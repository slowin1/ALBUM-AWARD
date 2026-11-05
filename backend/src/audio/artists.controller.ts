import { Controller, Get, Param, Query } from '@nestjs/common';
import { AudioService } from './audio.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  async getArtists(@Query('search') search?: string) {
    return this.audioService.getAllArtists(search);
  }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    return this.audioService.getArtistById(id);
  }
}
