import { albums, type AlbumDefinition } from './albums'
import { tracks, type TrackDefinition } from './tracks'
import { monthArtists, type MonthArtist } from './monthArtists'
import { artistCatalog } from './artistCatalog'

export type ArtistDefinition = {
  id: string
  name: string
  avatar: string
  albums: AlbumDefinition[]
  tracks: TrackDefinition[]
  monthAwards: MonthArtist[]
}

const albumArtistIds: Record<string, string> = {
  Radiohead: 'radiohead',
  'Daft Punk': 'daft-punk',
  'Frank Ocean': 'frank-ocean',
  'Tyler, The Creator': 'tyler-the-creator',
  'Lana Del Rey': 'lana-del-rey',
  'Tame Impala': 'tame-impala',
  'Kendrick Lamar': 'kendrick-lamar',
  'Massive Attack': 'massive-attack',
  Portishead: 'portishead',
  'Aphex Twin': 'aphex-twin',
  'Pink Floyd': 'pink-floyd',
  Deftones: 'deftones',
}

const trackArtistIds: Record<string, string> = {
  'Kai Angel': 'kai-angel',
  clout: 'clout',
  'тёмный принц': 'temny-princ',
  SALUKI: 'saluki',
  CUPSIZE: 'cupsize',
  '9mice, ЕГОР КРИД, тёмный принц, madk1d': '9mice',
  'gotlibgotlibgotlib, SABU': 'sabu',
  'GORILLA GLU, LIL NAKU, Maladoy Prince': 'maladoy-prince',
  'Big Baby Tape': 'big-baby-tape',
  Heronwater: 'heronwater',
  'тринадцать карат, мартин': 'trinadtsat-karat',
  'SQWOZ BAB': 'sqwoz-bab',
}

const canonicalArtistNames: Record<string, string> = {
  '9mice': '9mice',
  sabu: 'SABU',
  'maladoy-prince': 'Maladoy Prince',
  'trinadtsat-karat': 'тринадцать карат',
}

function slugifyArtistName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'artist'
}

/**
 * Splits an artist credit string and optional release title `(feat. ...)` / `(with ...)`
 * into individual canonical artist names, preserving commas inside `'Tyler, The Creator'`.
 */
