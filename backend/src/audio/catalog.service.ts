import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  artistPageId,
  AudioService,
  CustomAlbum,
  CustomAlbumTrack,
  CustomTrack,
  generateSlug,
  parseArtists,
} from './audio.service';

export type ArtistRef = { id: string; name: string; slug: string };

export type TrackInput = {
  id?: string;
  title: string;
  artist?: string;
  artistId?: string;
  artistIds?: string[];
  albumTitle?: string;
  cover?: string;
  duration?: string;
  audioUrl?: string;
  soundcloudUrl?: string;
  soundcloudTrackId?: string;
};

export type AlbumInput = {
  id?: string;
  title: string;
  artist: string;
  artistId?: string;
  artistIds?: string[];
  cover?: string;
  year?: number;
  sourceUrl?: string;
  soundcloudUrl?: string;
  soundcloudPlaylistId?: string;
  tracks?: CustomAlbumTrack[];
};

const FALLBACK_COVER = '/covers/in-rainbows.jpg';

/**
 * Единственный источник правды для каталога — PostgreSQL (Prisma).
 * Ошибки записи НЕ глотаются: клиент получает ошибку, а не «успех» с рассинхроном.
 */
@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audio: AudioService,
  ) {}

  // ───────────────────────── Артисты ─────────────────────────

  async ensureArtistByName(name: string, avatarUrl?: string): Promise<ArtistRef | null> {
    const cleanName = (name || '').trim();
    if (!cleanName || /^исполнитель(\s*\d+)?$/i.test(cleanName)) return null;

    const baseSlug = generateSlug(cleanName, `art-${Date.now()}`);
    const existing = await this.prisma.artist.findFirst({
      where: { OR: [{ name: { equals: cleanName, mode: 'insensitive' } }, { slug: baseSlug }] },
      select: { id: true, name: true, slug: true },
    });
    if (existing) return existing;

    try {
      return await this.prisma.artist.create({
        data: {
          name: cleanName,
          slug: `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`,
          avatar: avatarUrl || '/covers/placeholder.jpg',
        },
        select: { id: true, name: true, slug: true },
      });
    } catch {
      // гонка параллельных запросов — повторно читаем созданного артиста
      return this.prisma.artist.findFirst({
        where: { name: { equals: cleanName, mode: 'insensitive' } },
        select: { id: true, name: true, slug: true },
      });
    }
  }

  async ensureArtistsForCredit(credit: string, title?: string, avatarUrl?: string): Promise<ArtistRef[]> {
    const result: ArtistRef[] = [];
    for (const name of parseArtists(credit, title)) {
      const artist = await this.ensureArtistByName(name, avatarUrl);
      if (artist && !result.some(a => a.id === artist.id)) result.push(artist);
    }
    return result;
  }

  /** Явно выбранные в админке артисты (по id или slug) имеют приоритет над разбором строки. */
  private async resolveArtists(
    explicitIds: string[] | undefined,
    credit: string,
    title: string,
    cover: string,
  ): Promise<ArtistRef[]> {
    const ids = (explicitIds || []).map(v => String(v).trim()).filter(Boolean);
    if (ids.length > 0) {
      const found = await this.prisma.artist.findMany({
        where: { OR: [{ id: { in: ids } }, { slug: { in: ids } }] },
        select: { id: true, name: true, slug: true },
      });
      if (found.length > 0) {
        return ids
          .map(id => found.find(a => a.id === id || a.slug === id))
          .filter((a): a is ArtistRef => Boolean(a))
          .filter((a, i, arr) => arr.findIndex(b => b.id === a.id) === i);
      }
    }
    return this.ensureArtistsForCredit(credit, title, cover);
  }

  getAllArtists(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    return this.prisma.artist.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { _count: { select: { tracks: true, albums: true } } },
    });
  }

  /**
   * Страницы исполнителей целиком: артист + его альбомы и треки (с треклистами).
   * Связи считаются на сервере — по таблицам Artist/Track и по строке кредитов — а фронт
   * только отображает результат. `id` — адрес страницы (`/artist/:id`), `dbId` — id в БД.
   */
  async listArtistPages() {
    const [artists, albums, singles] = await Promise.all([
      this.prisma.artist.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.album.findMany({
        include: { tracks: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], include: { artists: { select: { id: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.track.findMany({
        where: { albumId: null },
        include: { artists: { select: { id: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const pages = new Map<string, any>();
    const idByName = new Map<string, string>();
    const usedPageIds = new Set<string>();
    for (const a of artists) {
      let pageId = artistPageId(a.name);
      if (usedPageIds.has(pageId)) pageId = `${pageId}-${a.id.slice(0, 4)}`;
      usedPageIds.add(pageId);
      idByName.set(a.name.toLowerCase(), a.id);
      pages.set(a.id, {
        id: pageId,
        dbId: a.id,
        slug: a.slug,
        name: a.name,
        avatar: a.avatar,
        bio: a.bio,
        genres: a.genres,
        isProducer: a.isProducer,
        isNominee: a.isNominee,
        monthAward: a.monthAward,
        albums: [] as any[],
        tracks: [] as any[],
      });
    }

    const fromCredit = (credit: string | null, title: string): string[] =>
      credit ? parseArtists(credit, title).map(n => idByName.get(n.toLowerCase())).filter((v): v is string => Boolean(v)) : [];
    const link = (ids: Iterable<string | null | undefined>, key: 'albums' | 'tracks', item: { id: string }) => {
      for (const id of new Set(ids)) {
        const page = id ? pages.get(id) : undefined;
        if (page && !page[key].some((x: { id: string }) => x.id === item.id)) page[key].push(item);
      }
    };

    for (const a of albums) {
      const year = a.year || 2026;
      const albumDef = {
        id: a.id,
        title: a.title,
        artist: a.artistDisplay || 'Исполнитель',
        year,
        cover: a.cover,
        sourceUrl: a.sourceUrl || a.soundcloudUrl || '',
        soundcloudUrl: a.soundcloudUrl || undefined,
        soundcloudPlaylistId: a.soundcloudPlaylistId || undefined,
        tracks: a.tracks.map(t => this.albumTrackDto(t, a)),
      };
      link([a.artistId, ...fromCredit(a.artistDisplay, a.title)], 'albums', albumDef);

      for (const t of a.tracks) {
        const trackDef = {
          id: t.id,
          albumId: a.id,
          title: t.title,
          albumTitle: a.title,
          artist: t.artistDisplay || a.artistDisplay || 'Исполнитель',
          year,
          duration: t.duration || '3:30',
          cover: t.cover || a.cover,
          sourceUrl: t.soundcloudUrl || a.soundcloudUrl || '',
          audioUrl: t.audioUrl || undefined,
          soundcloudUrl: t.soundcloudUrl || a.soundcloudUrl || undefined,
          soundcloudTrackId: t.soundcloudTrackId || undefined,
        };
        link([...t.artists.map(x => x.id), ...fromCredit(trackDef.artist, t.title)], 'tracks', trackDef);
      }
    }

    for (const t of singles) {
      const trackDef = {
        id: t.id,
        albumId: `sc-${t.id}`,
        title: t.title,
        albumTitle: t.albumTitle || 'Сингл',
        artist: t.artistDisplay || 'Исполнитель',
        year: 2026,
        duration: t.duration || '3:30',
        cover: t.cover,
        sourceUrl: t.soundcloudUrl || '',
        audioUrl: t.audioUrl || undefined,
        soundcloudUrl: t.soundcloudUrl || undefined,
        soundcloudTrackId: t.soundcloudTrackId || undefined,
      };
      link([...t.artists.map(x => x.id), ...fromCredit(trackDef.artist, t.title)], 'tracks', trackDef);
    }

    return [...pages.values()];
  }

  /** Номинанты сезона (таблица Freshman) с числом голосов. */
  listNominees() {
    return this.prisma.freshman.findMany({
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
      include: { artist: { select: { id: true, name: true, slug: true, avatar: true, monthAward: true } } },
    });
  }

  getArtistById(idOrSlug: string) {
    return this.prisma.artist.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { tracks: true, albums: { include: { tracks: true } } },
    });
  }

  // ───────────────────────── Маппинг в DTO ─────────────────────────

  private trackDto(t: any): CustomTrack {
    return {
      id: t.id,
      title: t.title,
      artist: t.artistDisplay || 'Исполнитель',
      albumTitle: t.albumTitle || 'Сингл',
      cover: t.cover,
      duration: t.duration || '3:30',
      audioUrl: t.audioUrl || undefined,
      soundcloudUrl: t.soundcloudUrl || undefined,
      soundcloudTrackId: t.soundcloudTrackId || undefined,
      createdAt: t.createdAt.toISOString(),
    };
  }

  albumTrackDto(t: any, album: { artistDisplay: string | null; cover: string }): CustomAlbumTrack {
    return {
      id: t.id,
      title: t.title,
      artist: t.artistDisplay || album.artistDisplay || 'Исполнитель',
      cover: t.cover || album.cover,
      duration: t.duration || '3:30',
      audioUrl: t.audioUrl || undefined,
      soundcloudUrl: t.soundcloudUrl || undefined,
      soundcloudTrackId: t.soundcloudTrackId || undefined,
    };
  }

  private albumDto(a: any): CustomAlbum {
    return {
      id: a.id,
      title: a.title,
      artist: a.artistDisplay || 'Исполнитель',
      cover: a.cover,
      year: a.year || 2026,
      soundcloudUrl: a.soundcloudUrl || undefined,
      soundcloudPlaylistId: a.soundcloudPlaylistId || undefined,
      tracks: (a.tracks || []).map((t: any) => this.albumTrackDto(t, a)),
      createdAt: a.createdAt.toISOString(),
    };
  }

  // ───────────────────────── Чтение ─────────────────────────

  async listSingles(): Promise<CustomTrack[]> {
    const rows = await this.prisma.track.findMany({ where: { albumId: null }, orderBy: { createdAt: 'desc' } });
    return rows.map(t => this.trackDto(t));
  }

  async listAlbums(): Promise<CustomAlbum[]> {
    const rows = await this.prisma.album.findMany({
      include: { tracks: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(a => this.albumDto(a));
  }

  // ───────────────────────── Синглы ─────────────────────────

  async createTrack(dto: TrackInput): Promise<CustomTrack> {
    const title = dto.title?.trim() || 'Новый трек';
    const artist = dto.artist?.trim() || 'Исполнитель';
    const cover = dto.cover?.trim() || FALLBACK_COVER;

    let soundcloudTrackId = dto.soundcloudTrackId;
    if (dto.soundcloudUrl && !soundcloudTrackId) {
      const meta = await this.audio.parseSoundcloudMetadata(dto.soundcloudUrl);
      if (meta && 'soundcloudTrackId' in meta) soundcloudTrackId = meta.soundcloudTrackId;
    }

    const artists = await this.resolveArtists(dto.artistIds, artist, title, cover);
    const row = await this.prisma.track.create({
      data: {
        id: `trk-${Date.now()}`,
        title,
        albumTitle: dto.albumTitle?.trim() || 'Сингл',
        artistDisplay: artist,
        cover,
        duration: dto.duration?.trim() || '3:30',
        audioUrl: dto.audioUrl?.trim() || null,
        soundcloudUrl: dto.soundcloudUrl?.trim() || null,
        soundcloudTrackId: soundcloudTrackId ? String(soundcloudTrackId) : null,
        artists: artists.length > 0 ? { connect: artists.map(a => ({ id: a.id })) } : undefined,
      },
    });
    return this.trackDto(row);
  }

  async updateTrack(id: string, dto: Partial<TrackInput>): Promise<CustomTrack> {
    const old = await this.prisma.track.findUnique({ where: { id } });
    if (!old) throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    const title = dto.title !== undefined ? dto.title.trim() : old.title;
    const artist = dto.artist !== undefined ? dto.artist.trim() : old.artistDisplay || 'Исполнитель';
    const cover = dto.cover !== undefined ? dto.cover.trim() || old.cover : old.cover;
    const artistsChanged = dto.artist !== undefined || dto.title !== undefined || dto.artistIds !== undefined;
    const artists = artistsChanged ? await this.resolveArtists(dto.artistIds, artist, title, cover) : [];

    const row = await this.prisma.track.update({
      where: { id },
      data: {
        title,
        albumTitle: dto.albumTitle !== undefined ? dto.albumTitle.trim() || 'Сингл' : undefined,
        artistDisplay: artist,
        cover,
        duration: dto.duration !== undefined ? dto.duration.trim() || null : undefined,
        audioUrl: dto.audioUrl !== undefined ? dto.audioUrl.trim() || null : undefined,
        soundcloudUrl: dto.soundcloudUrl !== undefined ? dto.soundcloudUrl.trim() || null : undefined,
        soundcloudTrackId:
          dto.soundcloudTrackId !== undefined ? (dto.soundcloudTrackId ? String(dto.soundcloudTrackId) : null) : undefined,
        artists: artistsChanged && artists.length > 0 ? { set: artists.map(a => ({ id: a.id })) } : undefined,
      },
    });
    return this.trackDto(row);
  }

  async deleteTrack(id: string): Promise<{ success: boolean }> {
    const exists = await this.prisma.track.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { success: false };
    await this.prisma.$transaction([
      // освобождаем слоты сцены, ссылавшиеся на трек
      this.prisma.sceneSlot.updateMany({
        where: { trackId: id },
        data: { trackId: null, customTitle: null, customCover: null },
      }),
      this.prisma.track.delete({ where: { id } }),
    ]);
    return { success: true };
  }

  // ───────────────────────── Альбомы ─────────────────────────

  /** Создаёт или обновляет альбом вместе с треклистом (порядок треков хранится в createdAt). */
  async upsertAlbum(input: AlbumInput & { id: string }, replaceTracks = true): Promise<CustomAlbum> {
    const title = input.title.trim();
    const credit = input.artist.trim();
    const cover = input.cover?.trim() || FALLBACK_COVER;
    const year = input.year || 2026;
    const albumArtists = await this.resolveArtists(input.artistIds, credit, title, cover);

    const trackRows: Array<{ trk: CustomAlbumTrack; id: string; artists: ArtistRef[] }> = [];
    for (let i = 0; i < (input.tracks || []).length; i++) {
      const trk = input.tracks![i];
      if (!trk || !trk.title) continue;
      const trkCredit = trk.artist || credit;
      trackRows.push({
        trk,
        id: trk.id || `${input.id}-trk-${i + 1}`,
        artists: await this.resolveArtists(trk.artistIds, trkCredit, trk.title, trk.cover || cover),
      });
    }

    const existing = await this.prisma.album.findUnique({ where: { id: input.id }, select: { createdAt: true } });
    const baseTime = (existing?.createdAt ?? new Date()).getTime();

    await this.prisma.$transaction(async tx => {
      await tx.album.upsert({
        where: { id: input.id },
        create: {
          id: input.id,
          title,
          slug: generateSlug(title, input.id),
          artistDisplay: credit,
          artistId: albumArtists[0]?.id || null,
          cover,
          year,
          sourceUrl: input.sourceUrl || null,
          soundcloudUrl: input.soundcloudUrl?.trim() || null,
          soundcloudPlaylistId: input.soundcloudPlaylistId ? String(input.soundcloudPlaylistId) : null,
        },
        update: {
          title,
          artistDisplay: credit,
          artistId: albumArtists[0]?.id || null,
          cover,
          year,
          sourceUrl: input.sourceUrl || undefined,
          soundcloudUrl: input.soundcloudUrl?.trim() || null,
          soundcloudPlaylistId: input.soundcloudPlaylistId ? String(input.soundcloudPlaylistId) : null,
        },
      });

      if (replaceTracks) {
        await tx.track.deleteMany({
          where: { albumId: input.id, id: { notIn: trackRows.map(r => r.id) } },
        });
      }

      for (let i = 0; i < trackRows.length; i++) {
        const { trk, id, artists } = trackRows[i];
        const connect = artists.map(a => ({ id: a.id }));
        const common = {
          title: trk.title,
          albumTitle: title,
          albumId: input.id,
          artistDisplay: trk.artist || credit,
          cover: trk.cover || cover,
          duration: trk.duration || '3:30',
          audioUrl: trk.audioUrl || null,
          soundcloudUrl: trk.soundcloudUrl || null,
          soundcloudTrackId: trk.soundcloudTrackId ? String(trk.soundcloudTrackId) : null,
          createdAt: new Date(baseTime + i),
        };
        await tx.track.upsert({
          where: { id },
          create: { id, ...common, artists: connect.length > 0 ? { connect } : undefined },
          update: { ...common, artists: connect.length > 0 ? { set: connect } : undefined },
        });
      }
    });

    const saved = await this.prisma.album.findUniqueOrThrow({
      where: { id: input.id },
      include: { tracks: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } },
    });
    return this.albumDto(saved);
  }

  async createAlbum(dto: AlbumInput): Promise<CustomAlbum> {
    return this.upsertAlbum({ ...dto, id: `alb-${Date.now()}` });
  }

  async updateAlbum(id: string, dto: Partial<AlbumInput>): Promise<CustomAlbum> {
    const old = await this.prisma.album.findUnique({
      where: { id },
      include: { tracks: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } },
    });
    if (!old) throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    const merged: AlbumInput & { id: string } = {
      id,
      title: dto.title !== undefined ? dto.title : old.title,
      artist: dto.artist !== undefined ? dto.artist : old.artistDisplay || 'Исполнитель',
      artistIds: dto.artistIds,
      cover: dto.cover !== undefined ? dto.cover : old.cover,
      year: dto.year !== undefined ? dto.year : old.year || 2026,
      sourceUrl: dto.sourceUrl ?? old.sourceUrl ?? undefined,
      soundcloudUrl: dto.soundcloudUrl !== undefined ? dto.soundcloudUrl : old.soundcloudUrl || undefined,
      soundcloudPlaylistId:
        dto.soundcloudPlaylistId !== undefined ? dto.soundcloudPlaylistId : old.soundcloudPlaylistId || undefined,
      tracks:
        dto.tracks !== undefined
          ? dto.tracks
          : old.tracks.map(t => ({ ...this.albumTrackDto(t, old), duration: t.duration || '3:30' })),
    };
    return this.upsertAlbum(merged, dto.tracks !== undefined);
  }

  async deleteAlbum(id: string): Promise<{ success: boolean }> {
    const exists = await this.prisma.album.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { success: false };
    const trackIds = (await this.prisma.track.findMany({ where: { albumId: id }, select: { id: true } })).map(t => t.id);
    const freed = { customTitle: null, customCover: null };
    await this.prisma.$transaction([
      this.prisma.sceneSlot.updateMany({ where: { albumId: id }, data: { albumId: null, ...freed } }),
      this.prisma.sceneSlot.updateMany({ where: { trackId: { in: trackIds } }, data: { trackId: null, ...freed } }),
      this.prisma.track.deleteMany({ where: { albumId: id } }),
      this.prisma.album.delete({ where: { id } }),
    ]);
    return { success: true };
  }

  // ───────────────────────── Поиск для слотов сцены ─────────────────────────

  async findAlbumForSlot(data: { id?: string; title?: string; artist?: string; soundcloudUrl?: string }) {
    const ors: any[] = [];
    if (data.id) ors.push({ id: data.id });
    if (data.soundcloudUrl) ors.push({ soundcloudUrl: data.soundcloudUrl });
    if (data.title) {
      ors.push({
        title: { equals: data.title, mode: 'insensitive' },
        ...(data.artist ? { artistDisplay: { equals: data.artist, mode: 'insensitive' } } : {}),
      });
    }
    if (ors.length === 0) return null;
    return this.prisma.album.findFirst({ where: { OR: ors } });
  }

  async findTrackForSlot(data: { id?: string; title?: string; artist?: string; soundcloudUrl?: string }) {
    const ors: any[] = [];
    if (data.id) ors.push({ id: data.id });
    if (data.soundcloudUrl) ors.push({ soundcloudUrl: data.soundcloudUrl });
    if (data.title) {
      ors.push({
        title: { equals: data.title, mode: 'insensitive' },
        ...(data.artist ? { artistDisplay: { equals: data.artist, mode: 'insensitive' } } : {}),
      });
    }
    if (ors.length === 0) return null;
    return this.prisma.track.findFirst({ where: { OR: ors }, orderBy: { createdAt: 'asc' } });
  }

  /** Создание сингла по данным слота (если в каталоге такого трека ещё нет). */
  async createTrackFromSlot(data: any): Promise<{ id: string }> {
    const stableId = typeof data.id === 'string' && !/^slot-/.test(data.id) ? data.id : `trk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const title = String(data.title || '').trim();
    const artist = String(data.artist || 'Исполнитель').trim();
    const cover = String(data.cover || '').trim() || FALLBACK_COVER;
    const artists = await this.ensureArtistsForCredit(artist, title, cover);
    return this.prisma.track.create({
      data: {
        id: stableId,
        title,
        albumTitle: data.albumTitle || 'Сингл',
        artistDisplay: artist,
        cover,
        duration: data.duration || '3:00',
        audioUrl: data.audioUrl || null,
        soundcloudUrl: data.soundcloudUrl || null,
        soundcloudTrackId: data.soundcloudTrackId ? String(data.soundcloudTrackId) : null,
        artists: artists.length > 0 ? { connect: artists.map(a => ({ id: a.id })) } : undefined,
      },
      select: { id: true },
    });
  }

  async createAlbumFromSlot(data: any): Promise<{ id: string }> {
    const id = typeof data.id === 'string' && !/^slot-/.test(data.id) ? data.id : `alb-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const album = await this.upsertAlbum({
      id,
      title: String(data.title || '').trim(),
      artist: String(data.artist || 'Исполнитель').trim(),
      cover: data.cover,
      year: data.year,
      sourceUrl: data.sourceUrl,
      soundcloudUrl: data.soundcloudUrl,
      soundcloudPlaylistId: data.soundcloudPlaylistId,
      tracks: Array.isArray(data.tracks) ? data.tracks : [],
    });
    return { id: album.id };
  }
}
