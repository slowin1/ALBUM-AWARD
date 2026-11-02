import { Component, StrictMode, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { Scene } from './scene/Scene'
import { LOGO_SCROLL_END, SCENE_DEFAULTS, TOTAL_SCROLL_PAGES, WHEEL_SCROLL_START } from './scene/config'
import { albums } from './data/albums'
import { tracks } from './data/tracks'
import { allAlbums, allTracks, artists, getAlbumArtist, getMonthArtist, getTrackArtist } from './data/artists'
import { monthArtists } from './data/monthArtists'
import { AlbumVotePage } from './components/AlbumVotePage'
import { TrackVotePage } from './components/TrackVotePage'
import { MonthArtistVotePage } from './components/MonthArtistVotePage'
import { ArtistPage } from './components/ArtistPage'
import { ArtistCardTransition, type ArtistCardSource } from './components/ArtistCardTransition'
import { HomePage } from './components/HomePage'
import { RegistrationPage } from './components/RegistrationPage'
import { UserProfilePage } from './components/UserProfilePage'
import { albumPath, albumProgress, artistPath, useAlbumNavigation } from './navigation/albumNavigation'
import { useAuth } from './hooks/useAuth'
import { FrameProfiler } from './scene/FrameProfiler'
import { RenderQuality } from './scene/RenderQuality'
import { albumDetailMotion } from './scene/albumDetailMotion'
import { installSmoothScroll, scrollToPosition, type SmoothScrollController } from './navigation/smoothScroll'
import './fonts.css'
import './style.css'

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false }
 static getDerivedStateFromError() { return { failed: true } }
 render() {
  return this.state.failed
   ? <div className="fallback">Не удалось загрузить сцену. Обнови страницу или проверь поддержку WebGL.</div>
   : this.props.children
 }
}

