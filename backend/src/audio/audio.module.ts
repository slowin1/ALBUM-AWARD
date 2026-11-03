import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { TracksController } from './tracks.controller';
import { AlbumsController } from './albums.controller';
import { SceneController } from './scene.controller';
import { AudioService } from './audio.service';

@Module({
  controllers: [AudioController, TracksController, AlbumsController, SceneController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}
