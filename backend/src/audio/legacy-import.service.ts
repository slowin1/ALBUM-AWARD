import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogService } from './catalog.service';
import { parseArtists } from './audio.service';
import { SceneService, SceneType } from './scene.service';

/**
 * Одноразовый перенос данных из старых JSON-файлов (custom_*.json, scene_*.json, lyrics_store.json)
 * в таблицы PostgreSQL. Каждый шаг выполняется только если соответствующая таблица пуста,
 * поэтому повторный запуск ничего не дублирует. После переноса JSON-файлы больше не читаются и не пишутся.
 */
@Injectable()
export class LegacyImportService implements OnModuleInit {
  private readonly logger = new Logger(LegacyImportService.name);
  private readonly root = path.join(__dirname, '..', '..');

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogService,
    private readonly scene: SceneService,
  ) {}

  async onModuleInit() {
    try {
      await this.importCatalog();
      await this.dedupeCatalog();
      await this.fillMissingAlbumTracks();
      await this.importScene();
      await this.importLyrics();
      await this.backfillReviewLinks();
    } catch (err) {
      this.logger.error(`Legacy JSON import failed: ${err}`);
    }
  }

  private readJson<T = any>(file: string): T[] {
    const full = path.join(this.root, file);
    try {
      if (!fs.existsSync(full)) return [];
      const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      this.logger.warn(`Cannot read ${file}: ${err}`);
      return [];
    }
  }

  private isPlaceholder(item: any) {
    return !item || !item.title || /^слот\s*\d+$/i.test(String(item.title).trim());
  }

  private async importCatalog() {
    if ((await this.prisma.album.count()) === 0) {
      const albums = [...this.readJson('custom_albums.json'), ...this.readJson('scene_albums.json')];
      const seen = new Set<string>();
      for (const a of albums) {
        if (this.isPlaceholder(a) || !a.id || seen.has(a.id)) continue;
        seen.add(a.id);
        await this.catalog.upsertAlbum({ ...a, artist: a.artist || 'Исполнитель' });
      }
      this.logger.log(`Imported ${seen.size} albums from JSON`);
    }

    if ((await this.prisma.track.count({ where: { albumId: null } })) === 0) {
      const tracks = [...this.readJson('custom_tracks.json'), ...this.readJson('scene_tracks.json')];
      const seen = new Set<string>();
      for (const t of tracks) {
        if (this.isPlaceholder(t) || !t.id || seen.has(t.id)) continue;
        seen.add(t.id);
        if (await this.prisma.track.findUnique({ where: { id: t.id }, select: { id: true } })) continue;
        await this.catalog.createTrackFromSlot(t);
      }
      this.logger.log(`Imported ${seen.size} singles from JSON`);
    }
  }

  /**
   * В базе есть альбомы без треклиста (раньше треки зеркалились только частично).
   * Дополняем их треками из старых JSON: альбом ищется по id / ссылке SoundCloud / названию+артисту.
   */
  private async fillMissingAlbumTracks() {
    const jsonAlbums = [...this.readJson('custom_albums.json'), ...this.readJson('scene_albums.json')];
    let filled = 0;
    const done = new Set<string>();
    for (const a of jsonAlbums) {
      if (this.isPlaceholder(a) || !Array.isArray(a.tracks) || a.tracks.length === 0) continue;
      try {
        const album = await this.catalog.findAlbumForSlot({
          id: a.id,
          title: a.title,
          artist: a.artist,
          soundcloudUrl: a.soundcloudUrl,
        });
        if (!album || done.has(album.id)) continue;
        if ((await this.prisma.track.count({ where: { albumId: album.id } })) > 0) continue;
        done.add(album.id);
        await this.catalog.upsertAlbum({
          id: album.id,
          title: album.title,
          artist: album.artistDisplay || a.artist || 'Исполнитель',
          cover: album.cover,
          year: album.year || undefined,
          sourceUrl: album.sourceUrl || undefined,
          soundcloudUrl: album.soundcloudUrl || a.soundcloudUrl,
          soundcloudPlaylistId: album.soundcloudPlaylistId || a.soundcloudPlaylistId,
          tracks: a.tracks.map((t: any) => ({ ...t, id: undefined })),
        });
        filled++;
      } catch (err) {
        this.logger.warn(`Cannot fill tracks for album ${a?.title}: ${err}`);
      }
    }
    if (filled > 0) this.logger.log(`Filled tracklists for ${filled} albums from JSON`);
  }

  /**
   * Старое «зеркалирование» создавало дубли: слот сцены (`slot-album-N`) и настоящий альбом
   * с тем же названием и ссылкой. Склеиваем дубли в одну запись, перенося на неё слоты сцены и рецензии.
   */
  private async dedupeCatalog() {
    const norm = (v?: string | null) => (v || '').trim().toLowerCase();

    const albums = await this.prisma.album.findMany({ include: { _count: { select: { tracks: true } } } });
    const albumGroups = new Map<string, typeof albums>();
    for (const a of albums) {
      const key = `${norm(a.title)}|${norm(a.soundcloudUrl) || norm(a.artistDisplay)}`;
      albumGroups.set(key, [...(albumGroups.get(key) || []), a]);
    }
    let removedAlbums = 0;
    for (const group of albumGroups.values()) {
      if (group.length < 2) continue;
      const slotRefs = new Set(
        (await this.prisma.sceneSlot.findMany({ where: { albumId: { in: group.map(g => g.id) } } })).map(r => r.albumId),
      );
      const ranked = [...group].sort(
        (x, y) =>
          y._count.tracks - x._count.tracks ||
          Number(slotRefs.has(y.id)) - Number(slotRefs.has(x.id)) ||
          Number(x.id.startsWith('slot-')) - Number(y.id.startsWith('slot-')) ||
          x.createdAt.getTime() - y.createdAt.getTime(),
      );
      const [keeper, ...dupes] = ranked;
      for (const dup of dupes) {
        try {
          await this.prisma.$transaction(async tx => {
            await tx.sceneSlot.updateMany({ where: { albumId: dup.id }, data: { albumId: keeper.id } });
            const reviews = await tx.review.findMany({ where: { OR: [{ albumId: dup.id }, { targetId: dup.id }] } });
            for (const r of reviews) {
              const clash =
                r.targetId === dup.id &&
                (await tx.review.findUnique({
                  where: { userId_targetId: { userId: r.userId, targetId: keeper.id } },
                  select: { id: true },
                }));
              await tx.review.update({
                where: { id: r.id },
                data: { albumId: keeper.id, ...(r.targetId === dup.id && !clash ? { targetId: keeper.id } : {}) },
              });
            }
            await tx.track.deleteMany({ where: { albumId: dup.id } });
            await tx.album.delete({ where: { id: dup.id } });
          });
          removedAlbums++;
        } catch (err) {
          this.logger.warn(`Cannot merge duplicate album ${dup.id}: ${err}`);
        }
      }
    }

    const singles = await this.prisma.track.findMany({ where: { albumId: null } });
    const singleGroups = new Map<string, typeof singles>();
    for (const t of singles) {
      const key = `${norm(t.title)}|${norm(t.soundcloudUrl) || norm(t.artistDisplay)}`;
      singleGroups.set(key, [...(singleGroups.get(key) || []), t]);
    }
    let removedSingles = 0;
    for (const group of singleGroups.values()) {
      if (group.length < 2) continue;
      const slotRefs = new Set(
        (await this.prisma.sceneSlot.findMany({ where: { trackId: { in: group.map(g => g.id) } } })).map(r => r.trackId),
      );
      const [keeper, ...dupes] = [...group].sort(
        (x, y) =>
          Number(slotRefs.has(y.id)) - Number(slotRefs.has(x.id)) ||
          Number(x.id.startsWith('slot-')) - Number(y.id.startsWith('slot-')) ||
          x.createdAt.getTime() - y.createdAt.getTime(),
      );
      for (const dup of dupes) {
        try {
          await this.prisma.$transaction(async tx => {
            await tx.sceneSlot.updateMany({ where: { trackId: dup.id }, data: { trackId: keeper.id } });
            const keeperLyrics = await tx.lyrics.findUnique({ where: { trackId: keeper.id }, select: { id: true } });
            if (!keeperLyrics) await tx.lyrics.updateMany({ where: { trackId: dup.id }, data: { trackId: keeper.id } });
            await tx.review.updateMany({ where: { trackId: dup.id }, data: { trackId: keeper.id } });
            await tx.track.delete({ where: { id: dup.id } });
          });
          removedSingles++;
        } catch (err) {
          this.logger.warn(`Cannot merge duplicate track ${dup.id}: ${err}`);
        }
      }
    }
    // «Составные» артисты вроде «A, B» — мусор от старого разбора строки кредитов: настоящие артисты A и B уже есть.
    let removedArtists = 0;
    const allArtists = await this.prisma.artist.findMany({
      include: { _count: { select: { albums: true, tracks: true, slots: true, producedAlbums: true, producedTracks: true } }, freshman: true },
    });
    const knownNames = new Set(allArtists.map(a => norm(a.name)));
    for (const a of allArtists) {
      const parts = parseArtists(a.name);
      const unused = Object.values(a._count).every(n => n === 0) && !a.freshman;
      if (unused && parts.length > 1 && parts.every(p => knownNames.has(norm(p)))) {
        try {
          await this.prisma.artist.delete({ where: { id: a.id } });
          removedArtists++;
        } catch (err) {
          this.logger.warn(`Cannot remove composite artist ${a.name}: ${err}`);
        }
      }
    }
    if (removedArtists > 0) this.logger.log(`Removed ${removedArtists} composite artist rows`);
    if (removedAlbums + removedSingles > 0) {
      this.logger.log(`Merged duplicates: ${removedAlbums} albums, ${removedSingles} singles`);
    }
  }

  private async importScene() {
    if ((await this.prisma.sceneSlot.count()) > 0) return;
    const files: Array<[SceneType, string]> = [
      ['album', 'scene_albums.json'],
      ['track', 'scene_tracks.json'],
      ['artist', 'scene_artists.json'],
    ];
    for (const [type, file] of files) {
      const items = this.readJson(file);
      if (items.length === 0) continue;
      await this.scene.saveSlots(type, items);
      this.logger.log(`Imported ${items.length} ${type} scene slots from ${file}`);
    }
  }

  private async importLyrics() {
    if ((await this.prisma.lyrics.count()) > 0) return;
    const full = path.join(this.root, 'lyrics_store.json');
    if (!fs.existsSync(full)) return;
    try {
      const store = JSON.parse(fs.readFileSync(full, 'utf8')) as Record<string, any>;
      const rows = Object.values(store)
        .filter(l => l && l.artist && l.title)
        .map(l => ({
          artist: String(l.artist),
          title: String(l.title),
          synced: l.synced || null,
          plain: l.plain || null,
          source: l.source || 'lrclib',
        }));
      const result = await this.prisma.lyrics.createMany({ data: rows, skipDuplicates: true });
      this.logger.log(`Imported ${result.count} lyrics from JSON`);
    } catch (err) {
      this.logger.warn(`Cannot import lyrics_store.json: ${err}`);
    }
  }

  /**
   * Рецензии раньше ссылались на номер слота (`slot-album-9`), а слот может содержать другой релиз.
   * Привязываем такие рецензии к настоящей записи каталога (по названию релиза из рецензии),
   * переписываем targetId на стабильный id и заполняем Review.albumId / Review.trackId.
   */
  private async backfillReviewLinks() {
    const reviews = await this.prisma.review.findMany({ where: { albumId: null, trackId: null } });
    let linked = 0;
    for (const r of reviews) {
      try {
        const isTrack = r.targetId.startsWith('track:');
        const bare = r.targetId.replace(/^(track|album|month-artist):/, '');
        if (r.targetId.startsWith('month-artist:')) continue;

        const slot = bare.match(/^slot-(album|track)-(\d+)$/);
        let albumId: string | null = null;
        let trackId: string | null = null;

        if (slot) {
          const row = await this.prisma.sceneSlot.findUnique({
            where: { type_slotIndex: { type: slot[1], slotIndex: Number(slot[2]) - 1 } },
            include: { album: true, track: true },
          });
          const sameTitle = (a?: string | null) => !r.itemTitle || (a || '').toLowerCase() === r.itemTitle.toLowerCase();
          if (slot[1] === 'album' && row?.album && sameTitle(row.album.title)) albumId = row.album.id;
          if (slot[1] === 'track' && row?.track && sameTitle(row.track.title)) trackId = row.track.id;
          if (!albumId && !trackId && r.itemTitle) {
            const byTitle = await this.prisma.album.findFirst({
              where: { title: { equals: r.itemTitle, mode: 'insensitive' } },
              select: { id: true },
            });
            if (slot[1] === 'album' && byTitle) albumId = byTitle.id;
          }
        } else if (isTrack) {
          trackId = (await this.prisma.track.findUnique({ where: { id: bare }, select: { id: true } }))?.id ?? null;
        } else {
          albumId = (await this.prisma.album.findUnique({ where: { id: bare }, select: { id: true } }))?.id ?? null;
        }
        if (!albumId && !trackId) continue;

        const newTarget = slot ? `${isTrack || slot[1] === 'track' ? 'track:' : ''}${albumId ?? trackId}` : r.targetId;
        const clash =
          newTarget !== r.targetId &&
          (await this.prisma.review.findUnique({
            where: { userId_targetId: { userId: r.userId, targetId: newTarget } },
            select: { id: true },
          }));
        await this.prisma.review.update({
          where: { id: r.id },
          data: { albumId, trackId, ...(slot && !clash ? { targetId: newTarget } : {}) },
        });
        linked++;
      } catch (err) {
        this.logger.warn(`Review ${r.id} not linked: ${err}`);
      }
    }
    if (linked > 0) this.logger.log(`Linked ${linked} reviews to catalog rows`);
  }
}
