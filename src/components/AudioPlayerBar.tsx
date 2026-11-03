import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type MouseEvent } from 'react'
import { artists, getReleaseArtists } from '../data/artists'
import { albumPath, trackPath } from '../navigation/albumNavigation'
import {
  formatAudioTime,
  useAudioPlayer,
  useAudioProgress,
  type PlayableTrack,
} from '../hooks/useAudioPlayer'
import { NowPlayingScene } from './NowPlayingScene'
import './AudioPlayerBar.css'

export type AudioPlayerBarProps = {
  onOpenAlbum: (albumIndex: number, vote?: boolean) => void
  onOpenTrack: (trackIndex: number, vote?: boolean) => void
  onOpenArtist: (
    artistIndex: number,
    fromReleaseIndex: number,
    fromMode: 'album' | 'track',
  ) => void
}

function CapsuleProgressLine({ disabled }: { disabled: boolean }) {
  const { currentTime, duration } = useAudioProgress()
  const { seekTo } = useAudioPlayer()
  const safeDuration = duration > 0 ? duration : 30
  const clampedCurrent = Math.min(safeDuration, Math.max(0, currentTime))
  const progressPct = safeDuration > 0 ? (clampedCurrent / safeDuration) * 100 : 0

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    seekTo(Number(event.target.value))
  }

  return (
    <div
      className="audio-capsule-progress"
      style={{ '--seek-pct': `${progressPct.toFixed(2)}%` } as CSSProperties}
    >
      <div className="audio-capsule-progress-track" aria-hidden="true">
        <div className="audio-capsule-progress-fill" />
      </div>
      <input
        type="range"
        className="audio-capsule-seek-input"
        min={0}
        max={safeDuration}
        step={0.05}
        value={clampedCurrent}
        disabled={disabled}
        onChange={handleSeek}
        aria-label={`Позиция воспроизведения: ${formatAudioTime(clampedCurrent)} из ${formatAudioTime(safeDuration)}`}
      />
      <div className="audio-capsule-time-tooltip" aria-hidden="true">
        <span>{formatAudioTime(clampedCurrent)}</span>
        <span>/</span>
        <span>{formatAudioTime(safeDuration)}</span>
      </div>
    </div>
  )
}

type ActivePopover = 'none' | 'queue' | 'more' | 'volume'

