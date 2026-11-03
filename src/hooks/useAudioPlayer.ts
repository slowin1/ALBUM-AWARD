import { useEffect, useState, useSyncExternalStore } from 'react'
import type { AlbumDefinition } from '../data/albums'
import { allAlbums, allTracks, registerCustomSoundcloudTrack } from '../data/artists'
import type { TrackDefinition } from '../data/tracks'
import {
  loadAndPlaySoundCloudTrack,
  pauseSoundCloudTrack,
  resumeSoundCloudTrack,
  seekSoundCloudTrack,
  setSoundCloudTrackVolume,
  stopSoundCloudTrack,
} from '../audio/soundcloudBridge'

export type RepeatMode = 'off' | 'all' | 'one'

export type PlayableTrack = {
  uid: string
  groupKey: string
  catalogTrackKey?: string
  appleSongId?: string
  title: string
  artist: string
  albumTitle: string
  cover: string
  durationLabel?: string
  sourceUrl: string
  audioUrl?: string
  soundcloudUrl?: string
  soundcloudTrackId?: string
  isPreview?: boolean
  albumIndex?: number
  trackIndex?: number
  trackNumber?: number
}

export type ReleasePlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused'

type PlayerSnapshot = {
  queue: PlayableTrack[]
  currentIndex: number
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  volume: number
  muted: boolean
  repeatMode: RepeatMode
  shuffle: boolean
}

type ProgressSnapshot = {
  currentTime: number
  duration: number
}

type ItunesSongResult = {
  wrapperType?: string
  kind?: string
  trackId?: number
  collectionId?: number
  trackName?: string
  collectionName?: string
  artistName?: string
  previewUrl?: string
  artworkUrl100?: string
  trackViewUrl?: string
  trackNumber?: number
  discNumber?: number
  trackTimeMillis?: number
}

const VOLUME_STORAGE_KEY = 'aa_player_volume_v1'
const SESSION_AUDIO_CACHE_KEY = 'aa_itunes_audio_cache_v1'

function readInitialVolume(): { volume: number; muted: boolean } {
  try {
    const raw = localStorage.getItem(VOLUME_STORAGE_KEY)
    if (!raw) return { volume: 0.8, muted: false }
    const parsed = JSON.parse(raw) as { volume?: number; muted?: boolean }
    const vol = typeof parsed.volume === 'number' && Number.isFinite(parsed.volume)
      ? Math.min(1, Math.max(0, parsed.volume))
      : 0.8
    return { volume: vol, muted: Boolean(parsed.muted) }
  } catch {
    return { volume: 0.8, muted: false }
  }
}

function saveVolumePrefs(volume: number, muted: boolean) {
  try {
    localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify({ volume, muted }))
  } catch {
    // Ignore storage quota errors
  }
}

const resolvedTrackCache = new Map<string, { url: string; isPreview: boolean; appleSongId?: string }>()
const localAudioProbeCache = new Map<string, Promise<string | null>>()
const itunesLookupCache = new Map<string, Promise<ItunesSongResult[]>>()
const albumTracksCache = new Map<string, Promise<PlayableTrack[]>>()
const albumTracksResolvedSync = new Map<string, PlayableTrack[]>()

try {
  const cachedRaw = sessionStorage.getItem(SESSION_AUDIO_CACHE_KEY)
  if (cachedRaw) {
    const entries = JSON.parse(cachedRaw) as Record<
      string,
      { url: string; isPreview: boolean; appleSongId?: string }
    >
    for (const [k, v] of Object.entries(entries)) {
      if (v && typeof v.url === 'string' && v.url) {
        resolvedTrackCache.set(k, v)
      }
    }
  }
} catch {
  // Ignore sessionStorage errors
}

function persistResolvedTrackCache() {
  try {
    const obj: Record<string, { url: string; isPreview: boolean; appleSongId?: string }> = {}
    for (const [k, v] of resolvedTrackCache.entries()) {
      obj[k] = v
    }
    sessionStorage.setItem(SESSION_AUDIO_CACHE_KEY, JSON.stringify(obj))
  } catch {
    // Ignore sessionStorage quota errors
  }
}

function normalizeMatchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\((?:feat\.?|ft\.?|with|при уч\.?|prod\.?)[^)]*\)/gi, '')
    .replace(/\[(?:feat\.?|ft\.?|with|при уч\.?|prod\.?)[^\]]*\]/gi, '')
    .replace(/[^a-z0-9а-я]+/gi, ' ')
    .trim()
}

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const whole = Math.floor(seconds)
  const mins = Math.floor(whole / 60)
  const secs = whole % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function formatMillisDuration(ms?: number): string | undefined {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return undefined
  return formatAudioTime(Math.round(ms / 1000))
}

