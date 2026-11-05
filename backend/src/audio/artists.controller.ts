import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async getArtists(@Query('search') search?: string) {
    return this.catalog.getAllArtists(search);
  }

  // Страницы исполнителей с альбомами и треками (Публично)
  @Get('pages')
  async getArtistPages() {
    return this.catalog.listArtistPages();
  }

  @Get('nominees')
  async getNominees() {
    return this.catalog.listNominees();
  }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    const artist = await this.catalog.getArtistById(id);
    if (!artist) throw new NotFoundException('Артист не найден');
    return artist;
  }
}
