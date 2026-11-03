import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { tracks, type TrackDefinition } from '../data/tracks'
import { artists, getReleaseArtists, type ArtistDefinition } from '../data/artists'
import { calculateAlbumScore, useAlbumRatings } from '../hooks/useAlbumRatings'
import { playOrToggleTrack, useReleasePlayback } from '../hooks/useAudioPlayer'
import { scrollToElement } from '../navigation/smoothScroll'
import { AlbumRatingCard } from './AlbumRatingCard'
import { AlbumScoreForm } from './AlbumScoreForm'
import './AlbumVotePage.css'

export type TrackVotePageProps = {
  track: TrackDefinition
  index: number
  onBack: () => void
  backHref?: string
  backLabel?: string
  directVote?: boolean
  onOpenAlbum?: () => void
  albumHref?: string
  artistHref: string
  onArtistOpen: (event: MouseEvent<HTMLAnchorElement>) => void
  onSelectArtist?: (artistIndex: number) => void
  reducedMotion: boolean
}

function isLocalNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function TrackVotePage({ track, index, onBack, backHref = '/tracks', backLabel = 'К трекам', directVote = false, onOpenAlbum, albumHref, artistHref, onArtistOpen, onSelectArtist, reducedMotion }: TrackVotePageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const voteHeadingRef = useRef<HTMLHeadingElement>(null)
  const rating = useAlbumRatings(`track:${track.id}`)
  const savedScore = rating.saved === null ? null : calculateAlbumScore(rating.saved)
  const isWheelTrack = index < tracks.length
  const number = String(index + 1).padStart(2, '0')
  const totalLabel = isWheelTrack ? String(tracks.length).padStart(2, '0') : 'КАТАЛОГ'
  const releaseArtists = getReleaseArtists(track.artist, track.title)
  const playbackStatus = useReleasePlayback(`track:${track.id}`)
  const isPlaying = playbackStatus === 'playing'
  const isLoading = playbackStatus === 'loading'
  const isPaused = playbackStatus === 'paused'

  const handleTogglePlay = () => {
    playOrToggleTrack(track, isWheelTrack ? tracks : undefined)
  }

  useEffect(() => {
    if (directVote) voteHeadingRef.current?.focus({ preventScroll: true })
    else headingRef.current?.focus({ preventScroll: true })
  }, [track.id, directVote])

  function returnToTracks(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocalNavigation(event)) return
    event.preventDefault()
    onBack()
  }

  function openAlbumPage(event: MouseEvent<HTMLAnchorElement>) {
    if (!onOpenAlbum || !isLocalNavigation(event)) return
    event.preventDefault()
    onOpenAlbum()
  }

  function openSpecificArtist(event: MouseEvent<HTMLAnchorElement>, targetArtist: ArtistDefinition) {
    if (!isLocalNavigation(event)) return
    const artistIdx = artists.findIndex(a => a.id === targetArtist.id)
    if (artistIdx >= 0 && onSelectArtist) {
      event.preventDefault()
      onSelectArtist(artistIdx)
    }
  }

  function scrollToVote(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocalNavigation(event)) return
    event.preventDefault()
    const target = document.getElementById('vote')
    if (target) scrollToElement(target, reducedMotion)
    voteHeadingRef.current?.focus({ preventScroll: true })
  }

  return (
    <main className="album-page" data-track={track.id}>
      {!directVote && (
        <>
          <section className="album-page-hero" aria-label={`Обложка трека ${track.title}`}>
            <div className="album-page-hero-caption">
              <span className="album-page-number" aria-label={isWheelTrack ? `Трек ${index + 1} из ${tracks.length}` : `Трек ${track.title}`}>
                {number} <span aria-hidden="true">/ {totalLabel}</span>
              </span>
              <div className="album-page-hero-actions">
                <button
                  type="button"
                  className={`album-page-play-btn is-hero${playbackStatus !== 'idle' ? ' is-active' : ''}`}
                  onClick={handleTogglePlay}
                >
                  {isLoading ? (
                    <span className="album-page-play-spinner" aria-hidden="true" />
                  ) : isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
                      <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M7.5 5.4c0-.85.94-1.36 1.66-.9l9.4 6c.66.42.66 1.38 0 1.8l-9.4 6c-.72.46-1.66-.05-1.66-.9v-12z" />
                    </svg>
                  )}
                  <span>{isPlaying ? 'Пауза' : 'Слушать'}</span>
                </button>
                <a className="album-page-scroll" href="#vote" onClick={scrollToVote}>
                  Голосовать
                  <svg width="17" height="22" viewBox="0 0 17 22" fill="none" aria-hidden="true">
                    <path d="M8.5 1v18M2 13l6.5 6.5L15 13" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <section className="album-page-release" aria-labelledby="track-page-title">
            <div className="album-page-release-inner">
              <p className="album-page-eyebrow">Трек / {number} · {track.albumTitle}</p>
              <h1 id="track-page-title" ref={headingRef} tabIndex={-1}>{track.title}</h1>
              <div className="album-page-release-meta">
                <div className="album-page-artist-list">
                  {releaseArtists.length > 0 ? (
                    releaseArtists.map((relArtist, idx) => (
                      <span key={relArtist.id} className="album-page-artist-item">
                        {idx > 0 && <span className="album-page-artist-sep" aria-hidden="true">, </span>}
                        <a
                          className="album-page-artist-link"
                          href={`/artist/${relArtist.id}`}
                          onClick={event => openSpecificArtist(event, relArtist)}
                        >
                          {relArtist.name} <span className="album-page-artist-arrow" aria-hidden="true">↗</span>
                        </a>
                      </span>
                    ))
                  ) : (
                    <p className="album-page-artist">{track.artist}</p>
                  )}
                </div>
                <p className="album-page-year"><span>Длительность · Год</span><span>{track.duration} · {track.year}</span></p>
              </div>
            </div>
          </section>
        </>
      )}

      <section className={`album-page-vote${directVote ? ' is-direct-vote' : ''}`} aria-labelledby="track-page-vote-title">
        <div className="album-page-section-top">
          <a className="album-page-back" href={backHref} onClick={returnToTracks}>
            <span aria-hidden="true">←</span> {backLabel}
          </a>
          <span className="album-page-eyebrow">Демо-голосование</span>
        </div>

        <div className="album-page-vote-layout">
          <AlbumRatingCard
            album={{
              id: `track:${track.id}`,
              title: track.title,
              artist: track.artist,
              year: track.year,
              cover: track.cover,
              sourceUrl: track.sourceUrl,
            }}
            index={index}
            kindLabel="Трек"
            metaRight={track.year}
            score={savedScore}
            scoreLabel="Твоя оценка"
            artistHref={artistHref}
            onArtistOpen={onArtistOpen}
            decorVariant="cloud"
            scoreCaption={rating.saved === null
              ? 'Оценка ещё не сохранена'
              : rating.persistent ? 'Сохранено на этом устройстве' : 'Сохранено до перезагрузки'}
          />

          <div className="album-page-vote-info" id="vote">
            <p className="album-page-eyebrow">Твой голос</p>
            <h2 id="track-page-vote-title" ref={voteHeadingRef} tabIndex={-1}>Оцени трек</h2>

            {releaseArtists.length > 0 && (
              <div className="album-page-coartists" aria-label="Исполнители трека">
                <span className="album-page-coartists-label">Профили исполнителей:</span>
                <div className="album-page-coartists-pills">
                  {releaseArtists.map(relArtist => (
                    <a
                      key={relArtist.id}
                      className="album-page-coartist-pill"
                      href={`/artist/${relArtist.id}`}
                      onClick={event => openSpecificArtist(event, relArtist)}
                    >
                      {relArtist.name} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <AlbumScoreForm
              key={`track:${track.id}`}
              saved={rating.saved}
              savedReviewTitle={rating.savedReviewTitle}
              savedReview={rating.savedReview}
              persistent={rating.persistent}
              onSave={rating.save}
              onRemove={rating.remove}
              reviewTitleLabel="Заголовок рецензии"
              reviewTitlePlaceholder="Например: Сильнейший припев и холодный вайб…"
              reviewLabel="Текст рецензии к треку"
              reviewPlaceholder="Напиши свою рецензию на трек: разбери рифмы и образы, ритмику, реализацию стиля, харизму и вайб…"
            />

            <div className="album-page-actions">
              <button
                type="button"
                className={`album-page-play-btn${playbackStatus !== 'idle' ? ' is-active' : ''}`}
                onClick={handleTogglePlay}
              >
                {isLoading ? (
                  <span className="album-page-play-spinner" aria-hidden="true" />
                ) : isPlaying ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
                    <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.5 5.4c0-.85.94-1.36 1.66-.9l9.4 6c.66.42.66 1.38 0 1.8l-9.4 6c-.72.46-1.66-.05-1.66-.9v-12z" />
                  </svg>
                )}
                <span>
                  {isLoading
                    ? 'Загружаем…'
                    : isPlaying
                      ? 'Пауза'
                      : isPaused
                        ? 'Продолжить прослушивание'
                        : 'Слушать трек'}
                </span>
              </button>
              <a className="album-page-listen" href={track.sourceUrl} target="_blank" rel="noopener noreferrer">
                Apple Music <span aria-hidden="true">↗</span>
                <span className="album-page-sr-only"> — откроется в новой вкладке</span>
              </a>
              {albumHref && onOpenAlbum && (
                <a className="album-page-listen" href={albumHref} onClick={openAlbumPage}>
                  К альбому «{track.albumTitle}» <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <footer className="album-page-footer"><span>ALBUM AWARDS · ТРЕКИ</span><span>{number} / {totalLabel}</span></footer>
      </section>
    </main>
  )
}