function parseAppleMusicUrl(sourceUrl: string): {
  country: string
  collectionId: string | null
  trackId: string | null
} {
  try {
    const parsed = new URL(sourceUrl)
    const parts = parsed.pathname.split('/').filter(Boolean)
    const country = parts[0] && /^[a-z]{2}$/i.test(parts[0]) ? parts[0].toLowerCase() : 'ru'
    let collectionId: string | null = null
    for (let i = parts.length - 1; i >= 0; i--) {
      if (/^\d+$/.test(parts[i])) {
        collectionId = parts[i]
        break
      }
    }
    const trackParam = parsed.searchParams.get('i')
    const trackId = trackParam && /^\d+$/.test(trackParam) ? trackParam : null
    return { country, collectionId, trackId }
  } catch {
    return { country: 'ru', collectionId: null, trackId: null }
  }
}

function uniqueCountries(primary: string): string[] {
  const out: string[] = []
  for (const code of [primary.toLowerCase(), 'ru', 'us']) {
    if (code && !out.includes(code)) out.push(code)
  }
  return out
}

function probeLocalAudioFile(id: string): Promise<string | null> {
  const cleanId = id.replace(/^(?:track:|album:)/, '').trim()
  if (!cleanId) return Promise.resolve(null)
  const existing = localAudioProbeCache.get(cleanId)
  if (existing) return existing

  const candidatePath = `/audio/${encodeURIComponent(cleanId)}.mp3`
  const promise = fetch(candidatePath, { method: 'HEAD' })
    .then(res => {
      if (!res.ok) return null
      const contentType = (res.headers.get('content-type') || '').toLowerCase()
      if (contentType.startsWith('audio/') || contentType.includes('octet-stream')) {
        return candidatePath
      }
      return null
    })
    .catch(() => null)

  localAudioProbeCache.set(cleanId, promise)
  return promise
}

