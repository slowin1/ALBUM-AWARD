import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { monthArtists, type MonthArtist } from '../data/monthArtists'
import { calculateAlbumScore, useAlbumRatings } from '../hooks/useAlbumRatings'
import { scrollToElement } from '../navigation/smoothScroll'
import { AlbumRatingCard } from './AlbumRatingCard'
import { AlbumScoreForm } from './AlbumScoreForm'
import './AlbumVotePage.css'

export type MonthArtistVotePageProps = {
  monthArtist: MonthArtist
  index: number
  onBack: () => void
  artistHref: string
  onArtistOpen: (event: MouseEvent<HTMLAnchorElement>) => void
  reducedMotion: boolean
}

function isLocalNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function MonthArtistVotePage({
  monthArtist,
  index,
  onBack,
  artistHref,
  onArtistOpen,
  reducedMotion,
}: MonthArtistVotePageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const voteHeadingRef = useRef<HTMLHeadingElement>(null)
  const rating = useAlbumRatings(`month-artist:${monthArtist.id}`)
  const savedScore = rating.saved === null ? null : calculateAlbumScore(rating.saved)
  const number = String(index + 1).padStart(2, '0')

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [monthArtist.id])

  function returnToArtists(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocalNavigation(event)) return
    event.preventDefault()
    onBack()
  }

  function scrollToVote(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocalNavigation(event)) return
    event.preventDefault()
    const target = document.getElementById('vote')
    if (target) scrollToElement(target, reducedMotion)
    voteHeadingRef.current?.focus({ preventScroll: true })
  }

  return (
    <main className="album-page" data-month-artist={monthArtist.id}>
      <section className="album-page-hero" aria-label={`Обложка исполнителя ${monthArtist.title}`}>
        <div className="album-page-hero-caption">
          <span className="album-page-number" aria-label={`Исполнитель ${index + 1} из ${monthArtists.length}`}>
            {number} <span aria-hidden="true">/ {String(monthArtists.length).padStart(2, '0')}</span>
          </span>
          <a className="album-page-scroll" href="#vote" onClick={scrollToVote}>
            Голосовать
            <svg width="17" height="22" viewBox="0 0 17 22" fill="none" aria-hidden="true">
              <path d="M8.5 1v18M2 13l6.5 6.5L15 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
        </div>
      </section>

      <section className="album-page-release" aria-labelledby="month-artist-page-title">
        <div className="album-page-release-inner">
          <p className="album-page-eyebrow">Исполнитель месяца / {number} · Album Awards</p>
          <h1 id="month-artist-page-title" ref={headingRef} tabIndex={-1}>{monthArtist.title}</h1>
          <div className="album-page-release-meta">
            <p className="album-page-artist">Артист месяца · {monthArtist.month}</p>
            <p className="album-page-year"><span>Номинация · Год</span><span>Album Awards · {monthArtist.year}</span></p>
          </div>
        </div>
      </section>

      <section className="album-page-vote" aria-labelledby="month-artist-page-vote-title">
        <div className="album-page-section-top">
          <a className="album-page-back" href="/month-artists" onClick={returnToArtists}>
            <span aria-hidden="true">←</span> К исполнителям
          </a>
          <span className="album-page-eyebrow">Демо-голосование</span>
        </div>

        <div className="album-page-vote-layout">
          <AlbumRatingCard
            album={{
              id: `month-artist:${monthArtist.id}`,
              title: monthArtist.title,
              artist: monthArtist.month,
              year: monthArtist.year,
              cover: monthArtist.cover,
              sourceUrl: monthArtist.sourceUrl,
            }}
            index={index}
            kindLabel="Исполнитель"
            metaRight={monthArtist.year}
            score={savedScore}
            scoreLabel="Твоя оценка"
            artistHref={artistHref}
            onArtistOpen={onArtistOpen}
            decorVariant="water"
            scoreCaption={rating.saved === null
              ? 'Оценка ещё не сохранена'
              : rating.persistent ? 'Сохранено на этом устройстве' : 'Сохранено до перезагрузки'}
          />

          <div className="album-page-vote-info" id="vote">
            <p className="album-page-eyebrow">Твой голос</p>
            <h2 id="month-artist-page-vote-title" ref={voteHeadingRef} tabIndex={-1}>Оцени исполнителя</h2>

            <AlbumScoreForm
              key={`month-artist:${monthArtist.id}`}
              saved={rating.saved}
              savedReviewTitle={rating.savedReviewTitle}
              savedReview={rating.savedReview}
              persistent={rating.persistent}
              onSave={(scores, review, title) =>
                rating.save(scores, review, title, {
                  title: monthArtist.title,
                  artist: monthArtist.artist,
                  cover: monthArtist.cover,
                })
              }
              onRemove={rating.remove}
              reviewTitleLabel="Заголовок рецензии"
              reviewTitlePlaceholder="Например: Главный артист месяца по форме и звуку…"
              reviewLabel="Текст рецензии об исполнителе"
              reviewPlaceholder="Напиши свою рецензию на исполнителя месяца: форма, релизы, стиль и харизма…"
            />

            <div className="album-page-actions">
              <a className="album-page-listen" href={monthArtist.sourceUrl} target="_blank" rel="noopener noreferrer">
                Слушать в Apple Music <span aria-hidden="true">↗</span>
                <span className="album-page-sr-only"> — откроется в новой вкладке</span>
              </a>
              <a className="album-page-listen" href={artistHref} onClick={onArtistOpen}>
                Профиль «{monthArtist.title}» <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <footer className="album-page-footer"><span>ALBUM AWARDS · ИСПОЛНИТЕЛИ МЕСЯЦА</span><span>{number} / {String(monthArtists.length).padStart(2, '0')}</span></footer>
      </section>
    </main>
  )
}
