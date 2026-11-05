import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

const hasRealCover = (cover?: string | null) => !!cover && !cover.includes('placeholder');

type AttentionRow = {
  key: string;
  kind: 'album' | 'track';
  id: string;
  title: string;
  artist: string;
  cover: string;
  problems: string[];
};

/** Сводка для админ-панели: все подсчёты делает база, а не браузер. */
@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  @UseGuards(AdminGuard)
  async stats() {
    const [albums, singles, albumTracks, artistsCount, leaders, sceneSlots, users, reviews, votes, likes, lyrics, nominees] =
      await Promise.all([
        this.prisma.album.findMany({
          select: { id: true, title: true, artistDisplay: true, cover: true, soundcloudUrl: true, artistId: true, year: true },
        }),
        this.prisma.track.findMany({
          where: { albumId: null },
          select: { id: true, title: true, artistDisplay: true, cover: true, soundcloudUrl: true, _count: { select: { artists: true } } },
        }),
        this.prisma.track.count({ where: { albumId: { not: null } } }),
        this.prisma.artist.count(),
        this.prisma.artist.findMany({
          where: { tracks: { some: {} } },
          select: { name: true, _count: { select: { tracks: true } } },
          orderBy: { tracks: { _count: 'desc' } },
          take: 6,
        }),
        this.prisma.sceneSlot.findMany({ select: { type: true, albumId: true, trackId: true, artistId: true } }),
        this.prisma.user.count(),
        this.prisma.review.count(),
        this.prisma.vote.count(),
        this.prisma.reviewLike.count(),
        this.prisma.lyrics.count(),
        this.prisma.freshman.count(),
      ]);

    const releases: AttentionRow[] = [];
    for (const a of albums) {
      const problems: string[] = [];
      if (!hasRealCover(a.cover)) problems.push('нет обложки');
      if (!a.soundcloudUrl?.trim()) problems.push('нет ссылки');
      if (!a.artistId) problems.push('нет профиля исполнителя');
      releases.push({
        key: `album:${a.id}`,
        kind: 'album',
        id: a.id,
        title: a.title,
        artist: a.artistDisplay || '',
        cover: a.cover,
        problems,
      });
    }
    for (const t of singles) {
      const problems: string[] = [];
      if (!hasRealCover(t.cover)) problems.push('нет обложки');
      if (!t.soundcloudUrl?.trim()) problems.push('нет ссылки');
      if (t._count.artists === 0) problems.push('нет профиля исполнителя');
      releases.push({
        key: `track:${t.id}`,
        kind: 'track',
        id: t.id,
        title: t.title,
        artist: t.artistDisplay || '',
        cover: t.cover,
        problems,
      });
    }

    const yearCounts = new Map<number, number>();
    for (const a of albums) {
      if (a.year) yearCounts.set(a.year, (yearCounts.get(a.year) ?? 0) + 1);
    }

    const filled = (type: string) =>
      sceneSlots.filter(s => s.type === type && (s.albumId || s.trackId || s.artistId)).length;

    return {
      counts: {
        albums: albums.length,
        singles: singles.length,
        albumTracks,
        artists: artistsCount,
        users,
        reviews,
        reviewLikes: likes,
        votes,
        lyrics,
        nominees,
      },
      quality: {
        total: releases.length,
        withCover: releases.filter(r => !r.problems.includes('нет обложки')).length,
        withLink: releases.filter(r => !r.problems.includes('нет ссылки')).length,
        withProfile: releases.filter(r => !r.problems.includes('нет профиля исполнителя')).length,
      },
      attention: releases
        .filter(r => r.problems.length > 0)
        .sort((a, b) => b.problems.length - a.problems.length),
      yearCounts: [...yearCounts.entries()].sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })),
      leaders: leaders.map(l => ({ name: l.name, count: l._count.tracks })),
      scene: { album: filled('album'), track: filled('track'), artist: filled('artist'), total: 12 },
    };
  }
}