function fetchItunesLookup(id: string, country: string): Promise<ItunesSongResult[]> {
  const key = `lookup:${country}:${id}`
  const cached = itunesLookupCache.get(key)
  if (cached) return cached

  const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&country=${encodeURIComponent(country)}&entity=song&limit=60`
  const promise = fetch(url)
    .then(res => (res.ok ? res.json() : null))
    .then((data: { results?: ItunesSongResult[] } | null) => {
      if (!data || !Array.isArray(data.results)) return []
      return data.results.filter(item => Boolean(item.previewUrl))
    })
    .catch(() => [])

  itunesLookupCache.set(key, promise)
  return promise
}


function pickBestMatchingSong(
  songs: ItunesSongResult[],
  targetTitle: string,
  targetArtist?: string,
): ItunesSongResult | null {
  if (songs.length === 0) return null
  const normTitle = normalizeMatchText(targetTitle)
  const primaryArtist = targetArtist ? normalizeMatchText(targetArtist.split(',')[0] || '') : ''

  let best: ItunesSongResult | null = null
  let bestScore = -1

  for (const song of songs) {
    const songTitle = normalizeMatchText(song.trackName || '')
    const songArtist = normalizeMatchText(song.artistName || '')
    let score = 0

    if (songTitle && normTitle) {
      if (songTitle === normTitle) score += 100
      else if (songTitle.startsWith(normTitle) || normTitle.startsWith(songTitle)) score += 70
      else if (songTitle.includes(normTitle) || normTitle.includes(songTitle)) score += 45
    }

    if (primaryArtist && songArtist) {
      if (songArtist === primaryArtist) score += 40
      else if (songArtist.includes(primaryArtist) || primaryArtist.includes(songArtist)) score += 25
    }

    if (score > bestScore) {
      bestScore = score
      best = song
    }
  }

  return best ?? songs[0]
}

async function resolvePlayableTrackAudio(
  item: PlayableTrack,
): Promise<{ url: string; isPreview: boolean; appleSongId?: string } | null> {
  // 1. Direct SoundCloud release
  if (item.soundcloudUrl) {
    const entry = {
      url: item.soundcloudUrl,
      isPreview: false,
    }
    resolvedTrackCache.set(item.uid, entry)
    return entry
  }

  // 2. Direct audio URL (local mp3 or direct streaming url)
  if (item.audioUrl && item.isPreview === false) {
    return {
      url: item.audioUrl,
      isPreview: false,
      appleSongId: item.appleSongId,
    }
  }

  const cached = resolvedTrackCache.get(item.uid)
  if (cached && cached.isPreview === false) return cached

  // 3. Local audio file /audio/<id>.mp3
  const localId = item.catalogTrackKey ?? item.uid
  const localUrl = await probeLocalAudioFile(localId)
  if (localUrl) {
    const entry = { url: localUrl, isPreview: false }
    resolvedTrackCache.set(item.uid, entry)
    return entry
  }

  if (cached) return cached

  // 4. Fallback to Apple Music direct ID preview if available
  const parsed = parseAppleMusicUrl(item.sourceUrl)
  const countries = uniqueCountries(parsed.country)

  if (parsed.trackId) {
    for (const country of countries) {
      const songs = await fetchItunesLookup(parsed.trackId, country)
      if (songs.length > 0) {
        const exact = songs.find(s => String(s.trackId) === parsed.trackId) ?? songs[0]
        if (exact.previewUrl) {
          const entry = {
            url: exact.previewUrl,
            isPreview: true,
            appleSongId: exact.trackId ? String(exact.trackId) : parsed.trackId,
          }
          resolvedTrackCache.set(item.uid, entry)
          persistResolvedTrackCache()
          return entry
        }
      }
    }
  }

  if (parsed.collectionId) {
    for (const country of countries) {
      const songs = await fetchItunesLookup(parsed.collectionId, country)
      if (songs.length > 0) {
        const match = pickBestMatchingSong(songs, item.title, item.artist)
        if (match?.previewUrl) {
          const entry = {
            url: match.previewUrl,
            isPreview: true,
            appleSongId: match.trackId ? String(match.trackId) : undefined,
          }
          resolvedTrackCache.set(item.uid, entry)
          persistResolvedTrackCache()
          return entry
        }
      }
    }
  }

  return null
}

export function trackDefinitionToPlayable(track: TrackDefinition): PlayableTrack {
  const trackIdx = allTracks.findIndex(t => t.id === track.id)
  const albumIdx = allAlbums.findIndex(
    a => a.id === track.albumId || a.title.toLowerCase() === track.albumTitle.toLowerCase(),
  )

  return {
    uid: `track:${track.id}`,
    groupKey: `track:${track.id}`,
    catalogTrackKey: `track:${track.id}`,
    title: track.title,
    artist: track.artist,
    albumTitle: track.albumTitle,
    cover: track.cover,
    durationLabel: track.duration,
    sourceUrl: track.sourceUrl,
    audioUrl: track.audioUrl,
    soundcloudUrl: track.soundcloudUrl,
    soundcloudTrackId: track.soundcloudTrackId,
    isPreview: track.soundcloudUrl ? false : track.audioUrl ? false : undefined,
    trackIndex: trackIdx >= 0 ? trackIdx : undefined,
    albumIndex: albumIdx >= 0 ? albumIdx : undefined,
  }
}

export function resolveAlbumTracks(album: AlbumDefinition): Promise<PlayableTrack[]> {
  const existing = albumTracksCache.get(album.id)
  if (existing) return existing

  const promise = (async (): Promise<PlayableTrack[]> => {
    const albumIdx = allAlbums.findIndex(a => a.id === album.id)
    const resolvedAlbumIdx = albumIdx >= 0 ? albumIdx : undefined

    if (album.audioUrl) {
      const single: PlayableTrack[] = [
        {
          uid: `album-song:${album.id}:1`,
          groupKey: `album:${album.id}`,
          title: album.title,
          artist: album.artist,
          albumTitle: album.title,
          cover: album.cover,
          sourceUrl: album.sourceUrl,
          audioUrl: album.audioUrl,
          isPreview: false,
          albumIndex: resolvedAlbumIdx,
          trackNumber: 1,
        },
      ]
      albumTracksResolvedSync.set(album.id, single)
      return single
    }

    const localAlbumMp3 = await probeLocalAudioFile(album.id)
    if (localAlbumMp3) {
      const single: PlayableTrack[] = [
        {
          uid: `album-song:${album.id}:local`,
          groupKey: `album:${album.id}`,
          title: album.title,
          artist: album.artist,
          albumTitle: album.title,
          cover: album.cover,
          sourceUrl: album.sourceUrl,
          audioUrl: localAlbumMp3,
          isPreview: false,
          albumIndex: resolvedAlbumIdx,
          trackNumber: 1,
        },
      ]
      albumTracksResolvedSync.set(album.id, single)
      return single
    }

    // 1. If album object already carries tracks array, use them immediately
    if (album.tracks && Array.isArray(album.tracks) && album.tracks.length > 0) {
      const mapped: PlayableTrack[] = album.tracks.map((t, idx) => ({
        uid: `album-song:${album.id}:${t.id || idx + 1}`,
        groupKey: `album:${album.id}`,
        title: t.title,
        artist: t.artist || album.artist,
        albumTitle: album.title,
        cover: t.cover || album.cover,
        durationLabel: t.duration,
        sourceUrl: t.soundcloudUrl || album.soundcloudUrl || '',
        soundcloudUrl: t.soundcloudUrl || album.soundcloudUrl,
        soundcloudTrackId: t.soundcloudTrackId,
        isPreview: false,
        albumIndex: resolvedAlbumIdx,
        trackNumber: idx + 1,
      }))
      albumTracksResolvedSync.set(album.id, mapped)
      return mapped
    }

    // 2. If matching tracks exist in catalogue
    const catalogMatches = allTracks.filter(
      t => t.albumId === album.id || t.albumTitle.toLowerCase() === album.title.toLowerCase(),
    )
    if (catalogMatches.length > 0) {
      const mapped = catalogMatches.map((trk, idx) => ({
        ...trackDefinitionToPlayable(trk),
        uid: `album-song:${album.id}:${trk.id}`,
        groupKey: `album:${album.id}`,
        albumIndex: resolvedAlbumIdx,
        trackNumber: idx + 1,
      }))
      albumTracksResolvedSync.set(album.id, mapped)
      return mapped
    }

    // 3. If album has SoundCloud URL, fetch full tracklist from SoundCloud via parse API
    if (album.soundcloudUrl) {
      try {
        const res = await fetch(`/api/tracks/parse?url=${encodeURIComponent(album.soundcloudUrl)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.type === 'album' && Array.isArray(data.tracks) && data.tracks.length > 0) {
            album.tracks = data.tracks
            data.tracks.forEach((t: any, idx: number) => {
              registerCustomSoundcloudTrack({
                id: t.id || `${album.id}-trk-${idx + 1}`,
                albumId: album.id,
                title: t.title,
                albumTitle: album.title,
                artist: t.artist || album.artist,
                cover: t.cover || album.cover,
                duration: t.duration || '3:30',
                soundcloudUrl: t.soundcloudUrl || album.soundcloudUrl!,
                soundcloudTrackId: t.soundcloudTrackId,
              })
            })
            const mapped: PlayableTrack[] = data.tracks.map((t: any, idx: number) => ({
              uid: `album-song:${album.id}:${t.id || idx + 1}`,
              groupKey: `album:${album.id}`,
              title: t.title,
              artist: t.artist || album.artist,
              albumTitle: album.title,
              cover: t.cover || album.cover,
              durationLabel: t.duration,
              sourceUrl: t.soundcloudUrl || album.soundcloudUrl!,
              soundcloudUrl: t.soundcloudUrl || album.soundcloudUrl,
              soundcloudTrackId: t.soundcloudTrackId,
              isPreview: false,
              albumIndex: resolvedAlbumIdx,
              trackNumber: idx + 1,
            }))
            albumTracksResolvedSync.set(album.id, mapped)
            return mapped
          } else if (data.type === 'track') {
            const single: PlayableTrack[] = [
              {
                uid: `album-song:${album.id}:1`,
                groupKey: `album:${album.id}`,
                title: data.title || album.title,
                artist: data.artist || album.artist,
                albumTitle: album.title,
                cover: data.cover || album.cover,
                durationLabel: data.duration,
                sourceUrl: album.soundcloudUrl,
                soundcloudUrl: album.soundcloudUrl,
                soundcloudTrackId: data.soundcloudTrackId,
                isPreview: false,
                albumIndex: resolvedAlbumIdx,
                trackNumber: 1,
              },
            ]
            albumTracksResolvedSync.set(album.id, single)
            return single
          }
        }
      } catch (err) {
        console.error('Failed to parse SoundCloud album tracklist', err)
      }
    }

    const parsed = parseAppleMusicUrl(album.sourceUrl)
    const countries = uniqueCountries(parsed.country)
    let songs: ItunesSongResult[] = []

    if (parsed.collectionId) {
      for (const country of countries) {
        const fetched = await fetchItunesLookup(parsed.collectionId, country)
        if (fetched.length > 0) {
          songs = fetched
          break
        }
      }
    }

    if (songs.length > 0) {
      const sorted = [...songs].sort((a, b) => {
        const discDiff = (a.discNumber ?? 1) - (b.discNumber ?? 1)
        if (discDiff !== 0) return discDiff
        return (a.trackNumber ?? 0) - (b.trackNumber ?? 0)
      })

      const mapped = sorted.map((song, idx): PlayableTrack => {
        const songTitle = song.trackName || `${album.title} — Трек ${idx + 1}`
        const songArtist = song.artistName || album.artist
        const normSongTitle = normalizeMatchText(songTitle)

        const matchingTrackIdx = allTracks.findIndex(t => {
          if (song.trackId && t.sourceUrl.includes(`i=${song.trackId}`)) return true
          return (
            (t.albumId === album.id || t.albumTitle.toLowerCase() === album.title.toLowerCase()) &&
            normalizeMatchText(t.title) === normSongTitle
          )
        })
        const matchedCatalogTrack = matchingTrackIdx >= 0 ? allTracks[matchingTrackIdx] : undefined

        return {
          uid: `album-song:${album.id}:${song.trackId ?? idx + 1}`,
          groupKey: `album:${album.id}`,
          catalogTrackKey: matchedCatalogTrack ? `track:${matchedCatalogTrack.id}` : undefined,
          appleSongId: song.trackId ? String(song.trackId) : undefined,
          title: songTitle,
          artist: songArtist,
          albumTitle: album.title,
          cover: album.cover,
          durationLabel: matchedCatalogTrack?.duration ?? formatMillisDuration(song.trackTimeMillis),
          sourceUrl: song.trackViewUrl || album.sourceUrl,
          audioUrl: matchedCatalogTrack?.audioUrl,
          isPreview: matchedCatalogTrack?.audioUrl ? false : true,
          albumIndex: resolvedAlbumIdx,
          trackIndex: matchingTrackIdx >= 0 ? matchingTrackIdx : undefined,
          trackNumber: song.trackNumber ?? idx + 1,
        }
      })

      albumTracksResolvedSync.set(album.id, mapped)
      return mapped
    }

    return []
  })()

  albumTracksCache.set(album.id, promise)
  return promise
}

