import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { SaveReviewDto } from './dto/save-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Сохранить или обновить рецензию (Авторизованный пользователь)
  @Post()
  @UseGuards(JwtAuthGuard)
  async saveReview(@Req() req: any, @Body() dto: SaveReviewDto) {
    return this.reviewsService.saveReview(req.user.id, dto);
  }

  // Получить все рецензии текущего пользователя
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyReviews(@Req() req: any) {
    return this.reviewsService.getMyReviews(req.user.id);
  }

  // Удалить рецензию
  @Delete(':targetId')
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Req() req: any, @Param('targetId') targetId: string) {
    return this.reviewsService.deleteReview(req.user.id, targetId);
  }

  // Лайкнуть / снять лайк с рецензии
  @Post(':reviewId/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Req() req: any, @Param('reviewId') reviewId: string) {
    return this.reviewsService.toggleLike(req.user.id, reviewId);
  }

  // id рецензий, которые лайкнул текущий пользователь
  @Get('liked/my')
  @UseGuards(JwtAuthGuard)
  async getMyLikes(@Req() req: any) {
    return this.reviewsService.getMyLikedReviewIds(req.user.id);
  }

  // Получить рецензии сообщества на релиз/трек (Публично)
  @Get('target/:targetId')
  async getByTarget(@Param('targetId') targetId: string) {
    return this.reviewsService.getByTarget(targetId);
  }

  // Лента недавних рецензий (Публично)
  @Get('recent')
  async getRecent(@Query('limit') limit?: string) {
    return this.reviewsService.getRecentReviews(limit ? parseInt(limit, 10) : 20);
  }
}
