import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { TracksController } from './tracks.controller';
import { AlbumsController } from './albums.controller';
import { SceneController } from './scene.controller';
import { ArtistsController } from './artists.controller';
import { AudioService } from './audio.service';
import { CatalogService } from './catalog.service';
import { SceneService } from './scene.service';
import { LegacyImportService } from './legacy-import.service';

@Module({
  controllers: [AudioController, TracksController, AlbumsController, SceneController, ArtistsController],
  providers: [AudioService, CatalogService, SceneService, LegacyImportService],
  exports: [AudioService, CatalogService, SceneService],
})
export class AudioModule {}
