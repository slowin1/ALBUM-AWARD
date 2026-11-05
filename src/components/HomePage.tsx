import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import {
  allAlbums,
  allTracks,
  artists,
  getReleaseArtists,
  getCatalogSnapshot,
  loadCatalog,
  type ApiAlbum,
  type ApiTrack,
  type ArtistDefinition,
} from '../data/artists'
import { useAllUserRatings, type AlbumScores } from '../hooks/useAlbumRatings'
import { playOrToggleAlbum, playOrToggleTrack, useReleasePlayback } from '../hooks/useAudioPlayer'
import { getAuthToken, useAuth } from '../hooks/useAuth'
import { albumPath, artistPath, trackPath } from '../navigation/albumNavigation'
import './HomePage.css'

type HomePageProps = {
  onOpenAlbum: (index: number, vote?: boolean) => void
  onOpenTrack: (index: number, vote?: boolean) => void
  onOpenArtist: (artistIndex: number, fromReleaseIndex: number, fromMode: 'album' | 'track') => void
  onNavigateToAlbumsWheel: () => void
  onNavigateToTracksWheel: () => void
  onNavigateToArtistsWheel: () => void
}

type ReleaseFilter = 'all' | 'albums' | 'tracks'

type FeedRelease = {
  uid: string
  kind: 'album' | 'track'
  index: number
  id: string
  title: string
  artist: string
  year: number
  cover: string
  baseScore: number
  soundcloudUrl?: string
  soundcloudTrackId?: string
}

type FreshmanCard = {
  artist: ArtistDefinition
  artistIndex: number
  breakoutTitle: string
  releasesCount: number
}

type FeedReview = {
  uid: string
  reviewId: string
  authorId: string
  likedByMe: boolean
  isUserReview?: boolean
  verified?: boolean
  baseLikes: number
  authorName: string
  authorInitials: string
  authorAvatar?: string
  timeLabel: string
  kind: 'album' | 'track'
  releaseIndex: number
  releaseTitle: string
  releaseArtist: string
  releaseCover: string
  scores: AlbumScores
  totalScore: number
  reviewTitle: string
  reviewText: string
}

const PRIORITY_RELEASES: Array<{ kind: 'album' | 'track'; id: string; baseScore: number }> = []

const FRESHMEN_SLUGS: Array<{ id: string; tag: string }> = []

type ApiReview = {
  id: string
  userId: string
  targetId: string
  targetType: string
  albumId: string | null
  trackId: string | null
  title: string | null
  text: string
  rhymesScore: number
  structureScore: number
  styleScore: number
  individualityScore: number
  atmosphereScore: number
  totalScore: number
  likesCount: number
  createdAt: string
  user?: { id: string; nickname: string; avatarUrl?: string | null; avatarSymbol?: string | null }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'только что'
  if (min < 60) return `${min} мин назад`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours} ч назад`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} дн назад`
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

function normalizeQuery(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, 'е')
}

function getInitials(name: string): string {
  const cleaned = name.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, ' ').trim()
  if (!cleaned) return 'AA'
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

function deterministicScore(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return 78 + (Math.abs(hash) % 16)
}

function ReleasePlayTrigger({
  targetKey,
  title,
  onTrigger,
}: {
  targetKey: string
  title: string
  onTrigger: () => void
}) {
  const status = useReleasePlayback(targetKey)
  const isActive = status !== 'idle'
  const isPlaying = status === 'playing'
  const isLoading = status === 'loading'

  return (
    <button
      type="button"
      className={`home-release-play-btn${isActive ? ' is-active' : ''}${isPlaying ? ' is-playing' : ''}`}
      aria-label={isPlaying ? `Пауза: ${title}` : `Слушать: ${title}`}
      title={isPlaying ? 'Пауза' : 'Слушать'}
      onPointerDown={e => e.stopPropagation()}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onTrigger()
      }}
    >
      {isLoading ? (
        <span className="home-play-spinner" aria-hidden="true" />
      ) : isPlaying ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
          <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="home-play-tri">
          <path d="M7.5 5.4c0-.85.94-1.36 1.66-.9l9.4 6c.66.42.66 1.38 0 1.8l-9.4 6c-.72.46-1.66-.05-1.66-.9v-12z" />
        </svg>
      )}
    </button>
  )
}

function ReviewPlayTrigger({
  targetKey,
  title,
  onTrigger,
}: {
  targetKey: string
  title: string
  onTrigger: () => void
}) {
  const status = useReleasePlayback(targetKey)
  const isActive = status !== 'idle'
  const isPlaying = status === 'playing'
  const isLoading = status === 'loading'

  return (
    <button
      type="button"
      className={`home-review-icon-btn${isActive ? ' is-active' : ''}`}
      aria-label={isPlaying ? `Пауза: ${title}` : `Слушать: ${title}`}
      title={isPlaying ? `Пауза: ${title}` : `Слушать: ${title}`}
      onClick={onTrigger}
    >
      {isLoading ? (
        <span className="home-play-spinner is-light" aria-hidden="true" />
      ) : isPlaying ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
          <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.5 5.4c0-.85.94-1.36 1.66-.9l9.4 6c.66.42.66 1.38 0 1.8l-9.4 6c-.72.46-1.66-.05-1.66-.9v-12z" />
        </svg>
      )}
    </button>
  )
}

