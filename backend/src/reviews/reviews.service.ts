import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveReviewDto } from './dto/save-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateTotalScore(scores: SaveReviewDto['scores']): number {
    const r = Math.max(0, Math.min(10, Number(scores?.rhymes ?? 5)));
    const st = Math.max(0, Math.min(10, Number(scores?.structure ?? 5)));
    const sy = Math.max(0, Math.min(10, Number(scores?.style ?? 5)));
    const ind = Math.max(0, Math.min(10, Number(scores?.individuality ?? 5)));
    const at = Math.max(0, Math.min(10, Number(scores?.atmosphere ?? 5)));

    const avg10 = (r + st + sy + ind + at) / 5;
    return Math.round(avg10 * 10 * 10) / 10; // 0 to 100 with 1 decimal
  }

  /**
   * Связывает рецензию с реальной записью каталога: targetId может быть id альбома/трека,
   * `track:<id>` или id слота сцены (`slot-album-N`, `slot-track-N`).
   */
  private async resolveTarget(targetId: string): Promise<{ albumId: string | null; trackId: string | null }> {
    const bare = targetId.replace(/^(track|album|month-artist):/, '');
    const slot = bare.match(/^slot-(album|track)-(\d+)$/);
    if (slot) {
      const row = await this.prisma.sceneSlot.findUnique({
        where: { type_slotIndex: { type: slot[1], slotIndex: Number(slot[2]) - 1 } },
        select: { albumId: true, trackId: true },
      });
      return { albumId: row?.albumId ?? null, trackId: row?.trackId ?? null };
    }
    if (targetId.startsWith('month-artist:')) return { albumId: null, trackId: null };
    const [album, track] = await Promise.all([
      targetId.startsWith('track:') ? null : this.prisma.album.findUnique({ where: { id: bare }, select: { id: true } }),
      targetId.startsWith('album:') ? null : this.prisma.track.findUnique({ where: { id: bare }, select: { id: true } }),
    ]);
    return { albumId: album?.id ?? null, trackId: track?.id ?? null };
  }

  async saveReview(userId: string, dto: SaveReviewDto) {
    const targetId = (dto.targetId ?? '').trim();
    const text = (dto.text ?? '').trim();
    const title = (dto.title ?? '').trim() || 'Рецензия';

    if (!targetId) {
      throw new BadRequestException('targetId is required');
    }
    if (!text) {
      throw new BadRequestException('Текст рецензии не может быть пустым');
    }

    const rhymesScore = Math.max(0, Math.min(10, Math.round(Number(dto.scores?.rhymes ?? 5))));
    const structureScore = Math.max(0, Math.min(10, Math.round(Number(dto.scores?.structure ?? 5))));
    const styleScore = Math.max(0, Math.min(10, Math.round(Number(dto.scores?.style ?? 5))));
    const individualityScore = Math.max(0, Math.min(10, Math.round(Number(dto.scores?.individuality ?? 5))));
    const atmosphereScore = Math.max(0, Math.min(10, Math.round(Number(dto.scores?.atmosphere ?? 5))));
    const totalScore = this.calculateTotalScore(dto.scores);

    const links = await this.resolveTarget(targetId);

    const review = await this.prisma.review.upsert({
      where: {
        userId_targetId: {
          userId,
          targetId,
        },
      },
      create: {
        userId,
        targetId,
        albumId: links.albumId,
        trackId: links.trackId,
        targetType: dto.targetType || (targetId.startsWith('track:') ? 'track' : targetId.startsWith('month-artist:') ? 'artist' : 'album'),
        title,
        text,
        rhymesScore,
        structureScore,
        styleScore,
        individualityScore,
        atmosphereScore,
        totalScore,
        itemTitle: dto.itemTitle?.trim() || null,
        itemArtist: dto.itemArtist?.trim() || null,
        itemCover: dto.itemCover?.trim() || null,
        itemYear: dto.itemYear ? Number(dto.itemYear) : null,
      },
      update: {
        albumId: links.albumId,
        trackId: links.trackId,
        title,
        text,
        rhymesScore,
        structureScore,
        styleScore,
        individualityScore,
        atmosphereScore,
        totalScore,
        itemTitle: dto.itemTitle?.trim() || undefined,
        itemArtist: dto.itemArtist?.trim() || undefined,
        itemCover: dto.itemCover?.trim() || undefined,
        itemYear: dto.itemYear ? Number(dto.itemYear) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            avatarSymbol: true,
          },
        },
      },
    });

    return review;
  }

  async deleteReview(userId: string, targetId: string) {
    if (!targetId) throw new BadRequestException('targetId is required');

    try {
      await this.prisma.review.delete({
        where: {
          userId_targetId: {
            userId,
            targetId,
          },
        },
      });
      return { success: true };
    } catch {
      throw new NotFoundException('Рецензия не найдена');
    }
  }

  async getMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getByTarget(targetId: string) {
    return this.prisma.review.findMany({
      where: { targetId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            avatarSymbol: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecentReviews(limit = 20) {
    return this.prisma.review.findMany({
      take: Math.min(100, Math.max(1, limit)),
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            avatarSymbol: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Лайк / снятие лайка с рецензии (переключатель). Счётчик пересчитывается из таблицы лайков. */
  async toggleLike(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId }, select: { id: true, userId: true } });
    if (!review) throw new NotFoundException('Рецензия не найдена');
    

    const existing = await this.prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
      select: { id: true },
    });
    if (existing) {
      await this.prisma.reviewLike.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.reviewLike.create({ data: { userId, reviewId } });
    }
    const likesCount = await this.prisma.reviewLike.count({ where: { reviewId } });
    await this.prisma.review.update({ where: { id: reviewId }, data: { likesCount } });
    return { liked: !existing, likesCount };
  }

  async getMyLikedReviewIds(userId: string) {
    const likes = await this.prisma.reviewLike.findMany({ where: { userId }, select: { reviewId: true } });
    return likes.map(l => l.reviewId);
  }
}
