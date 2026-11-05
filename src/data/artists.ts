import { albums, loadSceneAlbums, type AlbumDefinition } from './albums'
import { tracks, loadSceneTracks, type TrackDefinition } from './tracks'
import { monthArtists, loadSceneArtists, type MonthArtist } from './monthArtists'

/**
 * Каталог на клиенте — это только копия данных сервера для синхронной навигации по индексам.
 * Все связи (какие релизы относятся к артисту, составы треклистов, слоты сцены) считает бэкенд:
 * `GET /api/albums`, `/api/tracks`, `/api/scene/*` и `/api/artists/pages`.
 */

export type ArtistDefinition = {
  id: string
  name: string
  avatar: string
  albums: AlbumDefinition[]
  tracks: TrackDefinition[]
  monthAwards: MonthArtist[]
  /** id записи в БД (таблица Artist). */
  dbId?: string
  bio?: string
}

/** Альбом в том виде, в каком его отдаёт `GET /api/albums`. */
export type ApiAlbum = {
  id: string
  title: string
  artist: string
  artistId?: string
  artistIds?: string[]
  year?: number
  cover: string
  soundcloudUrl?: string
  soundcloudPlaylistId?: string
  createdAt?: string
  tracks?: Array<{
    id: string
    title: string
    artist?: string
    duration?: string
    audioUrl?: string
    soundcloudUrl?: string
    soundcloudTrackId?: string
    cover?: string
  }>
}

/** Сингл в том виде, в каком его отдаёт `GET /api/tracks`. */
export type ApiTrack = {
  id: string
  title: string
  artist: string
  artistId?: string
  artistIds?: string[]
  albumTitle?: string
  cover: string
  duration?: string
  audioUrl?: string
  soundcloudUrl?: string
  soundcloudTrackId?: string
  createdAt?: string
}

type ApiArtistPage = {
  id: string
  dbId: string
  name: string
  avatar: string
  bio?: string | null
  albums: AlbumDefinition[]
  tracks: TrackDefinition[]
}

export const artists: ArtistDefinition[] = []

// Плоские каталоги: первые 12 элементов — слоты колёс, дальше остальные релизы.
export const allAlbums: AlbumDefinition[] = [...albums]
export const allTracks: TrackDefinition[] = [...tracks]

const PLACEHOLDER_COVER = '/covers/placeholder.jpg'

let apiAlbums: ApiAlbum[] = []
let apiSingles: ApiTrack[] = []

/** Сырые данные каталога, как их вернул сервер (для списков в админке и ленты на главной). */
export function getCatalogSnapshot(): { albums: ApiAlbum[]; singles: ApiTrack[] } {
  return { albums: apiAlbums, singles: apiSingles }
}

const releaseArtistsByKey = new Map<string, ArtistDefinition[]>()
const releaseArtistsById = new Map<string, ArtistDefinition[]>()

const creditKey = (credit: string, title: string) => `${credit.trim().toLowerCase()}|${title.trim().toLowerCase()}`

function albumFromApi(a: ApiAlbum): AlbumDefinition {
  return {
    id: a.id,
    title: a.title,
    artist: a.artist,
    year: a.year || 2026,
    cover: a.cover,
    sourceUrl: a.soundcloudUrl || '',
    soundcloudUrl: a.soundcloudUrl,
    soundcloudPlaylistId: a.soundcloudPlaylistId,
    tracks: (a.tracks || []).map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      duration: t.duration,
      soundcloudUrl: t.soundcloudUrl,
      soundcloudTrackId: t.soundcloudTrackId,
      cover: t.cover,
    })),
  }
}

function albumTrackFromApi(a: ApiAlbum, t: NonNullable<ApiAlbum['tracks']>[number]): TrackDefinition {
  return {
    id: t.id,
    albumId: a.id,
    title: t.title,
    albumTitle: a.title,
    artist: t.artist || a.artist,
    year: a.year || 2026,
    duration: t.duration || '3:30',
    cover: t.cover || a.cover,
    sourceUrl: t.soundcloudUrl || a.soundcloudUrl || '',
    audioUrl: t.audioUrl,
    soundcloudUrl: t.soundcloudUrl || a.soundcloudUrl,
    soundcloudTrackId: t.soundcloudTrackId,
  }
}

function singleFromApi(t: ApiTrack): TrackDefinition {
  return {
    id: t.id,
    albumId: `sc-${t.id}`,
    title: t.title,
    albumTitle: t.albumTitle || 'Сингл',
    artist: t.artist,
    year: 2026,
    duration: t.duration || '3:30',
    cover: t.cover,
    sourceUrl: t.soundcloudUrl || '',
    audioUrl: t.audioUrl,
    soundcloudUrl: t.soundcloudUrl,
    soundcloudTrackId: t.soundcloudTrackId,
  }
}

const isPlaceholderRelease = (title: string) => /^слот\s*\d+$/i.test(title.trim())

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

let inflight: Promise<void> | null = null

/** Загружает весь каталог с сервера и пересобирает `artists`, `allAlbums`, `allTracks` на месте. */
export function loadCatalog(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (inflight) return inflight
  inflight = (async () => {
    const [albumList, singleList, pages] = await Promise.all([
      fetchJson<ApiAlbum[]>('/api/albums'),
      fetchJson<ApiTrack[]>('/api/tracks'),
      fetchJson<ApiArtistPage[]>('/api/artists/pages'),
      loadSceneAlbums(),
      loadSceneTracks(),
      loadSceneArtists(),
    ])
    if (Array.isArray(albumList)) apiAlbums = albumList
    if (Array.isArray(singleList)) apiSingles = singleList

    rebuildReleases()
    if (Array.isArray(pages)) rebuildArtists(pages)
    window.dispatchEvent(new CustomEvent('aa:artists_synced'))
  })().finally(() => {
    inflight = null
  })
  return inflight
}