// =========================================
// SINGLETON HTML5 AUDIO ENGINE & STORES
// =========================================

const initialVol = readInitialVolume()

let playerState: PlayerSnapshot = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  isLoading: false,
  error: null,
  volume: initialVol.volume,
  muted: initialVol.muted,
  repeatMode: 'off',
  shuffle: false,
}

let progressState: ProgressSnapshot = {
  currentTime: 0,
  duration: 0,
}

const playerListeners = new Set<() => void>()
const progressListeners = new Set<() => void>()

function emitPlayer() {
  for (const listener of playerListeners) listener()
}

function emitProgress() {
  for (const listener of progressListeners) listener()
}

function setPlayerState(patch: Partial<PlayerSnapshot>) {
  playerState = { ...playerState, ...patch }
  emitPlayer()
}

function setProgressState(next: ProgressSnapshot) {
  if (
    Math.abs(progressState.currentTime - next.currentTime) < 0.04 &&
    Math.abs(progressState.duration - next.duration) < 0.04
  ) {
    return
  }
  progressState = next
  emitProgress()
}

let sharedAudio: HTMLAudioElement | null = null
let activeLoadToken = 0

function syncMediaSession(track: PlayableTrack | null, playing: boolean) {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
  try {
    const ms = navigator.mediaSession
    if (!track) {
      ms.metadata = null
      ms.playbackState = 'none'
      return
    }
    if (typeof MediaMetadata !== 'undefined') {
      ms.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.albumTitle,
        artwork: track.cover ? [{ src: track.cover }] : [],
      })
    }
    ms.playbackState = playing ? 'playing' : 'paused'
  } catch {
    // Ignore unsupported MediaSession environments
  }
}

