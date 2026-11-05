import { useState, useEffect, useRef, useMemo, type FormEvent, type ChangeEvent } from 'react'
import { FluidBackground } from './FluidBackground'
import { AdminOverview } from './AdminOverview'
import { playOrToggleTrack, useReleasePlayback } from '../hooks/useAudioPlayer'
import { getAuthToken, useAuth } from '../hooks/useAuth'
import { artists, allTracks, loadCatalog, type ArtistDefinition } from '../data/artists'
import {
  albums as sceneDefaultAlbums,
  updateSceneAlbumSlot,
  type AlbumDefinition,
} from '../data/albums'
import {
  tracks as sceneDefaultTracks,
  updateSceneTrackSlot,
  setSceneTracks,
  type TrackDefinition,
} from '../data/tracks'
import {
  monthArtists as sceneDefaultArtists,
  updateSceneArtistSlot,
  type MonthArtist,
} from '../data/monthArtists'
import './AdminTracksPage.css'

export type CustomSoundCloudTrack = {
  id: string
  title: string
  artist: string
  artistId?: string
  artistIds?: string[]
  albumTitle: string
  cover: string
  duration?: string
  soundcloudUrl: string
  soundcloudTrackId?: string
  createdAt: string
}

export type CustomSoundCloudAlbumTrack = {
  id: string
  title: string
  artist: string
  artistId?: string
  artistIds?: string[]
  duration: string
  soundcloudUrl: string
  soundcloudTrackId: string
  cover: string
}

export type CustomSoundCloudAlbum = {
  id: string
  title: string
  artist: string
  artistId?: string
  artistIds?: string[]
  year: number
  cover: string
  soundcloudUrl: string
  soundcloudPlaylistId?: string
  tracks: CustomSoundCloudAlbumTrack[]
  createdAt: string
}

export type AdminTracksPageProps = {
  onBackToHome: () => void
  onNavigateToRegister?: () => void
}

/** Разбор строки «A, B & C» для чипов выбора — только отображение, связи артистов строит сервер. */
function splitCredit(value: string): string[] {
  return value
    .split(/\s*(?:,|&|\bfeat\.?|\bft\.?|\bx\b)\s*/i)
    .map(n => n.trim())
    .filter(Boolean)
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = getAuthToken()
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

type PreviewData =
  | {
      type: 'album'
      title: string
      artist: string
      artistId?: string
      artistIds?: string[]
      cover: string
      year: number
      soundcloudUrl: string
      soundcloudPlaylistId?: string
      tracksCount: number
      tracks: CustomSoundCloudAlbumTrack[]
    }
  | {
      type: 'track'
      title: string
      artist: string
      artistId?: string
      artistIds?: string[]
      cover: string
      duration?: string
      soundcloudUrl: string
      soundcloudTrackId?: string
    }

type AdminSection = 'overview' | 'link' | 'track' | 'album' | 'scene' | 'catalog'

const ADMIN_SECTIONS: Record<AdminSection, { nav: string; title: string; desc: string }> = {
  overview: {
    nav: 'Обзор',
    title: 'Обзор',
    desc: 'Что сейчас в каталоге, сколько слотов сцены заполнено и какие релизы стоит поправить.',
  },
  link: {
    nav: 'По ссылке',
    title: 'Импорт по ссылке',
    desc: 'Вставьте ссылку на трек или плейлист SoundCloud: название, обложка и треклист подтянутся сами. Перед сохранением всё можно поправить.',
  },
  track: {
    nav: 'Трек вручную',
    title: 'Новый трек',
    desc: 'Название, исполнители, обложка и ссылка на аудио. Трек появится в ленте на главной сразу после сохранения.',
  },
  album: {
    nav: 'Альбом вручную',
    title: 'Новый альбом',
    desc: 'Соберите альбом с обложкой, годом выпуска и треклистом. У каждого трека может быть свой исполнитель или фит.',
  },
  scene: {
    nav: '3D-сцена',
    title: '3D-сцена',
    desc: 'По двенадцать слотов в каждом колесе. Назначьте релиз из базы или заполните слот вручную — сцена обновится после сохранения слота.',
  },
  catalog: {
    nav: 'Каталог',
    title: 'Каталог релизов',
    desc: 'Все треки и альбомы в базе данных. Отсюда их можно прослушать, отредактировать или убрать из ленты.',
  },
}

const ADMIN_NAV_GROUPS: { label: string; items: AdminSection[] }[] = [
  { label: '', items: ['overview'] },
  { label: 'Добавить релиз', items: ['link', 'track', 'album'] },
  { label: 'Управление', items: ['catalog', 'scene'] },
]

function AdminNavIcon({ name }: { name: AdminSection }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'overview':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="2" />
          <rect x="14" y="3" width="7" height="5" rx="2" />
          <rect x="14" y="12" width="7" height="9" rx="2" />
          <rect x="3" y="16" width="7" height="5" rx="2" />
        </svg>
      )
    case 'link':
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    case 'track':
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    case 'album':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    case 'scene':
      return (
        <svg {...common}>
          <path d="M12 2 3 7v10l9 5 9-5V7z" />
          <path d="M3 7l9 5 9-5" />
          <path d="M12 12v10" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      )
  }
}

