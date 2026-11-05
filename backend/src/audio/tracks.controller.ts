import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { CatalogService } from './catalog.service';
import { AdminGuard } from '../auth/admin.guard';

export type CustomTrackDto = {
  id?: string;
  title: string;
  artist: string;
  artistId?: string;
  artistIds?: string[];
  albumTitle?: string;
  cover?: string;
  duration?: string;
  audioUrl?: string;
  soundcloudUrl?: string;
  soundcloudTrackId?: string;
};

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly audioService: AudioService,
    private readonly catalog: CatalogService,
  ) {}

  // Parse track or album metadata from SoundCloud or Spotify URL (Администратор)
  @Get('parse')
  @UseGuards(AdminGuard)
  async parseUrl(@Query('url') url: string) {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }
    const meta = await this.audioService.parseUrlMetadata(url);
    if (!meta) {
      throw new HttpException('Could not parse metadata from URL', HttpStatus.NOT_FOUND);
    }
    return meta;
  }

  @Get('parse-soundcloud')
  @UseGuards(AdminGuard)
  async parseSoundcloud(@Query('url') url: string) {
    return this.parseUrl(url);
  }

  // Upload cover image (Администратор)
  @Post('upload-cover')
  @UseGuards(AdminGuard)
  uploadCover(@Body() body: { imageBase64: string; filename?: string }) {
    if (!body?.imageBase64) {
      throw new HttpException('imageBase64 is required', HttpStatus.BAD_REQUEST);
    }
    const url = this.audioService.saveUploadedCover(body.imageBase64, body.filename);
    return { url };
  }

  // List all custom uploaded / added tracks (Публично для ленты и колеса треков)
  @Get()
  async getTracks() {
    return this.catalog.listSingles();
  }

  // Create new track (manually or from URL) (Администратор)
  @Post()
  @UseGuards(AdminGuard)
  async addTrack(@Body() body: CustomTrackDto) {
    if (!body.title && !body.soundcloudUrl) {
      throw new HttpException('Title or SoundCloud URL is required', HttpStatus.BAD_REQUEST);
    }
    return this.catalog.createTrack(body as any);
  }

  // Update track (Администратор)
  @Put(':id')
  @UseGuards(AdminGuard)
  async updateTrack(@Param('id') id: string, @Body() body: Partial<CustomTrackDto>) {
    return this.catalog.updateTrack(id, body);
  }

  // Delete track (Администратор)
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteTrack(@Param('id') id: string) {
    return this.catalog.deleteTrack(id);
  }
}