function getAudioElement(): HTMLAudioElement {
  if (sharedAudio) return sharedAudio

  const audio = new Audio()
  audio.preload = 'auto'
  audio.volume = playerState.muted ? 0 : playerState.volume
  audio.muted = playerState.muted

  audio.addEventListener('timeupdate', () => {
    setProgressState({
      currentTime: audio.currentTime || 0,
      duration: Number.isFinite(audio.duration) ? audio.duration : progressState.duration,
    })
  })

  audio.addEventListener('loadedmetadata', () => {
    setProgressState({
      currentTime: audio.currentTime || 0,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    })
  })

  audio.addEventListener('durationchange', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setProgressState({
        currentTime: audio.currentTime || 0,
        duration: audio.duration,
      })
    }
  })

  audio.addEventListener('playing', () => {
    setPlayerState({ isPlaying: true, isLoading: false, error: null })
    const current = playerState.queue[playerState.currentIndex] ?? null
    syncMediaSession(current, true)
  })

  audio.addEventListener('pause', () => {
    if (!audio.ended) {
      setPlayerState({ isPlaying: false })
      const current = playerState.queue[playerState.currentIndex] ?? null
      syncMediaSession(current, false)
    }
  })

  audio.addEventListener('waiting', () => {
    if (!audio.paused) {
      setPlayerState({ isLoading: true })
    }
  })

  audio.addEventListener('canplay', () => {
    if (playerState.isLoading) {
      setPlayerState({ isLoading: false })
    }
  })

  audio.addEventListener('ended', () => {
    handleTrackEnded()
  })

  audio.addEventListener('error', () => {
    if (!audio.src) return
    setPlayerState({
      isPlaying: false,
      isLoading: false,
      error: 'Не удалось воспроизвести аудиопоток',
    })
  })

  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        void resumePlayback()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        pausePlayback()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPreviousTrack()
      })
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNextTrack()
      })
      navigator.mediaSession.setActionHandler('seekto', details => {
        if (typeof details.seekTime === 'number') {
          seekAudioTo(details.seekTime)
        }
      })
    } catch {
      // Ignore unsupported handlers
    }
  }

  sharedAudio = audio
  return audio
}

let isCurrentTrackSoundcloud = false

