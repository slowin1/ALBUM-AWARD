import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CustomAlbumTrack } from './audio.service';
import { AdminGuard } from '../auth/admin.guard';

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
  constructor(private readonly catalog: CatalogService) {}

  // List all albums (Публично для ленты и колеса альбомов)
  @Get()
  async getAlbums() {
    return this.catalog.listAlbums();
  }

  // Create album (Администратор)
  @Post()
  @UseGuards(AdminGuard)
  async addAlbum(@Body() body: CustomAlbumDto) {
    if (!body.title || !body.artist) {
      throw new HttpException('Title and artist are required', HttpStatus.BAD_REQUEST);
    }
    return this.catalog.createAlbum(body);
  }

  // Update album (Администратор)
  @Put(':id')
  @UseGuards(AdminGuard)
  async updateAlbum(@Param('id') id: string, @Body() body: Partial<CustomAlbumDto>) {
    return this.catalog.updateAlbum(id, body);
  }

  // Delete album (Администратор)
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteAlbum(@Param('id') id: string) {
    return this.catalog.deleteAlbum(id);
  }
}
