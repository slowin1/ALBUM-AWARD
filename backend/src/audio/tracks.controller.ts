import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { AudioService } from './audio.service';
import { PrismaService } from '../prisma/prisma.service';

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
    private readonly prisma: PrismaService,
  ) {}

  // Parse track or album metadata from SoundCloud or Spotify URL
  @Get('parse')
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
  async parseSoundcloud(@Query('url') url: string) {
    return this.parseUrl(url);
  }

  // Upload cover image
  @Post('upload-cover')
  uploadCover(@Body() body: { imageBase64: string; filename?: string }) {
    if (!body?.imageBase64) {
      throw new HttpException('imageBase64 is required', HttpStatus.BAD_REQUEST);
    }
    const url = this.audioService.saveUploadedCover(body.imageBase64, body.filename);
    return { url };
  }

  // List all custom uploaded / added tracks
  @Get()
  async getTracks() {
    return this.audioService.getAllCustomTracks();
  }

  // Create new track (manually or from URL)
  @Post()
  async addTrack(@Body() body: CustomTrackDto) {
    if (!body.title && !body.soundcloudUrl) {
      throw new HttpException('Title or SoundCloud URL is required', HttpStatus.BAD_REQUEST);
    }
    return this.audioService.addCustomTrack(body);
  }

  // Update track
  @Put(':id')
  async updateTrack(@Param('id') id: string, @Body() body: Partial<CustomTrackDto>) {
    return this.audioService.updateCustomTrack(id, body);
  }

  // Delete track
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    return this.audioService.deleteCustomTrack(id);
  }
}
