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

const albumArtistIds: Record<string, string> = {}

const trackArtistIds: Record<string, string> = {}

const canonicalArtistNames: Record<string, string> = {}

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
    artists.push({ id, name: album.artist, avatar: album.cover || '/covers/placeholder.jpg', albums: [album], tracks: [], monthAwards: [] })
  }
}

for (const track of tracks) {
  const id = trackArtistIds[track.artist] ?? slugifyArtistName(track.artist)
  const canonicalName = canonicalArtistNames[id] ?? track.artist
  const existing = artists.find(artist => artist.id === id || artist.name === canonicalName)
  if (existing) {
    existing.tracks.push(track)
  } else {
    artists.push({ id, name: canonicalName, avatar: track.cover || '/covers/placeholder.jpg', albums: [], tracks: [track], monthAwards: [] })
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
export function findOrCreateArtist(name: string, fallbackCover: string): ArtistDefinition {
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
  return findOrCreateArtist(album.artist, album.cover)
}

export type CustomSoundCloudAlbumInput = {
  id: string
  title: string
  artist: string
  artistId?: string
  year?: number
  cover: string
  soundcloudUrl: string
  soundcloudPlaylistId?: string
  tracks?: Array<{
    id: string
    title: string
    artist?: string
    artistId?: string
    duration?: string
    soundcloudUrl?: string
    soundcloudTrackId?: string
    cover?: string
  }>
}

export function registerCustomSoundcloudAlbum(custom: CustomSoundCloudAlbumInput): AlbumDefinition {
  const existing = allAlbums.find(
    a => a.id === custom.id || (custom.soundcloudUrl && a.soundcloudUrl === custom.soundcloudUrl),
  )

  const albDef: AlbumDefinition = existing ?? {
    id: custom.id,
    title: custom.title,
    artist: custom.artist,
    year: custom.year || 2026,
    cover: custom.cover,
    sourceUrl: custom.soundcloudUrl,
    soundcloudUrl: custom.soundcloudUrl,
    soundcloudPlaylistId: custom.soundcloudPlaylistId,
    tracks: custom.tracks,
  }

  if (existing && custom.tracks && (!existing.tracks || existing.tracks.length === 0)) {
    existing.tracks = custom.tracks
  }

  if (!existing) {
    allAlbums.push(albDef)

    let targetArtist: ArtistDefinition | undefined
    if (custom.artistId) {
      targetArtist = artists.find(a => a.id === custom.artistId)
    }
    if (!targetArtist) {
      targetArtist = artists.find(a => a.name.toLowerCase() === custom.artist.toLowerCase())
    }

    if (targetArtist) {
      albumArtistIds[albDef.artist] = targetArtist.id
      if (!targetArtist.albums.some(a => a.id === albDef.id || a.title.toLowerCase() === albDef.title.toLowerCase())) {
        targetArtist.albums.unshift(albDef)
      }
    } else {
      const names = parseArtistNames(albDef.artist, albDef.title)
      for (const name of names) {
        const art = findOrCreateArtist(name, albDef.cover)
        if (!art.albums.some(a => a.id === albDef.id)) {
          art.albums.push(albDef)
        }
      }
    }
  }

  if (custom.tracks && Array.isArray(custom.tracks)) {
    custom.tracks.forEach((t, i) => {
      registerCustomSoundcloudTrack({
        id: t.id || `${custom.id}-trk-${i + 1}`,
        albumId: albDef.id,
        title: t.title,
        albumTitle: albDef.title,
        artist: t.artist || albDef.artist,
        artistId: t.artistId || custom.artistId,
        cover: t.cover || albDef.cover,
        duration: t.duration || '3:30',
        soundcloudUrl: t.soundcloudUrl || albDef.soundcloudUrl || '',
        soundcloudTrackId: t.soundcloudTrackId,
      })
    })
  }

  return albDef
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
  return findOrCreateArtist(track.artist, track.cover)
}

export type CustomSoundCloudTrackInput = {
  id: string
  albumId?: string
  title: string
  artist: string
  artistId?: string
  artistIds?: string[]
  albumTitle?: string
  cover: string
  duration?: string
  soundcloudUrl: string
  soundcloudTrackId?: string
}

export function registerCustomSoundcloudTrack(custom: CustomSoundCloudTrackInput): TrackDefinition {
  const existing = allTracks.find(
    t => t.id === custom.id || (custom.soundcloudUrl && t.soundcloudUrl === custom.soundcloudUrl),
  )
  if (existing) {
    return existing
  }

  const def: TrackDefinition = {
    id: custom.id,
    albumId: custom.albumId || `sc-${custom.id}`,
    title: custom.title,
    albumTitle: custom.albumTitle || 'SoundCloud Single',
    artist: custom.artist,
    year: 2026,
    duration: custom.duration || '3:30',
    cover: custom.cover,
    sourceUrl: custom.soundcloudUrl,
    soundcloudUrl: custom.soundcloudUrl,
    soundcloudTrackId: custom.soundcloudTrackId,
  }

  allTracks.push(def)

  let targetArtist: ArtistDefinition | undefined
  if (custom.artistId) {
    targetArtist = artists.find(a => a.id === custom.artistId)
  }
  if (!targetArtist) {
    targetArtist = artists.find(a => a.name.toLowerCase() === custom.artist.toLowerCase())
  }

  if (targetArtist) {
    trackArtistIds[def.artist] = targetArtist.id
    if (!targetArtist.tracks.some(t => t.id === def.id || t.title.toLowerCase() === def.title.toLowerCase())) {
      targetArtist.tracks.unshift(def)
    }
  }

  // Parse all collaborator names (e.g. "Платина, OG Buda" -> ["Платина", "OG Buda"])
  const names = parseArtistNames(def.artist, def.title)
  for (const name of names) {
    const art = findOrCreateArtist(name, def.cover)
    if (!art.tracks.some(t => t.id === def.id || t.title.toLowerCase() === def.title.toLowerCase())) {
      art.tracks.unshift(def)
    }
  }

  if (Array.isArray(custom.artistIds)) {
    for (const aId of custom.artistIds) {
      const art = artists.find(a => a.id === aId)
      if (art && !art.tracks.some(t => t.id === def.id || t.title.toLowerCase() === def.title.toLowerCase())) {
        art.tracks.unshift(def)
      }
    }
  }

  return def
}

export function unregisterCustomSoundcloudAlbum(id: string) {
  const albIdx = allAlbums.findIndex(a => a.id === id)
  const albumTitle = albIdx >= 0 ? allAlbums[albIdx].title.toLowerCase() : ''
  if (albIdx >= 0) {
    allAlbums.splice(albIdx, 1)
  }
  // Remove tracks belonging to this album
  for (let i = allTracks.length - 1; i >= 0; i--) {
    if (allTracks[i].albumId === id || (albumTitle && allTracks[i].albumTitle.toLowerCase() === albumTitle)) {
      allTracks.splice(i, 1)
    }
  }
  // Clean up artist models
  for (const art of artists) {
    art.albums = art.albums.filter(a => a.id !== id && (albumTitle ? a.title.toLowerCase() !== albumTitle : true))
    art.tracks = art.tracks.filter(t => t.albumId !== id && (albumTitle ? t.albumTitle.toLowerCase() !== albumTitle : true))
  }
}

export function unregisterCustomSoundcloudTrack(id: string) {
  const trkIdx = allTracks.findIndex(t => t.id === id)
  if (trkIdx >= 0) {
    allTracks.splice(trkIdx, 1)
  }
  for (const art of artists) {
    art.tracks = art.tracks.filter(t => t.id !== id)
  }
}

export function getMonthArtist(award: MonthArtist): ArtistDefinition {
  let artist = artists.find(
    candidate => candidate.id === award.pageId || candidate.name.toLowerCase() === award.artist.toLowerCase() || candidate.name.toLowerCase() === award.title.toLowerCase(),
  )
  if (!artist) {
    artist = findOrCreateArtist(award.artist || award.title, award.cover)
  }
  return artist
}