async function startQueueIndex(index: number) {
  const target = playerState.queue[index]
  if (!target) return

  const token = ++activeLoadToken
  const audio = getAudioElement()
  audio.pause()

  progressState = { currentTime: 0, duration: 0 }
  emitProgress()

  setPlayerState({
    currentIndex: index,
    isLoading: true,
    isPlaying: false,
    error: null,
  })
  syncMediaSession(target, false)

  // 1. Resolve audio source (queries local mp3 or NestJS SoundCloud full track search)
  const resolved = await resolvePlayableTrackAudio(target)
  if (token !== activeLoadToken) return

  // 2. If track has SoundCloud URL (directly or resolved via full search)
  const scUrl = target.soundcloudUrl || (resolved?.url && resolved.url.includes('soundcloud.com') ? resolved.url : null)
  if (scUrl) {
    if (audio.src) {
      audio.pause()
      audio.removeAttribute('src')
    }
    isCurrentTrackSoundcloud = true
    target.soundcloudUrl = scUrl
    try {
      await loadAndPlaySoundCloudTrack(
        scUrl,
        playerState.muted ? 0 : playerState.volume,
        {
          onPlay: () => {
            if (token !== activeLoadToken) return
            setPlayerState({ isPlaying: true, isLoading: false, error: null })
            syncMediaSession(target, true)
          },
          onPause: () => {
            if (token !== activeLoadToken) return
            setPlayerState({ isPlaying: false })
            syncMediaSession(target, false)
          },
          onProgress: (cur, dur) => {
            if (token !== activeLoadToken) return
            setProgressState({ currentTime: cur, duration: dur })
          },
          onFinish: () => {
            if (token !== activeLoadToken) return
            handleTrackEnded()
          },
          onError: () => {
            if (token !== activeLoadToken) return
            setPlayerState({
              isPlaying: false,
              isLoading: false,
              error: 'Не удалось запустить SoundCloud трек',
            })
          },
        },
      )
    } catch {
      if (token !== activeLoadToken) return
      setPlayerState({
        isPlaying: false,
        isLoading: false,
        error: 'Ошибка загрузки SoundCloud плеера',
      })
    }
    return
  }

  if (isCurrentTrackSoundcloud) {
    stopSoundCloudTrack()
    isCurrentTrackSoundcloud = false
  }

  if (!resolved?.url) {
    setPlayerState({
      isLoading: false,
      isPlaying: false,
      error: 'Превью недоступно — открой релиз в Apple Music',
    })
    return
  }

  // Store resolved URL back onto queue item so subsequent replays are instant
  if (
    target.audioUrl !== resolved.url ||
    target.isPreview !== resolved.isPreview ||
    target.appleSongId !== resolved.appleSongId
  ) {
    const updatedQueue = [...playerState.queue]
    if (updatedQueue[index]?.uid === target.uid) {
      updatedQueue[index] = {
        ...updatedQueue[index],
        audioUrl: resolved.url,
        isPreview: resolved.isPreview,
        appleSongId: resolved.appleSongId ?? target.appleSongId,
      }
      playerState = { ...playerState, queue: updatedQueue }
    }
  }

  audio.src = resolved.url
  audio.currentTime = 0
  audio.volume = playerState.muted ? 0 : playerState.volume
  audio.muted = playerState.muted

  try {
    await audio.play()
    if (token !== activeLoadToken) return
    setPlayerState({ isPlaying: true, isLoading: false, error: null })
    syncMediaSession(playerState.queue[index] ?? target, true)
  } catch (err) {
    if (token !== activeLoadToken) return
    const domErr = err as { name?: string } | null
    if (domErr?.name === 'AbortError') return
    setPlayerState({
      isPlaying: false,
      isLoading: false,
      error: 'Нажми Play для запуска аудио',
    })
  }
}

function pickRandomIndex(length: number, excludeIndex: number): number {
  if (length <= 1) return 0
  let candidate = Math.floor(Math.random() * length)
  if (candidate === excludeIndex) {
    candidate = (candidate + 1) % length
  }
  return candidate
}

function handleTrackEnded() {
  const audio = getAudioElement()
  const { queue, currentIndex, repeatMode, shuffle } = playerState
  if (queue.length === 0 || currentIndex < 0) return

  if (repeatMode === 'one') {
    audio.currentTime = 0
    void audio.play().catch(() => {})
    return
  }

  if (shuffle && queue.length > 1) {
    void startQueueIndex(pickRandomIndex(queue.length, currentIndex))
    return
  }

  const nextIdx = currentIndex + 1
  if (nextIdx < queue.length) {
    void startQueueIndex(nextIdx)
    return
  }

  if (repeatMode === 'all' && queue.length > 0) {
    void startQueueIndex(0)
    return
  }

  setPlayerState({ isPlaying: false, isLoading: false })
  setProgressState({ currentTime: 0, duration: progressState.duration })
  audio.currentTime = 0
  syncMediaSession(queue[currentIndex] ?? null, false)
}

export async function resumePlayback() {
  const current = playerState.queue[playerState.currentIndex]
  if (!current) return

  if (isCurrentTrackSoundcloud) {
    resumeSoundCloudTrack()
    setPlayerState({ isPlaying: true })
    syncMediaSession(current, true)
    return
  }

  const audio = getAudioElement()
  if (!audio.src) {
    await startQueueIndex(playerState.currentIndex)
    return
  }
  try {
    await audio.play()
  } catch {
    await startQueueIndex(playerState.currentIndex)
  }
}

