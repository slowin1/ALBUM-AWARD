import { useSyncExternalStore } from 'react'

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

// Keep the existing key; the envelope version identifies the criterion scale.
const STORAGE_KEY = 'album-awards-ratings-v1'
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
// Unsaved changes survive remounts and are merged when storage becomes available.
const pending = new Map<string, AlbumScores | null>()
const pendingReviews = new Map<string, AlbumReview | null>()

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

function readStorage(raw: string | null): { ratings: Ratings; reviews: Reviews } {
  const ratings = emptyRatings()
  const reviews = emptyReviews()
  if (raw === null) return { ratings, reviews }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return { ratings, reviews }
    const envelope = parsed as Record<string, unknown>
    if (envelope.version !== 1 && envelope.version !== 2) return { ratings, reviews }
    const entries = envelope.ratings
    if (typeof entries === 'object' && entries !== null && !Array.isArray(entries)) {
      for (const [albumId, value] of Object.entries(entries)) {
        if (albumId.length === 0) continue
        const scores = normalizeScores(value, envelope.version === 1)
        if (scores !== null) ratings[albumId] = scores
      }
    }
    const rawReviews = envelope.reviews
    if (typeof rawReviews === 'object' && rawReviews !== null && !Array.isArray(rawReviews)) {
      for (const [albumId, entry] of Object.entries(rawReviews)) {
        if (albumId.length === 0) continue
        const normalized = normalizeReviewEntry(entry)
        if (normalized !== null) reviews[albumId] = normalized
      }
    }
  } catch {
    // An outdated or damaged payload must not prevent a new local rating.
  }
  return { ratings, reviews }
}

function withPending(ratings: Ratings): Ratings {
  const next = Object.assign(emptyRatings(), ratings)
  for (const [albumId, scores] of pending) {
    if (scores === null) delete next[albumId]
    else next[albumId] = scores
  }
  return next
}

function withPendingReviews(reviews: Reviews): Reviews {
  const next = Object.assign(emptyReviews(), reviews)
  for (const [albumId, entry] of pendingReviews) {
    if (!entry) delete next[albumId]
    else next[albumId] = entry
  }
  return next
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

function refresh() {
  if (typeof window === 'undefined') return
  try {
    const stored = readStorage(window.localStorage.getItem(STORAGE_KEY))
    const ratings = withPending(stored.ratings)
    const reviews = withPendingReviews(stored.reviews)
    publish(ratings, reviews, pending.size === 0 && pendingReviews.size === 0)
  } catch {
    publish(snapshot.ratings, snapshot.reviews, false)
  }
}

function getSnapshot() {
  if (!initialized) {
    initialized = true
    refresh()
  }
  return snapshot
}

function syncStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return
  try {
    if (event.storageArea && event.storageArea !== window.localStorage) return
  } catch {
    publish(snapshot.ratings, snapshot.reviews, false)
    return
  }
  refresh()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', syncStorage)
    // Refresh changes from another tab while all voting forms were unmounted.
    refresh()
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', syncStorage)
    }
  }
}

function update(albumId: string, scores: AlbumScores | null, reviewEntry: AlbumReview | null) {
  if (albumId.length === 0) return
  getSnapshot()
  let ratings = withPending(snapshot.ratings)
  let reviews = withPendingReviews(snapshot.reviews)

  try {
    // Read before writing so ratings saved in another tab are retained.
    const stored = readStorage(window.localStorage.getItem(STORAGE_KEY))
    ratings = withPending(stored.ratings)
    reviews = withPendingReviews(stored.reviews)

    if (scores === null || reviewEntry === null) {
      delete ratings[albumId]
      delete reviews[albumId]
    } else {
      ratings[albumId] = scores
      reviews[albumId] = reviewEntry
    }

    if (Object.keys(ratings).length === 0 && Object.keys(reviews).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, ratings, reviews }))
    }
    pending.clear()
    pendingReviews.clear()
    publish(ratings, reviews, true)
  } catch {
    pending.set(albumId, scores)
    pendingReviews.set(albumId, reviewEntry)
    if (scores === null || reviewEntry === null) {
      delete ratings[albumId]
      delete reviews[albumId]
    } else {
      ratings[albumId] = scores
      reviews[albumId] = reviewEntry
    }
    publish(ratings, reviews, false)
  }
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
    save(scores: AlbumScores, reviewText: string, reviewTitle: string) {
      const normalized = normalizeScores(scores)
      const normalizedReview = normalizeReviewEntry({ title: reviewTitle, text: reviewText })
      if (normalized !== null && normalizedReview !== null) {
        update(albumId, normalized, normalizedReview)
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
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      pending.clear()
      pendingReviews.clear()
      publish(emptyRatings(), emptyReviews(), true)
    } catch {
      // ignore
    }
  }

  return {
    items,
    ratingsCount,
    reviewsCount,
    averageScore,
    clearAll,
  }
}

