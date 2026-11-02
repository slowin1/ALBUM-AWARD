import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { albums } from '../data/albums'
import { tracks } from '../data/tracks'
import { allAlbums, allTracks, artists } from '../data/artists'
import { monthArtists } from '../data/monthArtists'
import { WHEEL_SCROLL_START } from '../scene/config'
import { stopSmoothScroll, syncSmoothScroll } from './smoothScroll'

export type AlbumRoute =
 | { kind: 'home' }
 | { kind: 'gallery' }
 | { kind: 'tracks' }
 | { kind: 'artists' }
 | { kind: 'register' }
 | { kind: 'profile' }
 | { kind: 'album'; index: number }
 | { kind: 'track'; index: number }
 | { kind: 'month-artist'; index: number }
 | { kind: 'artist'; index: number }
 | { kind: 'not-found' }

type ScrollState = {
 entryKey?: string
 homeScrollY?: number
 returnHome?: boolean
 galleryProgress?: number
 tracksProgress?: number
 artistsProgress?: number
 returnArtists?: boolean
 detailScrollY?: number
 trackScrollY?: number
 monthArtistScrollY?: number
 artistScrollY?: number
 returnAlbumIndex?: number
 returnAlbumScrollY?: number
 returnTrackIndex?: number
 returnTrackScrollY?: number
 returnMonthArtistIndex?: number
 returnMonthArtistScrollY?: number
 returnEntryKey?: string
}
type LocationSnapshot = { route: AlbumRoute; hash: string; scroll: ScrollState }
const positions = new Map<string, ScrollState>()
// Only use Back for artist entries whose preceding album/track/month-artist entry we created here.
// Persisted state alone cannot prove that a previous same-origin entry still exists.
const artistOrigins = new Map<string, string>()
let sequence = 0

export const albumPath = (index: number) => `/album/${allAlbums[index].id}`
export const trackPath = (index: number) => `/track/${allTracks[index].id}`
export const monthArtistPath = (index: number) => `/month-artist/${monthArtists[index].id}`
export const artistPath = (index: number) => `/artist/${artists[index].id}`
export const albumProgress = (index: number) => {
 const wheelIndex = ((index % albums.length) + albums.length) % albums.length
 return WHEEL_SCROLL_START + wheelIndex / (albums.length - 1) * (1 - WHEEL_SCROLL_START)
}

const validAlbumIndex = (index: unknown): index is number => typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < allAlbums.length
const validTrackIndex = (index: unknown): index is number => typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < allTracks.length
const validMonthArtistIndex = (index: unknown): index is number => typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < monthArtists.length
const boundedIndex = (index: number, length: number) => Math.max(0, Math.min(length - 1, Number.isFinite(index) ? Math.trunc(index) : 0))

function albumForArtist(index: number, preferred?: number) {
 const artist = artists[index]
 if (!artist) return 0
 if (validAlbumIndex(preferred) && artist.albums.some(album => album.id === allAlbums[preferred].id)) return preferred
 const firstIndex = allAlbums.findIndex(album => album.id === artist.albums[0]?.id)
 return firstIndex >= 0 ? firstIndex : 0
}

function trackForArtist(index: number, preferred?: number) {
 const artist = artists[index]
 if (!artist) return 0
 if (validTrackIndex(preferred) && artist.tracks.some(track => track.id === allTracks[preferred].id)) return preferred
 const firstIndex = allTracks.findIndex(track => track.id === artist.tracks[0]?.id)
 return firstIndex >= 0 ? firstIndex : 0
}

function monthArtistForArtist(index: number, preferred?: number) {
 const artist = artists[index]
 if (!artist) return 0
 if (validMonthArtistIndex(preferred) && artist.monthAwards.some(award => award.id === monthArtists[preferred].id)) return preferred
 const firstIndex = monthArtists.findIndex(award => award.id === artist.monthAwards[0]?.id)
 return firstIndex >= 0 ? firstIndex : 0
}

