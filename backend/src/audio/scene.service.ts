import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogService } from './catalog.service';
import { artistPageId } from './audio.service';

export type SceneType = 'album' | 'track' | 'artist';
export const SCENE_SLOTS = 12;

const PLACEHOLDER_COVER = '/covers/placeholder.jpg';
const PLACEHOLDER_TITLE = /^(слот|исполнитель)\s*\d+$/i;

/**
 * 3D-сцена: 12 слотов × 3 колеса (альбомы / треки / исполнители) лежат в таблице SceneSlot
 * и ссылаются на настоящие записи Album / Track / Artist. Содержимое слота всегда читается
 * из связанной записи, поэтому правка альбома в каталоге сразу видна на сцене.
 */
@Injectable()
export class SceneService {
  private readonly logger = new Logger(SceneService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogService,
  ) {}

  placeholder(type: SceneType, i: number): any {
    const n = i + 1;
    if (type === 'album') {
      return {
        id: `slot-album-${n}`,
        title: `Слот ${n}`,
        artist: 'Исполнитель',
        year: 2026,
        cover: PLACEHOLDER_COVER,
        sourceUrl: '',
        soundcloudUrl: '',
        tracks: [],
      };
    }
    if (type === 'track') {
      return {
        id: `slot-track-${n}`,
        albumId: `slot-track-${n}`,
        title: `Слот ${n}`,
        albumTitle: 'Сингл',
        artist: 'Исполнитель',
        year: 2026,
        duration: '3:00',
        cover: PLACEHOLDER_COVER,
        sourceUrl: '',
        soundcloudUrl: '',
      };
    }
    return {
      id: `slot-artist-${n}`,
      title: `Исполнитель ${n}`,
      artist: `Исполнитель ${n}`,
      month: 'Сезон 2026',
      year: 2026,
      cover: PLACEHOLDER_COVER,
      sourceUrl: '',
      pageId: `slot-artist-${n}`,
    };
  }

  private isPlaceholder(type: SceneType, data: any): boolean {
    const title = String(data?.title ?? '').trim();
    if (!title) return true;
    if (type === 'artist') {
      return PLACEHOLDER_TITLE.test(title) && PLACEHOLDER_TITLE.test(String(data?.artist ?? title).trim());
    }
    return /^слот\s*\d+$/i.test(title);
  }

  // ───────────────────────── Чтение ─────────────────────────

