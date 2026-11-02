import { useState, useMemo, useRef, useEffect, type FormEvent, type MouseEvent, type ChangeEvent } from 'react'
import { useAuth, type UserPreferences, type PreferenceItem, getDefaultPreferences } from '../hooks/useAuth'
import { useAllUserRatings, SCORE_CRITERIA, type UserRatingItem } from '../hooks/useAlbumRatings'
import { allAlbums, allTracks, artists } from '../data/artists'
import { monthArtists } from '../data/monthArtists'
import { searchCategoryItems } from '../data/preferencesCatalog'
import { FluidBackground } from './FluidBackground'
import './UserProfilePage.css'

export type UserProfilePageProps = {
  onNavigateToGallery: () => void
  onNavigateToTracks: () => void
  onNavigateToRegister: () => void
  onNavigateToAlbum: (index: number) => void
  onNavigateToTrack: (index: number) => void
  onNavigateToMonthArtist: (index: number) => void
  onNavigateToArtist?: (index: number) => void
}

type ReleaseInfo = {
  kind: 'album' | 'track' | 'month-artist'
  index: number
  title: string
  artist: string
  cover: string
  year: string | number
  badge: string
}

function resolveRelease(id: string): ReleaseInfo | null {
  // Check albums
  const albumIdx = allAlbums.findIndex(a => a.id === id)
  if (albumIdx >= 0) {
    const item = allAlbums[albumIdx]
    return {
      kind: 'album',
      index: albumIdx,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
      year: item.year,
      badge: 'Альбом',
    }
  }

  // Check tracks
  const cleanTrackId = id.startsWith('track:') ? id.slice(6) : id
  const trackIdx = allTracks.findIndex(t => t.id === cleanTrackId || t.id === id)
  if (trackIdx >= 0) {
    const item = allTracks[trackIdx]
    return {
      kind: 'track',
      index: trackIdx,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
      year: item.year,
      badge: 'Трек',
    }
  }

  // Check month artists
  const cleanMonthId = id.startsWith('month-artist:') ? id.slice(13) : id
  const monthIdx = monthArtists.findIndex(m => m.id === cleanMonthId || m.id === id)
  if (monthIdx >= 0) {
    const item = monthArtists[monthIdx]
    return {
      kind: 'month-artist',
      index: monthIdx,
      title: item.title,
      artist: item.month,
      cover: item.cover,
      year: item.year,
      badge: 'Исполнитель месяца',
    }
  }

  return null
}

const SHORT_CRITERIA: Record<string, string> = {
  rhymes: 'Рифмы',
  structure: 'Ритмика',
  style: 'Стиль',
  individuality: 'Харизма',
  atmosphere: 'Вайб',
}

const CATEGORY_TITLES = {
  artists: 'Любимый артист',
  albums: 'Любимый альбом',
  producers: 'Саунд-продюсер',
  tracks: 'Любимый трек',
}

const CATEGORY_PLACEHOLDERS = {
  artists: 'Поиск артиста (SALUKI, Frank Ocean, Radiohead, Kai Angel...)',
  albums: 'Поиск альбома (Blonde, In Rainbows, IGOR, Currents...)',
  producers: 'Поиск продюсера (Скриптонит, Metro Boomin, White Punk, Aarne...)',
  tracks: 'Поиск трека (Mulholland, Чудо Света, одной из, Nikes...)',
}

const COLUMN_1_SECTIONS = [
  { key: 'artists' as const, title: 'Артисты', shape: 'round' as const },
  { key: 'tracks' as const, title: 'Треки', shape: 'square' as const },
  { key: 'clipmakers' as const, title: 'Клипмейкеры', shape: 'round' as const },
  { key: 'soundEngineers' as const, title: 'Звукорежиссеры', shape: 'round' as const },
]

const COLUMN_2_SECTIONS = [
  { key: 'albums' as const, title: 'Альбомы', shape: 'square' as const },
  { key: 'producers' as const, title: 'Продюсеры', shape: 'round' as const },
  { key: 'designers' as const, title: 'Дизайнеры', shape: 'round' as const },
]

