import { useSyncExternalStore } from 'react'
import { getAuthToken } from './useAuth'

export const SCORE_CRITERIA = [
  { id: 'rhymes', label: 'Рифмы / образы' },
  { id: 'structure', label: 'Структура / ритмика' },
  { id: 'style', label: 'Реализация / стиль' },
  { id: 'individuality', label: 'Индивидуальность / харизма' },
  { id: 'atmosphere', label: 'Атмосфера / вайб' },
] as const

export type AlbumScores = Record<(typeof SCORE_CRITERIA)[number]['id'], number>

export type AlbumReview = {
  title: string
  text: string
}

export type ReviewItemMetadata = {
  title?: string
  artist?: string
  cover?: string
  year?: number
}

export const DEFAULT_SCORES: AlbumScores = Object.freeze({
  rhymes: 5,
  structure: 5,
  style: 5,
  individuality: 5,
  atmosphere: 5,
})

export function calculateAlbumScore(scores: AlbumScores) {
  const total = SCORE_CRITERIA.reduce((sum, criterion) => sum + scores[criterion.id], 0)
  const scoreOutOf100 = (total / SCORE_CRITERIA.length) * 10
  return Math.round(scoreOutOf100 * 10) / 10
}

const MAX_TITLE_LENGTH = 120
const MAX_REVIEW_LENGTH = 1500
type Ratings = Record<string, AlbumScores>
type Reviews = Record<string, AlbumReview>
type Snapshot = { ratings: Ratings; reviews: Reviews; persistent: boolean }

const emptyRatings = (): Ratings => Object.create(null) as Ratings
const emptyReviews = (): Reviews => Object.create(null) as Reviews
const serverSnapshot: Snapshot = { ratings: emptyRatings(), reviews: emptyReviews(), persistent: false }
let snapshot = serverSnapshot
let initialized = false
const listeners = new Set<() => void>()

function normalizeScores(value: unknown, legacyScale = false): AlbumScores | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  if (Object.keys(value).length !== SCORE_CRITERIA.length) return null

  const candidate = value as Record<string, unknown>
  const scores = {} as AlbumScores
  for (const { id } of SCORE_CRITERIA) {
    const score = candidate[id]
    if (
      !Object.hasOwn(candidate, id) ||
      typeof score !== 'number' ||
      !Number.isFinite(score) ||
      score < 0 || score > (legacyScale ? 100 : 10)
    ) return null
    scores[id] = Math.round(legacyScale ? score / 10 : score)
  }
  return Object.freeze(scores)
}

