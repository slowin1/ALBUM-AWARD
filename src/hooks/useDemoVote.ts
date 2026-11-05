import { useSyncExternalStore } from 'react'
import { getAuthToken } from './useAuth'

/** Голосование «Альбом года». Голос хранится на сервере (таблица Vote), а не в браузере. */
const CATEGORY = 'album_of_the_year'

type VoteSnapshot = {
  albumId: string | null
  /** true — голос сохранён на сервере. */
  persistent: boolean
  choiceCleared: boolean
  /** Нужна авторизация, чтобы голосовать. */
  needsAuth: boolean
  saving: boolean
  error: string | null
}

const serverSnapshot: VoteSnapshot = {
  albumId: null,
  persistent: true,
  choiceCleared: false,
  needsAuth: false,
  saving: false,
  error: null,
}

let snapshot = serverSnapshot
const listeners = new Set<() => void>()

function publish(patch: Partial<VoteSnapshot>) {
  snapshot = { ...snapshot, ...patch }
  for (const listener of listeners) listener()
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function refresh() {
  if (!getAuthToken()) {
    publish({ albumId: null, needsAuth: false, error: null })
    return
  }
  try {
    const res = await fetch('/api/votes/my', { headers: authHeaders() })
    if (!res.ok) throw new Error(String(res.status))
    const votes: Array<{ category: string; targetId: string }> = await res.json()
    const mine = votes.find(v => v.category === CATEGORY)
    publish({ albumId: mine?.targetId ?? null, persistent: true, needsAuth: false, error: null })
  } catch {
    publish({ error: 'Не удалось загрузить твой голос', persistent: false })
  }
}

function getSnapshot() {
  return snapshot
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) void refresh()
  return () => {
    listeners.delete(listener)
  }
}

async function choose(albumId: string | null) {
  if (!getAuthToken()) {
    publish({ needsAuth: true })
    return
  }
  publish({ saving: true, error: null, needsAuth: false })
  try {
    const res =
      albumId === null
        ? await fetch(`/api/votes/${CATEGORY}`, { method: 'DELETE', headers: authHeaders() })
        : await fetch('/api/votes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify({ category: CATEGORY, targetId: albumId }),
          })
    if (res.status === 401) {
      publish({ saving: false, needsAuth: true })
      return
    }
    // 404 при снятии означает, что голоса уже нет — состояние всё равно верное
    if (!res.ok && !(albumId === null && res.status === 404)) throw new Error(String(res.status))
    publish({ albumId, persistent: true, choiceCleared: albumId === null, saving: false })
  } catch {
    publish({ saving: false, error: 'Не удалось сохранить голос. Попробуй ещё раз.' })
  }
}

/** Один голос пользователя в категории, общий для всех смонтированных элементов управления. */
export function useDemoVote() {
  const vote = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  return { ...vote, choose }
}