  async getSlots(type: SceneType): Promise<any[]> {
    const rows = await this.prisma.sceneSlot.findMany({
      where: { type },
      include: {
        album: { include: { tracks: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } } },
        track: { include: { album: { select: { year: true } } } },
        artist: { include: { freshman: true } },
      },
    });
    const byIndex = new Map(rows.map(r => [r.slotIndex, r]));
    return Array.from({ length: SCENE_SLOTS }, (_, i) => this.compose(type, i, byIndex.get(i)));
  }

  private compose(type: SceneType, i: number, row: any): any {
    const empty = this.placeholder(type, i);
    if (!row) return empty;

    if (type === 'album' && row.album) {
      const a = row.album;
      return {
        id: a.id,
        title: a.title,
        artist: a.artistDisplay || 'Исполнитель',
        year: a.year || 2026,
        cover: a.cover,
        sourceUrl: a.sourceUrl || '',
        soundcloudUrl: a.soundcloudUrl || '',
        soundcloudPlaylistId: a.soundcloudPlaylistId || undefined,
        tracks: (a.tracks || []).map((t: any) => this.catalog.albumTrackDto(t, a)),
      };
    }
    if (type === 'track' && row.track) {
      const t = row.track;
      return {
        id: t.id,
        albumId: t.id,
        title: t.title,
        albumTitle: t.albumTitle || 'Сингл',
        artist: t.artistDisplay || 'Исполнитель',
        year: t.album?.year || 2026,
        duration: t.duration || '3:00',
        cover: t.cover,
        sourceUrl: '',
        soundcloudUrl: t.soundcloudUrl || '',
        audioUrl: t.audioUrl || undefined,
        soundcloudTrackId: t.soundcloudTrackId || undefined,
      };
    }
    if (type === 'artist' && row.artist) {
      const a = row.artist;
      return {
        id: `slot-artist-${i + 1}`,
        title: a.name,
        artist: a.name,
        month: a.monthAward || 'Сезон 2026',
        year: a.freshman?.year || 2026,
        cover: row.customCover || a.avatar || PLACEHOLDER_COVER,
        sourceUrl: '',
        pageId: artistPageId(a.name),
      };
    }
    return empty;
  }

  // ───────────────────────── Запись ─────────────────────────

  async saveSlots(type: SceneType, items: any[]): Promise<any[]> {
    for (let i = 0; i < SCENE_SLOTS; i++) {
      await this.upsertSlot(type, i, items[i]);
    }
    if (type === 'artist') await this.syncNominees();
    return this.getSlots(type);
  }

  async updateSlot(type: SceneType, slotIndex: number, patch: any): Promise<any> {
    const current = await this.getSlots(type);
    await this.upsertSlot(type, slotIndex, { ...current[slotIndex], ...patch });
    if (type === 'artist') await this.syncNominees();
    return (await this.getSlots(type))[slotIndex];
  }

  private async upsertSlot(type: SceneType, slotIndex: number, data: any): Promise<void> {
    const where = { type_slotIndex: { type, slotIndex } };
    const cleared = { albumId: null, trackId: null, artistId: null, customTitle: null, customCover: null };

    if (!data || this.isPlaceholder(type, data)) {
      await this.prisma.sceneSlot.upsert({ where, create: { type, slotIndex, ...cleared }, update: cleared });
      return;
    }

    if (type === 'album') {
      const found = await this.catalog.findAlbumForSlot(data);
      const album = found ?? (await this.catalog.createAlbumFromSlot(data));
      const link = { ...cleared, albumId: album.id };
      await this.prisma.sceneSlot.upsert({ where, create: { type, slotIndex, ...link }, update: link });
      return;
    }

    if (type === 'track') {
      const found = await this.catalog.findTrackForSlot(data);
      const track = found ?? (await this.catalog.createTrackFromSlot(data));
      const link = { ...cleared, trackId: track.id };
      await this.prisma.sceneSlot.upsert({ where, create: { type, slotIndex, ...link }, update: link });
      return;
    }

    const name = String(data.artist || data.title).trim();
    const artist = await this.catalog.ensureArtistByName(name, data.cover);
    if (!artist) {
      await this.prisma.sceneSlot.upsert({ where, create: { type, slotIndex, ...cleared }, update: cleared });
      return;
    }
    await this.prisma.artist.update({
      where: { id: artist.id },
      data: { monthAward: data.month || 'Сезон 2026' },
    });
    const link = { ...cleared, artistId: artist.id, customCover: data.cover || null };
    await this.prisma.sceneSlot.upsert({ where, create: { type, slotIndex, ...link }, update: link });
    this.freshmanYears.set(artist.id, Number(data.year) || 2026);
  }

  private freshmanYears = new Map<string, number>();

  /**
   * Исполнители в слотах колеса «Артист месяца» — это номинанты сезона:
   * поддерживаем флаг isNominee и записи Freshman (с подсчётом голосов).
   */
  async syncNominees(): Promise<void> {
    const slots = await this.prisma.sceneSlot.findMany({
      where: { type: 'artist', artistId: { not: null } },
      orderBy: { slotIndex: 'asc' },
      include: { artist: true },
    });
    const nomineeIds = new Set<string>();
    for (const slot of slots) {
      if (!slot.artistId || nomineeIds.has(slot.artistId)) continue;
      nomineeIds.add(slot.artistId);
      const year = this.freshmanYears.get(slot.artistId);
      await this.prisma.artist.update({ where: { id: slot.artistId }, data: { isNominee: true } });
      await this.prisma.freshman.upsert({
        where: { artistId: slot.artistId },
        create: { artistId: slot.artistId, year: year ?? 2026, tag: slot.artist?.monthAward || 'Сезон 2026', order: slot.slotIndex },
        update: { year, tag: slot.artist?.monthAward || 'Сезон 2026', order: slot.slotIndex },
      });
    }
    await this.prisma.freshman.deleteMany({ where: { artistId: { notIn: [...nomineeIds] } } });
    await this.prisma.artist.updateMany({
      where: { isNominee: true, id: { notIn: [...nomineeIds] } },
      data: { isNominee: false },
    });
  }
}
