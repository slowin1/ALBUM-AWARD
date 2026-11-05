import { Body, Controller, Get, Post, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('scene')
export class SceneController {
  constructor(private readonly audioService: AudioService) {}

  @Get('albums')
  getSceneAlbums() {
    return this.audioService.getSceneAlbums();
  }

  @Post('albums')
  @UseGuards(AdminGuard)
  saveSceneAlbums(@Body() body: { albums: any[] }) {
    if (!Array.isArray(body?.albums)) {
      throw new HttpException('albums array required', HttpStatus.BAD_REQUEST);
    }
    return this.audioService.saveSceneAlbums(body.albums);
  }

  @Get('tracks')
  getSceneTracks() {
    return this.audioService.getSceneTracks();
  }

  @Post('tracks')
  @UseGuards(AdminGuard)
  saveSceneTracks(@Body() body: { tracks: any[] }) {
    if (!Array.isArray(body?.tracks)) {
      throw new HttpException('tracks array required', HttpStatus.BAD_REQUEST);
    }
    return this.audioService.saveSceneTracks(body.tracks);
  }

  @Get('artists')
  getSceneArtists() {
    return this.audioService.getSceneArtists();
  }

  @Post('artists')
  @UseGuards(AdminGuard)
  saveSceneArtists(@Body() body: { artists: any[] }) {
    if (!Array.isArray(body?.artists)) {
      throw new HttpException('artists array required', HttpStatus.BAD_REQUEST);
    }
    return this.audioService.saveSceneArtists(body.artists);
  }

  @Post('slot')
  @UseGuards(AdminGuard)
  updateSlot(@Body() body: { type: 'album' | 'track' | 'artist'; slotIndex: number; data: any }) {
    if (body.slotIndex < 0 || body.slotIndex >= 12 || !body.data) {
      throw new HttpException('Valid slotIndex (0-11) and data required', HttpStatus.BAD_REQUEST);
    }
    if (body.type === 'album') {
      return this.audioService.updateSceneAlbumSlot(body.slotIndex, body.data);
    } else if (body.type === 'artist') {
      return this.audioService.updateSceneArtistSlot(body.slotIndex, body.data);
    } else {
      return this.audioService.updateSceneTrackSlot(body.slotIndex, body.data);
    }
  }
}
