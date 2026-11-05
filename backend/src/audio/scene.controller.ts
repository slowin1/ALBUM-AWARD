import { Body, Controller, Get, Post, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { SceneService, SceneType, SCENE_SLOTS } from './scene.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('scene')
export class SceneController {
  constructor(private readonly scene: SceneService) {}

  @Get('albums')
  getSceneAlbums() {
    return this.scene.getSlots('album');
  }

  @Post('albums')
  @UseGuards(AdminGuard)
  async saveSceneAlbums(@Body() body: { albums: any[] }) {
    if (!Array.isArray(body?.albums)) {
      throw new HttpException('albums array required', HttpStatus.BAD_REQUEST);
    }
    return { success: true, albums: await this.scene.saveSlots('album', body.albums) };
  }

  @Get('tracks')
  getSceneTracks() {
    return this.scene.getSlots('track');
  }

  @Post('tracks')
  @UseGuards(AdminGuard)
  async saveSceneTracks(@Body() body: { tracks: any[] }) {
    if (!Array.isArray(body?.tracks)) {
      throw new HttpException('tracks array required', HttpStatus.BAD_REQUEST);
    }
    return { success: true, tracks: await this.scene.saveSlots('track', body.tracks) };
  }

  @Get('artists')
  getSceneArtists() {
    return this.scene.getSlots('artist');
  }

  @Post('artists')
  @UseGuards(AdminGuard)
  async saveSceneArtists(@Body() body: { artists: any[] }) {
    if (!Array.isArray(body?.artists)) {
      throw new HttpException('artists array required', HttpStatus.BAD_REQUEST);
    }
    return { success: true, artists: await this.scene.saveSlots('artist', body.artists) };
  }

  @Post('slot')
  @UseGuards(AdminGuard)
  async updateSlot(@Body() body: { type: SceneType; slotIndex: number; data: any }) {
    if (!['album', 'track', 'artist'].includes(body?.type)) {
      throw new HttpException('type must be album | track | artist', HttpStatus.BAD_REQUEST);
    }
    if (!Number.isInteger(body.slotIndex) || body.slotIndex < 0 || body.slotIndex >= SCENE_SLOTS || !body.data) {
      throw new HttpException(`Valid slotIndex (0-${SCENE_SLOTS - 1}) and data required`, HttpStatus.BAD_REQUEST);
    }
    return { success: true, slot: await this.scene.updateSlot(body.type, body.slotIndex, body.data) };
  }
}