function App() {
 const { route, location: routeLocation, openedFromHome, goToHome, goToAlbum, goToTrack, goToMonthArtist, goToArtist, returnToAlbum, goToGallery, goToTracks, goToArtists, goToRegister, goToProfile, artistAlbumIndex, artistFromTrack, artistFromMonthArtist } = useAlbumNavigation()
 const { user, isAuthenticated } = useAuth()
 const detailIndex = route.kind === 'album' ? route.index : null
 const trackIndex = route.kind === 'track' ? route.index : null
 const monthArtistIndex = route.kind === 'month-artist' ? route.index : null
 const artistIndex = route.kind === 'artist' ? route.index : null
 const sceneIndex = detailIndex ?? trackIndex ?? monthArtistIndex ?? artistAlbumIndex
 const wheelSceneIndex = sceneIndex !== null ? ((sceneIndex % albums.length) + albums.length) % albums.length : null
 const isArtistsMode = route.kind === 'artists' || monthArtistIndex !== null || artistFromMonthArtist
 const isTracksMode = !isArtistsMode && (route.kind === 'tracks' || trackIndex !== null || artistFromTrack)
 const isSceneKind = route.kind === 'gallery' || route.kind === 'tracks' || route.kind === 'artists'
 const isGalleryRoute = isSceneKind
 const isDetailPage = detailIndex !== null || trackIndex !== null || monthArtistIndex !== null || artistIndex !== null
 const isDirectVote = openedFromHome || (detailIndex !== null && detailIndex >= albums.length) || (trackIndex !== null && trackIndex >= tracks.length)
 const scroll = useRef(0)
 const detailScroll = useRef(0)
 const [intro, setIntro] = useState(true)
 const [galleryVisible, setGalleryVisible] = useState(false)
 const [activeIndex, setActiveIndex] = useState(0)
 const [openingIndex, setOpeningIndex] = useState<number | null>(null)
 const openingRef = useRef<number | null>(null)
 const openingTimer = useRef(0)
 const [artistOpening, setArtistOpening] = useState<{ albumIndex: number; artistIndex: number; fromMode: 'album' | 'track' | 'month-artist'; source: ArtistCardSource } | null>(null)
 const artistOpeningRef = useRef<typeof artistOpening>(null)
 const stageRef = useRef<HTMLDivElement>(null)
 const scrollController = useRef<SmoothScrollController | null>(null)
 const [stageVisible, setStageVisible] = useState(true)
 const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
 const [renderDpr, setRenderDpr] = useState(1)
 const { active: loading, progress: loadingProgress } = useProgress()
 const settings = { ...SCENE_DEFAULTS, animate: !reducedMotion }

 useEffect(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  const update = () => setReducedMotion(query.matches)
  update(); query.addEventListener('change', update)
  return () => query.removeEventListener('change', update)
 }, [])

 useLayoutEffect(() => {
  const controller = installSmoothScroll()
  scrollController.current = controller
  return () => { controller.destroy(); scrollController.current = null }
 }, [])

  const usesStageScroll = isSceneKind || (!isDirectVote && (route.kind === 'album' || route.kind === 'track' || route.kind === 'month-artist'))

 useLayoutEffect(() => {
  scrollController.current?.setEnabled(!reducedMotion && route.kind !== 'not-found')
  scrollController.current?.setLocked(openingIndex !== null || artistOpening !== null)
 }, [routeLocation, reducedMotion, route.kind, openingIndex, artistOpening])

 useLayoutEffect(() => {
  if (!usesStageScroll) {
   detailScroll.current = 0
   if (stageRef.current) {
    stageRef.current.style.opacity = '0'
    stageRef.current.style.visibility = 'hidden'
   }
   setStageVisible(false)
   return
  }
  let frame = 0
  let stageHeight = 1
  const update = () => {
   if (isSceneKind) {
    scroll.current = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
    setIntro(scroll.current < LOGO_SCROLL_END)
    setGalleryVisible(scroll.current >= WHEEL_SCROLL_START - .015)
   }
   const motion = (!isDirectVote && (route.kind === 'album' || route.kind === 'track' || route.kind === 'month-artist')) ? albumDetailMotion(window.scrollY, stageHeight) : null
   detailScroll.current = motion?.progress ?? 0
   const visible = isSceneKind || (motion?.visible ?? false)
   if (stageRef.current) {
    stageRef.current.style.opacity = String(motion?.opacity ?? 1)
    stageRef.current.style.visibility = visible ? 'visible' : 'hidden'
   }
   setStageVisible(visible)
  }
  const measure = () => {
   stageHeight = Math.max(1, stageRef.current?.offsetHeight || innerHeight)
   update()
  }
  const onScroll = () => {
   if (frame) return
   frame = requestAnimationFrame(() => { frame = 0; update() })
  }
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure)
  return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure) }
 }, [routeLocation, usesStageScroll, isSceneKind, isDirectVote, route.kind])

 const focusAlbum = useCallback((index: number) => {
  const bounded = Math.min(albums.length - 1, Math.max(0, index))
  const progress = albumProgress(bounded)
  scrollToPosition(progress * (document.documentElement.scrollHeight - innerHeight), reducedMotion)
 }, [reducedMotion])

 const cancelOpening = useCallback(() => {
  window.clearTimeout(openingTimer.current)
  openingTimer.current = 0
  openingRef.current = null
  scrollController.current?.setLocked(artistOpeningRef.current !== null)
  setOpeningIndex(null)
 }, [])

 const cancelArtistOpening = useCallback(() => {
  artistOpeningRef.current = null
  setArtistOpening(null)
  scrollController.current?.setLocked(openingRef.current !== null)
 }, [])

 function trackAsCardAlbum(track: (typeof allTracks)[number]) {
  return {
   id: `track:${track.id}`,
   title: track.title,
   artist: track.artist,
   year: track.year,
   cover: track.cover,
   sourceUrl: track.sourceUrl,
  }
 }

 function monthArtistAsCardAlbum(award: (typeof monthArtists)[number]) {
  return {
   id: `month-artist:${award.id}`,
   title: award.title,
   artist: award.month,
   year: award.year,
   cover: award.cover,
   sourceUrl: award.sourceUrl,
  }
 }

 const openArtist = useCallback((event: MouseEvent<HTMLAnchorElement>, releaseIndex: number, fromMode: 'album' | 'track' | 'month-artist' = 'album') => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (artistOpeningRef.current !== null || openingRef.current !== null) return
  const targetArtist = fromMode === 'month-artist'
   ? getMonthArtist(monthArtists[releaseIndex])
   : fromMode === 'track'
    ? getTrackArtist(allTracks[releaseIndex])
    : getAlbumArtist(allAlbums[releaseIndex])
  const artistIndex = artists.indexOf(targetArtist)
  if (reducedMotion) { goToArtist(artistIndex, releaseIndex, fromMode); return }
  const frame = event.currentTarget.closest<HTMLElement>('.album-rating-card-frame')
  const bounds = frame?.getBoundingClientRect()
  if (!frame || !bounds || bounds.width <= 0 || bounds.height <= 0) {
   goToArtist(artistIndex, releaseIndex, fromMode)
   return
  }
  scrollController.current?.stop()
  scrollController.current?.setLocked(true)
  const opening = {
   albumIndex: releaseIndex,
   artistIndex,
   fromMode,
   source: {
    left: bounds.left,
    top: bounds.top - (frame.hasAttribute('data-tilting') ? 4 : 0),
    width: bounds.width,
    height: bounds.height,
    rotateX: frame.style.getPropertyValue('--card-rotate-x') || '0deg',
    rotateY: frame.style.getPropertyValue('--card-rotate-y') || '0deg',
   },
  }
  artistOpeningRef.current = opening
  setArtistOpening(opening)
  goToArtist(artistIndex, releaseIndex, fromMode)
 }, [goToArtist, reducedMotion])

 const returnFromArtist = useCallback(() => {
  cancelArtistOpening()
  returnToAlbum()
 }, [cancelArtistOpening, returnToAlbum])

 const openAlbum = useCallback((index: number) => {
  if (openingRef.current !== null) return
  const bounded = Math.max(0, Math.min(albums.length - 1, index))
  const isTracksRoute = route.kind === 'tracks' || route.kind === 'track'
  const isArtistsRoute = route.kind === 'artists' || route.kind === 'month-artist'
  const navigate = () => {
   if (isArtistsRoute) goToMonthArtist(bounded)
   else if (isTracksRoute) goToTrack(bounded)
   else goToAlbum(bounded)
  }
  if (!isSceneKind) {
   navigate()
   return
  }
  // Align the selected screen, then let the camera move closer before changing the page.
  scroll.current = albumProgress(bounded)
  scrollToPosition(scroll.current * (document.documentElement.scrollHeight - innerHeight), true)
  scrollController.current?.setLocked(true)
  openingRef.current = bounded
  setOpeningIndex(bounded)
  openingTimer.current = window.setTimeout(() => {
   if (openingRef.current !== bounded) return
   openingTimer.current = 0
   openingRef.current = null
   navigate()
   setOpeningIndex(null)
  }, settings.animate ? 560 : 0)
 }, [goToAlbum, goToTrack, goToMonthArtist, isSceneKind, route.kind, settings.animate])

 useEffect(() => {
  cancelOpening()
  const opening = artistOpeningRef.current
  if (opening && (route.kind !== 'artist' || route.index !== opening.artistIndex)) cancelArtistOpening()
 }, [routeLocation, cancelOpening, cancelArtistOpening, route])

 useEffect(() => {
  const cancel = () => { cancelOpening(); cancelArtistOpening() }
  window.addEventListener('popstate', cancel)
  return () => { window.removeEventListener('popstate', cancel); window.clearTimeout(openingTimer.current) }
 }, [cancelOpening, cancelArtistOpening])

 useEffect(() => {
  if (openingIndex === null && artistOpening === null) return
  const prevent = (event: Event) => event.preventDefault()
  window.addEventListener('wheel', prevent, { passive: false })
  window.addEventListener('touchmove', prevent, { passive: false })
  return () => { window.removeEventListener('wheel', prevent); window.removeEventListener('touchmove', prevent) }
 }, [openingIndex, artistOpening])

 useEffect(() => {
  document.title = artistIndex !== null ? `${artists[artistIndex].name} | Album Awards`
   : detailIndex !== null ? `${allAlbums[detailIndex].title} — ${allAlbums[detailIndex].artist} | Album Awards`
   : trackIndex !== null ? `${allTracks[trackIndex].title} — ${allTracks[trackIndex].artist} | Album Awards`
   : monthArtistIndex !== null ? `${monthArtists[monthArtistIndex].title} — ${monthArtists[monthArtistIndex].month} | Album Awards`
   : route.kind === 'home' ? 'Главная | Album Awards'
   : route.kind === 'tracks' ? 'Треки — Starry Night | Album Awards'
   : route.kind === 'artists' ? 'Исполнители месяца — Ocean | Album Awards'
   : route.kind === 'profile' ? (isAuthenticated && user?.nickname ? `${user.nickname} · Профиль | Album Awards` : 'Профиль | Album Awards')
   : route.kind === 'register' ? 'Регистрация | Album Awards'
   : 'Альбомы — Shader Lab | Album Awards'
 }, [detailIndex, trackIndex, monthArtistIndex, artistIndex, route.kind, isAuthenticated, user])

 const previousPage = useRef(route.kind)
 useEffect(() => {
  let frame = 0
  if ((previousPage.current === 'album' && route.kind === 'gallery') || (previousPage.current === 'track' && route.kind === 'tracks') || ((previousPage.current === 'month-artist' || previousPage.current === 'artist') && route.kind === 'artists')) {
   frame = requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }))
  } else if (previousPage.current === 'artist' && (route.kind === 'album' || route.kind === 'track' || route.kind === 'month-artist')) {
   frame = requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>('.album-rating-card-link')?.focus({ preventScroll: true }))
  }
  previousPage.current = route.kind
  return () => cancelAnimationFrame(frame)
 }, [route.kind])

 const returnToHome = useCallback(() => {
  cancelOpening()
  cancelArtistOpening()
  goToHome()
 }, [cancelOpening, cancelArtistOpening, goToHome])

 const returnToGallery = useCallback(() => {
  cancelOpening()
  cancelArtistOpening()
  goToGallery()
 }, [cancelOpening, cancelArtistOpening, goToGallery])

 const returnToTracks = useCallback(() => {
  cancelOpening()
  cancelArtistOpening()
  goToTracks()
 }, [cancelOpening, cancelArtistOpening, goToTracks])

 const returnToArtists = useCallback(() => {
  cancelOpening()
  cancelArtistOpening()
  goToArtists()
 }, [cancelOpening, cancelArtistOpening, goToArtists])

 const mainHomeLink = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (route.kind === 'home') {
   cancelOpening()
   scrollToPosition(0, reducedMotion)
  } else returnToHome()
 }

 const galleryLink = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (route.kind === 'gallery') {
   cancelOpening()
   scrollToPosition(0, reducedMotion)
  } else returnToGallery()
 }

 const tracksLink = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (route.kind === 'tracks') {
   cancelOpening()
   scrollToPosition(0, reducedMotion)
  } else returnToTracks()
 }

 const artistsLink = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (route.kind === 'artists') {
   cancelOpening()
   scrollToPosition(0, reducedMotion)
  } else returnToArtists()
 }

 const registerLink = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  cancelOpening()
  cancelArtistOpening()
  goToRegister()
 }

 const profileLink = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  cancelOpening()
  cancelArtistOpening()
  goToProfile()
 }

 useEffect(() => {
  const onKey = (event: KeyboardEvent) => {
   const target = event.target as HTMLElement | null
   if (event.ctrlKey || event.metaKey || event.altKey || target?.isContentEditable || target?.matches('input, textarea, select')) return
   if (artistOpening !== null) {
    if (event.key === 'Escape') {
     if (route.kind === 'artist') returnToAlbum()
     else {
      cancelArtistOpening()
      document.querySelector<HTMLAnchorElement>('.album-rating-card-link')?.focus({ preventScroll: true })
     }
    }
    if (['Escape', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) event.preventDefault()
    return
   }
   if (openingIndex !== null) {
    if (event.key === 'Escape') cancelOpening()
    if (['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) event.preventDefault()
    return
   }
   if (route.kind === 'album' && event.key === 'Escape') {
    event.preventDefault()
    if (openedFromHome) returnToHome()
    else returnToGallery()
    return
   }
   if (route.kind === 'track' && event.key === 'Escape') {
    event.preventDefault()
    if (openedFromHome) returnToHome()
    else returnToTracks()
    return
   }
   if (route.kind === 'month-artist' && event.key === 'Escape') {
    event.preventDefault()
    if (openedFromHome) returnToHome()
    else returnToArtists()
    return
   }
   if (route.kind === 'artist' && event.key === 'Escape') {
    event.preventDefault()
    returnFromArtist()
    return
   }
   if ((route.kind === 'register' || route.kind === 'profile') && event.key === 'Escape') {
    event.preventDefault()
    returnToHome()
    return
   }
   if (!isSceneKind) return
   if (galleryVisible && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault()
    focusAlbum(activeIndex + (event.key === 'ArrowRight' ? 1 : -1))
   } else if (galleryVisible && event.key === 'Enter' && !event.shiftKey && !event.defaultPrevented && !target?.closest('a, button, input, textarea, select, [role="button"], [role="link"]')) {
    event.preventDefault()
    openAlbum(activeIndex)
   }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
 }, [activeIndex, artistOpening, cancelArtistOpening, cancelOpening, focusAlbum, galleryVisible, openAlbum, openedFromHome, openingIndex, returnFromArtist, returnToAlbum, returnToArtists, returnToGallery, returnToHome, returnToTracks, route.kind, isSceneKind])

 const showIntro = isGalleryRoute && openingIndex === null && intro
 const activeAlbum = albums[activeIndex]
 const activeTrack = tracks[activeIndex]
 const activeMonthArtist = monthArtists[activeIndex]
 const sectionLabel = artistIndex !== null ? 'ИСПОЛНИТЕЛЬ'
  : detailIndex !== null ? 'АЛЬБОМ'
  : trackIndex !== null ? 'ТРЕК'
  : monthArtistIndex !== null ? 'ИСПОЛНИТЕЛЬ МЕСЯЦА'
  : route.kind === 'home' ? 'ГЛАВНАЯ'
  : route.kind === 'tracks' ? 'ТРЕКИ · ОБЛАКА'
  : route.kind === 'artists' ? 'ИСПОЛНИТЕЛИ · ОКЕАН'
  : route.kind === 'profile' ? 'ПРОФИЛЬ'
  : route.kind === 'register' ? 'РЕГИСТРАЦИЯ'
  : 'АЛЬБОМЫ'
 const header = <header className={isDetailPage ? 'album-header' : ''}>
   <a className="site-logo" href="/" onClick={mainHomeLink} aria-label="Album Awards — на главную"><img src="/logo-transparent.png" alt="Album Awards" /></a>
   <span>СЕЗОН 2026 <i> / {sectionLabel}</i></span>
   {!isDetailPage && route.kind !== 'not-found' && (
    <nav className="scene-tabs" aria-label="Навигация премии">
     <a className={`scene-tab${route.kind === 'home' ? ' is-active' : ''}`} href="/" onClick={mainHomeLink} aria-current={route.kind === 'home' ? 'page' : undefined}>
      Главная
     </a>
     <a className={`scene-tab${route.kind === 'gallery' ? ' is-active' : ''}`} href="/albums" onClick={galleryLink} aria-current={route.kind === 'gallery' ? 'page' : undefined}>
      Альбомы
     </a>
     <a className={`scene-tab${route.kind === 'tracks' ? ' is-active' : ''}`} href="/tracks" onClick={tracksLink} aria-current={route.kind === 'tracks' ? 'page' : undefined}>
      Треки
     </a>
     <a className={`scene-tab${route.kind === 'artists' ? ' is-active' : ''}`} href="/month-artists" onClick={artistsLink} aria-current={route.kind === 'artists' ? 'page' : undefined}>
      Исполнители
     </a>
     {isAuthenticated && user?.nickname ? (
      <a className={`scene-tab${route.kind === 'profile' ? ' is-active' : ''}`} href="/profile" onClick={profileLink} aria-current={route.kind === 'profile' ? 'page' : undefined}>
       {user.nickname}
      </a>
     ) : (
      <a className={`scene-tab${route.kind === 'register' ? ' is-active' : ''}`} href="/register" onClick={registerLink} aria-current={route.kind === 'register' ? 'page' : undefined}>
       Регистрация
      </a>
     )}
    </nav>
   )}
   {isDetailPage
     ? <button
        className="album-close-button"
        type="button"
        onClick={artistIndex !== null ? returnFromArtist : openedFromHome ? returnToHome : monthArtistIndex !== null ? returnToArtists : trackIndex !== null ? returnToTracks : returnToGallery}
        aria-label={artistIndex !== null ? 'Закрыть страницу исполнителя' : monthArtistIndex !== null ? 'Закрыть страницу исполнителя месяца' : trackIndex !== null ? 'Закрыть страницу трека' : 'Закрыть страницу альбома'}
        title={artistIndex !== null ? 'Назад · Esc' : openedFromHome ? 'На главную · Esc' : monthArtistIndex !== null ? 'К исполнителям · Esc' : trackIndex !== null ? 'К трекам · Esc' : 'К альбомам · Esc'}
       >
       Закрыть
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 4 16 16M20 4 4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" /></svg>
      </button>
     : route.kind === 'not-found' && <a className="header-gallery-link" href="/" onClick={mainHomeLink}>← На главную</a>}
  </header>
 return <div className={`album-app${isDetailPage ? ' is-album-page' : ''}${openingIndex !== null ? ' is-opening' : ''}${artistOpening !== null ? ' is-artist-opening' : ''}`} aria-busy={openingIndex !== null || artistOpening !== null}>
  {route.kind !== 'not-found' && <div
   ref={stageRef}
   className={`canvas${isDetailPage ? ' canvas--album' : ''}`}
   tabIndex={isGalleryRoute && galleryVisible && openingIndex === null ? 0 : undefined}
   role={isGalleryRoute ? 'region' : undefined}
   aria-label={
    route.kind === 'gallery'
     ? (galleryVisible ? `Галерея альбомов. ${activeAlbum.title}, ${activeAlbum.artist}` : 'Галерея альбомов')
     : route.kind === 'tracks'
      ? (galleryVisible ? `Галерея треков. ${activeTrack.title}, ${activeTrack.artist}` : 'Галерея треков')
      : route.kind === 'artists'
       ? (galleryVisible ? `Галерея исполнителей месяца. ${activeMonthArtist.title}, ${activeMonthArtist.month}` : 'Галерея исполнителей месяца')
       : undefined
   }
   aria-keyshortcuts={isGalleryRoute && galleryVisible ? 'ArrowLeft ArrowRight Enter' : undefined}
  >
   <SceneBoundary>
    <Canvas camera={{ position: [0, 22, .01], fov: 48, near: .1, far: 100 }} dpr={renderDpr} gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
     fallback={<div className="fallback">Для этой сцены нужен браузер с WebGL.</div>}>
     <RenderQuality onDprChange={setRenderDpr} enabled={stageVisible}>
      <Suspense fallback={null}>
       <Scene key={isArtistsMode ? 'artists' : isTracksMode ? 'tracks' : 'albums'} mode={isArtistsMode ? 'artists' : isTracksMode ? 'tracks' : 'albums'} settings={settings} scroll={scroll} detailScroll={detailScroll} pointerEnabled={stageVisible && openingIndex === null && artistOpening === null && route.kind !== 'home' && route.kind !== 'register' && route.kind !== 'profile'} selectedIndex={wheelSceneIndex ?? openingIndex} detailMode={sceneIndex !== null} transitioning={openingIndex !== null} onSelect={openAlbum} onActiveChange={setActiveIndex} />
      </Suspense>
      {import.meta.env.DEV && new URLSearchParams(location.search).has('perf') && <FrameProfiler />}
     </RenderQuality>
    </Canvas>
   </SceneBoundary>
  </div>}
  {artistIndex === null && header}
  <img className={`center-logo ${showIntro ? 'visible' : ''}`} src={isArtistsMode ? '/logo-transparent-water.png?v=2' : isTracksMode ? '/logo-transparent-cloud.png' : '/logo-transparent-stone.png'} alt="" />
  {loading && artistIndex === null && isSceneKind && <div className="loading-screen" role="status">Загружаем обложки <span>{Math.round(loadingProgress)}%</span></div>}
  {openingIndex !== null && <div className="scene-opening"><span className="sr-only" role="status">Открываем {route.kind === 'artists' ? `исполнителя ${monthArtists[openingIndex].title}` : route.kind === 'tracks' ? `трек ${tracks[openingIndex].title}` : `альбом ${albums[openingIndex].title}`}</span></div>}
  {route.kind === 'home' && <HomePage
   onOpenAlbum={(index, vote) => goToAlbum(index, vote)}
   onOpenTrack={(index, vote) => goToTrack(index, vote)}
   onOpenArtist={(targetArtistIdx, fromReleaseIdx, fromMode) => goToArtist(targetArtistIdx, fromReleaseIdx, fromMode)}
   onNavigateToAlbumsWheel={goToGallery}
   onNavigateToTracksWheel={goToTracks}
   onNavigateToArtistsWheel={goToArtists}
  />}
  {detailIndex !== null && <AlbumVotePage
   album={allAlbums[detailIndex]}
   index={detailIndex}
   onBack={openedFromHome ? returnToHome : returnToGallery}
   backHref={openedFromHome ? '/' : '/albums'}
   backLabel={openedFromHome ? 'На главную' : 'К альбомам'}
   directVote={isDirectVote}
   artistHref={artistPath(artists.indexOf(getAlbumArtist(allAlbums[detailIndex]))) + window.location.search}
   onArtistOpen={event => openArtist(event, detailIndex, 'album')}
   onSelectArtist={targetArtistIdx => goToArtist(targetArtistIdx, detailIndex, 'album')}
   reducedMotion={reducedMotion}
  />}
  {trackIndex !== null && (() => {
   const currentTrack = allTracks[trackIndex]
   const matchingAlbumIdx = allAlbums.findIndex(a => a.id === currentTrack.albumId || a.title.toLowerCase() === currentTrack.albumTitle.toLowerCase())
   return <TrackVotePage
    track={currentTrack}
    index={trackIndex}
    onBack={openedFromHome ? returnToHome : returnToTracks}
    backHref={openedFromHome ? '/' : '/tracks'}
    backLabel={openedFromHome ? 'На главную' : 'К трекам'}
    directVote={isDirectVote}
    onOpenAlbum={matchingAlbumIdx >= 0 ? () => goToAlbum(matchingAlbumIdx, true) : undefined}
    albumHref={matchingAlbumIdx >= 0 ? albumPath(matchingAlbumIdx) + window.location.search + '#vote' : undefined}
    artistHref={artistPath(artists.indexOf(getTrackArtist(currentTrack))) + window.location.search}
    onArtistOpen={event => openArtist(event, trackIndex, 'track')}
    onSelectArtist={targetArtistIdx => goToArtist(targetArtistIdx, trackIndex, 'track')}
    reducedMotion={reducedMotion}
   />
  })()}
  {monthArtistIndex !== null && <MonthArtistVotePage monthArtist={monthArtists[monthArtistIndex]} index={monthArtistIndex} onBack={openedFromHome ? returnToHome : returnToArtists} artistHref={artistPath(artists.indexOf(getMonthArtist(monthArtists[monthArtistIndex]))) + window.location.search} onArtistOpen={event => openArtist(event, monthArtistIndex, 'month-artist')} reducedMotion={reducedMotion} />}
  {artistIndex !== null && artistAlbumIndex !== null && <ArtistCardTransition
   album={artistFromMonthArtist ? monthArtistAsCardAlbum(monthArtists[artistAlbumIndex]) : artistFromTrack ? trackAsCardAlbum(allTracks[artistAlbumIndex]) : allAlbums[artistAlbumIndex]}
   index={artistAlbumIndex}
   fromTrack={artistFromTrack}
   fromMonthArtist={artistFromMonthArtist}
   source={artistOpening?.source ?? null}
   onDone={cancelArtistOpening}
  >
   {header}
   <ArtistPage
    artist={artists[artistIndex]}
    album={artistFromMonthArtist ? monthArtistAsCardAlbum(monthArtists[artistAlbumIndex]) : artistFromTrack ? trackAsCardAlbum(allTracks[artistAlbumIndex]) : allAlbums[artistAlbumIndex]}
    track={artistFromTrack ? allTracks[artistAlbumIndex] : undefined}
    fromTrack={artistFromTrack}
    fromMonthArtist={artistFromMonthArtist}
    onBack={returnFromArtist}
    onOpenAlbum={index => goToAlbum(index, true)}
    onOpenTrack={index => goToTrack(index, true)}
    onOpenArtist={targetArtistIdx => goToArtist(targetArtistIdx, artistAlbumIndex, artistFromMonthArtist ? 'month-artist' : artistFromTrack ? 'track' : 'album')}
    opening={artistOpening !== null}
   />
  </ArtistCardTransition>}
  {artistOpening !== null && <span className="sr-only" role="status">Открываем страницу исполнителя {artistOpening.fromMode === 'month-artist' ? monthArtists[artistOpening.albumIndex].title : artistOpening.fromMode === 'track' ? allTracks[artistOpening.albumIndex].artist : allAlbums[artistOpening.albumIndex].artist}</span>}
  {route.kind === 'register' && <RegistrationPage onNavigateToGallery={goToGallery} onNavigateToTracks={goToTracks} onNavigateToProfile={goToProfile} />}
  {route.kind === 'profile' && (
   <UserProfilePage
    onNavigateToGallery={goToGallery}
    onNavigateToTracks={goToTracks}
    onNavigateToRegister={goToRegister}
    onNavigateToAlbum={goToAlbum}
    onNavigateToTrack={goToTrack}
    onNavigateToMonthArtist={goToMonthArtist}
    onNavigateToArtist={targetArtistIdx => goToArtist(targetArtistIdx, 0, 'album')}
   />
  )}
  {route.kind === 'not-found' && <main className="album-not-found"><p>404</p><h1>Страница не найдена</h1><a href="/" onClick={mainHomeLink}>Вернуться на главную ↗</a></main>}
  {isGalleryRoute && <div className="scroll-space" style={{ height: `${(TOTAL_SCROLL_PAGES + 1) * 100}vh` }} aria-hidden="true" />}
 </div>
}

// Keep one React/WebGL tree when Vite refreshes this entry during shader work.
const root: Root = import.meta.hot?.data.reactRoot ?? createRoot(document.getElementById('root')!)
if (import.meta.hot) import.meta.hot.data.reactRoot = root
root.render(<StrictMode><App /></StrictMode>)
