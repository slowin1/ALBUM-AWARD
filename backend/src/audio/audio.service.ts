import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

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

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  private readonly tracksFilePath = path.join(__dirname, '..', '..', 'custom_tracks.json');
  private readonly albumsFilePath = path.join(__dirname, '..', '..', 'custom_albums.json');
  private readonly sceneAlbumsFilePath = path.join(__dirname, '..', '..', 'scene_albums.json');
  private readonly sceneTracksFilePath = path.join(__dirname, '..', '..', 'scene_tracks.json');
  private readonly sceneArtistsFilePath = path.join(__dirname, '..', '..', 'scene_artists.json');

  private customTracks: CustomTrack[] = [];
  private customAlbums: CustomAlbum[] = [];

  private cachedClientId: string | null = null;
  private lastClientIdTime = 0;

  constructor() {
    this.loadCustomTracks();
    this.loadCustomAlbums();
  }

  private loadCustomTracks() {
    try {
      if (fs.existsSync(this.tracksFilePath)) {
        const raw = fs.readFileSync(this.tracksFilePath, 'utf8');
        this.customTracks = JSON.parse(raw);
      } else {
        this.customTracks = [];
        this.saveCustomTracks();
      }
    } catch {
      this.customTracks = [];
    }
  }

  private saveCustomTracks() {
    try {
      fs.writeFileSync(this.tracksFilePath, JSON.stringify(this.customTracks, null, 2), 'utf8');
    } catch (err) {
      this.logger.error(`Error saving custom tracks: ${err}`);
    }
  }

  private loadCustomAlbums() {
    try {
      if (fs.existsSync(this.albumsFilePath)) {
        const raw = fs.readFileSync(this.albumsFilePath, 'utf8');
        this.customAlbums = JSON.parse(raw);
      } else {
        this.customAlbums = [];
        this.saveCustomAlbums();
      }
    } catch {
      this.customAlbums = [];
    }
  }

  private saveCustomAlbums() {
    try {
      fs.writeFileSync(this.albumsFilePath, JSON.stringify(this.customAlbums, null, 2), 'utf8');
    } catch (err) {
      this.logger.error(`Error saving custom albums: ${err}`);
    }
  }

  getAllCustomTracks(): CustomTrack[] {
    return this.customTracks;
  }

  getAllCustomAlbums(): CustomAlbum[] {
    return this.customAlbums;
  }

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

  async addCustomTrack(dto: {
    title: string;
    artist: string;
    artistId?: string;
    albumTitle?: string;
    cover?: string;
    duration?: string;
    audioUrl?: string;
    soundcloudUrl?: string;
    soundcloudTrackId?: string;
  }): Promise<CustomTrack> {
    const title = dto.title?.trim() || 'Новый трек';
    const artist = dto.artist?.trim() || 'Исполнитель';
    const artistId = dto.artistId?.trim();
    const cover = dto.cover?.trim() || '/covers/in-rainbows.jpg';
    let trackId = dto.soundcloudTrackId;

    if (dto.soundcloudUrl && !trackId) {
      const meta = await this.parseSoundcloudMetadata(dto.soundcloudUrl);
      if (meta && 'soundcloudTrackId' in meta) {
        trackId = meta.soundcloudTrackId;
      }
    }

    const id = `trk-${Date.now()}`;
    const newTrack: CustomTrack = {
      id,
      title,
      artist,
      artistId,
      artistIds: (dto as any).artistIds,
      albumTitle: dto.albumTitle?.trim() || 'Сингл',
      cover,
      duration: dto.duration?.trim() || '3:30',
      audioUrl: dto.audioUrl?.trim(),
      soundcloudUrl: dto.soundcloudUrl?.trim(),
      soundcloudTrackId: trackId,
      createdAt: new Date().toISOString(),
    };

    this.customTracks.unshift(newTrack);
    this.saveCustomTracks();
    return newTrack;
  }

  deleteCustomTrack(id: string): { success: boolean } {
    this.loadCustomTracks();
    const prevLen = this.customTracks.length;
    const toDelete = this.customTracks.find(t => t.id === id);
    this.customTracks = this.customTracks.filter(t => t.id !== id);
    if (this.customTracks.length !== prevLen) {
      this.saveCustomTracks();

      if (toDelete) {
        const sceneTracks = this.getSceneTracks();
        let sceneChanged = false;
        for (let i = 0; i < sceneTracks.length; i++) {
          const s = sceneTracks[i];
          if (
            s.id === id ||
            (toDelete.soundcloudUrl && s.soundcloudUrl === toDelete.soundcloudUrl) ||
            (s.title && s.title.toLowerCase() === toDelete.title.toLowerCase())
          ) {
            sceneTracks[i] = {
              id: `slot-track-${i + 1}`,
              albumId: `slot-track-${i + 1}`,
              title: `Слот ${i + 1}`,
              albumTitle: 'Сингл',
              artist: 'Исполнитель',
              year: 2026,
              duration: '3:00',
              cover: '/covers/placeholder.jpg',
              sourceUrl: '',
              soundcloudUrl: '',
            };
            sceneChanged = true;
          }
        }
        if (sceneChanged) {
          this.saveSceneTracks(sceneTracks);
        }
      }

      return { success: true };
    }
    return { success: false };
  }

  updateCustomTrack(id: string, dto: {
    title?: string;
    artist?: string;
    artistId?: string;
    artistIds?: string[];
    albumTitle?: string;
    cover?: string;
    duration?: string;
    audioUrl?: string;
    soundcloudUrl?: string;
    soundcloudTrackId?: string;
  }): CustomTrack {
    this.loadCustomTracks();
    const index = this.customTracks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const oldTrack = this.customTracks[index];
    const updatedTrack: CustomTrack = {
      ...oldTrack,
      title: dto.title !== undefined ? dto.title.trim() : oldTrack.title,
      artist: dto.artist !== undefined ? dto.artist.trim() : oldTrack.artist,
      artistId: dto.artistId !== undefined ? dto.artistId?.trim() : oldTrack.artistId,
      artistIds: dto.artistIds !== undefined ? dto.artistIds : oldTrack.artistIds,
      albumTitle: dto.albumTitle !== undefined ? dto.albumTitle.trim() : oldTrack.albumTitle,
      cover: dto.cover !== undefined ? dto.cover.trim() : oldTrack.cover,
      duration: dto.duration !== undefined ? dto.duration.trim() : oldTrack.duration,
      audioUrl: dto.audioUrl !== undefined ? dto.audioUrl.trim() : oldTrack.audioUrl,
      soundcloudUrl: dto.soundcloudUrl !== undefined ? dto.soundcloudUrl.trim() : oldTrack.soundcloudUrl,
      soundcloudTrackId: dto.soundcloudTrackId !== undefined ? dto.soundcloudTrackId : oldTrack.soundcloudTrackId,
    };
    this.customTracks[index] = updatedTrack;
    this.saveCustomTracks();

    // Also update any matching scene tracks
    const sceneTracks = this.getSceneTracks();
    let sceneChanged = false;
    for (let i = 0; i < sceneTracks.length; i++) {
      const s = sceneTracks[i];
      if (s.id === id || s.title.toLowerCase() === oldTrack.title.toLowerCase()) {
        sceneTracks[i] = {
          ...s,
          title: updatedTrack.title,
          artist: updatedTrack.artist,
          cover: updatedTrack.cover,
          soundcloudUrl: updatedTrack.soundcloudUrl || s.soundcloudUrl,
          albumTitle: updatedTrack.albumTitle || s.albumTitle,
          duration: updatedTrack.duration || s.duration,
        };
        sceneChanged = true;
      }
    }
    if (sceneChanged) {
      this.saveSceneTracks(sceneTracks);
    }

    return updatedTrack;
  }

  async addCustomAlbum(dto: {
    title: string;
    artist: string;
    artistId?: string;
    artistIds?: string[];
    cover: string;
    year?: number;
    soundcloudUrl?: string;
    soundcloudPlaylistId?: string;
    tracks: CustomAlbumTrack[];
  }): Promise<CustomAlbum> {
    const id = `alb-${Date.now()}`;
    const newAlbum: CustomAlbum = {
      id,
      title: dto.title.trim(),
      artist: dto.artist.trim(),
      artistId: dto.artistId?.trim(),
      artistIds: dto.artistIds,
      year: dto.year || 2026,
      cover: dto.cover.trim() || '/covers/in-rainbows.jpg',
      soundcloudUrl: dto.soundcloudUrl?.trim(),
      soundcloudPlaylistId: dto.soundcloudPlaylistId,
      tracks: (dto.tracks || []).map((t, i) => ({
        ...t,
        id: t.id || `${id}-trk-${i + 1}`,
        artist: t.artist || dto.artist.trim(),
        cover: t.cover || dto.cover.trim(),
      })),
      createdAt: new Date().toISOString(),
    };

    this.customAlbums.unshift(newAlbum);
    this.saveCustomAlbums();
    return newAlbum;
  }

  deleteCustomAlbum(id: string): { success: boolean } {
    this.loadCustomAlbums();
    const prevLen = this.customAlbums.length;
    const toDelete = this.customAlbums.find(a => a.id === id);
    this.customAlbums = this.customAlbums.filter(a => a.id !== id);
    if (this.customAlbums.length !== prevLen) {
      this.saveCustomAlbums();

      if (toDelete) {
        const sceneAlbums = this.getSceneAlbums();
        let sceneChanged = false;
        for (let i = 0; i < sceneAlbums.length; i++) {
          const s = sceneAlbums[i];
          if (
            s.id === id ||
            (toDelete.soundcloudUrl && s.soundcloudUrl === toDelete.soundcloudUrl) ||
            (s.title && s.title.toLowerCase() === toDelete.title.toLowerCase())
          ) {
            sceneAlbums[i] = {
              id: `slot-album-${i + 1}`,
              title: `Слот ${i + 1}`,
              artist: 'Исполнитель',
              year: 2026,
              cover: '/covers/placeholder.jpg',
              sourceUrl: '',
              soundcloudUrl: '',
              tracks: [],
            };
            sceneChanged = true;
          }
        }
        if (sceneChanged) {
          this.saveSceneAlbums(sceneAlbums);
        }
      }

      return { success: true };
    }
    return { success: false };
  }

  updateCustomAlbum(id: string, dto: {
    title?: string;
    artist?: string;
    artistId?: string;
    artistIds?: string[];
    year?: number;
    cover?: string;
    soundcloudUrl?: string;
    soundcloudPlaylistId?: string;
    tracks?: CustomAlbumTrack[];
  }): CustomAlbum {
    this.loadCustomAlbums();
    const index = this.customAlbums.findIndex(a => a.id === id);
    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const oldAlbum = this.customAlbums[index];
    const updatedAlbum: CustomAlbum = {
      ...oldAlbum,
      title: dto.title !== undefined ? dto.title.trim() : oldAlbum.title,
      artist: dto.artist !== undefined ? dto.artist.trim() : oldAlbum.artist,
      artistId: dto.artistId !== undefined ? dto.artistId?.trim() : oldAlbum.artistId,
      artistIds: dto.artistIds !== undefined ? dto.artistIds : oldAlbum.artistIds,
      year: dto.year !== undefined ? dto.year : oldAlbum.year,
      cover: dto.cover !== undefined ? dto.cover.trim() : oldAlbum.cover,
      soundcloudUrl: dto.soundcloudUrl !== undefined ? dto.soundcloudUrl.trim() : oldAlbum.soundcloudUrl,
      soundcloudPlaylistId: dto.soundcloudPlaylistId !== undefined ? dto.soundcloudPlaylistId : oldAlbum.soundcloudPlaylistId,
      tracks: dto.tracks !== undefined ? dto.tracks.map((t, i) => ({
        ...t,
        id: t.id || `${id}-trk-${i + 1}`,
        artist: t.artist || (dto.artist ? dto.artist.trim() : oldAlbum.artist),
        cover: t.cover || (dto.cover ? dto.cover.trim() : oldAlbum.cover),
      })) : oldAlbum.tracks,
    };
    this.customAlbums[index] = updatedAlbum;
    this.saveCustomAlbums();

    // Also update any matching scene albums
    const sceneAlbums = this.getSceneAlbums();
    let sceneChanged = false;
    for (let i = 0; i < sceneAlbums.length; i++) {
      const s = sceneAlbums[i];
      if (s.id === id || s.title.toLowerCase() === oldAlbum.title.toLowerCase()) {
        sceneAlbums[i] = {
          ...s,
          title: updatedAlbum.title,
          artist: updatedAlbum.artist,
          year: updatedAlbum.year,
          cover: updatedAlbum.cover,
          soundcloudUrl: updatedAlbum.soundcloudUrl || s.soundcloudUrl,
          tracks: updatedAlbum.tracks as any,
        };
        sceneChanged = true;
      }
    }
    if (sceneChanged) {
      this.saveSceneAlbums(sceneAlbums);
    }

    return updatedAlbum;
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

  private readonly lyricsFilePath = path.join(__dirname, '..', '..', 'lyrics_store.json');
  private lyricsStore: Record<string, StoredLyrics> = this.loadLyricsStore();

  private lyricsKey(artist: string, title: string): string {
    const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '');
    return `${norm(artist.split(',')[0])}|${norm(title)}`;
  }

  private loadLyricsStore(): Record<string, StoredLyrics> {
    try {
      if (fs.existsSync(this.lyricsFilePath)) {
        return JSON.parse(fs.readFileSync(this.lyricsFilePath, 'utf8'));
      }
    } catch (err) {
      this.logger.warn(`Could not read lyrics store: ${err}`);
    }
    return {};
  }

  private persistLyricsStore() {
    try {
      fs.writeFileSync(this.lyricsFilePath, JSON.stringify(this.lyricsStore, null, 2), 'utf8');
    } catch (err) {
      this.logger.error(`Error saving lyrics store: ${err}`);
    }
  }

  saveLyrics(entry: Omit<StoredLyrics, 'updatedAt'>): StoredLyrics {
    const saved: StoredLyrics = { ...entry, updatedAt: new Date().toISOString() };
    this.lyricsStore[this.lyricsKey(entry.artist, entry.title)] = saved;
    this.persistLyricsStore();
    return saved;
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
    const key = this.lyricsKey(artist, title);
    const stored = this.lyricsStore[key];
    if (stored) return stored;

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

  getSceneAlbums(): any[] {
    const filePath = this.sceneAlbumsFilePath;
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (err) {
      this.logger.error(`Failed to read scene_albums.json: ${err}`);
    }
    return Array.from({ length: 12 }, (_, i) => ({
      id: `slot-album-${i + 1}`,
      title: `Слот ${i + 1}`,
      artist: 'Исполнитель',
      year: 2026,
      cover: '/covers/placeholder.jpg',
      sourceUrl: '',
      soundcloudUrl: '',
    }));
  }

  saveSceneAlbums(albums: any[]): { success: boolean; albums: any[] } {
    const filePath = this.sceneAlbumsFilePath;
    try {
      fs.writeFileSync(filePath, JSON.stringify(albums.slice(0, 12), null, 2), 'utf8');
      return { success: true, albums: albums.slice(0, 12) };
    } catch (err) {
      this.logger.error(`Failed to write scene_albums.json: ${err}`);
      return { success: false, albums: [] };
    }
  }

  updateSceneAlbumSlot(slotIndex: number, data: any): { success: boolean; slot: any } {
    const current = this.getSceneAlbums();
    if (slotIndex >= 0 && slotIndex < current.length) {
      current[slotIndex] = { ...current[slotIndex], ...data };
      this.saveSceneAlbums(current);
      return { success: true, slot: current[slotIndex] };
    }
    return { success: false, slot: null };
  }

  getSceneTracks(): any[] {
    const filePath = this.sceneTracksFilePath;
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (err) {
      this.logger.error(`Failed to read scene_tracks.json: ${err}`);
    }
    return Array.from({ length: 12 }, (_, i) => ({
      id: `slot-track-${i + 1}`,
      albumId: `slot-track-${i + 1}`,
      title: `Слот ${i + 1}`,
      albumTitle: 'Сингл',
      artist: 'Исполнитель',
      year: 2026,
      duration: '3:00',
      cover: '/covers/placeholder.jpg',
      sourceUrl: '',
      soundcloudUrl: '',
    }));
  }

  saveSceneTracks(tracks: any[]): { success: boolean; tracks: any[] } {
    const filePath = this.sceneTracksFilePath;
    try {
      fs.writeFileSync(filePath, JSON.stringify(tracks.slice(0, 12), null, 2), 'utf8');
      return { success: true, tracks: tracks.slice(0, 12) };
    } catch (err) {
      this.logger.error(`Failed to write scene_tracks.json: ${err}`);
      return { success: false, tracks: [] };
    }
  }

  updateSceneTrackSlot(slotIndex: number, data: any): { success: boolean; slot: any } {
    const current = this.getSceneTracks();
    if (slotIndex >= 0 && slotIndex < current.length) {
      current[slotIndex] = { ...current[slotIndex], ...data };
      this.saveSceneTracks(current);
      return { success: true, slot: current[slotIndex] };
    }
    return { success: false, slot: null };
  }

  getSceneArtists(): any[] {
    const filePath = this.sceneArtistsFilePath;
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (err) {
      this.logger.error(`Failed to read scene_artists.json: ${err}`);
    }
    return Array.from({ length: 12 }, (_, i) => ({
      id: `slot-artist-${i + 1}`,
      title: `Исполнитель ${i + 1}`,
      artist: `Исполнитель ${i + 1}`,
      month: 'Сезон 2026',
      year: 2026,
      cover: '/covers/placeholder.jpg',
      sourceUrl: '',
      pageId: `slot-artist-${i + 1}`,
    }));
  }

  saveSceneArtists(artists: any[]): { success: boolean; artists: any[] } {
    const filePath = this.sceneArtistsFilePath;
    try {
      fs.writeFileSync(filePath, JSON.stringify(artists.slice(0, 12), null, 2), 'utf8');
      return { success: true, artists: artists.slice(0, 12) };
    } catch (err) {
      this.logger.error(`Failed to write scene_artists.json: ${err}`);
      return { success: false, artists: [] };
    }
  }

  updateSceneArtistSlot(slotIndex: number, data: any): { success: boolean; slot: any } {
    const current = this.getSceneArtists();
    if (slotIndex >= 0 && slotIndex < current.length) {
      current[slotIndex] = { ...current[slotIndex], ...data };
      this.saveSceneArtists(current);
      return { success: true, slot: current[slotIndex] };
    }
    return { success: false, slot: null };
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
