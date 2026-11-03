import type { AlbumDefinition } from './albums'
import type { TrackDefinition } from './tracks'

export type ArtistCatalogEntry = {
  name?: string
  avatar?: string
  albums: AlbumDefinition[]
  tracks: TrackDefinition[]
}

export const artistCatalog: Record<string, ArtistCatalogEntry> = {}