export function parseArtistNames(artistCredit: string, releaseTitle?: string): string[] {
  const placeholder = '__TYLER_THE_CREATOR__'
  const normalizeSafe = (text: string) =>
    text.replace(/Tyler,\s*The\s*Creator/gi, placeholder)

  const restoreSafe = (token: string) =>
    token.replace(new RegExp(placeholder, 'g'), 'Tyler, The Creator').trim()

  const rawChunks: string[] = [normalizeSafe(artistCredit)]

  if (releaseTitle) {
    const featRegex = /(?:\(|\[)\s*(?:feat\.?|ft\.?|with|при уч\.?)\s+([^)\]]+)(?:\)|\])/gi
    let match: RegExpExecArray | null
    while ((match = featRegex.exec(releaseTitle)) !== null) {
      rawChunks.push(normalizeSafe(match[1]))
    }
  }

  const names: string[] = []
  for (const chunk of rawChunks) {
    const cleanChunk = chunk.replace(/\s*(?:\(|\[)?(?:feat\.?|ft\.?|with)\s+/gi, ', ')
    const tokens = cleanChunk.split(/\s*(?:,|&|\×|\band\b|\/)\s*/i)
    for (const rawToken of tokens) {
      const restored = restoreSafe(rawToken).replace(/^[\s()[\]]+|[\s()[\]]+$/g, '')
      if (!restored || restored.length < 2) continue
      if (/^(prod\.|dj\s|remix|live|deluxe|version)/i.test(restored)) continue
      if (!names.some(existing => existing.toLowerCase() === restored.toLowerCase())) {
        names.push(restored)
      }
    }
  }
  return names
}

export const artists: ArtistDefinition[] = []

for (const album of albums) {
  const existing = artists.find(artist => artist.name === album.artist)
  if (existing) {
    existing.albums.push(album)
  } else {
    const id = albumArtistIds[album.artist] ?? slugifyArtistName(album.artist)
    artists.push({ id, name: album.artist, avatar: `/artists/${id}.jpg`, albums: [album], tracks: [], monthAwards: [] })
  }
}

for (const track of tracks) {
  const id = trackArtistIds[track.artist] ?? slugifyArtistName(track.artist)
  const canonicalName = canonicalArtistNames[id] ?? track.artist
  const existing = artists.find(artist => artist.id === id || artist.name === canonicalName)
  if (existing) {
    existing.tracks.push(track)
  } else {
    artists.push({ id, name: canonicalName, avatar: `/artists/${id}.jpg`, albums: [], tracks: [track], monthAwards: [] })
  }
}

for (const award of monthArtists) {
  const existing = artists.find(artist => artist.id === award.pageId || artist.name === award.artist)
  if (existing) {
    existing.name = award.artist
    existing.monthAwards.push(award)
  } else {
    artists.push({
      id: award.pageId,
      name: award.artist,
      avatar: award.cover,
      albums: [],
      tracks: [],
      monthAwards: [award],
    })
  }
}

// Add all collaborator / featured artists from artistCatalog (e.g., gotlibgotlibgotlib, ЕГОР КРИД, madk1d, etc.)
for (const [catalogId, entry] of Object.entries(artistCatalog)) {
  const existing = artists.find(a => a.id === catalogId)
  if (!existing && entry.name) {
    artists.push({
      id: catalogId,
      name: entry.name,
      avatar: entry.avatar || `/artists/${catalogId}.jpg`,
      albums: [],
      tracks: [],
      monthAwards: [],
    })
  }
}

// Enrich every artist with their full albums and tracks catalogue from Apple Music
for (const artist of artists) {
  const extra = artistCatalog[artist.id]
  if (!extra) continue
  if (extra.avatar && artist.avatar.startsWith('/artists/') && !albums.some(a => albumArtistIds[a.artist] === artist.id) && !tracks.some(t => trackArtistIds[t.artist] === artist.id) && !monthArtists.some(m => m.pageId === artist.id)) {
    artist.avatar = extra.avatar
  }
  for (const extraAlbum of extra.albums) {
    const duplicate = artist.albums.some(a => a.title.toLowerCase() === extraAlbum.title.toLowerCase())
    if (!duplicate) {
      artist.albums.push(extraAlbum)
    }
  }
  for (const extraTrack of extra.tracks) {
    const duplicate = artist.tracks.some(t => t.title.toLowerCase() === extraTrack.title.toLowerCase())
    if (!duplicate) {
      artist.tracks.push(extraTrack)
    }
  }
}

// Build complete flat catalogues of all albums and all tracks (wheel items first at 0..11)
export const allAlbums: AlbumDefinition[] = [...albums]
export const allTracks: TrackDefinition[] = [...tracks]

for (const artist of artists) {
  for (const alb of artist.albums) {
    if (!allAlbums.some(existing => existing.id === alb.id)) {
      allAlbums.push(alb)
    }
  }
  for (const trk of artist.tracks) {
    if (!allTracks.some(existing => existing.id === trk.id)) {
      allTracks.push(trk)
    }
  }
}

// Ensure every collaborator mentioned on any album or track is linked to that release and has a page in `artists`
function findOrCreateArtist(name: string, fallbackCover: string): ArtistDefinition {
  const lower = name.toLowerCase()
  const existing = artists.find(a => a.name.toLowerCase() === lower || a.id === lower)
  if (existing) return existing
  const id = slugifyArtistName(name)
  const byId = artists.find(a => a.id === id)
  if (byId) return byId
  const created: ArtistDefinition = {
    id,
    name,
    avatar: fallbackCover,
    albums: [],
    tracks: [],
    monthAwards: [],
  }
  artists.push(created)
  return created
}

for (const alb of allAlbums) {
  const names = parseArtistNames(alb.artist, alb.title)
  for (const name of names) {
    const art = findOrCreateArtist(name, alb.cover)
    if (!art.albums.some(a => a.id === alb.id || a.title.toLowerCase() === alb.title.toLowerCase())) {
      art.albums.push(alb)
    }
  }
}

for (const trk of allTracks) {
  const names = parseArtistNames(trk.artist, trk.title)
  for (const name of names) {
    const art = findOrCreateArtist(name, trk.cover)
    if (!art.tracks.some(t => t.id === trk.id || t.title.toLowerCase() === trk.title.toLowerCase())) {
      art.tracks.push(trk)
    }
  }
}

export function getReleaseArtists(artistCredit: string, releaseTitle?: string): ArtistDefinition[] {
  const names = parseArtistNames(artistCredit, releaseTitle)
  const resolved: ArtistDefinition[] = []
  for (const name of names) {
    const lower = name.toLowerCase()
    const match = artists.find(a => a.name.toLowerCase() === lower || a.id === slugifyArtistName(name))
    if (match && !resolved.includes(match)) {
      resolved.push(match)
    }
  }
  return resolved
}

export function getAlbumArtist(album: AlbumDefinition): ArtistDefinition {
  const id = albumArtistIds[album.artist]
  if (id) {
    const byId = artists.find(candidate => candidate.id === id)
    if (byId) return byId
  }
  const byName = artists.find(candidate => candidate.name.toLowerCase() === album.artist.toLowerCase())
  if (byName) return byName
  const releaseArtists = getReleaseArtists(album.artist, album.title)
  if (releaseArtists.length > 0) return releaseArtists[0]
  const owner = artists.find(candidate => candidate.albums.some(a => a.id === album.id))
  if (owner) return owner
  throw new Error(`Artist is missing from the catalogue: ${album.artist}`)
}

export function getTrackArtist(track: TrackDefinition): ArtistDefinition {
  const id = trackArtistIds[track.artist]
  if (id) {
    const byId = artists.find(candidate => candidate.id === id)
    if (byId) return byId
  }
  const byName = artists.find(candidate => candidate.name.toLowerCase() === track.artist.toLowerCase())
  if (byName) return byName
  const releaseArtists = getReleaseArtists(track.artist, track.title)
  if (releaseArtists.length > 0) return releaseArtists[0]
  const owner = artists.find(candidate => candidate.tracks.some(t => t.id === track.id))
  if (owner) return owner
  throw new Error(`Artist is missing from the catalogue: ${track.artist}`)
}

export function getMonthArtist(award: MonthArtist): ArtistDefinition {
  const artist = artists.find(candidate => candidate.id === award.pageId || candidate.name === award.artist)
  if (!artist) throw new Error(`Month artist is missing from the catalogue: ${award.artist}`)
  return artist
}
