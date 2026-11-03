import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { AudioService, CustomAlbumTrack } from './audio.service';

export type CustomAlbumDto = {
  title: string;
  artist: string;
  artistId?: string;
  artistIds?: string[];
  cover: string;
  soundcloudUrl?: string;
  soundcloudPlaylistId?: string;
  tracks: CustomAlbumTrack[];
  year?: number;
};

@Controller('albums')
export class AlbumsController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  async getAlbums() {
    return this.audioService.getAllCustomAlbums();
  }

  @Post()
  async addAlbum(@Body() body: CustomAlbumDto) {
    if (!body.title || !body.artist) {
      throw new HttpException('Title and artist are required', HttpStatus.BAD_REQUEST);
    }
    return this.audioService.addCustomAlbum(body);
  }

  @Put(':id')
  async updateAlbum(@Param('id') id: string, @Body() body: Partial<CustomAlbumDto>) {
    return this.audioService.updateCustomAlbum(id, body);
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    return this.audioService.deleteCustomAlbum(id);
  }
}
