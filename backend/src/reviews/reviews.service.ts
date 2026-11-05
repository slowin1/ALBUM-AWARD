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
}