export function pausePlayback() {
  if (isCurrentTrackSoundcloud) {
    pauseSoundCloudTrack()
    setPlayerState({ isPlaying: false, isLoading: false })
    const current = playerState.queue[playerState.currentIndex]
    syncMediaSession(current, false)
    return
  }
  const audio = getAudioElement()
  audio.pause()
  setPlayerState({ isPlaying: false, isLoading: false })
}

export function togglePlayback() {
  if (playerState.queue.length === 0 || playerState.currentIndex < 0) return
  if (playerState.isPlaying || playerState.isLoading) {
    activeLoadToken++
    pausePlayback()
  } else {
    void resumePlayback()
  }
}

export function playNextTrack() {
  const { queue, currentIndex, repeatMode, shuffle } = playerState
  if (queue.length === 0) return
  if (shuffle && queue.length > 1) {
    void startQueueIndex(pickRandomIndex(queue.length, currentIndex))
    return
  }
  const nextIdx = currentIndex + 1
  if (nextIdx < queue.length) {
    void startQueueIndex(nextIdx)
  } else if (repeatMode === 'all' || queue.length > 1) {
    void startQueueIndex(0)
  } else {
    void startQueueIndex(0)
  }
}

export function playPreviousTrack() {
  const { queue, currentIndex } = playerState
  if (queue.length === 0) return
  const currentPos = getAudioElement().currentTime || 0

  if (currentPos > 3.2) {
    seekAudioTo(0)
    if (!playerState.isPlaying) void resumePlayback()
    return
  }
  const prevIdx = currentIndex > 0 ? currentIndex - 1 : queue.length - 1
  void startQueueIndex(prevIdx)
}

export function selectQueueTrack(index: number) {
  if (index < 0 || index >= playerState.queue.length) return
  if (index === playerState.currentIndex) {
    togglePlayback()
    return
  }
  void startQueueIndex(index)
}

export function seekAudioTo(timeSeconds: number) {
  if (isCurrentTrackSoundcloud) {
    seekSoundCloudTrack(timeSeconds)
    setProgressState({ currentTime: timeSeconds, duration: progressState.duration })
    return
  }
  const audio = getAudioElement()
  const max = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : progressState.duration
  const clamped = Math.max(0, max > 0 ? Math.min(max, timeSeconds) : timeSeconds)
  if (audio.src) {
    audio.currentTime = clamped
  }
  setProgressState({ currentTime: clamped, duration: max })
}

export function setAudioVolume(nextVolume: number) {
  const clamped = Math.min(1, Math.max(0, nextVolume))
  const unmuted = clamped > 0 ? false : playerState.muted
  if (sharedAudio) {
    sharedAudio.volume = unmuted ? 0 : clamped
    sharedAudio.muted = unmuted
  }
  setSoundCloudTrackVolume(unmuted ? 0 : clamped)
  saveVolumePrefs(clamped, unmuted)
  setPlayerState({ volume: clamped, muted: unmuted })
}

export function toggleAudioMute() {
  const nextMuted = !playerState.muted
  const nextVol = !nextMuted && playerState.volume === 0 ? 0.65 : playerState.volume
  if (sharedAudio) {
    sharedAudio.muted = nextMuted
    sharedAudio.volume = nextMuted ? 0 : nextVol
  }
  setSoundCloudTrackVolume(nextMuted ? 0 : nextVol)
  saveVolumePrefs(nextVol, nextMuted)
  setPlayerState({ muted: nextMuted, volume: nextVol })
}

export function cycleRepeatMode() {
  const order: RepeatMode[] = ['off', 'all', 'one']
  const next = order[(order.indexOf(playerState.repeatMode) + 1) % order.length]
  setPlayerState({ repeatMode: next })
}

export function toggleShuffleMode() {
  setPlayerState({ shuffle: !playerState.shuffle })
}

export function closeAudioPlayer() {
  activeLoadToken++
  if (isCurrentTrackSoundcloud) {
    stopSoundCloudTrack()
    isCurrentTrackSoundcloud = false
  }
  if (sharedAudio) {
    sharedAudio.pause()
    sharedAudio.removeAttribute('src')
    sharedAudio.load()
  }
  progressState = { currentTime: 0, duration: 0 }
  emitProgress()
  setPlayerState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    isLoading: false,
    error: null,
  })
  syncMediaSession(null, false)
}

function isTargetCurrentlyActive(targetKey: string): boolean {
  const current = playerState.queue[playerState.currentIndex]
  if (!current) return false
  return (
    current.uid === targetKey ||
    current.groupKey === targetKey ||
    current.catalogTrackKey === targetKey
  )
}

export function playOrToggleTrack(track: TrackDefinition, contextTracks?: TrackDefinition[]) {
  const key = `track:${track.id}`
  if (isTargetCurrentlyActive(key)) {
    togglePlayback()
    return
  }

  const list = contextTracks && contextTracks.length > 0 ? contextTracks : [track]
  const queue = list.map(trackDefinitionToPlayable)
  let targetIdx = queue.findIndex(item => item.uid === key)
  if (targetIdx < 0) {
    queue.unshift(trackDefinitionToPlayable(track))
    targetIdx = 0
  }

  playerState = { ...playerState, queue, error: null }
  void startQueueIndex(targetIdx)
}

