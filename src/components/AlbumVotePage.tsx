import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { albums, type AlbumDefinition } from '../data/albums'
import { artists, getReleaseArtists, type ArtistDefinition } from '../data/artists'
import { calculateAlbumScore, useAlbumRatings } from '../hooks/useAlbumRatings'
import { scrollToElement } from '../navigation/smoothScroll'
import { AlbumRatingCard } from './AlbumRatingCard'
import { AlbumScoreForm } from './AlbumScoreForm'
import './AlbumVotePage.css'

export type AlbumVotePageProps = {
  album: AlbumDefinition
  index: number
  onBack: () => void
  backHref?: string
  backLabel?: string
  directVote?: boolean
  artistHref: string
  onArtistOpen: (event: MouseEvent<HTMLAnchorElement>) => void
  onSelectArtist?: (artistIndex: number) => void
  reducedMotion: boolean
}

function isLocalNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function AlbumVotePage({ album, index, onBack, backHref = '/albums', backLabel = 'К альбомам', directVote = false, artistHref, onArtistOpen, onSelectArtist, reducedMotion }: AlbumVotePageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const voteHeadingRef = useRef<HTMLHeadingElement>(null)
  const rating = useAlbumRatings(album.id)
  const savedScore = rating.saved === null ? null : calculateAlbumScore(rating.saved)
  const isWheelAlbum = index < albums.length
  const number = String(index + 1).padStart(2, '0')
  const totalLabel = isWheelAlbum ? String(albums.length).padStart(2, '0') : 'КАТАЛОГ'
  const releaseArtists = getReleaseArtists(album.artist, album.title)

  useEffect(() => {
    if (directVote) voteHeadingRef.current?.focus({ preventScroll: true })
    else headingRef.current?.focus({ preventScroll: true })
  }, [album.id, directVote])

  function returnToGallery(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocalNavigation(event)) return
    event.preventDefault()
    onBack()
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
    <main className="album-page" data-album={album.id}>
      {!directVote && (
        <>
          <section className="album-page-hero" aria-label={`Обложка альбома ${album.title}`}>
            <div className="album-page-hero-caption">
              <span className="album-page-number" aria-label={isWheelAlbum ? `Альбом ${index + 1} из ${albums.length}` : `Альбом ${album.title}`}>
                {number} <span aria-hidden="true">/ {totalLabel}</span>
              </span>
              <a className="album-page-scroll" href="#vote" onClick={scrollToVote}>
                Голосовать
                <svg width="17" height="22" viewBox="0 0 17 22" fill="none" aria-hidden="true">
                  <path d="M8.5 1v18M2 13l6.5 6.5L15 13" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
            </div>
          </section>

          <section className="album-page-release" aria-labelledby="album-page-title">
            <div className="album-page-release-inner">
              <p className="album-page-eyebrow">Альбом / {number}</p>
              <h1 id="album-page-title" ref={headingRef} tabIndex={-1}>{album.title}</h1>
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
                    <p className="album-page-artist">{album.artist}</p>
                  )}
                </div>
                <p className="album-page-year"><span>Год выпуска</span><span>{album.year}</span></p>
              </div>
            </div>
          </section>
        </>
      )}

      <section className={`album-page-vote${directVote ? ' is-direct-vote' : ''}`} aria-labelledby="album-page-vote-title">
        <div className="album-page-section-top">
          <a className="album-page-back" href={backHref} onClick={returnToGallery}>
            <span aria-hidden="true">←</span> {backLabel}
          </a>
          <span className="album-page-eyebrow">Демо-голосование</span>
        </div>

        <div className="album-page-vote-layout">
          <AlbumRatingCard
            album={album}
            index={index}
            score={savedScore}
            scoreLabel="Твоя оценка"
            artistHref={artistHref}
            onArtistOpen={onArtistOpen}
            scoreCaption={rating.saved === null
              ? 'Оценка ещё не сохранена'
              : rating.persistent ? 'Сохранено на этом устройстве' : 'Сохранено до перезагрузки'}
          />

          <div className="album-page-vote-info" id="vote">
            <p className="album-page-eyebrow">Твой голос</p>
            <h2 id="album-page-vote-title" ref={voteHeadingRef} tabIndex={-1}>Оцени альбом</h2>

            {releaseArtists.length > 0 && (
              <div className="album-page-coartists" aria-label="Исполнители альбома">
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
              key={album.id}
              saved={rating.saved}
              savedReviewTitle={rating.savedReviewTitle}
              savedReview={rating.savedReview}
              persistent={rating.persistent}
              onSave={rating.save}
              onRemove={rating.remove}
              reviewTitleLabel="Заголовок рецензии"
              reviewTitlePlaceholder="Например: Цельный концепт и безупречный продакшн…"
              reviewLabel="Текст рецензии к альбому"
              reviewPlaceholder="Напиши свою рецензию на альбом: концепция, звук, лучшие треки и атмосфера релиза…"
            />

            <div className="album-page-actions">
              <a className="album-page-listen" href={album.sourceUrl} target="_blank" rel="noopener noreferrer">
                Слушать альбом <span aria-hidden="true">↗</span>
                <span className="album-page-sr-only"> — откроется в новой вкладке</span>
              </a>
            </div>
          </div>
        </div>

        <footer className="album-page-footer"><span>ALBUM AWARDS</span><span>{number} / {totalLabel}</span></footer>
      </section>
    </main>
  )
}