export function UserProfilePage({
  onNavigateToGallery,
  onNavigateToTracks,
  onNavigateToRegister,
  onNavigateToAlbum,
  onNavigateToTrack,
  onNavigateToMonthArtist,
  onNavigateToArtist,
}: UserProfilePageProps) {
  const { user, isAuthenticated, logout, updateProfile } = useAuth()
  const { items, ratingsCount, reviewsCount, averageScore, clearAll } = useAllUserRatings()

  const [activeTab, setActiveTab] = useState<'preferences' | 'reviews' | 'ratings' | 'settings'>('preferences')
  const [filterType, setFilterType] = useState<'all' | 'album' | 'track' | 'month-artist'>('all')

  // Settings form state
  const [editNickname, setEditNickname] = useState(() => user?.nickname ?? '')
  const [editBio, setEditBio] = useState(() => user?.bio ?? '')
  const [editGenre, setEditGenre] = useState(() => user?.favoriteGenre ?? '')
  const [editAvatarUrl, setEditAvatarUrl] = useState(() => user?.avatarUrl ?? '')
  const [editPreferences, setEditPreferences] = useState<UserPreferences>(() => user?.preferences ?? getDefaultPreferences())
  const [prefEditorCategory, setPrefEditorCategory] = useState<'artists' | 'albums' | 'producers' | 'tracks'>('artists')
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null)
  const [confirmClearRatings, setConfirmClearRatings] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Interactive Search Picker Modal state
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchCategory, setSearchCategory] = useState<'artists' | 'albums' | 'producers' | 'tracks'>('artists')
  const [searchSlotIndex, setSearchSlotIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const currentPreferences = user?.preferences ?? getDefaultPreferences()

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchModalOpen) return []
    return searchCategoryItems(searchCategory, searchQuery)
  }, [searchModalOpen, searchCategory, searchQuery])

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchModalOpen])

  function openSearchPicker(category: 'artists' | 'albums' | 'producers' | 'tracks', slotIndex: number) {
    setSearchCategory(category)
    setSearchSlotIndex(slotIndex)
    setSearchQuery('')
    setSearchModalOpen(true)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 60)
  }

  function closeSearchPicker() {
    setSearchModalOpen(false)
  }

  function handleSelectSearchResult(item: PreferenceItem) {
    setEditPreferences(prev => {
      const list = [...prev[searchCategory]]
      list[searchSlotIndex] = { ...item }
      const updated = {
        ...prev,
        [searchCategory]: list,
      }
      updateProfile({ preferences: updated })
      return updated
    })
    setSearchModalOpen(false)
    setSettingsSuccess(`Выбрано: ${item.name}`)
    setTimeout(() => setSettingsSuccess(null), 3000)
  }

  function handleSelectCustomQuery() {
    const clean = searchQuery.trim()
    if (!clean) return
    const customItem: PreferenceItem = {
      id: `custom-${Date.now()}`,
      name: clean,
      subtitle: searchCategory === 'artists' ? 'Артист'
        : searchCategory === 'albums' ? 'Альбом'
        : searchCategory === 'producers' ? 'Саунд-продюсер'
        : 'Трек',
    }
    handleSelectSearchResult(customItem)
  }

  function handleClearSlot(category: 'artists' | 'albums' | 'producers' | 'tracks', slotIndex: number) {
    setEditPreferences(prev => {
      const list = [...prev[category]]
      list[slotIndex] = { id: `slot-${slotIndex}`, name: '', subtitle: '', cover: '' }
      const updated = {
        ...prev,
        [category]: list,
      }
      updateProfile({ preferences: updated })
      return updated
    })
  }

  // Enriched items with release metadata
  const enrichedItems = useMemo(() => {
    return items.map(it => {
      const release = resolveRelease(it.id)
      return {
        ...it,
        release,
      }
    })
  }, [items])

  const reviewsList = useMemo(() => {
    return enrichedItems.filter(it => it.review.text.trim().length > 0)
  }, [enrichedItems])

  const filteredReviews = useMemo(() => {
    if (filterType === 'all') return reviewsList
    return reviewsList.filter(it => it.release?.kind === filterType)
  }, [reviewsList, filterType])

  const filteredRatings = useMemo(() => {
    if (filterType === 'all') return enrichedItems
    return enrichedItems.filter(it => it.release?.kind === filterType)
  }, [enrichedItems, filterType])

  function handleSaveSettings(event: FormEvent) {
    event.preventDefault()
    setSettingsSuccess(null)
    const ok = updateProfile({
      nickname: editNickname,
      bio: editBio,
      favoriteGenre: editGenre,
      avatarSymbol: '',
      avatarUrl: editAvatarUrl,
      preferences: editPreferences,
    })
    if (ok) {
      setSettingsSuccess('Профиль и предпочтения успешно сохранены')
      setTimeout(() => setSettingsSuccess(null), 3500)
    }
  }

  function handleAvatarFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла аватара не должен превышать 5 МБ')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatarUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleLogout(event: MouseEvent) {
    event.preventDefault()
    logout()
    onNavigateToGallery()
  }

  function handleOpenRelease(release: ReleaseInfo) {
    if (release.kind === 'album') onNavigateToAlbum(release.index)
    else if (release.kind === 'track') onNavigateToTrack(release.index)
    else if (release.kind === 'month-artist') onNavigateToMonthArtist(release.index)
  }

  function handleOpenPreference(category: 'artists' | 'albums' | 'producers' | 'tracks', item: PreferenceItem) {
    const normItemName = item.name.toLowerCase().replace(/ё/g, 'е').trim()
    if (category === 'artists' || category === 'producers') {
      const artIdx = artists.findIndex(a => {
        const aNorm = a.name.toLowerCase().replace(/ё/g, 'е').trim()
        return aNorm === normItemName || a.id === item.id
      })
      if (artIdx >= 0 && onNavigateToArtist) {
        onNavigateToArtist(artIdx)
        return
      }
    }
    if (category === 'albums') {
      const albIdx = allAlbums.findIndex(a => {
        const aNorm = a.title.toLowerCase().replace(/ё/g, 'е').trim()
        return aNorm === normItemName || a.id === item.id
      })
      if (albIdx >= 0) {
        onNavigateToAlbum(albIdx)
        return
      }
    }
    if (category === 'tracks') {
      const trkIdx = allTracks.findIndex(t => {
        const tNorm = t.title.toLowerCase().replace(/ё/g, 'е').trim()
        return tNorm === normItemName || t.id === item.id
      })
      if (trkIdx >= 0) {
        onNavigateToTrack(trkIdx)
        return
      }
    }
  }

  function handleResetPreferences() {
    const def = getDefaultPreferences()
    setEditPreferences(def)
    updateProfile({ preferences: def })
    setSettingsSuccess('Предпочтения сброшены к рекомендованным')
    setTimeout(() => setSettingsSuccess(null), 3000)
  }

  function handleClearAllRatings() {
    clearAll()
    setConfirmClearRatings(false)
  }

  // If user is not authenticated, show guest welcome / login prompt
  if (!isAuthenticated || !user) {
    return (
      <main className="profile-page" role="main">
        <FluidBackground />
        <section className="profile-guest-card">
          <div className="profile-guest-avatar">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="profile-guest-title">Вход в профиль</h1>
          <p className="profile-guest-desc">
            Войдите, чтобы оценивать релизы, настраивать свои предпочтения и публиковать рецензии.
          </p>
          <div className="profile-guest-actions">
            <button type="button" className="profile-btn-primary" onClick={onNavigateToRegister}>
              Войти →
            </button>
            <button type="button" className="profile-btn-secondary" onClick={onNavigateToGallery}>
              К альбомам
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="profile-page" role="main">
      <div className="profile-layout">
        {/* Top Controls: Tabs and Filters in Column 2, Row 1 */}
        <div className="profile-top-controls">
          <nav className="profile-tabs-nav" aria-label="Вкладки профиля">
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'preferences' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Предпочтения <span className="profile-tab-count">Топ-5</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'reviews' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Рецензии <span className="profile-tab-count">{reviewsCount}</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'ratings' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('ratings')}
            >
              Оценки <span className="profile-tab-count">{ratingsCount}</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Настройки
            </button>
          </nav>

          {activeTab === 'reviews' && reviewsList.length > 0 && (
            <div className="profile-filters-row">
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                Все
              </button>
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'album' ? 'is-active' : ''}`}
                onClick={() => setFilterType('album')}
              >
                Альбомы
              </button>
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'track' ? 'is-active' : ''}`}
                onClick={() => setFilterType('track')}
              >
                Треки
              </button>
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'month-artist' ? 'is-active' : ''}`}
                onClick={() => setFilterType('month-artist')}
              >
                Исполнители
              </button>
            </div>
          )}

          {activeTab === 'ratings' && enrichedItems.length > 0 && (
            <div className="profile-filters-row">
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                Все
              </button>
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'album' ? 'is-active' : ''}`}
                onClick={() => setFilterType('album')}
              >
                Альбомы
              </button>
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'track' ? 'is-active' : ''}`}
                onClick={() => setFilterType('track')}
              >
                Треки
              </button>
              <button
                type="button"
                className={`profile-filter-btn ${filterType === 'month-artist' ? 'is-active' : ''}`}
                onClick={() => setFilterType('month-artist')}
              >
                Исполнители
              </button>
            </div>
          )}
        </div>

        {/* Left Column: Dedicated User Avatar Block (Column 1, Row 2) */}
        <aside className="profile-user-card" aria-label="Профиль">
          <FluidBackground />

          {/* Avatar - Edge-to-edge square tile */}
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-disc">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.nickname}
                  className="profile-avatar-image"
                />
              ) : (
                <span className="profile-avatar-letters">
                  {user.nickname.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* User Meta */}
          <div className="profile-user-info">
            <h1 className="profile-nickname">{user.nickname}</h1>
            <p className="profile-email">{user.email}</p>

            {user.bio && <p className="profile-bio">«{user.bio}»</p>}

            {user.favoriteGenre && (
              <span className="profile-genre-tag">{user.favoriteGenre}</span>
            )}
          </div>

          {/* User Actions */}
          <div className="profile-user-actions">
            <button
              type="button"
              className={`profile-action-btn ${activeTab === 'preferences' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Предпочтения (Топ-5)
            </button>
            <button
              type="button"
              className={`profile-action-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Настройки
            </button>
            <button
              type="button"
              className="profile-action-btn is-logout"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </aside>

        {/* Right Column: Content (Column 2, Row 2) */}
        <div className="profile-main-content">
          {/* Tab 1: Preferences (Топ: Артисты, Альбомы, Треки, Продюсеры, Клипмейкеры, Дизайнеры, Звукорежиссеры) */}
          {activeTab === 'preferences' && (
            <section className="profile-tab-content">
              <div className="profile-preferences-top">
                <h2 className="profile-preferences-main-title">Предпочтения</h2>
                <button
                  type="button"
                  className="profile-pref-edit-btn"
                  onClick={() => setActiveTab('settings')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Редактировать предпочтения</span>
                </button>
              </div>

              <div className="profile-preferences-columns">
                {/* Column 1 */}
                <div className="profile-pref-col">
                  {COLUMN_1_SECTIONS.map(section => {
                    const list = (currentPreferences[section.key as keyof UserPreferences] as PreferenceItem[] | undefined) ?? []
                    const activeItems = list.filter(item => Boolean(item && item.name && item.name.trim().length > 0))

                    return (
                      <div key={section.key} className="profile-pref-section">
                        <div className="profile-pref-section-header">
                          <span className="profile-pref-section-title">{section.title}</span>
                          <span className="profile-pref-section-line" />
                        </div>

                        {activeItems.length > 0 ? (
                          <div className="profile-pref-tiles-row">
                            {activeItems.map((item, idx) => (
                              <button
                                key={item.id || idx}
                                type="button"
                                className="profile-pref-tile"
                                onClick={() => handleOpenPreference(section.key as any, item)}
                                title={item.name}
                              >
                                {item.cover ? (
                                  <img
                                    src={item.cover}
                                    alt={item.name}
                                    className={`profile-pref-tile-image ${section.shape === 'round' ? 'is-round' : 'is-square'}`}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className={`profile-pref-tile-fallback ${section.shape === 'round' ? 'is-round' : 'is-square'}`}>
                                    ?
                                  </div>
                                )}
                                <span className="profile-pref-tile-name">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="profile-pref-empty-pill"
                            onClick={() => {
                              if (section.key === 'artists' || section.key === 'tracks') {
                                openSearchPicker(section.key, 0)
                              } else {
                                setActiveTab('settings')
                              }
                            }}
                          >
                            Нет предпочтений
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Column 2 */}
                <div className="profile-pref-col">
                  {COLUMN_2_SECTIONS.map(section => {
                    const list = (currentPreferences[section.key as keyof UserPreferences] as PreferenceItem[] | undefined) ?? []
                    const activeItems = list.filter(item => Boolean(item && item.name && item.name.trim().length > 0))

                    return (
                      <div key={section.key} className="profile-pref-section">
                        <div className="profile-pref-section-header">
                          <span className="profile-pref-section-title">{section.title}</span>
                          <span className="profile-pref-section-line" />
                        </div>

                        {activeItems.length > 0 ? (
                          <div className="profile-pref-tiles-row">
                            {activeItems.map((item, idx) => (
                              <button
                                key={item.id || idx}
                                type="button"
                                className="profile-pref-tile"
                                onClick={() => handleOpenPreference(section.key as any, item)}
                                title={item.name}
                              >
                                {item.cover ? (
                                  <img
                                    src={item.cover}
                                    alt={item.name}
                                    className={`profile-pref-tile-image ${section.shape === 'round' ? 'is-round' : 'is-square'}`}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className={`profile-pref-tile-fallback ${section.shape === 'round' ? 'is-round' : 'is-square'}`}>
                                    ?
                                  </div>
                                )}
                                <span className="profile-pref-tile-name">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="profile-pref-empty-pill"
                            onClick={() => {
                              if (section.key === 'albums' || section.key === 'producers') {
                                openSearchPicker(section.key, 0)
                              } else {
                                setActiveTab('settings')
                              }
                            }}
                          >
                            Нет предпочтений
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'reviews' && (
            <section className="profile-tab-content">
              {filteredReviews.length === 0 ? (
                <div className="profile-empty-state">
                  <div className="profile-empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="profile-empty-title">Нет рецензий</h3>
                  <p className="profile-empty-desc">
                    {filterType === 'all'
                      ? 'Вы пока не написали ни одной рецензии. Оцените любой релиз и добавьте свой текстовый обзор!'
                      : 'В этой категории пока нет опубликованных рецензий.'}
                  </p>
                  <div className="profile-empty-actions">
                    <button type="button" className="profile-btn-primary" onClick={onNavigateToGallery}>
                      К альбомам →
                    </button>
                    <button type="button" className="profile-btn-secondary" onClick={onNavigateToTracks}>
                      К трекам
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-reviews-list">
                  {filteredReviews.map(item => {
                    const rel = item.release
                    if (!rel) return null
                    return (
                      <article key={item.id} className="profile-review-card">
                        <FluidBackground />
                        <div className="profile-review-header">
                          <div className="profile-review-release">
                            <img
                              src={rel.cover}
                              alt={rel.title}
                              className="profile-review-cover"
                              loading="lazy"
                            />
                            <div className="profile-review-meta">
                              <div className="profile-review-badges">
                                <span className="profile-release-badge">{rel.badge}</span>
                                <span className="profile-review-year">{rel.year}</span>
                              </div>
                              <h3 className="profile-release-title">{rel.title}</h3>
                              <p className="profile-release-artist">{rel.artist}</p>
                            </div>
                          </div>
                          <div className="profile-review-total">
                            <span className="profile-total-value">{item.totalScore.toFixed(0)}</span>
                            <span className="profile-total-max">/100</span>
                          </div>
                        </div>

                        {/* Breakdown criteria tags */}
                        <div className="profile-criteria-grid">
                          {Object.entries(SHORT_CRITERIA).map(([key, label]) => {
                            const val = item.scores[key as keyof typeof item.scores]
                            return (
                              <div key={key} className="profile-crit-item">
                                <span className="profile-crit-label">{label}</span>
                                <span className="profile-crit-val">{val}</span>
                              </div>
                            )
                          })}
                        </div>

                        <div className="profile-review-body">
                          {item.review.title && (
                            <h4 className="profile-review-title">«{item.review.title}»</h4>
                          )}
                          <p className="profile-review-text">{item.review.text}</p>
                        </div>

                        <div className="profile-review-footer">
                          <button
                            type="button"
                            className="profile-open-btn"
                            onClick={() => handleOpenRelease(rel)}
                          >
                            Открыть ↗
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* Tab 3: All Ratings */}
          {activeTab === 'ratings' && (
            <section className="profile-tab-content">
              {enrichedItems.length === 0 ? (
                <div className="profile-empty-state">
                  <div className="profile-empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                  </div>
                  <h3 className="profile-empty-title">Нет оценок</h3>
                  <p className="profile-empty-desc">
                    Вы пока не выставили баллы ни одному релизу. Перейдите к альбомам или трекам и поставьте первую оценку!
                  </p>
                  <div className="profile-empty-actions">
                    <button type="button" className="profile-btn-primary" onClick={onNavigateToGallery}>
                      К альбомам →
                    </button>
                    <button type="button" className="profile-btn-secondary" onClick={onNavigateToTracks}>
                      К трекам
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-ratings-grid">
                  {filteredRatings.map(item => {
                    const rel = item.release
                    if (!rel) return null
                    return (
                      <div key={item.id} className="profile-rating-card" onClick={() => handleOpenRelease(rel)}>
                        <img src={rel.cover} alt={rel.title} className="profile-rating-thumb" loading="lazy" />
                        <div className="profile-rating-info">
                          <span className="profile-rating-badge">{rel.badge}</span>
                          <h4 className="profile-rating-title">{rel.title}</h4>
                          <p className="profile-rating-artist">{rel.artist}</p>
                        </div>
                        <div className="profile-rating-score">
                          <span className="profile-rating-val">{item.totalScore.toFixed(0)}</span>
                          <span className="profile-rating-unit">/100</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* Tab 4: Settings & Preferences Editor */}
          {activeTab === 'settings' && (
            <section className="profile-tab-content">
              <div className="profile-settings-card">
                <FluidBackground />
                <h2 className="profile-settings-title">Настройки профиля и предпочтений</h2>

                {settingsSuccess && (
                  <div className="profile-settings-alert" role="status">
                    {settingsSuccess}
                  </div>
                )}

                <form className="profile-settings-form" onSubmit={handleSaveSettings}>
                  {/* Avatar Upload Section */}
                  <div className="profile-field-group">
                    <span className="profile-field-label">Фото аватара</span>
                    <div className="profile-avatar-edit-box">
                      <div className="profile-avatar-preview-tile">
                        {editAvatarUrl ? (
                          <img src={editAvatarUrl} alt="Превью" className="profile-avatar-preview-img" />
                        ) : (
                          <span className="profile-avatar-preview-text">
                            {(editNickname || user.nickname).slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="profile-avatar-controls">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarFileUpload}
                        />
                        <button
                          type="button"
                          className="profile-btn-primary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Загрузить фото с устройства ↗
                        </button>
                        {editAvatarUrl && (
                          <button
                            type="button"
                            className="profile-avatar-remove-btn"
                            onClick={() => setEditAvatarUrl('')}
                          >
                            Удалить фото
                          </button>
                        )}
                        <input
                          type="url"
                          value={editAvatarUrl}
                          onChange={e => setEditAvatarUrl(e.target.value)}
                          className="profile-text-input"
                          placeholder="Или вставьте прямую ссылку на фото (https://...)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="profile-field-group">
                    <label htmlFor="settings-nickname" className="profile-field-label">
                      Никнейм
                    </label>
                    <input
                      id="settings-nickname"
                      type="text"
                      required
                      value={editNickname}
                      onChange={e => setEditNickname(e.target.value)}
                      className="profile-text-input"
                      placeholder="Никнейм"
                    />
                  </div>

                  {/* Bio */}
                  <div className="profile-field-group">
                    <label htmlFor="settings-bio" className="profile-field-label">
                      О себе
                    </label>
                    <textarea
                      id="settings-bio"
                      rows={2}
                      value={editBio}
                      onChange={e => setEditBio(e.target.value)}
                      className="profile-textarea"
                      placeholder="Кратко о музыкальном вкусе…"
                    />
                  </div>

                  {/* Favorite Genre */}
                  <div className="profile-field-group">
                    <label htmlFor="settings-genre" className="profile-field-label">
                      Любимый артист / звук
                    </label>
                    <input
                      id="settings-genre"
                      type="text"
                      value={editGenre}
                      onChange={e => setEditGenre(e.target.value)}
                      className="profile-text-input"
                      placeholder="Артист, жанр или стиль"
                    />
                  </div>

                  {/* Preferences Top-5 Editor */}
                  <div className="profile-field-group profile-pref-editor-block">
                    <div className="profile-pref-editor-top">
                      <div>
                        <span className="profile-field-label">
                          Настройка предпочтений: Топ-5
                        </span>
                        <p className="profile-pref-editor-hint">
                          Нажмите на строку любого слота, чтобы открыть удобный поиск по каталогу.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="profile-pref-reset-btn"
                        onClick={handleResetPreferences}
                      >
                        Сбросить к рекомендованным
                      </button>
                    </div>

                    {/* Category Selector */}
                    <div className="profile-pref-editor-tabs">
                      <button
                        type="button"
                        className={`profile-pref-editor-tab ${prefEditorCategory === 'artists' ? 'is-active' : ''}`}
                        onClick={() => setPrefEditorCategory('artists')}
                      >
                        Артисты (5)
                      </button>
                      <button
                        type="button"
                        className={`profile-pref-editor-tab ${prefEditorCategory === 'albums' ? 'is-active' : ''}`}
                        onClick={() => setPrefEditorCategory('albums')}
                      >
                        Альбомы (5)
                      </button>
                      <button
                        type="button"
                        className={`profile-pref-editor-tab ${prefEditorCategory === 'producers' ? 'is-active' : ''}`}
                        onClick={() => setPrefEditorCategory('producers')}
                      >
                        Продюсеры (5)
                      </button>
                      <button
                        type="button"
                        className={`profile-pref-editor-tab ${prefEditorCategory === 'tracks' ? 'is-active' : ''}`}
                        onClick={() => setPrefEditorCategory('tracks')}
                      >
                        Треки (5)
                      </button>
                    </div>

                    {/* 5 Interactive Searchable Slot Rows */}
                    <div className="profile-pref-slots-list">
                      {Array.from({ length: 5 }).map((_, slotIdx) => {
                        const item = editPreferences[prefEditorCategory][slotIdx] ?? { id: `slot-${slotIdx}`, name: '', subtitle: '', cover: '' }
                        return (
                          <div
                            key={slotIdx}
                            className={`profile-pref-slot-card is-clickable ${item.name ? 'has-item' : 'is-empty'}`}
                            onClick={() => openSearchPicker(prefEditorCategory, slotIdx)}
                          >
                            <span className="profile-pref-slot-rank">#{slotIdx + 1}</span>
                            {item.cover ? (
                              <img
                                src={item.cover}
                                alt={item.name}
                                className={`profile-pref-slot-thumb ${prefEditorCategory === 'artists' ? 'is-artist' : ''}`}
                              />
                            ) : (
                              <div className="profile-pref-slot-thumb-fallback">
                                {item.name ? item.name.slice(0, 2).toUpperCase() : '+'}
                              </div>
                            )}
                            <div className="profile-pref-slot-details">
                              <span className="profile-pref-slot-name">
                                {item.name || `Нажмите, чтобы выбрать: ${CATEGORY_TITLES[prefEditorCategory]}`}
                              </span>
                              {item.subtitle && (
                                <span className="profile-pref-slot-sub">{item.subtitle}</span>
                              )}
                            </div>
                            <div className="profile-pref-slot-actions">
                              <button
                                type="button"
                                className="profile-pref-slot-choose-btn"
                                onClick={e => {
                                  e.stopPropagation()
                                  openSearchPicker(prefEditorCategory, slotIdx)
                                }}
                              >
                                {item.name ? 'Сменить' : 'Поиск'}
                              </button>
                              {item.name && (
                                <button
                                  type="button"
                                  className="profile-pref-slot-clear-btn"
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleClearSlot(prefEditorCategory, slotIdx)
                                  }}
                                  title="Очистить слот"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="profile-settings-footer">
                    <button type="submit" className="profile-btn-primary">
                      Сохранить все изменения
                    </button>
                  </div>
                </form>

                {/* Danger Zone */}
                <div className="profile-danger-zone">
                  <div className="profile-danger-actions">
                    {!confirmClearRatings ? (
                      <button
                        type="button"
                        className="profile-danger-btn"
                        onClick={() => setConfirmClearRatings(true)}
                      >
                        Сбросить оценки
                      </button>
                    ) : (
                      <div className="profile-danger-confirm">
                        <span>Сбросить все оценки?</span>
                        <button
                          type="button"
                          className="profile-danger-confirm-yes"
                          onClick={handleClearAllRatings}
                        >
                          Да
                        </button>
                        <button
                          type="button"
                          className="profile-danger-confirm-no"
                          onClick={() => setConfirmClearRatings(false)}
                        >
                          Отмена
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      className="profile-danger-btn"
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ====================================================
          INTERACTIVE SEARCH PICKER MODAL
          ==================================================== */}
      {searchModalOpen && (
        <div className="profile-search-modal-backdrop" onClick={closeSearchPicker}>
          <div className="profile-search-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="profile-search-header">
              <div className="profile-search-header-meta">
                <span className="profile-search-category-tag">
                  {CATEGORY_TITLES[searchCategory].toUpperCase()} · СЛОТ #{searchSlotIndex + 1}
                </span>
                <h3 className="profile-search-title">
                  Выбрать: {CATEGORY_TITLES[searchCategory]}
                </h3>
              </div>
              <button
                type="button"
                className="profile-search-close-btn"
                onClick={closeSearchPicker}
                aria-label="Закрыть поиск"
              >
                ✕
              </button>
            </div>

            {/* Category Switcher Tabs inside Modal */}
            <div className="profile-search-cat-tabs">
              <button
                type="button"
                className={`profile-search-cat-tab ${searchCategory === 'artists' ? 'is-active' : ''}`}
                onClick={() => {
                  setSearchCategory('artists')
                  setSearchQuery('')
                  searchInputRef.current?.focus()
                }}
              >
                Артисты
              </button>
              <button
                type="button"
                className={`profile-search-cat-tab ${searchCategory === 'albums' ? 'is-active' : ''}`}
                onClick={() => {
                  setSearchCategory('albums')
                  setSearchQuery('')
                  searchInputRef.current?.focus()
                }}
              >
                Альбомы
              </button>
              <button
                type="button"
                className={`profile-search-cat-tab ${searchCategory === 'producers' ? 'is-active' : ''}`}
                onClick={() => {
                  setSearchCategory('producers')
                  setSearchQuery('')
                  searchInputRef.current?.focus()
                }}
              >
                Продюсеры
              </button>
              <button
                type="button"
                className={`profile-search-cat-tab ${searchCategory === 'tracks' ? 'is-active' : ''}`}
                onClick={() => {
                  setSearchCategory('tracks')
                  setSearchQuery('')
                  searchInputRef.current?.focus()
                }}
              >
                Треки
              </button>
            </div>

            {/* Search Input Box */}
            <div className="profile-search-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="profile-search-input-icon">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                    if (searchResults.length > 0) {
                      handleSelectSearchResult(searchResults[0])
                    } else {
                      handleSelectCustomQuery()
                    }
                  }
                }}
                placeholder={CATEGORY_PLACEHOLDERS[searchCategory]}
                className="profile-search-input"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="profile-search-clear-query"
                  onClick={() => {
                    setSearchQuery('')
                    searchInputRef.current?.focus()
                  }}
                  aria-label="Очистить строку"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Custom choice button if query is typed */}
            {searchQuery.trim().length > 0 && (
              <div className="profile-search-custom-row">
                <button
                  type="button"
                  className="profile-search-custom-btn"
                  onClick={handleSelectCustomQuery}
                >
                  <span>Добавить своё значение:</span> <strong>«{searchQuery.trim()}»</strong>
                </button>
              </div>
            )}

            {/* Search Results List */}
            <div className="profile-search-results-list">
              {searchResults.length === 0 ? (
                <div className="profile-search-empty">
                  <p className="profile-search-empty-text">Ничего не найдено в каталоге</p>
                  <button
                    type="button"
                    className="profile-search-empty-use-btn"
                    onClick={handleSelectCustomQuery}
                  >
                    Добавить «{searchQuery.trim()}»
                  </button>
                </div>
              ) : (
                searchResults.map(item => (
                  <div
                    key={item.id}
                    className="profile-search-item"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.name}
                        className={`profile-search-item-thumb ${searchCategory === 'artists' ? 'is-artist' : ''}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="profile-search-item-fallback">
                        {item.name.slice(0, 2).toUpperCase() || 'AA'}
                      </div>
                    )}
                    <div className="profile-search-item-info">
                      <span className="profile-search-item-name">{item.name}</span>
                      {item.subtitle && (
                        <span className="profile-search-item-sub">{item.subtitle}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="profile-search-item-select-pill"
                    >
                      Выбрать
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
