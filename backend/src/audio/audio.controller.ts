import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('lyrics')
  async lyrics(@Query('artist') artist: string, @Query('title') title: string) {
    const result = await this.audioService.getLyrics(artist || '', title || '');
    return result ?? { synced: null, plain: null, source: null };
  }

  @Post('lyrics')
  saveLyrics(@Body() body: { artist: string; title: string; synced?: string; plain?: string }) {
    return this.audioService.saveLyrics({
      artist: body.artist,
      title: body.title,
      synced: body.synced || undefined,
      plain: body.plain || undefined,
      source: 'manual',
    });
  }
}