export function HomePage({
  onOpenAlbum,
  onOpenTrack,
  onOpenArtist,
  onNavigateToAlbumsWheel,
  onNavigateToTracksWheel,
  onNavigateToArtistsWheel,
}: HomePageProps) {
  const { user } = useAuth()
  const { items: userRatings } = useAllUserRatings()
  const [search, setSearch] = useState('')
  const [releaseFilter, setReleaseFilter] = useState<ReleaseFilter>('all')
  const [reviewFilter, setReviewFilter] = useState<ReleaseFilter>('all')
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})
  const [apiReviews, setApiReviews] = useState<ApiReview[]>([])
  const [myLikedIds, setMyLikedIds] = useState<Set<string>>(new Set())
  const [likeOverrides, setLikeOverrides] = useState<Record<string, { liked: boolean; count: number }>>({})
  const [openScoreReviews, setOpenScoreReviews] = useState<Record<string, boolean>>({})
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({})
  const [customTracks, setCustomTracks] = useState<ApiTrack[]>(() => getCatalogSnapshot().singles)
  const [customAlbums, setCustomAlbums] = useState<ApiAlbum[]>(() => getCatalogSnapshot().albums)
  const releasesRowRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({ active: false, startX: 0, scrollLeft: 0, dragged: false })
  const glareFrameRef = useRef(0)
  const glarePendingRef = useRef<{ el: HTMLElement; clientX: number; clientY: number } | null>(null)

  // Каталог целиком приходит с сервера; здесь только подписка на его обновления.
  useEffect(() => {
    const apply = () => {
      const snapshot = getCatalogSnapshot()
      setCustomTracks(snapshot.singles)
      setCustomAlbums(snapshot.albums)
    }
    const load = () => void loadCatalog()
    apply()
    load()
    window.addEventListener('aa:artists_synced', apply)
    window.addEventListener('aa:custom_tracks_updated', load)
    window.addEventListener('aa:scene_updated', load)
    return () => {
      window.removeEventListener('aa:artists_synced', apply)
      window.removeEventListener('aa:custom_tracks_updated', load)
      window.removeEventListener('aa:scene_updated', load)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (glareFrameRef.current) cancelAnimationFrame(glareFrameRef.current)
    }
  }, [])

  const changeReleaseFilter = (next: ReleaseFilter) => {
    setReleaseFilter(next)
    if (releasesRowRef.current) {
      releasesRowRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  const scrollReleasesRow = (direction: -1 | 1) => {
    const row = releasesRowRef.current
    if (!row) return
    const step = Math.max(320, Math.round(row.clientWidth * 0.78))
    row.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const onRowPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || event.button !== 0) return
    const row = releasesRowRef.current
    if (!row) return
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: row.scrollLeft,
      dragged: false,
    }
  }

  const onRowPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current
    const row = releasesRowRef.current
    if (!state.active || !row) return
    const dx = event.clientX - state.startX
    if (Math.abs(dx) > 6) {
      state.dragged = true
      row.scrollLeft = state.scrollLeft - dx
    }
  }

  const endRowDrag = () => {
    dragStateRef.current.active = false
    window.setTimeout(() => {
      dragStateRef.current.dragged = false
    }, 0)
  }

  const updateLiquidGlare = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    glarePendingRef.current = {
      el: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
    }
    if (glareFrameRef.current) return
    glareFrameRef.current = requestAnimationFrame(() => {
      glareFrameRef.current = 0
      const pending = glarePendingRef.current
      if (!pending) return
      const rect = pending.el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const gx = Math.round(((pending.clientX - rect.left) / rect.width) * 100)
      const gy = Math.round(((pending.clientY - rect.top) / rect.height) * 100)
      pending.el.style.setProperty('--gx', `${gx}%`)
      pending.el.style.setProperty('--gy', `${gy}%`)
    })
  }

  const markBroken = (key: string) => {
    setBrokenImages(prev => (prev[key] ? prev : { ...prev, [key]: true }))
  }

  const userScoreMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of userRatings) {
      map.set(item.id, item.totalScore)
    }
    return map
  }, [userRatings])

  const allFeedReleases = useMemo<FeedRelease[]>(() => {
    const list: FeedRelease[] = []
    const seen = new Set<string>()

    // Prepend user-added SoundCloud albums from Admin panel
    for (const ca of customAlbums) {
      const idx = allAlbums.findIndex(a => a.id === ca.id)
      if (idx < 0) continue
      const uid = `album:${ca.id}`
      if (!seen.has(uid)) {
        seen.add(uid)
        list.push({
          uid,
          kind: 'album',
          index: idx,
          id: ca.id,
          title: ca.title,
          artist: ca.artist,
          year: ca.year || 2026,
          cover: ca.cover,
          baseScore: deterministicScore(ca.id),
          soundcloudUrl: ca.soundcloudUrl,
          soundcloudTrackId: ca.soundcloudPlaylistId,
        })
      }
    }

    // Prepend user-added SoundCloud releases from Admin panel so they appear first in the feed
    for (const ct of customTracks) {
      const idx = allTracks.findIndex(t => t.id === ct.id)
      if (idx < 0) continue
      const uid = `track:${ct.id}`
      if (!seen.has(uid)) {
        seen.add(uid)
        list.push({
          uid,
          kind: 'track',
          index: idx,
          id: ct.id,
          title: ct.title,
          artist: ct.artist,
          year: 2026,
          cover: ct.cover,
          baseScore: deterministicScore(ct.id),
          soundcloudUrl: ct.soundcloudUrl,
          soundcloudTrackId: ct.soundcloudTrackId,
        })
      }
    }

    for (const entry of PRIORITY_RELEASES) {
      if (entry.kind === 'album') {
        const idx = allAlbums.findIndex(a => a.id === entry.id)
        if (idx >= 0) {
          const alb = allAlbums[idx]
          const uid = `album:${alb.id}`
          if (!seen.has(uid)) {
            seen.add(uid)
            list.push({
              uid,
              kind: 'album',
              index: idx,
              id: alb.id,
              title: alb.title,
              artist: alb.artist,
              year: alb.year,
              cover: alb.cover,
              baseScore: entry.baseScore,
            })
          }
        }
      } else {
        const idx = allTracks.findIndex(t => t.id === entry.id)
        if (idx >= 0) {
          const trk = allTracks[idx]
          const uid = `track:${trk.id}`
          if (!seen.has(uid)) {
            seen.add(uid)
            list.push({
              uid,
              kind: 'track',
              index: idx,
              id: trk.id,
              title: trk.title,
              artist: trk.artist,
              year: trk.year,
              cover: trk.cover,
              baseScore: entry.baseScore,
            })
          }
        }
      }
    }

    // Append remaining recent albums & tracks sorted by year desc so search covers everything
    const rest: FeedRelease[] = []
    allAlbums.forEach((alb, idx) => {
      const uid = `album:${alb.id}`
      if (!seen.has(uid)) {
        seen.add(uid)
        rest.push({
          uid,
          kind: 'album',
          index: idx,
          id: alb.id,
          title: alb.title,
          artist: alb.artist,
          year: alb.year,
          cover: alb.cover,
          baseScore: deterministicScore(uid),
        })
      }
    })
    allTracks.forEach((trk, idx) => {
      const uid = `track:${trk.id}`
      if (!seen.has(uid)) {
        seen.add(uid)
        rest.push({
          uid,
          kind: 'track',
          index: idx,
          id: trk.id,
          title: trk.title,
          artist: trk.artist,
          year: trk.year,
          cover: trk.cover,
          baseScore: deterministicScore(uid),
        })
      }
    })
    rest.sort((a, b) => b.year - a.year)
    return [...list, ...rest]
  }, [customAlbums, customTracks])

  const freshmen = useMemo<FreshmanCard[]>(() => {
    const result: FreshmanCard[] = []
    for (const item of FRESHMEN_SLUGS) {
      const idx = artists.findIndex(a => a.id === item.id)
      if (idx < 0) continue
      const artist = artists[idx]
      const releasesCount = artist.albums.length + artist.tracks.length
      const latestAlbum = artist.albums[0]?.title
      const latestTrack = artist.tracks[0]?.title
      result.push({
        artist,
        artistIndex: idx,
        breakoutTitle: item.tag || latestAlbum || latestTrack || 'Сезон 2026',
        releasesCount: Math.max(1, releasesCount),
      })
    }
    return result
  }, [])

  // Рецензии сообщества приходят с сервера (таблица Review): настоящие авторы, оценки и лайки.
  useEffect(() => {
    let active = true
    fetch('/api/reviews/recent?limit=50')
      .then(res => (res.ok ? res.json() : []))
      .then((data: ApiReview[]) => {
        if (active && Array.isArray(data)) setApiReviews(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [customAlbums, customTracks])

  useEffect(() => {
    const token = getAuthToken()
    if (!token || !user) {
      setMyLikedIds(new Set())
      return
    }
    let active = true
    fetch('/api/reviews/liked/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : []))
      .then((ids: string[]) => {
        if (active && Array.isArray(ids)) setMyLikedIds(new Set(ids))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user])

  const reviews = useMemo<FeedReview[]>(() => {
    const result: FeedReview[] = []
    for (const r of apiReviews) {
      if (r.targetType === 'artist' || r.targetId.startsWith('month-artist:')) continue
      const isTrack = r.targetType === 'track' || r.targetId.startsWith('track:')
      const bareId = r.targetId.replace(/^(track|album):/, '')
      const releaseIndex = isTrack
        ? allTracks.findIndex(t => t.id === (r.trackId ?? bareId))
        : allAlbums.findIndex(a => a.id === (r.albumId ?? bareId))
      if (releaseIndex < 0) continue
      const release = isTrack ? allTracks[releaseIndex] : allAlbums[releaseIndex]
      const scores: AlbumScores = {
        rhymes: r.rhymesScore,
        structure: r.structureScore,
        style: r.styleScore,
        individuality: r.individualityScore,
        atmosphere: r.atmosphereScore,
      }
      const authorName = r.user?.nickname || 'Слушатель'
      result.push({
        uid: `review-${r.id}`,
        reviewId: r.id,
        authorId: r.userId,
        likedByMe: myLikedIds.has(r.id),
        isUserReview: Boolean(user && r.userId === user.id),
        verified: false,
        baseLikes: r.likesCount,
        authorName,
        authorInitials: r.user?.avatarSymbol?.trim() || getInitials(authorName),
        authorAvatar: r.user?.avatarUrl || undefined,
        timeLabel: user && r.userId === user.id ? 'Ваша рецензия' : relativeTime(r.createdAt),
        kind: isTrack ? 'track' : 'album',
        releaseIndex,
        releaseTitle: release.title,
        releaseArtist: release.artist,
        releaseCover: release.cover,
        scores,
        totalScore: r.totalScore,
        reviewTitle: r.title || `${release.artist} — ${release.title}`,
        reviewText: r.text,
      })
    }
    return result
  }, [apiReviews, myLikedIds, user, customAlbums, customTracks])

  const toggleReviewLike = async (rev: FeedReview) => {
    const token = getAuthToken()
    if (!token || !user) return
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(rev.reviewId)}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data: { liked: boolean; likesCount: number } = await res.json()
      setLikeOverrides(prev => ({ ...prev, [rev.reviewId]: { liked: data.liked, count: data.likesCount } }))
    } catch {
      // сеть недоступна — состояние лайка не меняем
    }
  }

  const query = normalizeQuery(search)

  const filteredReleases = useMemo(() => {
    return allFeedReleases.filter(item => {
      if (releaseFilter === 'albums' && item.kind !== 'album') return false
      if (releaseFilter === 'tracks' && item.kind !== 'track') return false
      if (!query) return true
      const haystack = normalizeQuery(
        `${item.title} ${item.artist} ${item.year} ${item.soundcloudUrl ? 'soundcloud саундклауд' : ''}`,
      )
      return haystack.includes(query)
    })
  }, [allFeedReleases, releaseFilter, query])

  const visibleReleases = filteredReleases.slice(0, query ? 36 : 20)

  const filteredFreshmen = useMemo(() => {
    if (!query) return freshmen
    return freshmen.filter(f =>
      normalizeQuery(`${f.artist.name} ${f.breakoutTitle}`).includes(query),
    )
  }, [freshmen, query])

  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      if (reviewFilter === 'albums' && rev.kind !== 'album') return false
      if (reviewFilter === 'tracks' && rev.kind !== 'track') return false
      if (!query) return true
      const haystack = normalizeQuery(
        `${rev.releaseTitle} ${rev.releaseArtist} ${rev.authorName} ${rev.reviewTitle} ${rev.reviewText}`,
      )
      return haystack.includes(query)
    })
  }, [reviews, reviewFilter, query])

  const handleReleaseClick = (event: MouseEvent<HTMLAnchorElement>, item: FeedRelease) => {
    if (dragStateRef.current.dragged) {
      event.preventDefault()
      return
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (item.index < 0) return
    if (item.kind === 'album') onOpenAlbum(item.index, true)
    else onOpenTrack(item.index, true)
  }

  const handlePlayRelease = (item: FeedRelease) => {
    if (item.kind === 'album') {
      const alb = allAlbums[item.index]
      if (alb) void playOrToggleAlbum(alb)
    } else {
      const trk = allTracks[item.index]
      if (!trk) return
      const feedTracks = visibleReleases
        .filter(r => r.kind === 'track')
        .map(r => allTracks[r.index])
        .filter(Boolean)
      playOrToggleTrack(trk, feedTracks.length > 0 ? feedTracks : [trk])
    }
  }

  const handleArtistChipClick = (
    event: MouseEvent<HTMLButtonElement>,
    artistIdx: number,
    releaseIdx: number,
    mode: 'album' | 'track',
  ) => {
    event.preventDefault()
    event.stopPropagation()
    onOpenArtist(artistIdx, releaseIdx, mode)
  }

  const handleFreshmanClick = (event: MouseEvent<HTMLAnchorElement>, item: FreshmanCard) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const firstAlbumIdx = item.artist.albums[0]
      ? allAlbums.findIndex(a => a.id === item.artist.albums[0].id)
      : -1
    const firstTrackIdx = item.artist.tracks[0]
      ? allTracks.findIndex(t => t.id === item.artist.tracks[0].id)
      : -1
    if (firstAlbumIdx >= 0) {
      onOpenArtist(item.artistIndex, firstAlbumIdx, 'album')
    } else if (firstTrackIdx >= 0) {
      onOpenArtist(item.artistIndex, firstTrackIdx, 'track')
    } else {
      onOpenArtist(item.artistIndex, 0, 'album')
    }
  }

  const handleSceneLink = (event: MouseEvent<HTMLAnchorElement>, navigate: () => void) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate()
  }

  return (
    <main className="home-page">
      <div className="home-container">
        {/* Top Hero & Search Bar */}
        <section className="home-top-bar" aria-label="Навигация и поиск">
          <div className="home-heading-block">
            <h1 className="home-title">Главная</h1>
          </div>

          <div className="home-controls-row">
            <div className="home-search-wrap">
              <svg className="home-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7.2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                className="home-search-input"
                placeholder="Поиск релизов, фрешменов и рецензий..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Поиск релизов, фрешменов и рецензий"
              />
              {search && (
                <button
                  type="button"
                  className="home-search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Очистить поиск"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="home-scene-pills" aria-label="3D сцены">
              <a
                href="/albums"
                className="home-scene-pill"
                onClick={e => handleSceneLink(e, onNavigateToAlbumsWheel)}
              >
                Премия Альбомы месяца<span aria-hidden="true"></span>
              </a>
              <a
                href="/tracks"
                className="home-scene-pill"
                onClick={e => handleSceneLink(e, onNavigateToTracksWheel)}
              >
                Премия Треки месяца<span aria-hidden="true"></span>
              </a>
              <a
                href="/month-artists"
                className="home-scene-pill"
                onClick={e => handleSceneLink(e, onNavigateToArtistsWheel)}
              >
              Премия Исполнители месяца <span aria-hidden="true"></span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 1: ДОБАВЛЕННЫЕ РЕЛИЗЫ */}
        <section className="home-section" aria-labelledby="home-releases-heading">
          <div className="home-section-header">
            <h2 id="home-releases-heading" className="home-section-title">Добавленные релизы</h2>
            <span className="home-section-line" aria-hidden="true" />
            <div className="home-releases-header-controls">
              <div className="home-filter-tabs" role="tablist" aria-label="Фильтр релизов">
                <button
                  type="button"
                  role="tab"
                  aria-selected={releaseFilter === 'all'}
                  className={`home-filter-tab${releaseFilter === 'all' ? ' is-active' : ''}`}
                  onClick={() => changeReleaseFilter('all')}
                >
                  Все
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={releaseFilter === 'albums'}
                  className={`home-filter-tab${releaseFilter === 'albums' ? ' is-active' : ''}`}
                  onClick={() => changeReleaseFilter('albums')}
                >
                  Альбомы
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={releaseFilter === 'tracks'}
                  className={`home-filter-tab${releaseFilter === 'tracks' ? ' is-active' : ''}`}
                  onClick={() => changeReleaseFilter('tracks')}
                >
                  Треки
                </button>
              </div>

              <div className="home-row-arrows" aria-label="Прокрутка релизов">
                <button
                  type="button"
                  className="home-row-arrow-btn"
                  onClick={() => scrollReleasesRow(-1)}
                  aria-label="Прокрутить релизы влево"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="home-row-arrow-btn"
                  onClick={() => scrollReleasesRow(1)}
                  aria-label="Прокрутить релизы вправо"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {visibleReleases.length === 0 ? (
            <div className="home-empty-box">По вашему запросу релизы не найдены.</div>
          ) : (
            <div
              ref={releasesRowRef}
              className="home-releases-row"
              onPointerDown={onRowPointerDown}
              onPointerMove={onRowPointerMove}
              onPointerUp={endRowDrag}
              onPointerCancel={endRowDrag}
              onPointerLeave={endRowDrag}
            >
              {visibleReleases.map(item => {
                const ratingKey = item.kind === 'track' ? `track:${item.id}` : item.id
                const userScore = userScoreMap.get(ratingKey)
                const displayScore = userScore ?? item.baseScore
                const href = `${item.kind === 'album' ? albumPath(item.index) : trackPath(item.index)}#vote`
                const relArtists = getReleaseArtists(item.artist, item.title)
                const imgKey = `rel:${item.uid}`

                return (
                  <a
                    key={item.uid}
                    href={href}
                    className="home-release-card"
                    draggable={false}
                    onPointerMove={updateLiquidGlare}
                    onClick={e => handleReleaseClick(e, item)}
                  >
                    <span className="home-liquid-clip" aria-hidden="true">
                      {!brokenImages[imgKey] && (
                        <img
                          src={item.cover}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="home-liquid-bleed"
                        />
                      )}
                    </span>
                    <div className="home-release-cover-wrap">
                      {!brokenImages[imgKey] ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="home-release-cover"
                          onError={() => markBroken(imgKey)}
                        />
                      ) : (
                        <div className="home-release-fallback">{getInitials(item.title)}</div>
                      )}
                      <span className={`home-release-badge is-${item.kind}`}>
                        {item.kind === 'album' ? 'Альбом' : 'Трек'}
                      </span>
                      <ReleasePlayTrigger
                        targetKey={item.uid}
                        title={item.title}
                        onTrigger={() => handlePlayRelease(item)}
                      />
                      <span
                        className={`home-release-score${userScore !== undefined ? ' is-user' : ''}`}
                        title={userScore !== undefined ? 'Ваша оценка' : 'Средний балл'}
                      >
                        {Math.round(displayScore)}
                      </span>
                    </div>

                    <div className="home-release-meta">
                      <div className="home-release-title-row">
                        <h3 className="home-release-title">{item.title}</h3>
                        <span className="home-release-year">{item.year}</span>
                      </div>

                      <div className="home-release-artists">
                        {relArtists.length > 0 ? (
                          relArtists.slice(0, 3).map((art, i) => {
                            const artIdx = artists.indexOf(art)
                            return (
                              <span key={art.id} className="home-release-artist-token">
                                {i > 0 && <span className="home-release-artist-sep">, </span>}
                                <button
                                  type="button"
                                  className="home-release-artist-btn"
                                  onClick={e => handleArtistChipClick(e, artIdx, item.index, item.kind)}
                                >
                                  {art.name}
                                </button>
                              </span>
                            )
                          })
                        ) : (
                          <span className="home-release-artist-plain">{item.artist}</span>
                        )}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: НОВЫЕ ИМЕНА (ФРЕШМЕНЫ) */}
        <section className="home-section" aria-labelledby="home-freshmen-heading">
          <div className="home-section-header">
            <div className="home-section-title-group">
              <h2 id="home-freshmen-heading" className="home-section-title">Новые имена</h2>
              <span className="home-section-tag">Фрешмены</span>
            </div>
            <span className="home-section-line" aria-hidden="true" />
          </div>

          {filteredFreshmen.length === 0 ? (
            <div className="home-empty-box">Фрешмены по запросу не найдены.</div>
          ) : (
            <div className="home-freshmen-grid">
              {filteredFreshmen.map(item => {
                const imgKey = `fresh:${item.artist.id}`
                return (
                  <a
                    key={item.artist.id}
                    href={artistPath(item.artistIndex)}
                    className="home-freshman-card"
                    onPointerMove={updateLiquidGlare}
                    onClick={e => handleFreshmanClick(e, item)}
                  >
                    <span className="home-liquid-clip" aria-hidden="true">
                      {!brokenImages[imgKey] && item.artist.avatar && (
                        <img
                          src={item.artist.avatar}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="home-liquid-bleed"
                        />
                      )}
                    </span>
                    <div className="home-freshman-avatar-wrap">
                      {!brokenImages[imgKey] && item.artist.avatar ? (
                        <img
                          src={item.artist.avatar}
                          alt={item.artist.name}
                          loading="lazy"
                          decoding="async"
                          className="home-freshman-avatar"
                          onError={() => markBroken(imgKey)}
                        />
                      ) : (
                        <span className="home-freshman-initials">{getInitials(item.artist.name)}</span>
                      )}
                    </div>

                    <div className="home-freshman-info">
                      <h3 className="home-freshman-name">{item.artist.name}</h3>
                      <p className="home-freshman-release">{item.breakoutTitle}</p>
                      <span className="home-freshman-count">
                        {item.releasesCount} {item.releasesCount === 1 ? 'релиз' : item.releasesCount < 5 ? 'релиза' : 'релизов'}
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: НОВЫЕ РЕЦЕНЗИИ */}
        <section className="home-section" aria-labelledby="home-reviews-heading">
          <div className="home-section-header">
            <h2 id="home-reviews-heading" className="home-section-title">Новые рецензии</h2>
            <span className="home-section-line" aria-hidden="true" />
            <div className="home-filter-tabs" role="tablist" aria-label="Фильтр рецензий">
              <button
                type="button"
                role="tab"
                aria-selected={reviewFilter === 'all'}
                className={`home-filter-tab${reviewFilter === 'all' ? ' is-active' : ''}`}
                onClick={() => setReviewFilter('all')}
              >
                Все
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={reviewFilter === 'albums'}
                className={`home-filter-tab${reviewFilter === 'albums' ? ' is-active' : ''}`}
                onClick={() => setReviewFilter('albums')}
              >
                Альбомы
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={reviewFilter === 'tracks'}
                className={`home-filter-tab${reviewFilter === 'tracks' ? ' is-active' : ''}`}
                onClick={() => setReviewFilter('tracks')}
              >
                Треки
              </button>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="home-empty-box">
              {query ? 'Рецензии по вашему запросу не найдены.' : 'Пока нет опубликованных рецензий. Оцените любой трек или альбом, и ваша рецензия появится здесь!'}
            </div>
          ) : (
            <div className="home-reviews-grid">
              {filteredReviews.map(rev => {
                const releaseHref = `${rev.kind === 'album' ? albumPath(rev.releaseIndex) : trackPath(rev.releaseIndex)}#vote`
                const openTarget = (e: MouseEvent<HTMLAnchorElement>) => {
                  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                  e.preventDefault()
                  if (rev.kind === 'album') onOpenAlbum(rev.releaseIndex, true)
                  else onOpenTrack(rev.releaseIndex, true)
                }
                const coverKey = `revcover:${rev.uid}`
                const avatarKey = `revava:${rev.uid}`
                const likeState = likeOverrides[rev.reviewId]
                const isLiked = likeState ? likeState.liked : rev.likedByMe
                const likeCount = likeState ? likeState.count : rev.baseLikes
                const canLike = Boolean(user)
                const isScoresOpen = Boolean(openScoreReviews[rev.uid])
                const isExpanded = Boolean(expandedReviews[rev.uid])

                return (
                  <article
                    key={rev.uid}
                    className="home-review-card"
                    onPointerMove={updateLiquidGlare}
                  >
                    <span className="home-liquid-clip is-review-clip" aria-hidden="true" />

                    {/* Top Banner Pill: Avatar + Nickname + Badge on left, Release Cover on right */}
                    <div className="home-review-banner">
                      <span className="home-review-banner-ambient" aria-hidden="true">
                        {rev.authorAvatar && !brokenImages[avatarKey] && (
                          <img
                            src={rev.authorAvatar}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className="home-review-banner-glow is-left"
                          />
                        )}
                        {!brokenImages[coverKey] && (
                          <img
                            src={rev.releaseCover}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className="home-review-banner-glow is-right"
                          />
                        )}
                      </span>

                      <div className="home-review-author">
                        <div className="home-review-avatar">
                          {rev.authorAvatar && !brokenImages[avatarKey] ? (
                            <img
                              src={rev.authorAvatar}
                              alt={rev.authorName}
                              loading="lazy"
                              decoding="async"
                              onError={() => markBroken(avatarKey)}
                            />
                          ) : (
                            <span>{rev.authorInitials}</span>
                          )}
                        </div>
                        <div className="home-review-name-row">
                          <span className="home-review-author-name">{rev.authorName}</span>
                        </div>
                      </div>

                      <a
                        href={releaseHref}
                        className="home-review-cover-link"
                        onClick={openTarget}
                        title={`${rev.releaseArtist} — ${rev.releaseTitle} (${rev.totalScore}/100)`}
                        aria-label={`Открыть релиз ${rev.releaseArtist} — ${rev.releaseTitle}`}
                      >
                        {!brokenImages[coverKey] ? (
                          <img
                            src={rev.releaseCover}
                            alt={rev.releaseTitle}
                            loading="lazy"
                            decoding="async"
                            className="home-review-cover-thumb"
                            onError={() => markBroken(coverKey)}
                          />
                        ) : (
                          <span className="home-review-cover-fallback">{getInitials(rev.releaseTitle)}</span>
                        )}
                      </a>
                    </div>

                    {/* Review Headline + Text */}
                    <div className="home-review-body">
                      <h3 className={`home-review-headline${isExpanded ? ' is-expanded' : ''}`}>
                        {rev.reviewTitle}
                      </h3>
                      <p className={`home-review-text${isExpanded ? ' is-expanded' : ''}`}>
                        {rev.reviewText}
                      </p>
                    </div>

                    {/* Expandable Score & Criteria Breakdown */}
                    {(isScoresOpen || isExpanded) && (
                      <div className="home-review-scores-drawer" aria-label="Оценки релиза">
                        <div className="home-review-scores-head">
                          <span className="home-review-scores-release">
                            {rev.releaseArtist} — {rev.releaseTitle}
                          </span>
                          <span className="home-review-scores-total">{rev.totalScore} / 100</span>
                        </div>
                        <div className="home-review-criteria">
                          <span className="home-crit-pill">
                            <span className="home-crit-label">Рифмы</span>
                            <span className="home-crit-val">{rev.scores.rhymes}</span>
                          </span>
                          <span className="home-crit-pill">
                            <span className="home-crit-label">Структура</span>
                            <span className="home-crit-val">{rev.scores.structure}</span>
                          </span>
                          <span className="home-crit-pill">
                            <span className="home-crit-label">Стиль</span>
                            <span className="home-crit-val">{rev.scores.style}</span>
                          </span>
                          <span className="home-crit-pill">
                            <span className="home-crit-label">Харизма</span>
                            <span className="home-crit-val">{rev.scores.individuality}</span>
                          </span>
                          <span className="home-crit-pill">
                            <span className="home-crit-label">Вайб</span>
                            <span className="home-crit-val">{rev.scores.atmosphere}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="home-review-bottom">
                      <div className="home-review-bottom-left">
                        <button
                          type="button"
                          className={`home-review-like-btn${isLiked ? ' is-liked' : ''}`}
                          aria-pressed={isLiked}
                          disabled={!canLike}
                          title={!user ? 'Войди, чтобы оценить рецензию' : undefined}
                          onClick={() => void toggleReviewLike(rev)}
                          aria-label={`Нравится рецензия: ${likeCount}`}
                        >
                          <svg width="20" height="19" viewBox="0 0 24 22" fill="none" aria-hidden="true" className="home-review-gem-heart">
                            <path d="M6.8 2L2 6.8L5.2 12.2L12 20.2L18.8 12.2L22 6.8L17.2 2L12 5.2L6.8 2Z" fill="currentColor" fillOpacity="0.35" />
                            <path d="M6.8 2L12 5.2L8.4 9.2L2 6.8L6.8 2Z" fill="currentColor" fillOpacity="0.88" />
                            <path d="M17.2 2L22 6.8L15.6 9.2L12 5.2L17.2 2Z" fill="currentColor" fillOpacity="0.62" />
                            <path d="M2 6.8L8.4 9.2L5.2 12.2L2 6.8Z" fill="currentColor" fillOpacity="0.52" />
                            <path d="M22 6.8L18.8 12.2L15.6 9.2L22 6.8Z" fill="currentColor" fillOpacity="0.32" />
                            <path d="M8.4 9.2L15.6 9.2L12 20.2L8.4 9.2Z" fill="currentColor" fillOpacity="0.72" />
                            <path d="M5.2 12.2L8.4 9.2L12 20.2L5.2 12.2Z" fill="currentColor" fillOpacity="0.55" />
                            <path d="M18.8 12.2L12 20.2L15.6 9.2L18.8 12.2Z" fill="currentColor" fillOpacity="0.42" />
                          </svg>
                          <span className="home-review-like-count">{likeCount}</span>
                        </button>

                        <button
                          type="button"
                          className={`home-review-icon-btn${isScoresOpen ? ' is-active' : ''}`}
                          aria-pressed={isScoresOpen}
                          onClick={() =>
                            setOpenScoreReviews(prev => ({ ...prev, [rev.uid]: !prev[rev.uid] }))
                          }
                          title={`Баллы: ${rev.totalScore} / 100`}
                          aria-label="Показать баллы по критериям"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="5" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.7" />
                            <circle cx="5" cy="12" r="1.7" stroke="currentColor" strokeWidth="1.7" />
                            <circle cx="5" cy="18" r="1.7" stroke="currentColor" strokeWidth="1.7" />
                            <path d="M10 6h10M10 12h10M10 18h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                          </svg>
                        </button>

                        <ReviewPlayTrigger
                          targetKey={
                            rev.kind === 'album'
                              ? `album:${allAlbums[rev.releaseIndex]?.id ?? ''}`
                              : `track:${allTracks[rev.releaseIndex]?.id ?? ''}`
                          }
                          title={`${rev.releaseArtist} — ${rev.releaseTitle}`}
                          onTrigger={() => {
                            if (rev.kind === 'album') {
                              const alb = allAlbums[rev.releaseIndex]
                              if (alb) void playOrToggleAlbum(alb)
                            } else {
                              const trk = allTracks[rev.releaseIndex]
                              if (trk) playOrToggleTrack(trk)
                            }
                          }}
                        />
                      </div>

                      <div className="home-review-bottom-right">
                        <button
                          type="button"
                          className={`home-review-icon-btn${isScoresOpen ? ' is-active' : ''}`}
                          aria-pressed={isScoresOpen}
                          onClick={() =>
                            setOpenScoreReviews(prev => ({ ...prev, [rev.uid]: !prev[rev.uid] }))
                          }
                          title={`${rev.releaseArtist} — ${rev.releaseTitle} (${rev.totalScore}/100)`}
                          aria-label="Карточка оценок релиза"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="7" y="4.5" width="10" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
                            <path d="M3.5 6.5v11M20.5 6.5v11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                          </svg>
                        </button>

                        <a
                          href={releaseHref}
                          className="home-review-icon-btn"
                          onClick={openTarget}
                          title="Перейти к оцениванию релиза"
                          aria-label="Перейти к оцениванию релиза"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="4" y="4" width="16" height="16" rx="3.2" stroke="currentColor" strokeWidth="1.7" />
                            <path d="M9.5 14.5L15 9M10.2 9H15v4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>

                        <button
                          type="button"
                          className={`home-review-icon-btn${isExpanded ? ' is-active' : ''}`}
                          aria-pressed={isExpanded}
                          onClick={() =>
                            setExpandedReviews(prev => ({ ...prev, [rev.uid]: !prev[rev.uid] }))
                          }
                          title={isExpanded ? 'Свернуть рецензию' : 'Читать полностью'}
                          aria-label={isExpanded ? 'Свернуть рецензию' : 'Читать полностью'}
                        >
                          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M2.2 12S5.8 5.5 12 5.5 21.8 12 21.8 12 18.2 18.5 12 18.5 2.2 12 2.2 12z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinejoin="round"
                            />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