function AdminTrackItem({
  track,
  onEdit,
  onDelete,
}: {
  track: CustomSoundCloudTrack
  onEdit: (track: CustomSoundCloudTrack) => void
  onDelete: (id: string, title: string) => void
}) {
  const playbackStatus = useReleasePlayback(`track:${track.id}`)
  const isPlaying = playbackStatus === 'playing'
  const isLoading = playbackStatus === 'loading'

  const linkedArtist = useMemo(() => {
    if (track.artistId) {
      return artists.find(a => a.dbId === track.artistId || a.id === track.artistId)
    }
    return artists.find(a => a.name.toLowerCase() === track.artist.toLowerCase())
  }, [track.artistId, track.artist])

  const handlePlay = () => {
    const trackDef = allTracks.find(t => t.id === track.id)
    if (trackDef) playOrToggleTrack(trackDef)
  }

  return (
    <article className="admin-track-card">
      <div className="admin-track-thumb-wrap">
        <img src={track.cover} alt={track.title} className="admin-track-thumb" />
        <button
          type="button"
          className={`admin-thumb-play-btn${isPlaying ? ' is-playing' : ''}`}
          onClick={handlePlay}
          aria-label={isPlaying ? 'Пауза' : 'Слушать'}
          title={isPlaying ? 'Пауза' : 'Слушать трек'}
        >
          {isLoading ? (
            <span className="admin-thumb-spinner" />
          ) : isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1.2" />
              <rect x="14" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="7,4 20,12 7,20" />
            </svg>
          )}
        </button>
      </div>

      <div className="admin-track-body">
        <div className="admin-track-title-row">
          <h4 className="admin-track-name">{track.title}</h4>
          <span className="admin-feed-badge" title="Релиз отображается в ленте на главной">
            В ленте
          </span>
        </div>
        <div className="admin-track-artist-row">
          <p className="admin-track-artist">{track.artist}</p>
          {linkedArtist && (
            <span className="admin-track-linked-badge" title={`Привязан к профилю ${linkedArtist.name}`}>
              ✓ В профиле {linkedArtist.name}
            </span>
          )}
        </div>
        <a
          href={track.soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sc-link"
        >
          SoundCloud
        </a>
      </div>

      <div className="admin-item-actions">
        <button
          type="button"
          className="admin-edit-btn"
          onClick={() => onEdit(track)}
          aria-label={`Редактировать ${track.title}`}
          title="Редактировать трек"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
        <button
          type="button"
          className="admin-delete-btn"
          onClick={() => onDelete(track.id, track.title)}
          aria-label={`Удалить ${track.title}`}
          title="Удалить из ленты"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function AdminAlbumItem({
  album,
  onEdit,
  onDelete,
}: {
  album: CustomSoundCloudAlbum
  onEdit: (album: CustomSoundCloudAlbum) => void
  onDelete: (id: string, title: string) => void
}) {
  const linkedArtist = useMemo(() => {
    if (album.artistId) {
      return artists.find(a => a.id === album.artistId)
    }
    return artists.find(a => a.name.toLowerCase() === album.artist.toLowerCase())
  }, [album.artistId, album.artist])

  return (
    <article className="admin-track-card admin-album-card">
      <div className="admin-track-thumb-wrap">
        <img src={album.cover} alt={album.title} className="admin-track-thumb" />
      </div>

      <div className="admin-track-body">
        <div className="admin-track-title-row">
          <h4 className="admin-track-name">{album.title}</h4>
          <span className="admin-feed-badge is-album-badge" title="Альбом в ленте на главной">
            Альбом · {album.tracks?.length || 0} треков
          </span>
        </div>
        <div className="admin-track-artist-row">
          <p className="admin-track-artist">{album.artist} ({album.year})</p>
          {linkedArtist && (
            <span className="admin-track-linked-badge" title={`Привязан к профилю ${linkedArtist.name}`}>
              ✓ В профиле {linkedArtist.name}
            </span>
          )}
        </div>
        <a
          href={album.soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sc-link"
        >
          SoundCloud Альбом
        </a>
      </div>

      <div className="admin-item-actions">
        <button
          type="button"
          className="admin-edit-btn"
          onClick={() => onEdit(album)}
          aria-label={`Редактировать ${album.title}`}
          title="Редактировать альбом"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
        <button
          type="button"
          className="admin-delete-btn"
          onClick={() => onDelete(album.id, album.title)}
          aria-label={`Удалить ${album.title}`}
          title="Удалить альбом из ленты"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function getArtistCountsText(art: any): string {
  const tCount = Array.isArray(art.tracks) ? art.tracks.length : (art.tracksCount ?? 0)
  const aCount = Array.isArray(art.albums) ? art.albums.length : (art.albumsCount ?? 0)
  return `${tCount} треков · ${aCount} альбомов`
}

function ArtistSearchSelector({
  value,
  selectedArtistId,
  availableArtists,
  onChange,
}: {
  value: string
  selectedArtistId?: string
  availableArtists?: Array<{ id: string; name: string; avatar?: string }>
  onChange: (artistName: string, artistId?: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  const pool = useMemo(() => {
    if (availableArtists && availableArtists.length > 0) return availableArtists
    return artists
  }, [availableArtists])

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const linkedArtist = useMemo(() => {
    if (selectedArtistId) {
      return pool.find(a => a.id === selectedArtistId)
    }
    return pool.find(a => a.name.toLowerCase() === value.trim().toLowerCase())
  }, [selectedArtistId, value, pool])

  const filteredArtists = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return pool.slice(0, 10)
    }
    return pool
      .filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 10)
  }, [query, pool])

  const handleSelectArtist = (art: { id: string; name: string }) => {
    onChange(art.name, art.id)
    setQuery(art.name)
    setIsOpen(false)
  }

  const handleSelectCustom = () => {
    const clean = query.trim()
    if (!clean) return
    onChange(clean, undefined)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setQuery(next)
    setIsOpen(true)
    const exactMatch = pool.find(a => a.name.toLowerCase() === next.trim().toLowerCase())
    if (exactMatch) {
      onChange(exactMatch.name, exactMatch.id)
    } else {
      onChange(next, undefined)
    }
  }

  return (
    <div className="admin-artist-search-wrap" ref={containerRef}>
      <div className="admin-artist-search-head">
        <label htmlFor="admin-artist-search-field" className="admin-artist-search-label">
          Исполнитель в каталоге:
        </label>
        {linkedArtist ? (
          <span className="admin-artist-status-tag is-linked">
            ✓ Связан с профилем
          </span>
        ) : (
          <span className="admin-artist-status-tag is-custom">
            Новый артист
          </span>
        )}
      </div>

      {linkedArtist && !isOpen && (
        <div className="admin-artist-selected-card">
          <img
            src={linkedArtist.avatar}
            alt={linkedArtist.name}
            className="admin-artist-selected-avatar"
          />
          <div className="admin-artist-selected-body">
            <span className="admin-artist-selected-name">{linkedArtist.name}</span>
            <span className="admin-artist-selected-details">
              В каталоге: {getArtistCountsText(linkedArtist)}
            </span>
          </div>
          <button
            type="button"
            className="admin-artist-change-btn"
            onClick={() => setIsOpen(true)}
            title="Найти другого исполнителя"
          >
            Изменить
          </button>
        </div>
      )}

      {(!linkedArtist || isOpen) && (
        <div className="admin-artist-input-row">
          <input
            id="admin-artist-search-field"
            type="text"
            className="admin-inline-input is-artist"
            placeholder="Начни вводить имя исполнителя для поиска..."
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={handleInputChange}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="admin-artist-clear-btn"
              onClick={() => {
                setQuery('')
                onChange('', undefined)
                setIsOpen(true)
              }}
              title="Очистить"
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div className="admin-artist-dropdown">
          <div className="admin-artist-dropdown-title">
            {query.trim()
              ? `Результаты поиска (${filteredArtists.length})`
              : 'Выберите исполнителя из каталога:'}
          </div>

          <div className="admin-artist-dropdown-list">
            {filteredArtists.map(art => {
              const isSelected =
                art.id === selectedArtistId ||
                art.name.toLowerCase() === value.trim().toLowerCase()

              return (
                <button
                  key={art.id}
                  type="button"
                  className={`admin-artist-dropdown-item${isSelected ? ' is-selected' : ''}`}
                  onClick={() => handleSelectArtist(art)}
                >
                  <img
                    src={art.avatar}
                    alt=""
                    className="admin-artist-dropdown-avatar"
                  />
                  <div className="admin-artist-dropdown-text">
                    <span className="admin-artist-dropdown-name">{art.name}</span>
                    <span className="admin-artist-dropdown-sub">
                      {getArtistCountsText(art)}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="admin-artist-dropdown-badge">✓ Выбран</span>
                  )}
                </button>
              )
            })}

            {query.trim() && (
              <button
                type="button"
                className="admin-artist-dropdown-item is-custom-action"
                onClick={handleSelectCustom}
              >
                <div className="admin-artist-custom-icon">+</div>
                <div className="admin-artist-dropdown-text">
                  <span className="admin-artist-dropdown-name">
                    Назначить нового исполнителя: &laquo;{query.trim()}&raquo;
                  </span>
                  <span className="admin-artist-dropdown-sub">
                    Создаст отдельный профиль в каталоге сайта
                  </span>
                </div>
              </button>
            )}

            {filteredArtists.length === 0 && !query.trim() && (
              <div className="admin-artist-dropdown-empty">
                Исполнители не найдены. Введите имя для создания нового.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type MultiArtistItem = {
  name: string
  id?: string
  avatar?: string
}

function MultiArtistSelector({
  value,
  selectedArtistIds,
  availableArtists,
  onChange,
  label = 'Исполнители трека (основной + фиты / соавторы) *',
}: {
  value: string
  selectedArtistIds?: string[]
  availableArtists?: Array<{ id: string; name: string; avatar?: string }>
  onChange: (combinedArtistString: string, primaryArtistId?: string, allArtistIds?: string[]) => void
  label?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const pool = useMemo(() => {
    if (availableArtists && availableArtists.length > 0) return availableArtists
    return artists
  }, [availableArtists])

  // Resolve current list of artists from `value` string
  const currentArtists = useMemo<MultiArtistItem[]>(() => {
    if (!value || !value.trim()) return []
    const parsedNames = splitCredit(value)
    return parsedNames.map((name: string, idx: number) => {
      const match = pool.find(
        a => a.name.toLowerCase() === name.toLowerCase() || (selectedArtistIds && selectedArtistIds[idx] === a.id),
      )
      return {
        name: match ? match.name : name,
        id: match?.id,
        avatar: match?.avatar || '/covers/placeholder.jpg',
      }
    })
  }, [value, selectedArtistIds, pool])

  // Candidates for adding
  const candidates = useMemo(() => {
    const selectedNames = new Set(currentArtists.map(a => a.name.toLowerCase()))
    const q = query.trim().toLowerCase()
    return pool
      .filter(a => !selectedNames.has(a.name.toLowerCase()))
      .filter(a => !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 10)
  }, [query, currentArtists, pool])

  const notifyChange = (nextList: MultiArtistItem[]) => {
    const combined = nextList.map(a => a.name).join(', ')
    const primaryId = nextList[0]?.id
    const allIds = nextList.map(a => a.id).filter(Boolean) as string[]
    onChange(combined, primaryId, allIds)
  }

  const handleAddArtist = (artist: { id: string; name: string; avatar?: string }) => {
    const nextList: MultiArtistItem[] = [
      ...currentArtists,
      { name: artist.name, id: artist.id, avatar: artist.avatar },
    ]
    notifyChange(nextList)
    setQuery('')
    setIsOpen(false)
  }

  const handleAddCustom = () => {
    const clean = query.trim()
    if (!clean) return
    const match = pool.find(a => a.name.toLowerCase() === clean.toLowerCase())
    const nextList: MultiArtistItem[] = [
      ...currentArtists,
      {
        name: match ? match.name : clean,
        id: match?.id,
        avatar: match?.avatar || '/covers/placeholder.jpg',
      },
    ]
    notifyChange(nextList)
    setQuery('')
    setIsOpen(false)
  }

  const handleRemove = (indexToRemove: number) => {
    const nextList = currentArtists.filter((_, idx) => idx !== indexToRemove)
    notifyChange(nextList)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="admin-multi-artist-wrap" ref={containerRef}>
      <div className="admin-multi-artist-head">
        <label className="admin-multi-artist-label">{label}</label>
        <span className="admin-multi-artist-count">
          {currentArtists.length === 0 ? 'Ни одного не выбрано' : `${currentArtists.length} исп.`}
        </span>
      </div>

      {/* Selected Artists Chips */}
      {currentArtists.length > 0 && (
        <div className="admin-multi-artist-chips">
          {currentArtists.map((art, idx) => (
            <div key={`${art.name}-${idx}`} className="admin-multi-artist-chip">
              <img
                src={art.avatar || '/covers/placeholder.jpg'}
                alt=""
                className="admin-multi-artist-avatar"
                onError={e => {
                  ;(e.target as HTMLImageElement).src = '/covers/placeholder.jpg'
                }}
              />
              <div className="admin-multi-artist-chip-info">
                <span className="admin-multi-artist-chip-name">{art.name}</span>
                <span className={`admin-multi-artist-chip-role${idx === 0 ? ' is-main' : ' is-feat'}`}>
                  {idx === 0 ? 'Основной' : 'Соавтор / фит'}
                </span>
              </div>
              <button
                type="button"
                className="admin-multi-artist-remove-btn"
                onClick={() => handleRemove(idx)}
                title={`Удалить ${art.name}`}
                aria-label={`Удалить ${art.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input for adding another artist */}
      <div className="admin-multi-artist-input-row">
        <input
          type="text"
          className="admin-inline-input is-artist"
          placeholder={
            currentArtists.length === 0
              ? 'Начните вводить имя первого (основного) исполнителя...'
              : '+ Добавить ещё исполнителя (фит, продюсер, фичер)...'
          }
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (candidates.length > 0 && query.trim().toLowerCase() === candidates[0].name.toLowerCase()) {
                handleAddArtist(candidates[0])
              } else if (query.trim()) {
                handleAddCustom()
              }
            }
          }}
          autoComplete="off"
        />
        {query.trim() && (
          <button
            type="button"
            className="admin-multi-artist-add-btn"
            onClick={handleAddCustom}
            title="Добавить этого артиста"
          >
            + Добавить
          </button>
        )}
      </div>

      {isOpen && (
        <div className="admin-artist-dropdown">
          <div className="admin-artist-dropdown-title">
            {query.trim()
              ? `Поиск в каталоге (${candidates.length})`
              : 'Выберите исполнителя для добавления:'}
          </div>

          <div className="admin-artist-dropdown-list">
            {candidates.map(art => (
              <button
                key={art.id}
                type="button"
                className="admin-artist-dropdown-item"
                onClick={() => handleAddArtist(art)}
              >
                <img src={art.avatar} alt="" className="admin-artist-dropdown-avatar" />
                <div className="admin-artist-dropdown-text">
                  <span className="admin-artist-dropdown-name">{art.name}</span>
                  <span className="admin-artist-dropdown-sub">
                    {getArtistCountsText(art)}
                  </span>
                </div>
                <span className="admin-multi-artist-add-tag">+ Добавить</span>
              </button>
            ))}

            {query.trim() && !candidates.some(c => c.name.toLowerCase() === query.trim().toLowerCase()) && (
              <button
                type="button"
                className="admin-artist-dropdown-item is-custom-action"
                onClick={handleAddCustom}
              >
                <div className="admin-artist-custom-icon">+</div>
                <div className="admin-artist-dropdown-text">
                  <span className="admin-artist-dropdown-name">
                    Добавить нового исполнителя: &laquo;{query.trim()}&raquo;
                  </span>
                  <span className="admin-artist-dropdown-sub">
                    Создаст отдельный профиль в каталоге
                  </span>
                </div>
              </button>
            )}

            {candidates.length === 0 && !query.trim() && (
              <div className="admin-artist-dropdown-empty">
                Все артисты уже добавлены или каталог пуст.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminTracksPage({ onBackToHome, onNavigateToRegister }: AdminTracksPageProps) {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [creationMode, setCreationMode] = useState<AdminSection>('overview')
  const [catalogQuery, setCatalogQuery] = useState('')
  const [sceneMode, setSceneMode] = useState<'albums' | 'tracks' | 'artists'>('albums')
  const [sceneAlbumsState, setSceneAlbumsState] = useState<AlbumDefinition[]>(() => [...sceneDefaultAlbums])
  const [sceneTracksState, setSceneTracksState] = useState<TrackDefinition[]>(() => [...sceneDefaultTracks])
  const [sceneArtistsState, setSceneArtistsState] = useState<MonthArtist[]>(() => [...sceneDefaultArtists])
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null)

  // Link import state
  const [urlInput, setUrlInput] = useState('')
  const [loadingParse, setLoadingParse] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [preview, setPreview] = useState<PreviewData | null>(null)

  // Manual track state
  const [manualTrackTitle, setManualTrackTitle] = useState('')
  const [manualTrackArtist, setManualTrackArtist] = useState('')
  const [manualTrackArtistId, setManualTrackArtistId] = useState<string | undefined>()
  const [manualTrackArtistIds, setManualTrackArtistIds] = useState<string[]>([])
  const [manualTrackAlbum, setManualTrackAlbum] = useState('')
  const [manualTrackDuration, setManualTrackDuration] = useState('3:00')
  const [manualTrackCover, setManualTrackCover] = useState('')
  const [manualTrackAudio, setManualTrackAudio] = useState('')
  const [uploadingTrackCover, setUploadingTrackCover] = useState(false)

  // Manual album state
  const [manualAlbumTitle, setManualAlbumTitle] = useState('')
  const [manualAlbumArtist, setManualAlbumArtist] = useState('')
  const [manualAlbumArtistId, setManualAlbumArtistId] = useState<string | undefined>()
  const [manualAlbumYear, setManualAlbumYear] = useState(2026)
  const [manualAlbumCover, setManualAlbumCover] = useState('')
  const [manualAlbumUrl, setManualAlbumUrl] = useState('')
  const [uploadingAlbumCover, setUploadingAlbumCover] = useState(false)
  const [albumTrackRows, setAlbumTrackRows] = useState<Array<{ title: string; duration: string; audioUrl: string; artist?: string }>>([
    { title: '', duration: '3:00', audioUrl: '', artist: '' },
  ])

  // Catalog items
  const [tracks, setTracks] = useState<CustomSoundCloudTrack[]>([])
  const [albums, setAlbums] = useState<CustomSoundCloudAlbum[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'albums' | 'tracks'>('all')
  const [statusMessage, setStatusMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Исполнители — это таблица Artist: список приходит с сервера (/api/artists/pages), счётчики считает он же.
  const [catalogVersion, setCatalogVersion] = useState(0)
  useEffect(() => {
    const bump = () => setCatalogVersion(v => v + 1)
    window.addEventListener('aa:artists_synced', bump)
    return () => window.removeEventListener('aa:artists_synced', bump)
  }, [])

  const databaseArtists = useMemo(() => {
    return artists
      .filter(a => !/^слот\s+\d+$/i.test(a.name) && a.name.toLowerCase() !== 'исполнитель')
      .map(a => ({
        id: a.dbId ?? a.id,
        name: a.name,
        avatar: a.avatar || '/covers/placeholder.jpg',
        albumsCount: a.albums.length,
        tracksCount: a.tracks.length,
      }))
      .sort((x, y) => (y.albumsCount + y.tracksCount) - (x.albumsCount + x.tracksCount) || x.name.localeCompare(y.name))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogVersion])

  // Editing state
  const [editingItem, setEditingItem] = useState<
    | { type: 'track'; item: CustomSoundCloudTrack }
    | { type: 'album'; item: CustomSoundCloudAlbum }
    | null
  >(null)

  // Track edit form state
  const [editTrackTitle, setEditTrackTitle] = useState('')
  const [editTrackArtist, setEditTrackArtist] = useState('')
  const [editTrackArtistId, setEditTrackArtistId] = useState<string | undefined>()
  const [editTrackArtistIds, setEditTrackArtistIds] = useState<string[]>([])
  const [editTrackAlbumTitle, setEditTrackAlbumTitle] = useState('')
  const [editTrackCover, setEditTrackCover] = useState('')
  const [editTrackDuration, setEditTrackDuration] = useState('')
  const [editTrackSoundcloudUrl, setEditTrackSoundcloudUrl] = useState('')

  // Album edit form state
  const [editAlbumTitle, setEditAlbumTitle] = useState('')
  const [editAlbumArtist, setEditAlbumArtist] = useState('')
  const [editAlbumArtistId, setEditAlbumArtistId] = useState<string | undefined>()
  const [editAlbumArtistIds, setEditAlbumArtistIds] = useState<string[]>([])
  const [editAlbumYear, setEditAlbumYear] = useState<number>(2026)
  const [editAlbumCover, setEditAlbumCover] = useState('')
  const [editAlbumSoundcloudUrl, setEditAlbumSoundcloudUrl] = useState('')
  const [editAlbumTracks, setEditAlbumTracks] = useState<CustomSoundCloudAlbumTrack[]>([])

  const [loadingEditSave, setLoadingEditSave] = useState(false)
  const [uploadingEditCover, setUploadingEditCover] = useState(false)

  const fetchReleases = async () => {
    try {
      const [tracksRes, albumsRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/albums'),
      ])

      if (tracksRes.ok) {
        const data: CustomSoundCloudTrack[] = await tracksRes.json()
        setTracks(data)
      }

      if (albumsRes.ok) {
        const aData: CustomSoundCloudAlbum[] = await albumsRes.json()
        setAlbums(aData)
      }
      await loadCatalog()
    } catch {
      // Ignore network errors
    }
  }

  useEffect(() => {
    void fetchReleases()
    // после создания релиза сервер пересчитывает страницы исполнителей
    const onCatalogChanged = () => void loadCatalog()
    window.addEventListener('aa:custom_tracks_updated', onCatalogChanged)
    return () => window.removeEventListener('aa:custom_tracks_updated', onCatalogChanged)
  }, [])

  const handleUploadCoverFile = async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
      })
      reader.readAsDataURL(file)
      const base64 = await base64Promise

      const res = await fetch('/api/tracks/upload-cover', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ imageBase64: base64, filename: file.name }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.url
      }
    } catch (err) {
      console.error('Upload cover failed', err)
    }
    return null
  }

  const handleTrackCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingTrackCover(true)
    const url = await handleUploadCoverFile(file)
    setUploadingTrackCover(false)
    if (url) {
      setManualTrackCover(url)
    } else {
      setStatusMessage({ type: 'err', text: 'Ошибка загрузки обложки' })
    }
  }

  const handleAlbumCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAlbumCover(true)
    const url = await handleUploadCoverFile(file)
    setUploadingAlbumCover(false)
    if (url) {
      setManualAlbumCover(url)
    } else {
      setStatusMessage({ type: 'err', text: 'Ошибка загрузки обложки' })
    }
  }

  useEffect(() => {
    const handleSceneUpdate = () => {
      setSceneAlbumsState([...sceneDefaultAlbums])
      setSceneTracksState([...sceneDefaultTracks])
      setSceneArtistsState([...sceneDefaultArtists])
    }
    window.addEventListener('aa:scene_updated', handleSceneUpdate)
    return () => window.removeEventListener('aa:scene_updated', handleSceneUpdate)
  }, [])

  const handleSlotCoverUpload = async (
    slotIndex: number,
    mode: 'albums' | 'tracks' | 'artists',
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingSlotIndex(slotIndex)
    const url = await handleUploadCoverFile(file)
    setUploadingSlotIndex(null)
    if (url) {
      if (mode === 'albums') {
        updateSceneAlbumSlot(slotIndex, { cover: url })
        setSceneAlbumsState(prev => {
          const next = [...prev]
          next[slotIndex] = { ...next[slotIndex], cover: url }
          return next
        })
      } else if (mode === 'artists') {
        updateSceneArtistSlot(slotIndex, { cover: url })
        setSceneArtistsState(prev => {
          const next = [...prev]
          next[slotIndex] = { ...next[slotIndex], cover: url }
          return next
        })
      } else {
        updateSceneTrackSlot(slotIndex, { cover: url })
        setSceneTracksState(prev => {
          const next = [...prev]
          next[slotIndex] = { ...next[slotIndex], cover: url }
          return next
        })
      }
      setStatusMessage({ type: 'ok', text: `Обложка для слота ${slotIndex + 1} обновлена!` })
    } else {
      setStatusMessage({ type: 'err', text: 'Ошибка загрузки файла обложки' })
    }
  }

  const handleSlotFieldChange = (
    slotIndex: number,
    mode: 'albums' | 'tracks' | 'artists',
    field: string,
    value: string,
  ) => {
    if (mode === 'albums') {
      setSceneAlbumsState(prev => {
        const next = [...prev]
        next[slotIndex] = { ...next[slotIndex], [field]: value }
        return next
      })
    } else if (mode === 'artists') {
      setSceneArtistsState(prev => {
        const next = [...prev]
        next[slotIndex] = { ...next[slotIndex], [field]: value }
        return next
      })
    } else {
      setSceneTracksState(prev => {
        const next = [...prev]
        next[slotIndex] = { ...next[slotIndex], [field]: value }
        return next
      })
    }
  }

  const handleParseSlotSoundcloud = async (slotIndex: number, mode: 'albums' | 'tracks') => {
    const slot = (mode === 'albums' ? sceneAlbumsState : sceneTracksState)[slotIndex]
    const url = slot?.soundcloudUrl?.trim()
    if (!url || !url.includes('soundcloud.com')) {
      setStatusMessage({ type: 'err', text: 'Сначала вставьте ссылку на SoundCloud в поле слота' })
      return
    }

    setStatusMessage(null)
    try {
      const res = await fetch(`/api/tracks/parse?url=${encodeURIComponent(url)}`, {
        headers: authHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        if (mode === 'albums') {
          const updated = {
            title: slot.title.startsWith('Слот') ? (data.title || slot.title) : slot.title,
            artist: slot.artist === 'Исполнитель' ? (data.artist || slot.artist) : slot.artist,
            cover: (!slot.cover || slot.cover.includes('placeholder')) ? (data.cover || slot.cover) : slot.cover,
            tracks: data.tracks || [],
          }
          setSceneAlbumsState(prev => {
            const next = [...prev]
            next[slotIndex] = { ...next[slotIndex], ...updated }
            return next
          })
          updateSceneAlbumSlot(slotIndex, updated)
          if (data.tracks && data.tracks.length > 0) {
            setStatusMessage({ type: 'ok', text: `Получено ${data.tracks.length} треков альбома из SoundCloud!` })
          } else {
            setStatusMessage({ type: 'ok', text: 'Данные получены из SoundCloud!' })
          }
        } else {
          const updated = {
            title: slot.title.startsWith('Слот') ? (data.title || slot.title) : slot.title,
            artist: slot.artist === 'Исполнитель' ? (data.artist || slot.artist) : slot.artist,
            cover: (!slot.cover || slot.cover.includes('placeholder')) ? (data.cover || slot.cover) : slot.cover,
            duration: data.duration || (('duration' in slot) ? (slot as any).duration : '3:00') || '3:00',
            soundcloudTrackId: data.soundcloudTrackId,
          }
          setSceneTracksState(prev => {
            const next = [...prev]
            next[slotIndex] = { ...next[slotIndex], ...updated }
            return next
          })
          updateSceneTrackSlot(slotIndex, updated)
          setStatusMessage({ type: 'ok', text: 'Данные трека получены из SoundCloud!' })
        }
      } else {
        setStatusMessage({ type: 'err', text: 'Не удалось получить данные релиза из SoundCloud' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Ошибка соединения при получении треков' })
    }
  }

  const handleSaveSlot = async (slotIndex: number, mode: 'albums' | 'tracks' | 'artists') => {
    if (mode === 'albums') {
      const slot = sceneAlbumsState[slotIndex]
      let tracksList = slot.tracks || []

      // If tracks are not yet parsed but soundcloudUrl is provided, parse now
      if (tracksList.length === 0 && slot.soundcloudUrl?.includes('soundcloud.com')) {
        try {
          const res = await fetch(`/api/tracks/parse?url=${encodeURIComponent(slot.soundcloudUrl.trim())}`, {
            headers: authHeaders(),
          })
          if (res.ok) {
            const data = await res.json()
            if (data.type === 'album' && Array.isArray(data.tracks) && data.tracks.length > 0) {
              tracksList = data.tracks
              slot.tracks = data.tracks
              if (slot.title.startsWith('Слот')) slot.title = data.title || slot.title
              if (slot.artist === 'Исполнитель') slot.artist = data.artist || slot.artist
              if (!slot.cover || slot.cover.includes('placeholder')) slot.cover = data.cover || slot.cover
            }
          }
        } catch {}
      }

      const updatedAlbum = {
        title: slot.title.trim() || `Слот ${slotIndex + 1}`,
        artist: slot.artist.trim() || 'Исполнитель',
        cover: slot.cover.trim() || '/covers/placeholder.jpg',
        soundcloudUrl: slot.soundcloudUrl?.trim() || undefined,
        tracks: tracksList,
      }
      updateSceneAlbumSlot(slotIndex, updatedAlbum)

      if (tracksList.length > 0) {
      }

      setStatusMessage({
        type: 'ok',
        text: `Слот ${slotIndex + 1} (Альбом${tracksList.length > 0 ? `, ${tracksList.length} треков` : ''}) сохранён в 3D сцене!`,
      })
    } else if (mode === 'artists') {
      const slot = sceneArtistsState[slotIndex]
      const name = slot.title.trim() || `Исполнитель ${slotIndex + 1}`
      updateSceneArtistSlot(slotIndex, {
        title: name,
        artist: slot.artist.trim() || name,
        month: slot.month?.trim() || 'Сезон 2026',
        cover: slot.cover.trim() || '/covers/placeholder.jpg',
      })
      setStatusMessage({ type: 'ok', text: `Слот ${slotIndex + 1} (Исполнитель) сохранён в 3D сцене!` })
    } else {
      const slot = sceneTracksState[slotIndex]
      updateSceneTrackSlot(slotIndex, {
        title: slot.title.trim() || `Слот ${slotIndex + 1}`,
        artist: slot.artist.trim() || 'Исполнитель',
        cover: slot.cover.trim() || '/covers/placeholder.jpg',
        soundcloudUrl: slot.soundcloudUrl?.trim() || undefined,
      })
      setStatusMessage({ type: 'ok', text: `Слот ${slotIndex + 1} (Трек) сохранён в 3D сцене!` })
    }
  }

  const handlePopulateTrackWheelFromAlbum = async (albumSlot: AlbumDefinition) => {
    let tracksList = albumSlot.tracks || []
    if (tracksList.length === 0 && albumSlot.soundcloudUrl) {
      try {
        const res = await fetch(`/api/tracks/parse?url=${encodeURIComponent(albumSlot.soundcloudUrl.trim())}`, {
          headers: authHeaders(),
        })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.tracks)) {
            tracksList = data.tracks
          }
        }
      } catch {}
    }
    if (tracksList.length === 0) {
      setStatusMessage({ type: 'err', text: 'У этого альбома пока нет списка треков' })
      return
    }

    const newTrackSlots = [...sceneTracksState]
    for (let i = 0; i < 12; i++) {
      const sourceTrack = tracksList[i % tracksList.length]
      newTrackSlots[i] = {
        id: `slot-track-${i + 1}`,
        albumId: albumSlot.id || `slot-album-${i + 1}`,
        title: sourceTrack.title,
        albumTitle: albumSlot.title || 'Альбом',
        artist: sourceTrack.artist || albumSlot.artist || 'Исполнитель',
        year: 2026,
        duration: sourceTrack.duration || '3:00',
        cover: sourceTrack.cover || albumSlot.cover || '/covers/placeholder.jpg',
        sourceUrl: sourceTrack.soundcloudUrl || albumSlot.soundcloudUrl || '',
        soundcloudUrl: sourceTrack.soundcloudUrl || albumSlot.soundcloudUrl || '',
        soundcloudTrackId: sourceTrack.soundcloudTrackId,
      }
    }
    setSceneTracksState(newTrackSlots)
    setSceneTracks(newTrackSlots)
    setStatusMessage({
      type: 'ok',
      text: `12 слотов 3D Колеса Треков успешно заполнены песнями из "${albumSlot.title}"!`,
    })
  }

  const handleAssignReleaseToSlot = (
    slotIndex: number,
    mode: 'albums' | 'tracks' | 'artists',
    releaseId: string,
  ) => {
    if (mode === 'albums') {
      const cleanId = releaseId.startsWith('album:') ? releaseId.replace(/^album:/, '') : releaseId
      const found = albums.find(a => a.id === cleanId)
      if (!found) return
      const updated: AlbumDefinition = {
        id: found.id || `slot-album-${slotIndex + 1}`,
        title: found.title,
        artist: found.artist,
        year: found.year || 2026,
        cover: found.cover || '/covers/placeholder.jpg',
        sourceUrl: found.soundcloudUrl || '',
        soundcloudUrl: found.soundcloudUrl || '',
        tracks: (found.tracks || []).map((t, idx) => ({
          id: t.id || `${found.id}-trk-${idx + 1}`,
          albumId: found.id,
          title: t.title,
          albumTitle: found.title,
          artist: t.artist || found.artist,
          year: found.year || 2026,
          duration: t.duration || '3:00',
          cover: t.cover || found.cover || '/covers/placeholder.jpg',
          sourceUrl: t.soundcloudUrl || found.soundcloudUrl || '',
          soundcloudUrl: t.soundcloudUrl || found.soundcloudUrl || '',
          soundcloudTrackId: t.soundcloudTrackId,
        })),
      }
      updateSceneAlbumSlot(slotIndex, updated)
      setSceneAlbumsState(prev => {
        const next = [...prev]
        next[slotIndex] = updated
        return next
      })
      setStatusMessage({ type: 'ok', text: `Альбом "${found.title}" назначен в слот ${slotIndex + 1}!` })
    } else if (mode === 'artists') {
      const cleanId = releaseId.startsWith('artist:') ? releaseId.replace(/^artist:/, '') : releaseId
      const found = databaseArtists.find(
        a => a.id === cleanId || a.name.toLowerCase() === cleanId.toLowerCase(),
      )
      if (!found) return
      const updated: MonthArtist = {
        id: `slot-artist-${slotIndex + 1}`,
        title: found.name,
        artist: found.name,
        month: 'Сезон 2026',
        year: 2026,
        cover: found.avatar || '/covers/placeholder.jpg',
        sourceUrl: '',
        pageId: artists.find(x => x.dbId === found.id)?.id ?? found.id,
      }
      updateSceneArtistSlot(slotIndex, updated)
      setSceneArtistsState(prev => {
        const next = [...prev]
        next[slotIndex] = updated
        return next
      })
      setStatusMessage({ type: 'ok', text: `Исполнитель "${found.name}" из базы данных назначен в слот ${slotIndex + 1}!` })
    } else {
      // mode === 'tracks'
      if (releaseId.startsWith('album-track:')) {
        const [, albumId, trackId] = releaseId.split(':')
        const album = albums.find(a => a.id === albumId)
        if (!album) return
        const albumTrack = (album.tracks || []).find((t, i) => t.id === trackId || String(i) === trackId)
        if (!albumTrack) return

        const updated: TrackDefinition = {
          id: `slot-track-${slotIndex + 1}`,
          albumId: album.id,
          title: albumTrack.title,
          albumTitle: album.title,
          artist: albumTrack.artist || album.artist || 'Исполнитель',
          year: album.year || 2026,
          duration: albumTrack.duration || '3:00',
          cover: albumTrack.cover || album.cover || '/covers/placeholder.jpg',
          sourceUrl: albumTrack.soundcloudUrl || album.soundcloudUrl || '',
          soundcloudUrl: albumTrack.soundcloudUrl || album.soundcloudUrl || '',
          soundcloudTrackId: albumTrack.soundcloudTrackId,
        }

        updateSceneTrackSlot(slotIndex, updated)
        setSceneTracksState(prev => {
          const next = [...prev]
          next[slotIndex] = updated
          return next
        })

        // Also register track in audio runtime so it's immediately playable

        setStatusMessage({
          type: 'ok',
          text: `Трек "${albumTrack.title}" из альбома "${album.title}" назначен в слот ${slotIndex + 1}!`,
        })
      } else {
        const cleanId = releaseId.startsWith('track:') ? releaseId.replace(/^track:/, '') : releaseId
        const found = tracks.find(t => t.id === cleanId)
        if (!found) return
        const updated: TrackDefinition = {
          id: `slot-track-${slotIndex + 1}`,
          albumId: found.id,
          title: found.title,
          albumTitle: found.albumTitle || 'Сингл',
          artist: found.artist,
          year: 2026,
          duration: found.duration || '3:00',
          cover: found.cover || '/covers/placeholder.jpg',
          sourceUrl: found.soundcloudUrl || '',
          soundcloudUrl: found.soundcloudUrl || '',
          soundcloudTrackId: found.soundcloudTrackId,
        }
        updateSceneTrackSlot(slotIndex, updated)
        setSceneTracksState(prev => {
          const next = [...prev]
          next[slotIndex] = updated
          return next
        })
        setStatusMessage({ type: 'ok', text: `Трек "${found.title}" назначен в слот ${slotIndex + 1}!` })
      }
    }
  }

  // Parse by Link (SoundCloud)
  const handleParse = async (event: FormEvent) => {
    event.preventDefault()
    const cleanUrl = urlInput.trim()
    if (!cleanUrl || !cleanUrl.includes('soundcloud.com')) {
      setStatusMessage({ type: 'err', text: 'Вставьте ссылку на трек или плейлист/альбом из soundcloud.com' })
      return
    }

    setLoadingParse(true)
    setStatusMessage(null)
    setPreview(null)

    try {
      const res = await fetch(`/api/tracks/parse?url=${encodeURIComponent(cleanUrl)}`, {
        headers: authHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        const initialArtistName = (data.artist || '').trim()
        const matched = artists.find(
          a =>
            a.name.toLowerCase() === initialArtistName.toLowerCase() ||
            a.id.toLowerCase() === initialArtistName.toLowerCase() ||
            initialArtistName.toLowerCase().includes(a.name.toLowerCase())
        )
        setPreview({
          ...data,
          artist: matched ? matched.name : initialArtistName,
          artistId: matched ? matched.id : undefined,
        })
      } else {
        setStatusMessage({ type: 'err', text: 'Не удалось получить данные по ссылке. Проверь доступность релиза.' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Ошибка соединения с бэкендом.' })
    } finally {
      setLoadingParse(false)
    }
  }

  const handleSaveRelease = async () => {
    if (!preview) return
    setLoadingSave(true)
    setStatusMessage(null)

    try {
      if (preview.type === 'album') {
        const res = await fetch('/api/albums', {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(preview),
        })
        if (res.ok) {
          const created: CustomSoundCloudAlbum = await res.json()
          setAlbums(prev => {
            const next = [created, ...prev]
            window.dispatchEvent(new CustomEvent('aa:custom_tracks_updated'))
            return next
          })
          setPreview(null)
          setUrlInput('')
          setStatusMessage({
            type: 'ok',
            text: `Альбом "${created.title}" (${created.tracks.length} треков) успешно сохранен в базе данных!`,
          })
        } else {
          setStatusMessage({ type: 'err', text: 'Ошибка сохранения альбома' })
        }
      } else {
        const res = await fetch('/api/tracks', {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(preview),
        })
        if (res.ok) {
          const created: CustomSoundCloudTrack = await res.json()
          setTracks(prev => {
            const next = [created, ...prev]
            window.dispatchEvent(new CustomEvent('aa:custom_tracks_updated'))
            return next
          })
          setPreview(null)
          setUrlInput('')
          setStatusMessage({
            type: 'ok',
            text: `Трек "${created.title}" успешно сохранен в базе данных!`,
          })
        } else {
          setStatusMessage({ type: 'err', text: 'Ошибка сохранения трека' })
        }
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось связаться с сервером' })
    } finally {
      setLoadingSave(false)
    }
  }

  // Save manual track
  const handleSaveManualTrack = async (e: FormEvent) => {
    e.preventDefault()
    if (!manualTrackTitle.trim() || !manualTrackArtist.trim()) {
      setStatusMessage({ type: 'err', text: 'Укажите название трека и исполнителя' })
      return
    }

    setLoadingSave(true)
    setStatusMessage(null)

    const payload = {
      title: manualTrackTitle.trim(),
      artist: manualTrackArtist.trim(),
      artistId: manualTrackArtistId,
      artistIds: manualTrackArtistIds.length > 0 ? manualTrackArtistIds : undefined,
      albumTitle: manualTrackAlbum.trim() || 'Сингл',
      duration: manualTrackDuration.trim() || '3:00',
      cover: manualTrackCover.trim() || '/covers/placeholder.jpg',
      audioUrl: manualTrackAudio.trim().startsWith('http') && !manualTrackAudio.includes('soundcloud.com') ? manualTrackAudio.trim() : undefined,
      soundcloudUrl: manualTrackAudio.includes('soundcloud.com') ? manualTrackAudio.trim() : undefined,
    }

    try {
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created: CustomSoundCloudTrack = await res.json()
        setTracks(prev => [created, ...prev])
        setManualTrackTitle('')
        setManualTrackArtist('')
        setManualTrackArtistId(undefined)
        setManualTrackArtistIds([])
        setManualTrackAlbum('')
        setManualTrackAudio('')
        setManualTrackCover('')
        setStatusMessage({ type: 'ok', text: `Трек "${created.title}" сохранён в базе данных!` })
      } else {
        setStatusMessage({ type: 'err', text: 'Ошибка сохранения трека' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось связаться с сервером' })
    } finally {
      setLoadingSave(false)
    }
  }

  // Save manual album
  const handleSaveManualAlbum = async (e: FormEvent) => {
    e.preventDefault()
    if (!manualAlbumTitle.trim() || !manualAlbumArtist.trim()) {
      setStatusMessage({ type: 'err', text: 'Укажите название альбома и исполнителя' })
      return
    }

    const validTracks = albumTrackRows
      .filter(r => r.title.trim())
      .map((r, i) => ({
        id: `trk-${Date.now()}-${i + 1}`,
        title: r.title.trim(),
        artist: r.artist?.trim()
          ? (r.artist.trim().includes(manualAlbumArtist.trim())
              ? r.artist.trim()
              : `${manualAlbumArtist.trim()}, ${r.artist.trim()}`)
          : manualAlbumArtist.trim(),
        artistId: manualAlbumArtistId,
        duration: r.duration.trim() || '3:00',
        cover: manualAlbumCover.trim() || '/covers/placeholder.jpg',
        audioUrl: r.audioUrl.trim().startsWith('http') && !r.audioUrl.includes('soundcloud.com') ? r.audioUrl.trim() : undefined,
        soundcloudUrl: r.audioUrl.includes('soundcloud.com') ? r.audioUrl.trim() : undefined,
        soundcloudTrackId: '',
      }))

    setLoadingSave(true)
    setStatusMessage(null)

    const payload = {
      title: manualAlbumTitle.trim(),
      artist: manualAlbumArtist.trim(),
      artistId: manualAlbumArtistId,
      year: manualAlbumYear || 2026,
      cover: manualAlbumCover.trim() || '/covers/placeholder.jpg',
      soundcloudUrl: manualAlbumUrl.includes('soundcloud.com') ? manualAlbumUrl.trim() : undefined,
      tracks: validTracks,
    }

    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created: CustomSoundCloudAlbum = await res.json()
        setAlbums(prev => [created, ...prev])
        setManualAlbumTitle('')
        setManualAlbumCover('')
        setManualAlbumUrl('')
        setAlbumTrackRows([{ title: '', duration: '3:00', audioUrl: '' }])
        setStatusMessage({ type: 'ok', text: `Альбом "${created.title}" сохранён в базе данных!` })
      } else {
        setStatusMessage({ type: 'err', text: 'Ошибка сохранения альбома' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось связаться с сервером' })
    } finally {
      setLoadingSave(false)
    }
  }

  const handleDeleteTrack = async (id: string, title: string) => {
    if (!confirm(`Удалить трек "${title}" из базы данных?`)) return
    try {
      const res = await fetch(`/api/tracks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success !== false) {
        setTracks(prev => {
          const next = prev.filter(t => t.id !== id)
          void loadCatalog()
          return next
        })

        // Also if any 3D scene slot has this track, reset that slot to default
        setSceneTracksState(prev => {
          const next = [...prev]
          let changed = false
          for (let i = 0; i < next.length; i++) {
            if (next[i].id === id || next[i].title.toLowerCase() === title.toLowerCase()) {
              const defSlot: TrackDefinition = {
                id: `slot-track-${i + 1}`,
                albumId: `slot-track-${i + 1}`,
                title: `Слот ${i + 1}`,
                albumTitle: 'Сингл',
                artist: 'Исполнитель',
                year: 2026,
                duration: '3:00',
                cover: '/covers/placeholder.jpg',
                sourceUrl: '',
                soundcloudUrl: '',
              }
              next[i] = defSlot
              updateSceneTrackSlot(i, defSlot)
              changed = true
            }
          }
          return changed ? next : prev
        })

        window.dispatchEvent(new CustomEvent('aa:custom_tracks_updated'))
        window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        setStatusMessage({ type: 'ok', text: `Трек "${title}" удален из базы данных` })
      } else {
        setStatusMessage({ type: 'err', text: 'Сервер не смог удалить трек' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось удалить трек' })
    }
  }

  const handleDeleteAlbum = async (id: string, title: string) => {
    if (!confirm(`Удалить альбом "${title}" из базы данных?`)) return
    try {
      const res = await fetch(`/api/albums/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success !== false) {
        setAlbums(prev => {
          const next = prev.filter(a => a.id !== id)
          void loadCatalog()
          return next
        })

        // Also if any 3D scene slot has this album, reset that slot to default
        setSceneAlbumsState(prev => {
          const next = [...prev]
          let changed = false
          for (let i = 0; i < next.length; i++) {
            if (next[i].id === id || next[i].title.toLowerCase() === title.toLowerCase()) {
              const defSlot: AlbumDefinition = {
                id: `slot-album-${i + 1}`,
                title: `Слот ${i + 1}`,
                artist: 'Исполнитель',
                year: 2026,
                cover: '/covers/placeholder.jpg',
                sourceUrl: '',
                soundcloudUrl: '',
                tracks: [],
              }
              next[i] = defSlot
              updateSceneAlbumSlot(i, defSlot)
              changed = true
            }
          }
          return changed ? next : prev
        })

        window.dispatchEvent(new CustomEvent('aa:custom_tracks_updated'))
        window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        setStatusMessage({ type: 'ok', text: `Альбом "${title}" удален из базы данных` })
      } else {
        setStatusMessage({ type: 'err', text: 'Сервер не смог удалить альбом' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось удалить альбом' })
    }
  }

  const handleStartEditTrack = (track: CustomSoundCloudTrack) => {
    setEditingItem({ type: 'track', item: track })
    setEditTrackTitle(track.title)
    setEditTrackArtist(track.artist)
    setEditTrackArtistId(track.artistId)
    setEditTrackArtistIds(track.artistIds || (track.artistId ? [track.artistId] : []))
    setEditTrackAlbumTitle(track.albumTitle || 'Сингл')
    setEditTrackCover(track.cover)
    setEditTrackDuration(track.duration || '3:30')
    setEditTrackSoundcloudUrl(track.soundcloudUrl || '')
    setStatusMessage(null)
  }

  const handleStartEditAlbum = (album: CustomSoundCloudAlbum) => {
    setEditingItem({ type: 'album', item: album })
    setEditAlbumTitle(album.title)
    setEditAlbumArtist(album.artist)
    setEditAlbumArtistId(album.artistId)
    setEditAlbumArtistIds(album.artistIds || (album.artistId ? [album.artistId] : []))
    setEditAlbumYear(album.year || 2026)
    setEditAlbumCover(album.cover)
    setEditAlbumSoundcloudUrl(album.soundcloudUrl || '')
    setEditAlbumTracks(album.tracks ? [...album.tracks] : [])
    setStatusMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const handleUploadEditCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingEditCover(true)
    try {
      const url = await handleUploadCoverFile(file)
      if (url) {
        if (editingItem?.type === 'track') {
          setEditTrackCover(url)
        } else if (editingItem?.type === 'album') {
          setEditAlbumCover(url)
        }
      }
    } finally {
      setUploadingEditCover(false)
    }
  }

  const handleSaveEditTrack = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingItem || editingItem.type !== 'track') return
    const id = editingItem.item.id
    setLoadingEditSave(true)
    try {
      const payload = {
        title: editTrackTitle.trim(),
        artist: editTrackArtist.trim(),
        artistId: editTrackArtistId,
        artistIds: editTrackArtistIds,
        albumTitle: editTrackAlbumTitle.trim() || 'Сингл',
        cover: editTrackCover.trim() || '/covers/in-rainbows.jpg',
        duration: editTrackDuration.trim() || '3:30',
        soundcloudUrl: editTrackSoundcloudUrl.trim() || editingItem.item.soundcloudUrl,
      }

      const res = await fetch(`/api/tracks/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const updatedTrack: CustomSoundCloudTrack = await res.json()


        setTracks(prev => {
          const next = prev.map(t => (t.id === id ? updatedTrack : t))
          void loadCatalog()
          return next
        })

        setSceneTracksState(prev => {
          const next = [...prev]
          let changed = false
          for (let i = 0; i < next.length; i++) {
            if (next[i].id === id || next[i].title.toLowerCase() === editingItem.item.title.toLowerCase()) {
              next[i] = {
                ...next[i],
                title: updatedTrack.title,
                artist: updatedTrack.artist,
                cover: updatedTrack.cover,
                albumTitle: updatedTrack.albumTitle,
                duration: updatedTrack.duration || next[i].duration,
                soundcloudUrl: updatedTrack.soundcloudUrl || next[i].soundcloudUrl,
              }
              updateSceneTrackSlot(i, next[i])
              changed = true
            }
          }
          return changed ? next : prev
        })

        window.dispatchEvent(new CustomEvent('aa:custom_tracks_updated'))
        window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        setStatusMessage({ type: 'ok', text: `Трек "${updatedTrack.title}" успешно обновлен!` })
        setEditingItem(null)
      } else {
        setStatusMessage({ type: 'err', text: 'Ошибка сохранения трека на сервере' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось сохранить изменения трека' })
    } finally {
      setLoadingEditSave(false)
    }
  }

  const handleSaveEditAlbum = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingItem || editingItem.type !== 'album') return
    const id = editingItem.item.id
    setLoadingEditSave(true)
    try {
      const payload = {
        title: editAlbumTitle.trim(),
        artist: editAlbumArtist.trim(),
        artistId: editAlbumArtistId,
        artistIds: editAlbumArtistIds,
        year: Number(editAlbumYear) || 2026,
        cover: editAlbumCover.trim() || '/covers/in-rainbows.jpg',
        soundcloudUrl: editAlbumSoundcloudUrl.trim() || editingItem.item.soundcloudUrl,
        tracks: editAlbumTracks.map((t, idx) => ({
          ...t,
          id: t.id || `${id}-trk-${idx + 1}`,
          title: t.title.trim() || `Трек ${idx + 1}`,
          artist: t.artist?.trim() || editAlbumArtist.trim(),
          duration: t.duration?.trim() || '3:30',
          cover: t.cover || editAlbumCover.trim() || '/covers/in-rainbows.jpg',
        })),
      }

      const res = await fetch(`/api/albums/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const updatedAlbum: CustomSoundCloudAlbum = await res.json()


        setAlbums(prev => {
          const next = prev.map(a => (a.id === id ? updatedAlbum : a))
          void loadCatalog()
          return next
        })

        setSceneAlbumsState(prev => {
          const next = [...prev]
          let changed = false
          for (let i = 0; i < next.length; i++) {
            if (next[i].id === id || next[i].title.toLowerCase() === editingItem.item.title.toLowerCase()) {
              next[i] = {
                ...next[i],
                title: updatedAlbum.title,
                artist: updatedAlbum.artist,
                year: updatedAlbum.year,
                cover: updatedAlbum.cover,
                soundcloudUrl: updatedAlbum.soundcloudUrl || next[i].soundcloudUrl,
                tracks: updatedAlbum.tracks as any,
              }
              updateSceneAlbumSlot(i, next[i])
              changed = true
            }
          }
          return changed ? next : prev
        })

        window.dispatchEvent(new CustomEvent('aa:custom_tracks_updated'))
        window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        setStatusMessage({ type: 'ok', text: `Альбом "${updatedAlbum.title}" успешно обновлен!` })
        setEditingItem(null)
      } else {
        setStatusMessage({ type: 'err', text: 'Ошибка сохранения альбома на сервере' })
      }
    } catch {
      setStatusMessage({ type: 'err', text: 'Не удалось сохранить изменения альбома' })
    } finally {
      setLoadingEditSave(false)
    }
  }

  const handleResetSlot = (slotIndex: number, mode: 'albums' | 'tracks' | 'artists') => {
    if (!confirm(`Очистить слот ${slotIndex + 1}?`)) return
    if (mode === 'albums') {
      const defSlot: AlbumDefinition = {
        id: `slot-album-${slotIndex + 1}`,
        title: `Слот ${slotIndex + 1}`,
        artist: 'Исполнитель',
        year: 2026,
        cover: '/covers/placeholder.jpg',
        sourceUrl: '',
        soundcloudUrl: '',
        tracks: [],
      }
      setSceneAlbumsState(prev => {
        const next = [...prev]
        next[slotIndex] = defSlot
        return next
      })
      updateSceneAlbumSlot(slotIndex, defSlot)
      setStatusMessage({ type: 'ok', text: `Слот ${slotIndex + 1} (Альбом) очищен!` })
    } else if (mode === 'artists') {
      const defArtist: MonthArtist = {
        id: `slot-artist-${slotIndex + 1}`,
        title: `Исполнитель ${slotIndex + 1}`,
        artist: `Исполнитель ${slotIndex + 1}`,
        month: 'Сезон 2026',
        year: 2026,
        cover: '/covers/placeholder.jpg',
        sourceUrl: '',
        pageId: `artist-${slotIndex + 1}`,
      }
      setSceneArtistsState(prev => {
        const next = [...prev]
        next[slotIndex] = defArtist
        return next
      })
      updateSceneArtistSlot(slotIndex, defArtist)
      setStatusMessage({ type: 'ok', text: `Слот ${slotIndex + 1} (Исполнитель) очищен!` })
    } else {
      const defTrack: TrackDefinition = {
        id: `slot-track-${slotIndex + 1}`,
        albumId: `slot-track-${slotIndex + 1}`,
        title: `Слот ${slotIndex + 1}`,
        albumTitle: 'Сингл',
        artist: 'Исполнитель',
        year: 2026,
        duration: '3:00',
        cover: '/covers/placeholder.jpg',
        sourceUrl: '',
        soundcloudUrl: '',
      }
      setSceneTracksState(prev => {
        const next = [...prev]
        next[slotIndex] = defTrack
        return next
      })
      updateSceneTrackSlot(slotIndex, defTrack)
      setStatusMessage({ type: 'ok', text: `Слот ${slotIndex + 1} (Трек) очищен!` })
    }
  }

  if (!isAdmin) {
    return (
      <main className="admin-page is-gate" role="main">
        <FluidBackground />
        <div className="admin-gate">
          <span className="admin-gate-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
          <h1 className="admin-title">Нужны права администратора</h1>
          <p className="admin-subtitle">
            {isAuthenticated
              ? `Вы вошли как «${user?.nickname || user?.email}» с ролью «${user?.role || 'user'}». Панель доступна только пользователям с ролью «admin».`
              : 'Добавлять, редактировать и удалять релизы могут только администраторы премии. Войдите в аккаунт с правами администратора.'}
          </p>
          <div className="admin-gate-actions">
            <button type="button" onClick={onBackToHome} className="admin-back-btn">
              На главную
            </button>
            {!isAuthenticated && onNavigateToRegister && (
              <button type="button" onClick={onNavigateToRegister} className="admin-submit-btn">
                Войти в аккаунт
              </button>
            )}
          </div>
        </div>
      </main>
    )
  }

  const catalogNeedle = catalogQuery.trim().toLowerCase()
  const visibleAlbums = catalogNeedle
    ? albums.filter(a => `${a.title} ${a.artist}`.toLowerCase().includes(catalogNeedle))
    : albums
  const visibleTracks = catalogNeedle
    ? tracks.filter(t => `${t.title} ${t.artist}`.toLowerCase().includes(catalogNeedle))
    : tracks
  const currentSection = ADMIN_SECTIONS[creationMode]

  return (
    <main className="admin-page" role="main">
      <FluidBackground />

      <div className="admin-shell">
        <div className="admin-sidebar">
          <div className="admin-side-brand">
            <img className="admin-side-logo" src="/logo-transparent.png" alt="Album Awards" />
            <span className="admin-side-brand-sub">Панель администратора</span>
          </div>

          <nav className="admin-nav" aria-label="Разделы панели">
            {ADMIN_NAV_GROUPS.map(group => (
              <div key={group.label} className="admin-nav-group">
                {group.label && <p className="admin-nav-label">{group.label}</p>}
                {group.items.map(id => (
                  <button
                    key={id}
                    type="button"
                    className={`admin-nav-item${creationMode === id ? ' is-active' : ''}`}
                    aria-current={creationMode === id ? 'page' : undefined}
                    onClick={() => { setCreationMode(id); setStatusMessage(null) }}
                  >
                    <AdminNavIcon name={id} />
                    <span className="admin-nav-text">{ADMIN_SECTIONS[id].nav}</span>
                    {id === 'catalog' && (
                      <span className="admin-nav-count">{albums.length + tracks.length}</span>
                    )}
                    {id === 'scene' && <span className="admin-nav-count">3 × 12</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>


          <div className="admin-side-foot">
            <div className="admin-side-user">
              <span className="admin-side-avatar" aria-hidden="true">
                {(user?.nickname || user?.email || 'A').slice(0, 1).toUpperCase()}
              </span>
              <div className="admin-side-user-text">
                <strong>{user?.nickname || 'Администратор'}</strong>
                {user?.email && <span>{user.email}</span>}
              </div>
            </div>
            <button type="button" className="admin-back-btn" onClick={onBackToHome}>
              На главную
            </button>
          </div>
        </div>

        <div className="admin-main">
          <div className="admin-main-head">
            <h1 className="admin-title">{currentSection.title}</h1>
            <p className="admin-subtitle">{currentSection.desc}</p>
          </div>

          {statusMessage && (
            <div className={`admin-alert is-${statusMessage.type}`} role="status">
              {statusMessage.text}
            </div>
          )}

        {creationMode === 'overview' && (
          <AdminOverview
            albums={albums}
            tracks={tracks}
            artistsCount={databaseArtists.length}
            sceneWheels={[
              { id: 'albums', label: 'Колесо альбомов', slots: sceneAlbumsState },
              { id: 'tracks', label: 'Колесо треков', slots: sceneTracksState },
              { id: 'artists', label: 'Колесо исполнителей', slots: sceneArtistsState },
            ]}
            onEditAlbum={handleStartEditAlbum}
            onEditTrack={handleStartEditTrack}
            onOpenScene={() => { setCreationMode('scene'); setStatusMessage(null) }}
            onOpenImport={() => { setCreationMode('link'); setStatusMessage(null) }}
          />
        )}

        {/* Card 1: Import by link */}
        {creationMode === 'link' && (
          <div className="admin-card">
            <form className="admin-form" onSubmit={handleParse}>
              <label htmlFor="sc-url-input" className="admin-label">
                Ссылка на трек или плейлист/альбом SoundCloud:
              </label>
              <div className="admin-input-row">
                <input
                  id="sc-url-input"
                  type="url"
                  className="admin-input"
                  placeholder="https://soundcloud.com/... или https://open.spotify.com/..."
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="admin-submit-btn"
                  disabled={loadingParse || !urlInput.trim()}
                >
                  {loadingParse ? 'Загрузка…' : 'Проверить ссылку'}
                </button>
              </div>
            </form>

            {preview && (
              <div className="admin-preview-card">
                <img src={preview.cover} alt="" className="admin-preview-cover" />
                <div className="admin-preview-info">
                  <span className={`admin-preview-tag${preview.type === 'album' ? ' is-album' : ''}`}>
                    {preview.type === 'album'
                      ? `Альбом (${preview.tracks.length} треков)`
                      : 'Сингл / Трек'}
                  </span>
                  <input
                    type="text"
                    className="admin-inline-input is-title"
                    value={preview.title}
                    onChange={e => setPreview({ ...preview, title: e.target.value })}
                    placeholder="Название трека / альбома"
                    aria-label="Название"
                  />

                  {preview.type === 'track' ? (
                    <MultiArtistSelector
                      value={preview.artist}
                      selectedArtistIds={preview.artistIds}
                      availableArtists={databaseArtists}
                      onChange={(artistName, primaryId, allIds) =>
                        setPreview({
                          ...preview,
                          artist: artistName,
                          artistId: primaryId,
                          artistIds: allIds,
                        })
                      }
                    />
                  ) : (
                    <ArtistSearchSelector
                      value={preview.artist}
                      selectedArtistId={preview.artistId}
                      availableArtists={databaseArtists}
                      onChange={(artistName, artistId) =>
                        setPreview({ ...preview, artist: artistName, artistId })
                      }
                    />
                  )}

                  <span className="admin-preview-url">{preview.soundcloudUrl || (preview as any).spotifyUrl}</span>

                  {preview.type === 'album' && preview.tracks.length > 0 && (
                    <div className="admin-preview-tracklist">
                      <span className="admin-tracklist-heading">Треклист альбома:</span>
                      <ol className="admin-tracklist-preview-list">
                        {preview.tracks.slice(0, 8).map((t, i) => (
                          <li key={t.id || i} className="admin-tracklist-preview-item">
                            <span>{t.title}</span>
                            <span className="admin-tracklist-dur">{t.duration}</span>
                          </li>
                        ))}
                        {preview.tracks.length > 8 && (
                          <li className="admin-tracklist-preview-more">
                            ... и ещё {preview.tracks.length - 8} треков
                          </li>
                        )}
                      </ol>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="admin-add-btn"
                  disabled={loadingSave}
                  onClick={handleSaveRelease}
                >
                  {loadingSave
                    ? 'Сохраняем…'
                    : preview.type === 'album'
                    ? 'Сохранить альбом'
                    : 'Сохранить трек'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Card 2: Manual Track Form */}
        {creationMode === 'track' && (
          <div className="admin-card">
            <form className="admin-manual-form" onSubmit={handleSaveManualTrack}>
              <div className="admin-form-row">
                <div className="admin-field" style={{ flex: '2 1 200px' }}>
                  <label className="admin-label">Название трека *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Например: Mulholland"
                    value={manualTrackTitle}
                    onChange={e => setManualTrackTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-field" style={{ flex: '1 1 120px' }}>
                  <label className="admin-label">Длительность</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="2:45"
                    value={manualTrackDuration}
                    onChange={e => setManualTrackDuration(e.target.value)}
                  />
                </div>
                <div className="admin-field" style={{ flex: '1.5 1 160px' }}>
                  <label className="admin-label">Альбом / Сингл</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Например: Shh..."
                    value={manualTrackAlbum}
                    onChange={e => setManualTrackAlbum(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-row is-artist-row">
                <div className="admin-field is-full">
                  <MultiArtistSelector
                    value={manualTrackArtist}
                    selectedArtistIds={manualTrackArtistIds}
                    availableArtists={databaseArtists}
                    onChange={(name, id, allIds) => {
                      setManualTrackArtist(name)
                      setManualTrackArtistId(id)
                      setManualTrackArtistIds(allIds || [])
                    }}
                  />
                </div>
              </div>

              {/* Cover upload & URL */}
              <div className="admin-field is-full">
                <label className="admin-label">Обложка трека</label>
                <div className="admin-cover-section">
                  <img
                    src={manualTrackCover || '/covers/placeholder.jpg'}
                    alt="Предпросмотр обложки"
                    className="admin-cover-preview"
                  />
                  <div className="admin-cover-inputs">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="URL обложки (https://... или загрузите файл ниже)"
                      value={manualTrackCover}
                      onChange={e => setManualTrackCover(e.target.value)}
                    />
                    <label className="admin-file-btn">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleTrackCoverUpload}
                      />
                      {uploadingTrackCover ? 'Загрузка обложки…' : 'Загрузить файл'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Audio URL */}
              <div className="admin-field is-full">
                <label className="admin-label">Ссылка на аудио (SoundCloud или прямой MP3 файл)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://soundcloud.com/... или https://.../audio.mp3"
                  value={manualTrackAudio}
                  onChange={e => setManualTrackAudio(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="admin-save-primary-btn"
                disabled={loadingSave || !manualTrackTitle.trim() || !manualTrackArtist.trim()}
              >
                {loadingSave ? 'Сохранение…' : 'Сохранить трек'}
              </button>
            </form>
          </div>
        )}

        {/* Card 3: Manual Album Form */}
        {creationMode === 'album' && (
          <div className="admin-card">
            <form className="admin-manual-form" onSubmit={handleSaveManualAlbum}>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-label">Название альбома *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Например: Blonde"
                    value={manualAlbumTitle}
                    onChange={e => setManualAlbumTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Исполнитель альбома *</label>
                  <ArtistSearchSelector
                    value={manualAlbumArtist}
                    selectedArtistId={manualAlbumArtistId}
                    availableArtists={databaseArtists}
                    onChange={(name, id) => {
                      setManualAlbumArtist(name)
                      setManualAlbumArtistId(id)
                    }}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-label">Год выпуска</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="2026"
                    value={manualAlbumYear}
                    onChange={e => setManualAlbumYear(Number(e.target.value))}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Ссылка на плейлист SoundCloud (опционально)</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://soundcloud.com/.../sets/..."
                    value={manualAlbumUrl}
                    onChange={e => setManualAlbumUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Cover upload & URL */}
              <div className="admin-field is-full">
                <label className="admin-label">Обложка альбома</label>
                <div className="admin-cover-section">
                  <img
                    src={manualAlbumCover || '/covers/placeholder.jpg'}
                    alt="Предпросмотр обложки"
                    className="admin-cover-preview"
                  />
                  <div className="admin-cover-inputs">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="URL обложки (https://... или загрузите файл ниже)"
                      value={manualAlbumCover}
                      onChange={e => setManualAlbumCover(e.target.value)}
                    />
                    <label className="admin-file-btn">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAlbumCoverUpload}
                      />
                      {uploadingAlbumCover ? 'Загрузка обложки…' : 'Загрузить файл'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Tracklist Builder */}
              <div className="admin-field is-full">
                <label className="admin-label">Треклист альбома ({albumTrackRows.length})</label>
                <div className="admin-tracklist-builder">
                  {albumTrackRows.map((row, idx) => (
                    <div key={idx} className="admin-track-item-row">
                      <span className="admin-track-num">{idx + 1}.</span>
                      <input
                        type="text"
                        className="admin-track-title-input"
                        placeholder="Название трека"
                        value={row.title}
                        onChange={e => {
                          const updated = [...albumTrackRows]
                          updated[idx].title = e.target.value
                          setAlbumTrackRows(updated)
                        }}
                      />
                      <input
                        type="text"
                        className="admin-track-artist-input"
                        placeholder="Фиты / исполнители (опц.)"
                        value={row.artist || ''}
                        onChange={e => {
                          const updated = [...albumTrackRows]
                          updated[idx].artist = e.target.value
                          setAlbumTrackRows(updated)
                        }}
                        title="Укажите соавторов/фиты (например: OG Buda)"
                      />
                      <input
                        type="text"
                        className="admin-track-dur-input"
                        placeholder="3:00"
                        value={row.duration}
                        onChange={e => {
                          const updated = [...albumTrackRows]
                          updated[idx].duration = e.target.value
                          setAlbumTrackRows(updated)
                        }}
                      />
                      <input
                        type="text"
                        className="admin-track-url-input"
                        placeholder="Аудио/SoundCloud URL (опционально)"
                        value={row.audioUrl}
                        onChange={e => {
                          const updated = [...albumTrackRows]
                          updated[idx].audioUrl = e.target.value
                          setAlbumTrackRows(updated)
                        }}
                      />
                      {albumTrackRows.length > 1 && (
                        <button
                          type="button"
                          className="admin-track-remove-btn"
                          title="Удалить трек"
                          onClick={() => {
                            setAlbumTrackRows(albumTrackRows.filter((_, i) => i !== idx))
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="admin-add-track-btn"
                    onClick={() => {
                      setAlbumTrackRows([...albumTrackRows, { title: '', duration: '3:00', audioUrl: '' }])
                    }}
                  >
                    + Добавить ещё один трек в альбом
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="admin-save-primary-btn"
                disabled={loadingSave || !manualAlbumTitle.trim() || !manualAlbumArtist.trim()}
              >
                {loadingSave ? 'Сохранение…' : 'Сохранить альбом'}
              </button>
            </form>
          </div>
        )}

        {/* Card 4: 3D Scene Slots Manager */}
        {creationMode === 'scene' && (
          <div className="admin-card admin-scene-panel">
            <div className="admin-scene-header">
              <div className="admin-scene-subtabs">
                <button
                  type="button"
                  className={`admin-scene-subtab${sceneMode === 'albums' ? ' is-active' : ''}`}
                  onClick={() => setSceneMode('albums')}
                >
                  Колесо Альбомов (12)
                </button>
                <button
                  type="button"
                  className={`admin-scene-subtab${sceneMode === 'tracks' ? ' is-active' : ''}`}
                  onClick={() => setSceneMode('tracks')}
                >
                  Колесо Треков (12)
                </button>
                <button
                  type="button"
                  className={`admin-scene-subtab${sceneMode === 'artists' ? ' is-active' : ''}`}
                  onClick={() => setSceneMode('artists')}
                >
                  Колесо Исполнителей (12)
                </button>
              </div>
            </div>

            <div className="admin-scene-grid">
              {(sceneMode === 'albums' ? sceneAlbumsState : sceneMode === 'tracks' ? sceneTracksState : sceneArtistsState).map((slot: any, idx) => (
                <div key={slot.id || `slot-${idx}`} className="admin-scene-card">
                  <div className="admin-scene-card-top">
                    <span className="admin-scene-slot-badge">Слот {idx + 1}</span>
                    <select
                      className="admin-scene-select"
                      defaultValue=""
                      onChange={(e) => {
                        const val = e.target.value
                        if (!val) return
                        handleAssignReleaseToSlot(idx, sceneMode, val)
                        e.target.value = ''
                      }}
                      title="Назначить трек или релиз из базы данных"
                    >
                      <option value="">Назначить из базы...</option>
                      {sceneMode === 'albums' ? (
                        albums.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.title} ({a.artist})
                          </option>
                        ))
                      ) : sceneMode === 'tracks' ? (
                        <>
                          {tracks.length > 0 && (
                            <optgroup label="Отдельные треки (синглы)">
                              {tracks.map(t => (
                                <option key={t.id} value={`track:${t.id}`}>
                                  {t.title} — {t.artist}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {albums.map(album => (
                            album.tracks && album.tracks.length > 0 ? (
                              <optgroup key={album.id} label={`Альбом: ${album.title} (${album.artist})`}>
                                {album.tracks.map((t, trkIdx) => (
                                  <option key={t.id || `${album.id}-${trkIdx}`} value={`album-track:${album.id}:${t.id || trkIdx}`}>
                                    {trkIdx + 1}. {t.title} {t.artist && t.artist !== album.artist ? `(${t.artist})` : ''}
                                  </option>
                                ))}
                              </optgroup>
                            ) : null
                          ))}
                        </>
                      ) : (
                        databaseArtists.length > 0 ? (
                          databaseArtists.map(art => {
                            const countText = [
                              art.albumsCount > 0 ? `${art.albumsCount} альб.` : null,
                              art.tracksCount > 0 ? `${art.tracksCount} трек.` : null,
                            ].filter(Boolean).join(', ')

                            return (
                              <option key={art.id} value={`artist:${art.id}`}>
                                {art.name} {countText ? `(${countText})` : ''}
                              </option>
                            )
                          })
                        ) : (
                          <option value="" disabled>Нет исполнителей в базе данных</option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="admin-scene-cover-wrap">
                    <img
                      src={slot.cover || '/covers/placeholder.jpg'}
                      alt={slot.title}
                      className="admin-scene-cover-img"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/covers/placeholder.jpg' }}
                    />
                    <label className="admin-scene-upload-overlay">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleSlotCoverUpload(idx, sceneMode, e)}
                      />
                      <span className="admin-scene-upload-text">
                        {uploadingSlotIndex === idx ? 'Загрузка...' : 'Загрузить фото/обложку'}
                      </span>
                    </label>
                  </div>

                  <div className="admin-scene-fields">
                    <div className="admin-scene-field">
                      <label className="admin-scene-label">
                        {sceneMode === 'artists' ? 'Имя исполнителя' : 'Название'}
                      </label>
                      <input
                        type="text"
                        className="admin-inline-input"
                        value={slot.title}
                        onChange={(e) => handleSlotFieldChange(idx, sceneMode, 'title', e.target.value)}
                        placeholder={sceneMode === 'artists' ? 'Имя артиста' : 'Название релиза'}
                      />
                    </div>
                    {sceneMode === 'artists' ? (
                      <div className="admin-scene-field">
                        <label className="admin-scene-label">Период / Номинация</label>
                        <input
                          type="text"
                          className="admin-inline-input is-artist"
                          value={slot.month || ''}
                          onChange={(e) => handleSlotFieldChange(idx, sceneMode, 'month', e.target.value)}
                          placeholder="Сезон 2026"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="admin-scene-field">
                          <label className="admin-scene-label">Исполнитель</label>
                          <input
                            type="text"
                            className="admin-inline-input is-artist"
                            value={slot.artist}
                            onChange={(e) => handleSlotFieldChange(idx, sceneMode, 'artist', e.target.value)}
                            placeholder="Исполнитель"
                          />
                        </div>
                        <div className="admin-scene-field">
                          <label className="admin-scene-label">Ссылка SoundCloud (опционально)</label>
                          <div className="admin-scene-sc-row">
                            <input
                              type="url"
                              className="admin-inline-input is-artist"
                              value={slot.soundcloudUrl || ''}
                              onChange={(e) => handleSlotFieldChange(idx, sceneMode, 'soundcloudUrl', e.target.value)}
                              placeholder="https://soundcloud.com/..."
                            />
                            {slot.soundcloudUrl?.includes('soundcloud.com') && (
                              <button
                                type="button"
                                className="admin-scene-parse-btn"
                                onClick={() => handleParseSlotSoundcloud(idx, sceneMode as 'albums' | 'tracks')}
                                title="Спарсить данные из SoundCloud"
                              >
                                Спарсить
                              </button>
                            )}
                          </div>
                        </div>
                        {sceneMode === 'albums' && slot.tracks && slot.tracks.length > 0 && (
                          <div className="admin-scene-tracks-info">
                            <span className="admin-scene-tracks-badge">
                              {slot.tracks.length} треков спарсено
                            </span>
                            <button
                              type="button"
                              className="admin-scene-fill-wheel-btn"
                              onClick={() => handlePopulateTrackWheelFromAlbum(slot)}
                              title="Заполнить 12 слотов 3D сцены (Колесо Треков) первыми песнями этого альбома"
                            >
                              Заполнить Колесо Треков 3D сцены
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    <div className="admin-scene-field">
                      <label className="admin-scene-label">URL обложки / фото</label>
                      <input
                        type="text"
                        className="admin-inline-input is-artist"
                        value={slot.cover}
                        onChange={(e) => handleSlotFieldChange(idx, sceneMode, 'cover', e.target.value)}
                        placeholder="/covers/... или https://..."
                      />
                    </div>
                  </div>

                  <div className="admin-scene-card-actions">
                    <button
                      type="button"
                      className="admin-slot-save-btn"
                      onClick={() => handleSaveSlot(idx, sceneMode)}
                    >
                      Сохранить слот {idx + 1}
                    </button>
                    <button
                      type="button"
                      className="admin-slot-reset-btn"
                      onClick={() => handleResetSlot(idx, sceneMode)}
                      title="Очистить и сбросить слот"
                    >
                      Очистить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {creationMode === 'catalog' && (
        <section className="admin-list-section" aria-label="Каталог релизов">
          <div className="admin-list-header">
            <div className="admin-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                className={`admin-tab${activeTab === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Все <span className="admin-tab-count">{albums.length + tracks.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'albums'}
                className={`admin-tab${activeTab === 'albums' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('albums')}
              >
                Альбомы <span className="admin-tab-count">{albums.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'tracks'}
                className={`admin-tab${activeTab === 'tracks' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('tracks')}
              >
                Треки <span className="admin-tab-count">{tracks.length}</span>
              </button>
            </div>
            <label className="admin-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={catalogQuery}
                onChange={e => setCatalogQuery(e.target.value)}
                placeholder="Название или исполнитель"
                aria-label="Поиск по каталогу"
              />
            </label>
          </div>

          {albums.length === 0 && tracks.length === 0 ? (
            <div className="admin-empty-state">
              <p>В каталоге пока нет релизов.</p>
              <button type="button" className="admin-empty-action" onClick={() => setCreationMode('link')}>
                Импортировать по ссылке
              </button>
            </div>
          ) : visibleAlbums.length + visibleTracks.length === 0 ? (
            <div className="admin-empty-state">
              <p>По запросу «{catalogQuery}» ничего не найдено.</p>
              <button type="button" className="admin-empty-action" onClick={() => setCatalogQuery('')}>
                Сбросить поиск
              </button>
            </div>
          ) : (
            <div className="admin-tracks-grid">
              {(activeTab === 'all' || activeTab === 'albums') &&
                visibleAlbums.map(album => (
                  <AdminAlbumItem
                    key={album.id}
                    album={album}
                    onEdit={handleStartEditAlbum}
                    onDelete={handleDeleteAlbum}
                  />
                ))}

              {(activeTab === 'all' || activeTab === 'tracks') &&
                visibleTracks.map(track => (
                  <AdminTrackItem
                    key={track.id}
                    track={track}
                    onEdit={handleStartEditTrack}
                    onDelete={handleDeleteTrack}
                  />
                ))}
            </div>
          )}
        </section>
        )}
        </div>
      </div>

      {/* Edit Release Modal */}
      {editingItem && (
        <div className="admin-edit-modal-backdrop" onClick={handleCancelEdit}>
          <div className="admin-edit-modal-window" onClick={e => e.stopPropagation()}>
            <div className="admin-edit-modal-header">
              <div>
                <span className="admin-edit-modal-badge">
                  {editingItem.type === 'album' ? 'Редактирование альбома' : 'Редактирование трека'}
                </span>
                <h3 className="admin-edit-modal-title">
                  {editingItem.item.title}
                </h3>
              </div>
              <button
                type="button"
                className="admin-edit-modal-close-btn"
                onClick={handleCancelEdit}
                aria-label="Закрыть окно редактирования"
              >
                ✕
              </button>
            </div>

            <form
              className="admin-edit-modal-form"
              onSubmit={editingItem.type === 'track' ? handleSaveEditTrack : handleSaveEditAlbum}
            >
              {/* Cover row */}
              <div className="admin-edit-cover-row">
                <div className="admin-edit-cover-preview">
                  <img
                    src={editingItem.type === 'track' ? (editTrackCover || '/covers/placeholder.jpg') : (editAlbumCover || '/covers/placeholder.jpg')}
                    alt="Обложка"
                    className="admin-edit-cover-img"
                    onError={e => { (e.target as HTMLImageElement).src = '/covers/placeholder.jpg' }}
                  />
                  <label className="admin-edit-cover-upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleUploadEditCover}
                    />
                    {uploadingEditCover ? 'Загрузка…' : 'Сменить обложку'}
                  </label>
                </div>

                <div className="admin-edit-cover-inputs">
                  <div>
                    <label className="admin-label">URL обложки / фото:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingItem.type === 'track' ? editTrackCover : editAlbumCover}
                      onChange={e => {
                        if (editingItem.type === 'track') setEditTrackCover(e.target.value)
                        else setEditAlbumCover(e.target.value)
                      }}
                      placeholder="/covers/... или https://..."
                    />
                  </div>

                  {editingItem.type === 'track' ? (
                    <div className="admin-edit-meta-grid">
                      <div>
                        <label className="admin-label">Альбом / релиз:</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editTrackAlbumTitle}
                          onChange={e => setEditTrackAlbumTitle(e.target.value)}
                          placeholder="Сингл"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Длительность:</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editTrackDuration}
                          onChange={e => setEditTrackDuration(e.target.value)}
                          placeholder="3:30"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="admin-label">Год выпуска альбома:</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={editAlbumYear}
                        onChange={e => setEditAlbumYear(Number(e.target.value) || 2026)}
                        min={1950}
                        max={2030}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title input */}
              <div className="admin-form-group">
                <label className="admin-label">
                  {editingItem.type === 'track' ? 'Название трека:' : 'Название альбома:'}
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingItem.type === 'track' ? editTrackTitle : editAlbumTitle}
                  onChange={e => {
                    if (editingItem.type === 'track') setEditTrackTitle(e.target.value)
                    else setEditAlbumTitle(e.target.value)
                  }}
                  placeholder={editingItem.type === 'track' ? 'Название песни' : 'Название альбома'}
                  required
                />
              </div>

              {/* MultiArtistSelector for track or album */}
              <div className="admin-form-group">
                <MultiArtistSelector
                  value={editingItem.type === 'track' ? editTrackArtist : editAlbumArtist}
                  selectedArtistIds={editingItem.type === 'track' ? editTrackArtistIds : editAlbumArtistIds}
                  availableArtists={databaseArtists}
                  onChange={(combined, primaryId, allIds) => {
                    if (editingItem.type === 'track') {
                      setEditTrackArtist(combined)
                      setEditTrackArtistId(primaryId)
                      setEditTrackArtistIds(allIds || [])
                    } else {
                      setEditAlbumArtist(combined)
                      setEditAlbumArtistId(primaryId)
                      setEditAlbumArtistIds(allIds || [])
                    }
                  }}
                />
              </div>

              {/* SoundCloud URL */}
              <div className="admin-form-group">
                <label className="admin-label">Ссылка SoundCloud:</label>
                <input
                  type="url"
                  className="admin-input"
                  value={editingItem.type === 'track' ? editTrackSoundcloudUrl : editAlbumSoundcloudUrl}
                  onChange={e => {
                    if (editingItem.type === 'track') setEditTrackSoundcloudUrl(e.target.value)
                    else setEditAlbumSoundcloudUrl(e.target.value)
                  }}
                  placeholder="https://soundcloud.com/..."
                />
              </div>

              {/* If Album: Tracklist editor */}
              {editingItem.type === 'album' && (
                <div className="admin-edit-tracks-section">
                  <div className="admin-edit-tracks-header">
                    <label className="admin-label">
                      Треклист альбома ({editAlbumTracks.length} треков):
                    </label>
                    <button
                      type="button"
                      className="admin-edit-add-trk-btn"
                      onClick={() => {
                        setEditAlbumTracks([
                          ...editAlbumTracks,
                          {
                            id: `sc-trk-${Date.now()}`,
                            title: `Трек ${editAlbumTracks.length + 1}`,
                            artist: editAlbumArtist || '',
                            duration: '3:00',
                            soundcloudUrl: '',
                            soundcloudTrackId: '',
                            cover: editAlbumCover || '/covers/in-rainbows.jpg',
                          },
                        ])
                      }}
                    >
                      + Добавить трек
                    </button>
                  </div>

                  <div className="admin-edit-tracks-list">
                    {editAlbumTracks.map((trk, tIdx) => (
                      <div key={trk.id || `edit-trk-${tIdx}`} className="admin-edit-trk-row">
                        <span className="admin-edit-trk-idx">{tIdx + 1}</span>
                        <input
                          type="text"
                          className="admin-input is-trk-title"
                          placeholder="Название трека"
                          value={trk.title}
                          onChange={e => {
                            const next = [...editAlbumTracks]
                            next[tIdx] = { ...next[tIdx], title: e.target.value }
                            setEditAlbumTracks(next)
                          }}
                        />
                        <input
                          type="text"
                          className="admin-input is-trk-artist"
                          placeholder="Исполнитель / фит"
                          value={trk.artist}
                          onChange={e => {
                            const next = [...editAlbumTracks]
                            next[tIdx] = { ...next[tIdx], artist: e.target.value }
                            setEditAlbumTracks(next)
                          }}
                        />
                        <input
                          type="text"
                          className="admin-input is-trk-dur"
                          placeholder="3:00"
                          value={trk.duration}
                          onChange={e => {
                            const next = [...editAlbumTracks]
                            next[tIdx] = { ...next[tIdx], duration: e.target.value }
                            setEditAlbumTracks(next)
                          }}
                        />
                        <button
                          type="button"
                          className="admin-track-remove-btn"
                          title="Удалить трек"
                          onClick={() => {
                            setEditAlbumTracks(editAlbumTracks.filter((_, i) => i !== tIdx))
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal footer actions */}
              <div className="admin-edit-modal-footer">
                <button
                  type="button"
                  className="admin-modal-cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="admin-modal-save-btn"
                  disabled={loadingEditSave}
                >
                  {loadingEditSave ? 'Сохранение…' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