/** Первая загрузка каталога: на неё ждёт маршрутизация, чтобы прямые ссылки находили релизы и артистов. */
export const catalogReady: Promise<void> = loadCatalog()

function rebuildReleases() {
  const nextAlbums: AlbumDefinition[] = [...albums]
  const nextTracks: TrackDefinition[] = [...tracks]
  const hasAlbum = (a: ApiAlbum) =>
    nextAlbums.some(x => x.id === a.id || (a.soundcloudUrl && x.soundcloudUrl === a.soundcloudUrl))
  const hasTrack = (id: string, url?: string) =>
    nextTracks.some(x => x.id === id || (url && x.soundcloudUrl === url))

  for (const a of apiAlbums) {
    if (isPlaceholderRelease(a.title)) continue
    if (!hasAlbum(a)) nextAlbums.push(albumFromApi(a))
    for (const t of a.tracks || []) {
      if (!hasTrack(t.id, undefined)) nextTracks.push(albumTrackFromApi(a, t))
    }
  }
  for (const t of apiSingles) {
    if (isPlaceholderRelease(t.title)) continue
    if (!hasTrack(t.id, t.soundcloudUrl)) nextTracks.push(singleFromApi(t))
  }

  allAlbums.splice(0, allAlbums.length, ...nextAlbums)
  allTracks.splice(0, allTracks.length, ...nextTracks)
}

function rebuildArtists(pages: ApiArtistPage[]) {
  const albumById = new Map(allAlbums.map(a => [a.id, a]))
  const trackById = new Map(allTracks.map(t => [t.id, t]))
  const previous = new Map(artists.map(a => [a.id, a]))
  const next: ArtistDefinition[] = []

  releaseArtistsByKey.clear()
  releaseArtistsById.clear()
  const remember = (release: { id: string; artist: string; title: string }, artist: ArtistDefinition) => {
    const byKey = releaseArtistsByKey.get(creditKey(release.artist, release.title)) ?? []
    if (!byKey.includes(artist)) byKey.push(artist)
    releaseArtistsByKey.set(creditKey(release.artist, release.title), byKey)
    const byId = releaseArtistsById.get(release.id) ?? []
    if (!byId.includes(artist)) byId.push(artist)
    releaseArtistsById.set(release.id, byId)
  }

  for (const page of pages) {
    // Сохраняем идентичность объекта: на артистов ссылаются компоненты и `artists.indexOf(...)`.
    const artist: ArtistDefinition = previous.get(page.id) ?? {
      id: page.id,
      name: page.name,
      avatar: page.avatar,
      albums: [],
      tracks: [],
      monthAwards: [],
    }
    artist.name = page.name
    artist.dbId = page.dbId
    artist.bio = page.bio || undefined
    artist.avatar = page.avatar || PLACEHOLDER_COVER
    artist.albums = page.albums.map(a => albumById.get(a.id)).filter((a): a is AlbumDefinition => Boolean(a))
    artist.tracks = page.tracks.map(t => trackById.get(t.id)).filter((t): t is TrackDefinition => Boolean(t))
    artist.monthAwards = []
    for (const a of artist.albums) remember(a, artist)
    for (const t of artist.tracks) remember(t, artist)
    next.push(artist)
  }

  // Исполнители колеса «Артист месяца»
  for (const award of monthArtists) {
    if (/^исполнитель\s*\d+$/i.test(award.title.trim())) continue
    const artist = next.find(a => a.id === award.pageId) ?? next.find(a => a.name.toLowerCase() === award.artist.toLowerCase())
    if (artist) artist.monthAwards.push(award)
  }

  artists.splice(0, artists.length, ...next)
}

/** Исполнители релиза — данные сервера, а не разбор строки на клиенте. */
export function getReleaseArtists(artistCredit: string, releaseTitle?: string): ArtistDefinition[] {
  return releaseArtistsByKey.get(creditKey(artistCredit, releaseTitle ?? '')) ?? []
}

function stubArtist(name: string, cover: string): ArtistDefinition {
  return { id: name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-+|-+$/g, '') || 'artist', name, avatar: cover, albums: [], tracks: [], monthAwards: [] }
}

export function getAlbumArtist(album: AlbumDefinition): ArtistDefinition {
  return (
    releaseArtistsById.get(album.id)?.[0] ??
    getReleaseArtists(album.artist, album.title)[0] ??
    artists.find(a => a.name.toLowerCase() === album.artist.toLowerCase()) ??
    stubArtist(album.artist, album.cover)
  )
}

export function getTrackArtist(track: TrackDefinition): ArtistDefinition {
  return (
    releaseArtistsById.get(track.id)?.[0] ??
    getReleaseArtists(track.artist, track.title)[0] ??
    artists.find(a => a.name.toLowerCase() === track.artist.toLowerCase()) ??
    stubArtist(track.artist, track.cover)
  )
}

export function getMonthArtist(award: MonthArtist): ArtistDefinition {
  return (
    artists.find(a => a.id === award.pageId) ??
    artists.find(a => a.name.toLowerCase() === award.artist.toLowerCase() || a.name.toLowerCase() === award.title.toLowerCase()) ??
    stubArtist(award.artist || award.title, award.cover)
  )
}
