import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votes: VotesService) {}

  // Мои голоса (Авторизованный пользователь)
  @Get('my')
  @UseGuards(JwtAuthGuard)
  my(@Req() req: any, @Query('season') season?: string) {
    return this.votes.getMyVotes(req.user.id, season);
  }

  // Итоги голосования по категории (Публично)
  @Get('results/:category')
  results(@Param('category') category: string, @Query('season') season?: string) {
    return this.votes.results(category, season);
  }

  // Отдать или изменить голос
  @Post()
  @UseGuards(JwtAuthGuard)
  cast(@Req() req: any, @Body() body: { category: string; targetId: string; season?: string }) {
    return this.votes.castVote(req.user.id, body?.category, body?.targetId, body?.season);
  }

  // Снять голос
  @Delete(':category')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any, @Param('category') category: string, @Query('season') season?: string) {
    return this.votes.removeVote(req.user.id, category, season);
  }
}
