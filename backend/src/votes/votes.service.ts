import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const VOTE_CATEGORIES = ['album_of_the_year', 'track_of_the_year', 'month_artist'] as const;
export type VoteCategory = (typeof VOTE_CATEGORIES)[number];

export const DEFAULT_SEASON = '2026';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  private assertCategory(category: string): VoteCategory {
    if (!(VOTE_CATEGORIES as readonly string[]).includes(category)) {
      throw new BadRequestException(`Неизвестная категория голосования: ${category}`);
    }
    return category as VoteCategory;
  }

  private cleanSeason(season?: string): string {
    return (season ?? '').trim() || DEFAULT_SEASON;
  }

  /** Один голос на пользователя в категории и сезоне; повторный голос меняет выбор. */
  async castVote(userId: string, category: string, targetId: string, season?: string) {
    const cat = this.assertCategory(category);
    const target = (targetId ?? '').trim();
    if (!target) throw new BadRequestException('targetId is required');
    const seasonKey = this.cleanSeason(season);

    const vote = await this.prisma.vote.upsert({
      where: { userId_category_season: { userId, category: cat, season: seasonKey } },
      create: { userId, category: cat, targetId: target, season: seasonKey },
      update: { targetId: target },
    });
    if (cat === 'month_artist') await this.recountFreshmen(seasonKey);
    return vote;
  }

  async removeVote(userId: string, category: string, season?: string) {
    const cat = this.assertCategory(category);
    const seasonKey = this.cleanSeason(season);
    const { count } = await this.prisma.vote.deleteMany({ where: { userId, category: cat, season: seasonKey } });
    if (count === 0) throw new NotFoundException('Голос не найден');
    if (cat === 'month_artist') await this.recountFreshmen(seasonKey);
    return { success: true };
  }

  getMyVotes(userId: string, season?: string) {
    return this.prisma.vote.findMany({
      where: { userId, ...(season ? { season } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async results(category: string, season?: string) {
    const cat = this.assertCategory(category);
    const groups = await this.prisma.vote.groupBy({
      by: ['targetId'],
      where: { category: cat, season: this.cleanSeason(season) },
      _count: { _all: true },
      orderBy: { _count: { targetId: 'desc' } },
    });
    return groups.map(g => ({ targetId: g.targetId, votes: g._count._all }));
  }

  /**
   * Голос «Артист месяца» адресован слоту сцены (`slot-artist-N`) или id/slug артиста;
   * число голосов сохраняется в Freshman.votesCount.
   */
  private async recountFreshmen(season: string) {
    const freshmen = await this.prisma.freshman.findMany({ include: { artist: { select: { id: true, slug: true } } } });
    const slots = await this.prisma.sceneSlot.findMany({ where: { type: 'artist', artistId: { not: null } } });
    const votes = await this.prisma.vote.groupBy({
      by: ['targetId'],
      where: { category: 'month_artist', season },
      _count: { _all: true },
    });
    const counts = new Map(votes.map(v => [v.targetId, v._count._all]));

    for (const f of freshmen) {
      const keys = new Set<string>([f.artist.id, f.artist.slug]);
      for (const slot of slots) {
        if (slot.artistId === f.artist.id) keys.add(`slot-artist-${slot.slotIndex + 1}`);
      }
      let total = 0;
      for (const key of keys) total += counts.get(key) ?? 0;
      if (total !== f.votesCount) {
        await this.prisma.freshman.update({ where: { id: f.id }, data: { votesCount: total } });
      }
    }
  }
}
