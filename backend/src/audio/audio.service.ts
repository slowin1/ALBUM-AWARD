import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

export type CustomTrack = {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artistIds?: string[];
  albumTitle?: string;
  cover: string;
  duration?: string;
  audioUrl?: string;
  soundcloudUrl?: string;
  soundcloudTrackId?: string;
  createdAt: string;
};

export type CustomAlbumTrack = {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artistIds?: string[];
  duration: string;
  audioUrl?: string;
  soundcloudUrl?: string;
  soundcloudTrackId?: string;
  cover?: string;
};

export type CustomAlbum = {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artistIds?: string[];
  year: number;
  cover: string;
  soundcloudUrl?: string;
  soundcloudPlaylistId?: string;
  tracks: CustomAlbumTrack[];
  createdAt: string;
};

export type StoredLyrics = {
  artist: string;
  title: string;
  synced?: string;
  plain?: string;
  source: 'lrclib' | 'genius' | 'manual';
  updatedAt: string;
};

export function generateSlug(title: string, id: string): string {
  const translit = (title || id)
    .toLowerCase()
    .replace(/[а-яё]/g, char => {
      const map: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
        й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
        у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
        э: 'e', ю: 'yu', я: 'ya',
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${translit || 'item'}-${id.slice(-6)}`;
}

/** Тот же алгоритм, что в `slugifyArtistName` на фронте: так pageId страницы исполнителя не расходится. */
export function artistPageId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'artist'
  );
}

export function parseArtists(credit: string, title?: string): string[] {
  const raw = [credit || ''];
  if (title) {
    const featMatch = String(title).match(/(?:\(|\[)\s*(?:feat\.?|ft\.?|with|при уч\.?)\s+([^)\]]+)(?:\)|\])/i);
    if (featMatch) raw.push(featMatch[1]);
  }
  const result: string[] = [];
  for (const chunk of raw) {
    const clean = String(chunk).replace(/(?:\(|\[)?(?:feat\.?|ft\.?|with)\s+/gi, ', ');
    const parts = clean.split(/[,&/×+]/);
    for (const p of parts) {
      const name = p.trim().replace(/^[@#]/, '').trim();
      if (name.length >= 2 && !result.some(r => r.toLowerCase() === name.toLowerCase())) {
        result.push(name);
      }
    }
  }
  return result.length > 0 ? result : [String(credit).trim()];
}

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  private cachedClientId: string | null = null;
  private lastClientIdTime = 0;

  constructor(private readonly prisma: PrismaService) {}

  private async getSoundCloudClientId(): Promise<string> {
    const now = Date.now();
    if (this.cachedClientId && now - this.lastClientIdTime < 3600000) {
      return this.cachedClientId;
    }
    try {
      const res = await this.fetchText('https://soundcloud.com');
      const scriptMatches = [...res.matchAll(/src="([^"]*assets\/[^"]*\.js)"/g)].map(m => m[1]);
      for (const sUrl of scriptMatches.slice(-4)) {
        const sRes = await this.fetchText(sUrl);
        const cidMatch = sRes.match(/client_id[:=]"([a-zA-Z0-9]{32})"/);
        if (cidMatch) {
          this.cachedClientId = cidMatch[1];
          this.lastClientIdTime = now;
          return cidMatch[1];
        }
      }
    } catch (err) {
      this.logger.warn(`Could not dynamically extract client_id: ${err}`);
    }
    return '2yeWkbX88QhTzS3OtZp8cLGaJRrOAWwF';
  }

  async parseSoundcloudMetadata(url: string) {
    try {
      const cleanUrl = url.trim();
      const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(cleanUrl)}`;
      const data = await this.fetchJson(oembedUrl);

      let title = data.title || 'Unknown Title';
      let artist = data.author_name || 'Unknown Artist';

      if (title.includes(' by ')) {
        const parts = title.split(' by ');
        title = parts[0].trim();
        artist = parts[1].trim() || artist;
      } else if (title.includes(' - ')) {
        const parts = title.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      let cover = data.thumbnail_url || '/placeholder-cover.jpg';
      if (cover.includes('-large.')) {
        cover = cover.replace('-large.', '-t500x500.');
      }

      const isSet = cleanUrl.includes('/sets/') || (data.html && data.html.includes('playlists%2F'));

      if (isSet) {
        // ALBUM / PLAYLIST
        let playlistId: string | undefined;
        if (data.html) {
          const match = data.html.match(/playlists%2F([0-9]+)/);
          if (match) playlistId = match[1];
        }

        const clientId = await this.getSoundCloudClientId();
        let albumTracks: CustomAlbumTrack[] = [];

        if (playlistId) {
          try {
            const pUrl = `https://api-v2.soundcloud.com/playlists/${playlistId}?client_id=${clientId}`;
            const pData = await this.fetchJson(pUrl);
            const rawTracks: any[] = Array.isArray(pData.tracks) ? pData.tracks : [];
            const missingIds = rawTracks.filter(t => !t.title && t.id).map(t => t.id);

            const fullMap = new Map<number, any>();
            rawTracks.filter(t => t.title && t.id).forEach(t => fullMap.set(t.id, t));

            if (missingIds.length > 0) {
              for (let i = 0; i < missingIds.length; i += 50) {
                const chunk = missingIds.slice(i, i + 50);
                const tUrl = `https://api-v2.soundcloud.com/tracks?ids=${chunk.join('%2C')}&client_id=${clientId}`;
                try {
                  const tData = await this.fetchJson(tUrl);
                  if (Array.isArray(tData)) {
                    tData.forEach(t => fullMap.set(t.id, t));
                  }
                } catch {
                  // Ignore batch chunk error
                }
              }
            }

            albumTracks = rawTracks.map((t, idx) => {
              const full = fullMap.get(t.id) || t;
              const durMs = full.duration || 180000;
              const totalSec = Math.floor(durMs / 1000);
              const m = Math.floor(totalSec / 60);
              const s = String(totalSec % 60).padStart(2, '0');
              const trkCover = (full.artwork_url || cover).replace('-large.', '-t500x500.');

              return {
                id: `sc-trk-${full.id || Date.now() + idx}`,
                title: full.title || `Трек ${idx + 1}`,
                artist: full.user?.username || artist,
                duration: `${m}:${s}`,
                soundcloudUrl: full.permalink_url || cleanUrl,
                soundcloudTrackId: String(full.id || ''),
                cover: trkCover,
              };
            });
          } catch (pErr) {
            this.logger.warn(`Failed to fetch album tracks via API: ${pErr}`);
          }
        }

        return {
          type: 'album',
          title,
          artist,
          cover,
          year: 2026,
          soundcloudUrl: cleanUrl,
          soundcloudPlaylistId: playlistId,
          tracksCount: albumTracks.length,
          tracks: albumTracks,
        };
      }

      // SINGLE TRACK
      let trackId: string | undefined;
      if (data.html) {
        const match = data.html.match(/tracks%2F([0-9]+)/);
        if (match) trackId = match[1];
      }

      return {
        type: 'track',
        title,
        artist,
        cover,
        soundcloudUrl: cleanUrl,
        soundcloudTrackId: trackId,
        duration: '3:30',
      };
    } catch (err) {
      this.logger.error(`Failed to parse SoundCloud URL: ${err}`);
      return null;
    }
  }

  async parseUrlMetadata(url: string) {
    const clean = (url || '').trim();
    return this.parseSoundcloudMetadata(clean);
  }

  saveUploadedCover(base64Data: string, originalName?: string): string {
    const rootDir = path.basename(process.cwd()) === 'backend' ? path.resolve(process.cwd(), '..') : process.cwd();
    const customDir = path.resolve(rootDir, 'public/covers/custom');
    if (!fs.existsSync(customDir)) {
      fs.mkdirSync(customDir, { recursive: true });
    }
    const match = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    let ext = 'jpg';
    if (match) {
      ext = match[1] === 'jpeg' ? 'jpg' : match[1] === 'svg+xml' ? 'svg' : match[1];
    } else if (originalName && originalName.includes('.')) {
      ext = originalName.split('.').pop() || 'jpg';
    }
    const rawBase64 = match ? match[2] : base64Data;
    const buffer = Buffer.from(rawBase64, 'base64');
    const filename = `cover-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = path.join(customDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/covers/custom/${filename}`;
  }

  private fetchJson(targetUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https
        .get(
          targetUrl,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'application/json',
            },
          },
          res => {
            let body = '';
            res.on('data', chunk => (body += chunk));
            res.on('end', () => {
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                reject(e);
              }
            });
          },
        )
        .on('error', reject);
    });
  }

  private normLyrics(v: string): string {
    return (v || '').toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '');
  }

  private toStoredLyrics(row: {
    artist: string;
    title: string;
    synced: string | null;
    plain: string | null;
    source: string;
    updatedAt: Date;
  }): StoredLyrics {
    return {
      artist: row.artist,
      title: row.title,
      synced: row.synced || undefined,
      plain: row.plain || undefined,
      source: row.source as StoredLyrics['source'],
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /** Finds a stored lyrics row, tolerant to punctuation / feat. differences in artist and title. */
  private async findStoredLyrics(artist: string, title: string) {
    const exact = await this.prisma.lyrics.findUnique({ where: { artist_title: { artist, title } } });
    if (exact) return exact;
    const wantTitle = this.normLyrics(title);
    const wantArtist = this.normLyrics((artist || '').split(',')[0]);
    const sameTitle = await this.prisma.lyrics.findMany({ where: { title: { equals: title, mode: 'insensitive' } } });
    const candidates = sameTitle.length > 0 ? sameTitle : await this.prisma.lyrics.findMany();
    return (
      candidates.find(
        r => this.normLyrics(r.title) === wantTitle && this.normLyrics((r.artist || '').split(',')[0]) === wantArtist,
      ) || null
    );
  }

  async saveLyrics(entry: Omit<StoredLyrics, 'updatedAt'>): Promise<StoredLyrics> {
    const artist = (entry.artist || '').trim();
    const title = (entry.title || '').trim();
    if (!artist || !title) {
      throw new HttpException('artist and title are required', HttpStatus.BAD_REQUEST);
    }
    const existing = await this.findStoredLyrics(artist, title);
    const data = {
      synced: entry.synced ?? null,
      plain: entry.plain ?? null,
      source: entry.source,
    };
    const row = existing
      ? await this.prisma.lyrics.update({ where: { id: existing.id }, data })
      : await this.prisma.lyrics.create({ data: { artist, title, ...data } });

    // Link the lyrics to a catalog track when there is an unambiguous, not yet linked match.
    if (!row.trackId) {
      try {
        const track = await this.prisma.track.findFirst({
          where: {
            title: { equals: title, mode: 'insensitive' },
            artistDisplay: { contains: artist.split(',')[0].trim(), mode: 'insensitive' },
            lyrics: null,
          },
          select: { id: true },
        });
        if (track) {
          await this.prisma.lyrics.update({ where: { id: row.id }, data: { trackId: track.id } });
        }
      } catch (err) {
        this.logger.debug(`Lyrics ${row.id} left unlinked: ${err}`);
      }
    }
    return this.toStoredLyrics(row);
  }
  private lrclibCooldownUntil = 0;

  private async lrclibRequest(url: string): Promise<any> {
    if (Date.now() < this.lrclibCooldownUntil) return null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const data = await this.fetchJson(url);
        if (data && data.statusCode === 429) {
          this.lrclibCooldownUntil = Date.now() + 60_000;
          return null;
        }
        if (data && data.statusCode === 503) throw new Error('busy');
        return data;
      } catch {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      }
    }
    return null;
  }

  private async findLrclib(artist: string, title: string): Promise<{ syncedLyrics?: string; plainLyrics?: string } | null> {
    const base = 'https://lrclib.net/api';
    const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '');
    const candidates: Array<{ artist: string; title: string }> = [{ artist, title }];

    const split = title.match(/^(.+?)\s+[-–—]\s+(.+)$/);
    if (split) {
      candidates.push({ artist: split[1].split(/,|&| x /i)[0].trim(), title: split[2].trim() });
      candidates.push({ artist, title: split[2].trim() });
    }
    const bare = title.replace(/\s*[([][^)\]]*[)\]]/g, '').trim();
    if (bare && bare !== title) candidates.push({ artist, title: bare });

    for (const c of candidates) {
      const rec = await this.lrclibRequest(
        `${base}/get?artist_name=${encodeURIComponent(c.artist)}&track_name=${encodeURIComponent(c.title)}`,
      );
      if (rec && (rec.syncedLyrics || rec.plainLyrics)) return rec;
    }

    for (const c of candidates) {
      const list = await this.lrclibRequest(`${base}/search?q=${encodeURIComponent(`${c.artist} ${c.title}`)}`);
      if (!Array.isArray(list)) continue;
      const wantTitle = norm(c.title);
      const wantArtist = norm(c.artist.split(',')[0]);
      const good = list.filter(r => (r.syncedLyrics || r.plainLyrics) && norm(r.trackName || '') === wantTitle);
      const pick =
        good.find(r => r.syncedLyrics && norm(r.artistName || '').includes(wantArtist)) ||
        good.find(r => norm(r.artistName || '').includes(wantArtist)) ||
        good.find(r => r.syncedLyrics) ||
        good[0];
      if (pick) return pick;
    }
    return null;
  }

  /** Stored copy first; otherwise LRCLIB (synced), then Genius (plain). Found lyrics are persisted. */
  async getLyrics(artist: string, title: string): Promise<StoredLyrics | null> {
    const stored = await this.findStoredLyrics(artist, title);
    if (stored) return this.toStoredLyrics(stored);

    const found = await this.findLrclib(artist, title);
    if (found) {
      return this.saveLyrics({
        artist,
        title,
        synced: found.syncedLyrics || undefined,
        plain: found.plainLyrics || undefined,
        source: 'lrclib',
      });
    }

    const genius = await this.getGeniusLyrics(artist, title);
    if (genius) {
      return this.saveLyrics({ artist, title, plain: genius.lyrics, source: 'genius' });
    }
    return null;
  }

  private fetchJsonAuth(targetUrl: string, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https
        .get(targetUrl, { headers: { Authorization: `Bearer ${token}` } }, res => {
          let body = '';
          res.on('data', chunk => (body += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (err) {
              reject(err);
            }
          });
        })
        .on('error', reject);
    });
  }

  private decodeHtml(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  }

  async getGeniusLyrics(artist: string, title: string): Promise<{ lyrics: string; url: string } | null> {
    const token = process.env.GENIUS_ACCESS_TOKEN;
    if (!token) return null;
    try {
      const q = encodeURIComponent(`${artist} ${title}`);
      const data = await this.fetchJsonAuth(`https://api.genius.com/search?q=${q}`, token);
      const hits: any[] = data?.response?.hits || [];
      const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '');
      const wantArtist = norm(artist.split(',')[0]);
      const hit =
        hits.find(h => h.type === 'song' && norm(h.result?.primary_artist?.name || '').includes(wantArtist)) ||
        hits.find(h => h.type === 'song');
      const url: string | undefined = hit?.result?.url;
      if (!url) return null;

      const html = await this.fetchText(url);
      const blocks = [...html.matchAll(/<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/g)].map(m => m[1]);
      const lyrics = this.decodeHtml(
        blocks
          .join('\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, ''),
      ).trim();
      return lyrics ? { lyrics, url } : null;
    } catch (err) {
      this.logger.warn(`Genius lyrics lookup failed: ${err}`);
      return null;
    }
  }

  private fetchText(targetUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(
          targetUrl,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
          },
          res => {
            let body = '';
            res.on('data', chunk => (body += chunk));
            res.on('end', () => resolve(body));
          },
        )
        .on('error', reject);
    });
  }
}