function currentRoute(): AlbumRoute {
 const path = window.location.pathname.replace(/\/+$/, '') || '/'
 if (path === '/') return { kind: 'home' }
 if (path === '/albums') return { kind: 'gallery' }
 if (path === '/tracks') return { kind: 'tracks' }
 if (path === '/month-artists') return { kind: 'artists' }
 if (path === '/register') return { kind: 'register' }
 if (path === '/profile') return { kind: 'profile' }
 const match = /^\/(album|track|month-artist|artist)\/([^/]+)$/.exec(path)
 if (!match) return { kind: 'not-found' }
 try {
  const id = decodeURIComponent(match[2])
  const index = match[1] === 'album'
   ? allAlbums.findIndex(album => album.id === id)
   : match[1] === 'track'
    ? allTracks.findIndex(track => track.id === id)
    : match[1] === 'month-artist'
     ? monthArtists.findIndex(item => item.id === id)
     : artists.findIndex(artist => artist.id === id)
  return index < 0 ? { kind: 'not-found' } : { kind: match[1] as 'album' | 'track' | 'month-artist' | 'artist', index }
 } catch { return { kind: 'not-found' } }
}

function historyObject(): Record<string, unknown> {
 const state: unknown = window.history.state
 return state && typeof state === 'object' ? state as Record<string, unknown> : {}
}

function scrollState(): ScrollState {
 const value = historyObject().albumAwards
 if (!value || typeof value !== 'object') return {}
 const data = value as ScrollState
 const saved: ScrollState = {
  entryKey: typeof data.entryKey === 'string' ? data.entryKey : undefined,
  homeScrollY: Number.isFinite(data.homeScrollY) ? Math.max(0, data.homeScrollY!) : undefined,
  returnHome: data.returnHome === true ? true : undefined,
  galleryProgress: Number.isFinite(data.galleryProgress) ? Math.min(1, Math.max(0, data.galleryProgress!)) : undefined,
  tracksProgress: Number.isFinite(data.tracksProgress) ? Math.min(1, Math.max(0, data.tracksProgress!)) : undefined,
  artistsProgress: Number.isFinite(data.artistsProgress) ? Math.min(1, Math.max(0, data.artistsProgress!)) : undefined,
  returnArtists: data.returnArtists === true ? true : undefined,
  detailScrollY: Number.isFinite(data.detailScrollY) ? Math.max(0, data.detailScrollY!) : undefined,
  trackScrollY: Number.isFinite(data.trackScrollY) ? Math.max(0, data.trackScrollY!) : undefined,
  monthArtistScrollY: Number.isFinite(data.monthArtistScrollY) ? Math.max(0, data.monthArtistScrollY!) : undefined,
  artistScrollY: Number.isFinite(data.artistScrollY) ? Math.max(0, data.artistScrollY!) : undefined,
  returnAlbumIndex: validAlbumIndex(data.returnAlbumIndex) ? data.returnAlbumIndex : undefined,
  returnAlbumScrollY: Number.isFinite(data.returnAlbumScrollY) ? Math.max(0, data.returnAlbumScrollY!) : undefined,
  returnTrackIndex: validTrackIndex(data.returnTrackIndex) ? data.returnTrackIndex : undefined,
  returnTrackScrollY: Number.isFinite(data.returnTrackScrollY) ? Math.max(0, data.returnTrackScrollY!) : undefined,
  returnMonthArtistIndex: validMonthArtistIndex(data.returnMonthArtistIndex) ? data.returnMonthArtistIndex : undefined,
  returnMonthArtistScrollY: Number.isFinite(data.returnMonthArtistScrollY) ? Math.max(0, data.returnMonthArtistScrollY!) : undefined,
  returnEntryKey: typeof data.returnEntryKey === 'string' ? data.returnEntryKey : undefined,
 }
 return saved.entryKey ? { ...(positions.get(saved.entryKey) ?? saved) } : saved
}

function replaceScroll(data: ScrollState) {
 if (data.entryKey) positions.set(data.entryKey, data)
 window.history.replaceState({ ...historyObject(), albumAwards: data }, '')
}

