import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import {
  SCORE_CRITERIA,
  DEFAULT_SCORES,
  calculateAlbumScore,
  type AlbumScores,
} from '../hooks/useAlbumRatings'
import { useAuth } from '../hooks/useAuth'
import './AlbumScoreForm.css'

export type AlbumScoreFormProps = {
  saved: AlbumScores | null
  savedReviewTitle?: string
  savedReview?: string
  persistent: boolean
  onSave: (scores: AlbumScores, review: string, reviewTitle: string) => void
  onRemove: () => void
  reviewTitleLabel?: string
  reviewTitlePlaceholder?: string
  reviewLabel?: string
  reviewPlaceholder?: string
}

function sameScores(left: AlbumScores, right: AlbumScores) {
  return SCORE_CRITERIA.every(({ id }) => left[id] === right[id])
}

const scoreFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })
const MAX_TITLE_CHARS = 120
const MAX_REVIEW_CHARS = 1200

export function AlbumScoreForm({
  saved,
  savedReviewTitle = '',
  savedReview = '',
  persistent,
  onSave,
  onRemove,
  reviewTitleLabel = 'Заголовок рецензии',
  reviewTitlePlaceholder = 'Краткий заголовок твоей рецензии…',
  reviewLabel = 'Текст рецензии',
  reviewPlaceholder = 'Напиши свою рецензию: разбери рифмы и образы, ритмику, реализацию стиля, харизму артиста и общий вайб…',
}: AlbumScoreFormProps) {
  const id = useId()
  const { user, isAuthenticated } = useAuth()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const reviewInputRef = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState<AlbumScores>(() => ({ ...(saved ?? DEFAULT_SCORES) }))
  const [draftTitle, setDraftTitle] = useState<string>(() => savedReviewTitle)
  const [draftReview, setDraftReview] = useState<string>(() => savedReview)
  const [announcement, setAnnouncement] = useState<{ type: 'saved'; scores: AlbumScores; title: string; review: string } | { type: 'removed' } | null>(null)
  const baseline = useRef<AlbumScores>({ ...(saved ?? DEFAULT_SCORES) })
  const baselineTitle = useRef<string>(savedReviewTitle)
  const baselineReview = useRef<string>(savedReview)

  const trimmedTitle = draftTitle.trim()
  const trimmedReview = draftReview.trim()
  const hasValidReview = trimmedTitle.length > 0 && trimmedReview.length > 0
  const dirtyScores = saved !== null && !sameScores(draft, saved)
  const dirtyTitle = trimmedTitle !== savedReviewTitle.trim()
  const dirtyReview = trimmedReview !== savedReview.trim()
  const dirty = dirtyScores || dirtyTitle || dirtyReview
  const canSave = isAuthenticated && hasValidReview && (saved === null || dirty)
  const total = scoreFormat.format(calculateAlbumScore(draft))
  const savedTotal = saved ? scoreFormat.format(calculateAlbumScore(saved)) : null

  useEffect(() => {
    const next = { ...(saved ?? DEFAULT_SCORES) }
    const previous = baseline.current
    if (!sameScores(previous, next)) {
      baseline.current = next
      setDraft(current => sameScores(current, previous) ? next : current)
    }
  }, [saved])

  useEffect(() => {
    const prevTitle = baselineTitle.current
    if (prevTitle !== savedReviewTitle) {
      baselineTitle.current = savedReviewTitle
      setDraftTitle(current => current === prevTitle ? savedReviewTitle : current)
    }
  }, [savedReviewTitle])

  useEffect(() => {
    const previousReview = baselineReview.current
    if (previousReview !== savedReview) {
      baselineReview.current = savedReview
      setDraftReview(current => current === previousReview ? savedReview : current)
    }
  }, [savedReview])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isAuthenticated) {
      window.location.href = '/register'
      return
    }
    if (!trimmedTitle) {
      titleInputRef.current?.focus()
      return
    }
    if (!trimmedReview) {
      reviewInputRef.current?.focus()
      return
    }
    if (!canSave) return
    onSave({ ...draft }, trimmedReview, trimmedTitle)
    setAnnouncement({ type: 'saved', scores: { ...draft }, title: trimmedTitle, review: trimmedReview })
  }

  function remove() {
    onRemove()
    setDraft({ ...DEFAULT_SCORES })
    setDraftTitle('')
    setDraftReview('')
    setAnnouncement({ type: 'removed' })
  }

  const status = announcement?.type === 'saved' && saved !== null && sameScores(saved, announcement.scores)
    ? persistent
      ? 'Оценка и рецензия сохранены на этом устройстве.'
      : 'Оценка и рецензия сохранены до перезагрузки страницы.'
    : announcement?.type === 'removed' && saved === null
      ? 'Оценка и рецензия удалены.'
      : ''

  return (
    <form className="album-score-form" onSubmit={submit} aria-describedby={`${id}-intro ${id}-storage`} data-scene-pointer-ignore>
      {!isAuthenticated ? (
        <div className="album-score-form-auth-gate">
          <div className="album-score-form-auth-gate-info">
            <span className="album-score-form-auth-gate-title">Требуется регистрация</span>
            <span className="album-score-form-auth-gate-desc">
              Чтобы выставить оценку и опубликовать рецензию, необходимо войти в аккаунт.
            </span>
          </div>
          <a className="album-score-form-auth-gate-btn" href="/register">
            Зарегистрироваться →
          </a>
        </div>
      ) : (
        <div className="album-score-form-author-banner">
          <span className="album-score-form-author-dot" />
          <span>Рецензент: <strong>{user?.nickname}</strong></span>
        </div>
      )}

      <p className="album-score-form-intro" id={`${id}-intro`}>
        <span>Пять критериев</span>
        <span>0–10<span className="album-score-form-sr-only"> баллов. Все критерии равнозначны.</span></span>
      </p>

      <fieldset className="album-score-form-criteria">
        <legend className="album-score-form-sr-only">Критерии оценки</legend>
        {SCORE_CRITERIA.map(({ id: criterionId, label }) => {
          const inputId = `${id}-${criterionId}`
          const value = draft[criterionId]
          return (
            <div className="album-score-form-row" key={criterionId}>
              <label className="album-score-form-label" htmlFor={inputId}>{label}</label>
              <span className="album-score-form-value" aria-hidden="true">{value}</span>
              <input
                className="album-score-form-range"
                id={inputId}
                name={criterionId}
                type="range"
                min={0}
                max={10}
                step={1}
                value={value}
                aria-valuetext={`${value} из 10`}
                style={{ '--score-ratio': value / 10 } as CSSProperties}
                onChange={event => {
                  setDraft(current => ({ ...current, [criterionId]: Number(event.target.value) }))
                  setAnnouncement(null)
                }}
              />
            </div>
          )
        })}
      </fieldset>

      <div className="album-score-form-review">
        <div className="album-score-form-review-field">
          <div className="album-score-form-review-header">
            <label className="album-score-form-review-label" htmlFor={`${id}-review-title`}>
              {reviewTitleLabel} <span className="album-score-form-required" aria-hidden="true">*</span>
            </label>
            <span className="album-score-form-review-count" aria-hidden="true">
              {draftTitle.length} / {MAX_TITLE_CHARS}
            </span>
          </div>
          <input
            ref={titleInputRef}
            id={`${id}-review-title`}
            name="reviewTitle"
            type="text"
            required
            className="album-score-form-title-input"
            maxLength={MAX_TITLE_CHARS}
            placeholder={reviewTitlePlaceholder}
            value={draftTitle}
            onChange={event => {
              setDraftTitle(event.target.value)
              setAnnouncement(null)
            }}
          />
        </div>

        <div className="album-score-form-review-field">
          <div className="album-score-form-review-header">
            <label className="album-score-form-review-label" htmlFor={`${id}-review`}>
              {reviewLabel} <span className="album-score-form-required" aria-hidden="true">*</span>
            </label>
            <span className="album-score-form-review-count" aria-hidden="true">
              {draftReview.length} / {MAX_REVIEW_CHARS}
            </span>
          </div>
          <textarea
            ref={reviewInputRef}
            id={`${id}-review`}
            name="review"
            required
            className="album-score-form-textarea"
            rows={4}
            maxLength={MAX_REVIEW_CHARS}
            placeholder={reviewPlaceholder}
            value={draftReview}
            onChange={event => {
              setDraftReview(event.target.value)
              setAnnouncement(null)
            }}
          />
        </div>

        {!hasValidReview && (
          <p className="album-score-form-review-hint" role="note">
            Обязательно: укажи заголовок и напиши рецензию — без рецензии выставить оценку нельзя.
          </p>
        )}
      </div>

      <div className="album-score-form-footer">
        <div className="album-score-form-total">
          <p><span aria-hidden="true">Итог</span><span className="album-score-form-sr-only">Итоговая оценка — среднее пяти критериев, умноженное на 10</span></p>
          <div className="album-score-form-total-value"><strong>{total}</strong><span>/ 100</span></div>
        </div>
        <button
          className="album-score-form-submit"
          type="submit"
          disabled={!canSave}
          aria-label={!isAuthenticated ? 'Войди или зарегистрируйся для публикации' : !hasValidReview ? 'Заполни заголовок и текст рецензии, чтобы сохранить оценку' : saved === null ? 'Сохранить оценку и рецензию' : dirty ? 'Обновить оценку и рецензию' : 'Оценка и рецензия сохранены'}
        >
          <span>
            {!isAuthenticated
              ? 'Войди для публикации'
              : saved === null || !hasValidReview
                ? 'Опубликовать оценку'
                : dirty
                  ? 'Обновить рецензию'
                  : 'Опубликовано'}
          </span>
          {isAuthenticated && saved !== null && !dirty && hasValidReview ? <span aria-hidden="true">✓</span> : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {saved !== null && savedReview.trim().length > 0 && (
        <article className="album-score-form-published-review" aria-label="Твоя опубликованная рецензия">
          <div className="album-score-form-published-top">
            <span className="album-score-form-published-badge">
              {isAuthenticated && user?.nickname ? `Рецензия · ${user.nickname}` : 'Твоя рецензия'}
            </span>
            <span className="album-score-form-published-score">
              <strong>{savedTotal}</strong> / 100
            </span>
          </div>
          {savedReviewTitle.trim().length > 0 && (
            <h3 className="album-score-form-published-title">{savedReviewTitle}</h3>
          )}
          <p className="album-score-form-published-text">{savedReview}</p>
          <div className="album-score-form-published-breakdown" aria-label="Разбивка по критериям">
            {SCORE_CRITERIA.map(({ id: critId, label }) => (
              <span key={critId}>
                {label.split(' / ')[0]}: <strong>{saved[critId]}</strong>
              </span>
            ))}
          </div>
        </article>
      )}

      <div className="album-score-form-meta">
        <p className="album-score-form-storage" id={`${id}-storage`}>
          {persistent ? 'Демо · оценка и рецензия сохраняются на устройстве' : 'Демо · сохранится только до перезагрузки'}
        </p>
        {saved !== null && <button className="album-score-form-remove" type="button" onClick={remove}>Удалить оценку и рецензию</button>}
      </div>
      <p className="album-score-form-sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</p>
    </form>
  )
}