export async function playOrToggleAlbum(album: AlbumDefinition, startSongIndex = 0) {
  const groupKey = `album:${album.id}`

  // If clicking the main album Play button (not a specific song row) while this album is active, toggle play/pause
  if (startSongIndex === 0 && isTargetCurrentlyActive(groupKey) && playerState.currentIndex >= 0) {
    togglePlayback()
    return
  }

  // If this album is already loaded in queue and user picked a specific song row
  if (
    playerState.queue.length > 0 &&
    playerState.queue[0]?.groupKey === groupKey &&
    startSongIndex >= 0 &&
    startSongIndex < playerState.queue.length
  ) {
    selectQueueTrack(startSongIndex)
    return
  }

  const token = ++activeLoadToken
  const albumIdx = allAlbums.findIndex(a => a.id === album.id)
  const placeholder: PlayableTrack = {
    uid: `album-loading:${album.id}`,
    groupKey,
    title: album.title,
    artist: album.artist,
    albumTitle: album.title,
    cover: album.cover,
    sourceUrl: album.sourceUrl,
    albumIndex: albumIdx >= 0 ? albumIdx : undefined,
  }

  if (sharedAudio) sharedAudio.pause()
  progressState = { currentTime: 0, duration: 0 }
  emitProgress()
  setPlayerState({
    queue: [placeholder],
    currentIndex: 0,
    isLoading: true,
    isPlaying: false,
    error: null,
  })

  const songs = await resolveAlbumTracks(album)
  if (token !== activeLoadToken) return

  if (songs.length === 0) {
    setPlayerState({
      isLoading: false,
      isPlaying: false,
      error: 'Треклист недоступен — открой альбом в Apple Music',
    })
    return
  }

  const boundedIdx = Math.min(songs.length - 1, Math.max(0, startSongIndex))
  playerState = { ...playerState, queue: songs, error: null }
  void startQueueIndex(boundedIdx)
}

// =========================================
// REACT SUBSCRIPTION HOOKS
// =========================================

function subscribePlayer(listener: () => void) {
  playerListeners.add(listener)
  return () => {
    playerListeners.delete(listener)
  }
}

function getPlayerSnapshot(): PlayerSnapshot {
  return playerState
}

function subscribeProgress(listener: () => void) {
  progressListeners.add(listener)
  return () => {
    progressListeners.delete(listener)
  }
}

function getProgressSnapshot(): ProgressSnapshot {
  return progressState
}

export function useAudioPlayer() {
  const snapshot = useSyncExternalStore(subscribePlayer, getPlayerSnapshot, getPlayerSnapshot)
  const currentTrack =
    snapshot.currentIndex >= 0 && snapshot.currentIndex < snapshot.queue.length
      ? snapshot.queue[snapshot.currentIndex]
      : null

  return {
    ...snapshot,
    currentTrack,
    togglePlay: togglePlayback,
    playNext: playNextTrack,
    playPrev: playPreviousTrack,
    selectQueueTrack,
    seekTo: seekAudioTo,
    setVolume: setAudioVolume,
    toggleMute: toggleAudioMute,
    cycleRepeatMode,
    toggleShuffle: toggleShuffleMode,
    closePlayer: closeAudioPlayer,
    playTrack: playOrToggleTrack,
    playAlbum: playOrToggleAlbum,
  }
}

export function useAudioProgress(): ProgressSnapshot {
  return useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressSnapshot)
}

export function useHasActivePlayer(): boolean {
  return useSyncExternalStore(
    subscribePlayer,
    () => playerState.queue.length > 0 && playerState.currentIndex >= 0,
    () => false,
  )
}

export function useReleasePlayback(targetKey: string): ReleasePlaybackStatus {
  return useSyncExternalStore(
    subscribePlayer,
    () => {
      if (!isTargetCurrentlyActive(targetKey)) return 'idle'
      if (playerState.isLoading) return 'loading'
      return playerState.isPlaying ? 'playing' : 'paused'
    },
    () => 'idle',
  )
}

export function useAlbumTracklist(album: AlbumDefinition): {
  tracks: PlayableTrack[]
  loading: boolean
} {
  const cached = albumTracksResolvedSync.get(album.id)
  const [tracksList, setTracksList] = useState<PlayableTrack[]>(cached ?? [])
  const [loading, setLoading] = useState<boolean>(!cached)

  useEffect(() => {
    let cancelled = false
    const syncHit = albumTracksResolvedSync.get(album.id)
    if (syncHit) {
      setTracksList(syncHit)
      setLoading(false)
      return
    }
    setTracksList([])
    setLoading(true)
    resolveAlbumTracks(album).then(resolved => {
      if (cancelled) return
      setTracksList(resolved)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [album])

  return { tracks: tracksList, loading }
}