function rememberScroll(persist = true) {
 const route = currentRoute()
 const data = scrollState()
 if (route.kind === 'home') data.homeScrollY = window.scrollY
 else if (route.kind === 'gallery') {
  data.galleryProgress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
 } else if (route.kind === 'tracks') {
  data.tracksProgress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
 } else if (route.kind === 'artists') {
  data.artistsProgress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
 } else if (route.kind === 'album') data.detailScrollY = window.scrollY
 else if (route.kind === 'track') data.trackScrollY = window.scrollY
 else if (route.kind === 'month-artist') data.monthArtistScrollY = window.scrollY
 else if (route.kind === 'artist') data.artistScrollY = window.scrollY
 if (data.entryKey) positions.set(data.entryKey, data)
 if (persist) replaceScroll(data)
 return data
}

function readLocation(): LocationSnapshot {
 const scroll = scrollState()
 if (!scroll.entryKey) {
  scroll.entryKey = `${Date.now().toString(36)}-${++sequence}`
  replaceScroll(scroll)
 }
 return { route: currentRoute(), hash: window.location.hash, scroll }
}

/** Native album/track/month-artist/artist URLs, Back/Forward and independent page scroll positions. */
export function useAlbumNavigation() {
 const [location, setLocation] = useState(readLocation)
 const pendingScroll = useRef(0)
 const cancelScrollSave = useCallback(() => {
  window.clearTimeout(pendingScroll.current)
  pendingScroll.current = 0
 }, [])

 useEffect(() => {
  const previous = window.history.scrollRestoration
  window.history.scrollRestoration = 'manual'
  const update = () => { stopSmoothScroll(); cancelScrollSave(); setLocation(readLocation()) }
  window.addEventListener('popstate', update)
  return () => {
   window.removeEventListener('popstate', update)
   window.history.scrollRestoration = previous
  }
 }, [cancelScrollSave])

 useLayoutEffect(() => {
  stopSmoothScroll()
  if (location.route.kind === 'home') {
   window.scrollTo({ top: location.scroll.homeScrollY ?? 0, behavior: 'instant' })
  } else if (location.route.kind === 'gallery') {
   window.scrollTo({ top: (location.scroll.galleryProgress ?? 0) * Math.max(0, document.documentElement.scrollHeight - innerHeight), behavior: 'instant' })
  } else if (location.route.kind === 'tracks') {
   window.scrollTo({ top: (location.scroll.tracksProgress ?? 0) * Math.max(0, document.documentElement.scrollHeight - innerHeight), behavior: 'instant' })
  } else if (location.route.kind === 'artists') {
   window.scrollTo({ top: (location.scroll.artistsProgress ?? 0) * Math.max(0, document.documentElement.scrollHeight - innerHeight), behavior: 'instant' })
  } else if (location.route.kind === 'album' && !location.scroll.returnHome && location.route.index < albums.length && location.scroll.detailScrollY === undefined && location.hash === '#vote') {
   document.getElementById('vote')?.scrollIntoView({ behavior: 'instant' })
  } else if (location.route.kind === 'track' && !location.scroll.returnHome && location.route.index < tracks.length && location.scroll.trackScrollY === undefined && location.hash === '#vote') {
   document.getElementById('vote')?.scrollIntoView({ behavior: 'instant' })
  } else if (location.route.kind === 'month-artist' && location.scroll.monthArtistScrollY === undefined && location.hash === '#vote') {
   document.getElementById('vote')?.scrollIntoView({ behavior: 'instant' })
  } else if (location.route.kind === 'artist') {
   window.scrollTo({ top: location.scroll.artistScrollY ?? 0, behavior: 'instant' })
  } else if (location.route.kind === 'register' || location.route.kind === 'profile') {
   window.scrollTo({ top: 0, behavior: 'instant' })
  } else if (location.route.kind === 'track') {
   window.scrollTo({ top: location.scroll.trackScrollY ?? 0, behavior: 'instant' })
  } else if (location.route.kind === 'month-artist') {
   window.scrollTo({ top: location.scroll.monthArtistScrollY ?? 0, behavior: 'instant' })
  } else window.scrollTo({ top: location.scroll.detailScrollY ?? 0, behavior: 'instant' })
  syncSmoothScroll()
 }, [location])

 useEffect(() => {
  const entryKey = location.scroll.entryKey
  const onScroll = () => {
   if (scrollState().entryKey !== entryKey) return
   const data = rememberScroll(false)
   if (pendingScroll.current) return
   const key = data.entryKey
   pendingScroll.current = window.setTimeout(() => {
    pendingScroll.current = 0
    if (scrollState().entryKey === key) replaceScroll(scrollState())
   }, 1000)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  const onPageHide = () => { if (scrollState().entryKey === entryKey) rememberScroll() }
  window.addEventListener('pagehide', onPageHide)
  return () => {
   cancelScrollSave()
   window.removeEventListener('scroll', onScroll)
   window.removeEventListener('pagehide', onPageHide)
  }
 }, [location, cancelScrollSave])

 const goToAlbum = useCallback((index: number, vote = false) => {
  stopSmoothScroll()
  cancelScrollSave()
  const bounded = boundedIndex(index, allAlbums.length)
  const route = currentRoute()
  const data = scrollState()
  if (route.kind === 'gallery') {
   data.galleryProgress = albumProgress(bounded)
   replaceScroll(data)
  } else rememberScroll()
  const galleryProgress = data.galleryProgress ?? albumProgress(bounded)
  const returnHome = (route.kind === 'home' || data.returnHome) ? true : undefined
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, returnHome, galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress, detailScrollY: vote ? undefined : 0 } }, '', albumPath(bounded) + window.location.search + (vote ? '#vote' : ''))
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToTrack = useCallback((index: number, vote = false) => {
  stopSmoothScroll()
  cancelScrollSave()
  const bounded = boundedIndex(index, allTracks.length)
  const route = currentRoute()
  const data = scrollState()
  if (route.kind === 'tracks') {
   data.tracksProgress = albumProgress(bounded)
   replaceScroll(data)
  } else rememberScroll()
  const tracksProgress = data.tracksProgress ?? albumProgress(bounded)
  const returnHome = (route.kind === 'home' || data.returnHome) ? true : undefined
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, returnHome, galleryProgress: data.galleryProgress, tracksProgress, artistsProgress: data.artistsProgress, trackScrollY: vote ? undefined : 0 } }, '', trackPath(bounded) + window.location.search + (vote ? '#vote' : ''))
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToMonthArtist = useCallback((index: number, vote = false) => {
  stopSmoothScroll()
  cancelScrollSave()
  const bounded = boundedIndex(index, monthArtists.length)
  const route = currentRoute()
  const data = scrollState()
  if (route.kind === 'artists') {
   data.artistsProgress = albumProgress(bounded)
   replaceScroll(data)
  } else rememberScroll()
  const artistsProgress = data.artistsProgress ?? albumProgress(bounded)
  const returnHome = route.kind === 'home' ? true : undefined
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, returnHome, galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress, monthArtistScrollY: vote ? undefined : 0 } }, '', monthArtistPath(bounded) + window.location.search + (vote ? '#vote' : ''))
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToArtist = useCallback((index: number, fromReleaseIndex: number, fromMode: 'album' | 'track' | 'month-artist' = 'album') => {
  stopSmoothScroll()
  cancelScrollSave()
  const bounded = boundedIndex(index, artists.length)
  const route = currentRoute()
  if (route.kind === 'artist' && route.index === bounded) return
  const data = rememberScroll()
  const artist = artists[bounded]
  const isFromMonthArtist = fromMode === 'month-artist' || (artist && artist.monthAwards.length > 0 && artist.tracks.length === 0 && artist.albums.length === 0)
  const isFromTrack = !isFromMonthArtist && (fromMode === 'track' || (artist && artist.tracks.length > 0 && artist.albums.length === 0))
  const sourceIndex = isFromMonthArtist
   ? monthArtistForArtist(bounded, route.kind === 'month-artist' ? route.index : fromReleaseIndex)
   : isFromTrack
    ? trackForArtist(bounded, route.kind === 'track' ? route.index : fromReleaseIndex)
    : albumForArtist(bounded, route.kind === 'album' ? route.index : fromReleaseIndex)
  const fromAlbumPage = route.kind === 'album' && route.index === sourceIndex && !isFromTrack && !isFromMonthArtist
  const fromTrackPage = route.kind === 'track' && route.index === sourceIndex && isFromTrack
  const fromArtistsWheel = route.kind === 'artists'
  const fromHome = route.kind === 'home'
  const fromMonthArtistPage = route.kind === 'month-artist' && route.index === sourceIndex && isFromMonthArtist
  const state: ScrollState = {
   homeScrollY: data.homeScrollY,
   returnHome: fromHome ? true : undefined,
   galleryProgress: data.galleryProgress ?? albumProgress(sourceIndex),
   tracksProgress: data.tracksProgress ?? albumProgress(sourceIndex),
   artistsProgress: data.artistsProgress ?? albumProgress(sourceIndex),
   returnArtists: fromArtistsWheel ? true : undefined,
   artistScrollY: 0,
   returnAlbumIndex: (!isFromTrack && !isFromMonthArtist) ? sourceIndex : undefined,
   returnAlbumScrollY: fromAlbumPage ? data.detailScrollY : undefined,
   returnTrackIndex: isFromTrack ? sourceIndex : undefined,
   returnTrackScrollY: fromTrackPage ? data.trackScrollY : undefined,
   returnMonthArtistIndex: isFromMonthArtist ? sourceIndex : undefined,
   returnMonthArtistScrollY: fromMonthArtistPage ? data.monthArtistScrollY : undefined,
   returnEntryKey: (fromAlbumPage || fromTrackPage || fromMonthArtistPage || fromArtistsWheel || fromHome) ? data.entryKey : undefined,
  }
  window.history.pushState({ albumAwards: state }, '', artistPath(bounded) + window.location.search)
  const next = readLocation()
  if ((fromAlbumPage || fromTrackPage || fromMonthArtistPage || fromArtistsWheel || fromHome) && data.entryKey && next.scroll.entryKey) artistOrigins.set(next.scroll.entryKey, data.entryKey)
  setLocation(next)
 }, [cancelScrollSave])

 const returnToAlbum = useCallback(() => {
  const route = currentRoute()
  if (route.kind !== 'artist') return
  stopSmoothScroll()
  cancelScrollSave()
  const data = rememberScroll()
  if (data.entryKey && data.returnEntryKey && artistOrigins.get(data.entryKey) === data.returnEntryKey) {
   window.history.back()
   return
  }
  if (data.returnHome) {
   window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY ?? 0, galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress } }, '', '/' + window.location.search)
   setLocation(readLocation())
   return
  }
  if (data.returnArtists) {
   const idx = boundedIndex(data.returnMonthArtistIndex ?? 0, monthArtists.length)
   window.history.pushState({ albumAwards: { galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress ?? albumProgress(idx) } }, '', '/month-artists' + window.location.search)
   setLocation(readLocation())
   return
  }
  if (data.returnMonthArtistIndex !== undefined) {
   const idx = boundedIndex(data.returnMonthArtistIndex, monthArtists.length)
   const state: ScrollState = {
    galleryProgress: data.galleryProgress,
    tracksProgress: data.tracksProgress,
    artistsProgress: data.artistsProgress ?? albumProgress(idx),
    monthArtistScrollY: data.returnMonthArtistScrollY,
   }
   const hash = state.monthArtistScrollY === undefined ? '#vote' : ''
   window.history.pushState({ albumAwards: state }, '', monthArtistPath(idx) + window.location.search + hash)
   setLocation(readLocation())
   return
  }
  if (data.returnTrackIndex !== undefined) {
   const trackIdx = boundedIndex(data.returnTrackIndex, allTracks.length)
   const state: ScrollState = {
    galleryProgress: data.galleryProgress,
    tracksProgress: data.tracksProgress ?? albumProgress(trackIdx),
    artistsProgress: data.artistsProgress,
    trackScrollY: data.returnTrackScrollY,
   }
   const hash = state.trackScrollY === undefined ? '#vote' : ''
   window.history.pushState({ albumAwards: state }, '', trackPath(trackIdx) + window.location.search + hash)
   setLocation(readLocation())
   return
  }
  const index = albumForArtist(route.index, data.returnAlbumIndex)
  const state: ScrollState = {
   galleryProgress: data.galleryProgress ?? albumProgress(index),
   tracksProgress: data.tracksProgress,
   artistsProgress: data.artistsProgress,
   detailScrollY: data.returnAlbumScrollY,
  }
  const hash = state.detailScrollY === undefined ? '#vote' : ''
  window.history.pushState({ albumAwards: state }, '', albumPath(index) + window.location.search + hash)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToHome = useCallback(() => {
  stopSmoothScroll()
  cancelScrollSave()
  const route = currentRoute()
  if (route.kind === 'home') return
  const data = rememberScroll()
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY ?? 0, galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress } }, '', '/' + window.location.search)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToGallery = useCallback(() => {
  stopSmoothScroll()
  cancelScrollSave()
  const route = currentRoute()
  if (route.kind === 'gallery') return
  const data = rememberScroll()
  const galleryProgress = route.kind === 'album' ? albumProgress(route.index)
   : route.kind === 'artist' ? albumProgress(albumForArtist(route.index, data.returnAlbumIndex))
   : data.galleryProgress ?? 0
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress } }, '', '/albums' + window.location.search)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToTracks = useCallback(() => {
  stopSmoothScroll()
  cancelScrollSave()
  const route = currentRoute()
  if (route.kind === 'tracks') return
  const data = rememberScroll()
  const tracksProgress = route.kind === 'track' ? albumProgress(route.index)
   : route.kind === 'artist' && data.returnTrackIndex !== undefined ? albumProgress(data.returnTrackIndex)
   : data.tracksProgress ?? 0
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, galleryProgress: data.galleryProgress, tracksProgress, artistsProgress: data.artistsProgress } }, '', '/tracks' + window.location.search)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToArtists = useCallback(() => {
  stopSmoothScroll()
  cancelScrollSave()
  const route = currentRoute()
  if (route.kind === 'artists') return
  const data = rememberScroll()
  const artistsProgress = route.kind === 'month-artist' ? albumProgress(route.index)
   : route.kind === 'artist' && data.returnMonthArtistIndex !== undefined ? albumProgress(data.returnMonthArtistIndex)
   : data.artistsProgress ?? 0
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress } }, '', '/month-artists' + window.location.search)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToRegister = useCallback(() => {
  stopSmoothScroll()
  cancelScrollSave()
  const route = currentRoute()
  if (route.kind === 'register') return
  const data = rememberScroll()
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress } }, '', '/register' + window.location.search)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const goToProfile = useCallback(() => {
  stopSmoothScroll()
  cancelScrollSave()
  const route = currentRoute()
  if (route.kind === 'profile') return
  const data = rememberScroll()
  window.history.pushState({ albumAwards: { homeScrollY: data.homeScrollY, galleryProgress: data.galleryProgress, tracksProgress: data.tracksProgress, artistsProgress: data.artistsProgress } }, '', '/profile' + window.location.search)
  setLocation(readLocation())
 }, [cancelScrollSave])

 const artistIndex = location.route.kind === 'artist' ? location.route.index : null
 const currentArtist = artistIndex !== null ? artists[artistIndex] : null
 const artistFromMonthArtist = artistIndex !== null
  ? (location.scroll.returnMonthArtistIndex !== undefined || (currentArtist !== null && currentArtist.monthAwards.length > 0 && currentArtist.tracks.length === 0 && currentArtist.albums.length === 0))
  : false
 const artistFromTrack = artistIndex !== null && !artistFromMonthArtist
  ? (location.scroll.returnTrackIndex !== undefined || (currentArtist !== null && currentArtist.tracks.length > 0 && currentArtist.albums.length === 0))
  : false
 const artistAlbumIndex = artistIndex !== null
  ? (artistFromMonthArtist
      ? monthArtistForArtist(artistIndex, location.scroll.returnMonthArtistIndex)
      : artistFromTrack
        ? trackForArtist(artistIndex, location.scroll.returnTrackIndex)
        : albumForArtist(artistIndex, location.scroll.returnAlbumIndex))
  : null
 const openedFromHome = location.scroll.returnHome === true
 return { route: location.route, location, openedFromHome, goToHome, goToAlbum, goToTrack, goToMonthArtist, goToArtist, returnToAlbum, goToGallery, goToTracks, goToArtists, goToRegister, goToProfile, artistAlbumIndex, artistFromTrack, artistFromMonthArtist }
}