function normalizeReviewEntry(value: unknown): AlbumReview | null {
  if (typeof value === 'string') {
    const text = value.trim().slice(0, MAX_REVIEW_LENGTH)
    return text.length > 0 ? Object.freeze({ title: 'Рецензия', text }) : null
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  const candidate = value as Record<string, unknown>
  const title = typeof candidate.title === 'string' ? candidate.title.trim().slice(0, MAX_TITLE_LENGTH) : ''
  const text = typeof candidate.text === 'string' ? candidate.text.trim().slice(0, MAX_REVIEW_LENGTH) : ''
  if (title.length === 0 || text.length === 0) return null
  return Object.freeze({ title, text })
}

function withPending(ratings: Ratings): Ratings {
  return Object.assign(emptyRatings(), ratings)
}

function withPendingReviews(reviews: Reviews): Reviews {
  return Object.assign(emptyReviews(), reviews)
}

function sameScores(left: AlbumScores, right: AlbumScores) {
  return SCORE_CRITERIA.every(({ id }) => left[id] === right[id])
}

function sameReview(left: AlbumReview | undefined, right: AlbumReview | undefined) {
  if (!left && !right) return true
  if (!left || !right) return false
  return left.title === right.title && left.text === right.text
}

function publish(ratings: Ratings, reviews: Reviews, persistent: boolean) {
  const keys = Object.keys(ratings)
  const sameRatings = keys.length === Object.keys(snapshot.ratings).length && keys.every(
    key => Object.hasOwn(snapshot.ratings, key) && sameScores(ratings[key], snapshot.ratings[key]),
  )
  const reviewKeys = Object.keys(reviews)
  const sameReviews = reviewKeys.length === Object.keys(snapshot.reviews).length && reviewKeys.every(
    key => Object.hasOwn(snapshot.reviews, key) && sameReview(reviews[key], snapshot.reviews[key]),
  )
  if (sameRatings && sameReviews && snapshot.persistent === persistent) return

  // Retain score references for albums that did not change.
  for (const key of keys) {
    if (Object.hasOwn(snapshot.ratings, key) && sameScores(ratings[key], snapshot.ratings[key])) {
      ratings[key] = snapshot.ratings[key]
    }
  }
  snapshot = { ratings, reviews, persistent }
  for (const listener of listeners) listener()
}

function getSnapshot() {
  return snapshot
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function update(
  albumId: string,
  scores: AlbumScores | null,
  reviewEntry: AlbumReview | null,
  metadata?: ReviewItemMetadata,
) {
  if (albumId.length === 0) return
  const ratings = withPending(snapshot.ratings)
  const reviews = withPendingReviews(snapshot.reviews)
  if (scores === null || reviewEntry === null) {
    delete ratings[albumId]
    delete reviews[albumId]
  } else {
    ratings[albumId] = scores
    reviews[albumId] = reviewEntry
  }
  // Без входа оценка живёт только в памяти страницы (persistent = false), с входом — сохраняется в БД.
  publish(ratings, reviews, Boolean(getAuthToken()))

  // Синхронизация с базой данных PostgreSQL при наличии авторизации
  const token = getAuthToken()
  if (token) {
    if (scores === null || reviewEntry === null) {
      fetch(`/api/reviews/${encodeURIComponent(albumId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    } else {
      fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetId: albumId,
          targetType: albumId.startsWith('track:') ? 'track' : albumId.startsWith('month-artist:') ? 'artist' : 'album',
          title: reviewEntry.title,
          text: reviewEntry.text,
          scores,
          itemTitle: metadata?.title,
          itemArtist: metadata?.artist,
          itemCover: metadata?.cover,
          itemYear: metadata?.year,
        }),
      }).catch(() => {})
    }
  }
}

let backendSyncStarted = false

export async function syncReviewsFromBackend() {
  const token = getAuthToken()
  if (!token) return
  try {
    const res = await fetch('/api/reviews/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return
    const dbReviews: any[] = await res.json()
    if (!Array.isArray(dbReviews)) return

    const ratings = emptyRatings()
    const reviews = emptyReviews()

    for (const r of dbReviews) {
      const targetId = r.targetId
      if (!targetId) continue
      ratings[targetId] = {
        rhymes: r.rhymesScore ?? 5,
        structure: r.structureScore ?? 5,
        style: r.styleScore ?? 5,
        individuality: r.individualityScore ?? 5,
        atmosphere: r.atmosphereScore ?? 5,
      }
      reviews[targetId] = {
        title: r.title || 'Рецензия',
        text: r.text || '',
      }
    }

    publish(ratings, reviews, true)
  } catch {
    // Best effort background sync
  }
}

if (typeof window !== 'undefined' && !backendSyncStarted) {
  backendSyncStarted = true
  setTimeout(() => {
    void syncReviewsFromBackend()
  }, 120)
  window.addEventListener('aa:auth_login', () => {
    void syncReviewsFromBackend()
  })
}

/** Per-album/track demo ratings and required written reviews, shared across forms and browser tabs. */
export function useAlbumRatings(albumId: string) {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  const reviewObj = Object.hasOwn(state.reviews, albumId) ? state.reviews[albumId] : null
  return {
    saved: Object.hasOwn(state.ratings, albumId) ? state.ratings[albumId] : null,
    savedReviewTitle: reviewObj?.title ?? '',
    savedReview: reviewObj?.text ?? '',
    persistent: state.persistent,
    save(scores: AlbumScores, reviewText: string, reviewTitle: string, metadata?: ReviewItemMetadata) {
      const normalized = normalizeScores(scores)
      const normalizedReview = normalizeReviewEntry({ title: reviewTitle, text: reviewText })
      if (normalized !== null && normalizedReview !== null) {
        update(albumId, normalized, normalizedReview, metadata)
      }
    },
    remove() { update(albumId, null, null) },
  }
}

export type UserRatingItem = {
  id: string
  scores: AlbumScores
  totalScore: number
  review: AlbumReview
}

export function useAllRatingsStats() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  return {
    ratingsCount: Object.keys(state.ratings).length,
    reviewsCount: Object.keys(state.reviews).length,
  }
}

export function useAllUserRatings() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  const items: UserRatingItem[] = []
  let totalScoreSum = 0
  for (const [id, scores] of Object.entries(state.ratings)) {
    const totalScore = calculateAlbumScore(scores)
    totalScoreSum += totalScore
    items.push({
      id,
      scores,
      totalScore,
      review: state.reviews[id] ?? { title: 'Оценка', text: '' },
    })
  }
  const ratingsCount = items.length
  const reviewsCount = items.filter(it => it.review.text.trim().length > 0).length
  const averageScore = ratingsCount > 0 ? Math.round((totalScoreSum / ratingsCount) * 10) / 10 : 0

  function clearAll() {
    const token = getAuthToken()
    for (const id of Object.keys(state.ratings)) {
      if (token) {
        fetch(`/api/reviews/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {})
      }
    }
    publish(emptyRatings(), emptyReviews(), Boolean(token))
  }

  return {
    items,
    ratingsCount,
    reviewsCount,
    averageScore,
    clearAll,
  }
}

