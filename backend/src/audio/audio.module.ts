import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { TracksController } from './tracks.controller';
import { AlbumsController } from './albums.controller';
import { SceneController } from './scene.controller';
import { ArtistsController } from './artists.controller';
import { AudioService } from './audio.service';

@Module({
  controllers: [AudioController, TracksController, AlbumsController, SceneController, ArtistsController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}