export function AudioPlayerBar({
  onOpenAlbum,
  onOpenTrack,
  onOpenArtist,
}: AudioPlayerBarProps) {
  const {
    queue,
    currentIndex,
    currentTrack,
    isPlaying,
    isLoading,
    error,
    volume,
    muted,
    repeatMode,
    shuffle,
    togglePlay,
    playNext,
    playPrev,
    selectQueueTrack,
    setVolume,
    toggleMute,
    cycleRepeatMode,
    toggleShuffle,
    closePlayer,
  } = useAudioPlayer()

  const [popover, setPopover] = useState<ActivePopover>('none')
  const [brokenCover, setBrokenCover] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (popover === 'none') return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        setPopover('none')
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPopover('none')
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKey)
    }
  }, [popover])

  const [sceneOpen, setSceneOpen] = useState(false)

  if (!currentTrack) return null

  const effectiveVol = muted ? 0 : volume
  const volPct = Math.round(effectiveVol * 100)
  const releaseArtists = getReleaseArtists(currentTrack.artist, currentTrack.title)
  const primaryArtist = releaseArtists[0]
  const primaryArtistIdx = primaryArtist ? artists.indexOf(primaryArtist) : -1

  const getReleaseHref = (item: PlayableTrack): string | undefined => {
    if (item.trackIndex !== undefined) return `${trackPath(item.trackIndex)}#vote`
    if (item.albumIndex !== undefined) return `${albumPath(item.albumIndex)}#vote`
    return undefined
  }

  const navigateToCurrentRelease = () => {
    setPopover('none')
    if (currentTrack.trackIndex !== undefined) {
      onOpenTrack(currentTrack.trackIndex, true)
    } else if (currentTrack.albumIndex !== undefined) {
      onOpenAlbum(currentTrack.albumIndex, true)
    }
  }

  const handleOpenCurrentRelease = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (currentTrack.trackIndex !== undefined || currentTrack.albumIndex !== undefined) {
      event.preventDefault()
      navigateToCurrentRelease()
    }
  }

  const handleArtistClick = (artistIdx: number) => {
    if (artistIdx < 0) return
    setPopover('none')
    if (currentTrack.trackIndex !== undefined) {
      onOpenArtist(artistIdx, currentTrack.trackIndex, 'track')
    } else if (currentTrack.albumIndex !== undefined) {
      onOpenArtist(artistIdx, currentTrack.albumIndex, 'album')
    } else {
      onOpenArtist(artistIdx, 0, 'album')
    }
  }

  const releaseHref = getReleaseHref(currentTrack)
  const subtitleAlbum =
    currentTrack.albumTitle &&
    currentTrack.albumTitle.trim().length > 0
      ? currentTrack.albumTitle
      : ''

  const repeatLabel =
    repeatMode === 'one'
      ? 'Повтор одного трека'
      : repeatMode === 'all'
        ? 'Повтор очереди'
        : 'Повтор выключен'

  const toggleNamedPopover = (target: ActivePopover) => {
    setPopover(prev => (prev === target ? 'none' : target))
  }

  return (
    <>
    {sceneOpen && <NowPlayingScene track={currentTrack} onClose={() => setSceneOpen(false)} />}
    <div
      ref={containerRef}
      role="region"
      className={`audio-player-dock${isPlaying ? ' is-playing' : ''}${sceneOpen ? ' is-scene-hidden' : ''}`}
      aria-label="Аудиоплеер"
      data-scene-pointer-ignore
      data-smooth-scroll-prevent
    >
      {/* MORE MENU POPOVER */}
      {popover === 'more' && (
        <div className="audio-capsule-popover is-more-menu" role="menu" aria-label="Действия с треком">
          {(currentTrack.trackIndex !== undefined || currentTrack.albumIndex !== undefined) && (
            <button
              type="button"
              className="audio-more-item"
              role="menuitem"
              onClick={navigateToCurrentRelease}
            >
              <span>Перейти к оцениванию релиза</span>
              <span className="audio-more-arrow" aria-hidden="true">→</span>
            </button>
          )}
          {primaryArtistIdx >= 0 && (
            <button
              type="button"
              className="audio-more-item"
              role="menuitem"
              onClick={() => handleArtistClick(primaryArtistIdx)}
            >
              <span>Профиль {primaryArtist.name}</span>
              <span className="audio-more-arrow" aria-hidden="true">→</span>
            </button>
          )}
          <a
            href={currentTrack.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="audio-more-item"
            role="menuitem"
            onClick={() => setPopover('none')}
          >
            <span>Открыть в Apple Music</span>
            <span className="audio-more-arrow" aria-hidden="true">↗</span>
          </a>
          <div className="audio-more-divider" role="separator" />
          <button
            type="button"
            className="audio-more-item is-danger"
            role="menuitem"
            onClick={() => {
              setPopover('none')
              closePlayer()
            }}
          >
            <span>Остановить и скрыть плеер</span>
          </button>
        </div>
      )}

      {/* VOLUME POPOVER */}
      {popover === 'volume' && (
        <div className="audio-capsule-popover is-volume-menu" role="dialog" aria-label="Громкость">
          <button
            type="button"
            className="audio-vol-mute-btn"
            onClick={toggleMute}
            aria-label={effectiveVol === 0 ? 'Включить звук' : 'Выключить звук'}
          >
            {effectiveVol === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 9.2H6.8L11.4 5.2C12.05 4.64 13 5.1 13 5.96V18.04C13 18.9 12.05 19.36 11.4 18.8L6.8 14.8H3.6C2.94 14.8 2.4 14.26 2.4 13.6V10.4C2.4 9.74 2.94 9.2 3.6 9.2Z" />
                <path d="M16.5 9.5L21 14M21 9.5L16.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 9.2H6.8L11.4 5.2C12.05 4.64 13 5.1 13 5.96V18.04C13 18.9 12.05 19.36 11.4 18.8L6.8 14.8H3.6C2.94 14.8 2.4 14.26 2.4 13.6V10.4C2.4 9.74 2.94 9.2 3.6 9.2Z" />
                <path d="M16.2 8.8a4.8 4.8 0 0 1 0 6.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <input
            type="range"
            className="audio-vol-slider"
            min={0}
            max={1}
            step={0.01}
            value={effectiveVol}
            onChange={e => setVolume(Number(e.target.value))}
            aria-label="Уровень громкости"
            style={{ '--vol-pct': `${volPct}%` } as CSSProperties}
          />
          <span className="audio-vol-value">{volPct}%</span>
        </div>
      )}

      {/* QUEUE POPOVER */}
      {popover === 'queue' && queue.length > 0 && (
        <div className="audio-capsule-popover is-queue-menu" role="dialog" aria-label="Очередь воспроизведения">
          <div className="audio-player-queue-header">
            <div className="audio-player-queue-title-wrap">
              <span className="audio-player-queue-title">Далее в очереди</span>
              <span className="audio-player-queue-count">{queue.length}</span>
            </div>
            <button
              type="button"
              className="audio-queue-close-btn"
              onClick={() => setPopover('none')}
              aria-label="Закрыть очередь"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="audio-player-queue-list">
            {queue.map((item, idx) => {
              const isCurrent = idx === currentIndex
              return (
                <button
                  key={`${item.uid}-${idx}`}
                  type="button"
                  className={`audio-player-queue-item${isCurrent ? ' is-current' : ''}`}
                  onClick={() => selectQueueTrack(idx)}
                >
                  <span className="audio-player-queue-index">
                    {isCurrent && isPlaying ? (
                      <span className="audio-eq-bars" aria-hidden="true">
                        <i /><i /><i />
                      </span>
                    ) : (
                      item.trackNumber ?? idx + 1
                    )}
                  </span>
                  <img
                    src={item.cover}
                    alt=""
                    width="36"
                    height="36"
                    loading="lazy"
                    decoding="async"
                    className="audio-player-queue-cover"
                  />
                  <span className="audio-player-queue-info">
                    <span className="audio-player-queue-name">{item.title}</span>
                    <span className="audio-player-queue-artist">{item.artist}</span>
                  </span>
                  {item.durationLabel && (
                    <span className="audio-player-queue-duration">{item.durationLabel}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* MAIN LIQUID GLASS CAPSULE BAR */}
      <div className="audio-capsule-bar">
        {/* LEFT CLUSTER: Shuffle, Rewind, Play/Pause, Fast-Forward, Repeat */}
        <div className="audio-capsule-transport">
          <button
            type="button"
            className={`audio-capsule-btn is-aux${shuffle ? ' is-active' : ''}`}
            onClick={toggleShuffle}
            aria-pressed={shuffle}
            aria-label="Перемешать"
            title={shuffle ? 'Перемешивание включено' : 'Перемешать'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M17.5 4.5L20.5 7.5L17.5 10.5M17.5 13.5L20.5 16.5L17.5 19.5M3.5 7.5H6.8C8.3 7.5 9.5 8.3 10.4 9.7L13.6 14.3C14.5 15.7 15.7 16.5 17.2 16.5H20M3.5 16.5H6.8C8.3 16.5 9.5 15.7 10.4 14.3L13.6 9.7C14.5 8.3 15.7 7.5 17.2 7.5H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="audio-capsule-btn is-skip"
            onClick={playPrev}
            aria-label="Предыдущий трек"
            title="Предыдущий трек"
          >
            <svg width="26" height="26" viewBox="0 0 28 24" fill="currentColor" aria-hidden="true">
              <path d="M12.9 6.1c.76-.55 1.82-.01 1.82.93v9.94c0 .94-1.06 1.48-1.82.93l-6.85-4.97a1.15 1.15 0 0 1 0-1.86l6.85-4.97Z" />
              <path d="M22.7 6.1c.76-.55 1.82-.01 1.82.93v9.94c0 .94-1.06 1.48-1.82.93l-6.85-4.97a1.15 1.15 0 0 1 0-1.86l6.85-4.97Z" />
            </svg>
          </button>

          <button
            type="button"
            className="audio-capsule-btn is-play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            title={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isLoading ? (
              <span className="audio-capsule-spinner" aria-hidden="true" />
            ) : isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5.5" y="3.8" width="4.6" height="16.4" rx="1.5" />
                <rect x="13.9" y="3.8" width="4.6" height="16.4" rx="1.5" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="audio-capsule-play-tri">
                <path d="M6.8 4.5c0-.95 1.05-1.52 1.85-.99l10.8 7.02c.72.47.72 1.51 0 1.98L8.65 19.5c-.8.53-1.85-.04-1.85-.99V4.5Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="audio-capsule-btn is-skip"
            onClick={playNext}
            aria-label="Следующий трек"
            title="Следующий трек"
          >
            <svg width="26" height="26" viewBox="0 0 28 24" fill="currentColor" aria-hidden="true">
              <path d="M5.3 6.1c-.76-.55-1.82-.01-1.82.93v9.94c0 .94 1.06 1.48 1.82.93l6.85-4.97a1.15 1.15 0 0 0 0-1.86L5.3 6.1Z" />
              <path d="M15.1 6.1c-.76-.55-1.82-.01-1.82.93v9.94c0 .94 1.06 1.48 1.82.93l6.85-4.97a1.15 1.15 0 0 0 0-1.86L15.1 6.1Z" />
            </svg>
          </button>

          <button
            type="button"
            className={`audio-capsule-btn is-aux${repeatMode !== 'off' ? ' is-active' : ''}`}
            onClick={cycleRepeatMode}
            aria-label={repeatLabel}
            title={repeatLabel}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M17 3.5L20.5 7L17 10.5M4 11V9.5C4 7.57 5.57 6 7.5 6H20M7 20.5L3.5 17L7 13.5M20 13V14.5C20 16.43 18.43 18 16.5 18H4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {repeatMode === 'one' && <span className="audio-capsule-repeat-badge">1</span>}
          </button>
        </div>

        {/* CENTER TRACK ZONE: Cover + Title/Artist—Album + More (•••) + Bottom Progress Line */}
        <div className="audio-capsule-center">
          <div className="audio-capsule-track-row">
            <button
              type="button"
              className="audio-capsule-cover-link is-expand"
              onClick={() => { setPopover('none'); setSceneOpen(true) }}
              aria-label={`Развернуть сцену трека ${currentTrack.title}`}
              title="Развернуть сцену и текст"
            >
              {brokenCover !== currentTrack.cover ? (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  width="46"
                  height="46"
                  className="audio-capsule-cover"
                  onError={() => setBrokenCover(currentTrack.cover)}
                />
              ) : (
                <span className="audio-capsule-cover-fallback">AA</span>
              )}
            </button>

            <div className="audio-capsule-meta">
              {releaseHref ? (
                <a
                  href={releaseHref}
                  className="audio-capsule-title"
                  onClick={handleOpenCurrentRelease}
                  title={currentTrack.title}
                >
                  {currentTrack.title}
                </a>
              ) : (
                <span className="audio-capsule-title" title={currentTrack.title}>
                  {currentTrack.title}
                </span>
              )}

              {error ? (
                <span className="audio-capsule-error" role="status">{error}</span>
              ) : (
                <div className="audio-capsule-subtitle">
                  {releaseArtists.length > 0 ? (
                    releaseArtists.slice(0, 3).map((art, i) => {
                      const artIdx = artists.indexOf(art)
                      return (
                        <span key={art.id} className="audio-capsule-artist-wrap">
                          {i > 0 && <span>, </span>}
                          <button
                            type="button"
                            className="audio-capsule-artist-link"
                            onClick={() => handleArtistClick(artIdx)}
                          >
                            {art.name}
                          </button>
                        </span>
                      )
                    })
                  ) : (
                    <span>{currentTrack.artist}</span>
                  )}
                  {subtitleAlbum && (
                    <span className="audio-capsule-album"> — {subtitleAlbum}</span>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`audio-capsule-btn is-more${popover === 'more' ? ' is-active' : ''}`}
              onClick={() => toggleNamedPopover('more')}
              aria-expanded={popover === 'more'}
              aria-label="Дополнительные действия"
              title="Ещё"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5.5" cy="12" r="1.9" />
                <circle cx="12" cy="12" r="1.9" />
                <circle cx="18.5" cy="12" r="1.9" />
              </svg>
            </button>
          </div>

          <CapsuleProgressLine disabled={isLoading && !currentTrack.audioUrl} />
        </div>

        {/* RIGHT CLUSTER: Speech-Quote (Vote/Review), Queue List, Volume Speaker */}
        <div className="audio-capsule-utilities">
          <button
            type="button"
            className="audio-capsule-btn is-util"
            onClick={navigateToCurrentRelease}
            disabled={currentTrack.trackIndex === undefined && currentTrack.albumIndex === undefined}
            aria-label="Оценить и написать рецензию"
            title="Оценить и написать рецензию"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.2 4.2h11.6c1.66 0 3 1.34 3 3v7.2c0 1.66-1.34 3-3 3H11l-3.9 3.1c-.55.44-1.36.05-1.36-.66V17.4H6.2c-1.66 0-3-1.34-3-3V7.2c0-1.66 1.34-3 3-3Z"
                stroke="currentColor"
                strokeWidth="1.95"
                strokeLinejoin="round"
              />
              <path
                d="M9.6 9.5c-.7 0-1.2.5-1.2 1.15 0 .62.48 1.1 1.1 1.1.22 0 .4-.05.55-.14-.12.78-.58 1.32-1.25 1.62M14.8 9.5c-.7 0-1.2.5-1.2 1.15 0 .62.48 1.1 1.1 1.1.22 0 .4-.05.55-.14-.12.78-.58 1.32-1.25 1.62"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`audio-capsule-btn is-util${popover === 'queue' ? ' is-active' : ''}`}
            onClick={() => toggleNamedPopover('queue')}
            aria-expanded={popover === 'queue'}
            aria-label={`Очередь воспроизведения (${queue.length})`}
            title={`Очередь (${queue.length})`}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="4.8" cy="6.5" r="1.45" fill="currentColor" />
              <circle cx="4.8" cy="12" r="1.45" fill="currentColor" />
              <circle cx="4.8" cy="17.5" r="1.45" fill="currentColor" />
              <path
                d="M9.2 6.5h10.6M9.2 12h10.6M9.2 17.5h10.6"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`audio-capsule-btn is-util${popover === 'volume' ? ' is-active' : ''}`}
            onClick={() => toggleNamedPopover('volume')}
            onDoubleClick={toggleMute}
            aria-expanded={popover === 'volume'}
            aria-label="Громкость"
            title={`Громкость: ${volPct}%`}
          >
            {effectiveVol === 0 ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 9.2H6.8L11.5 5.1C12.16 4.53 13.15 5 13.15 5.87V18.13C13.15 19 12.16 19.47 11.5 18.9L6.8 14.8H3.6C2.94 14.8 2.4 14.26 2.4 13.6V10.4C2.4 9.74 2.94 9.2 3.6 9.2Z" />
                <path d="M16.5 9.5L21 14M21 9.5L16.5 14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 9.2H6.8L11.5 5.1C12.16 4.53 13.15 5 13.15 5.87V18.13C13.15 19 12.16 19.47 11.5 18.9L6.8 14.8H3.6C2.94 14.8 2.4 14.26 2.4 13.6V10.4C2.4 9.74 2.94 9.2 3.6 9.2Z" />
                <path
                  d="M16.1 8.9a4.6 4.6 0 0 1 0 6.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {effectiveVol > 0.4 && (
                  <path
                    d="M18.9 6.3a8.3 8.3 0 0 1 0 11.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
