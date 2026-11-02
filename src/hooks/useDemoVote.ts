import { useSyncExternalStore } from 'react'

const VOTE_STORAGE_KEY = 'album-awards-demo-vote'

type VoteSnapshot = {
  albumId: string | null
  persistent: boolean
  choiceCleared: boolean
}

const serverSnapshot: VoteSnapshot = {
  albumId: null,
  persistent: false,
  choiceCleared: false,
}

let snapshot = serverSnapshot
let initialized = false
let sessionOnly = false
const listeners = new Set<() => void>()

function publish(next: VoteSnapshot) {
  if (
    snapshot.albumId === next.albumId &&
    snapshot.persistent === next.persistent &&
    snapshot.choiceCleared === next.choiceCleared
  ) return

  snapshot = next
  for (const listener of listeners) listener()
}

function refresh(resetNotice = false) {
  if (typeof window === 'undefined' || sessionOnly) return

  try {
    const albumId = window.localStorage.getItem(VOTE_STORAGE_KEY)
    publish({
      albumId,
      persistent: true,
      choiceCleared: !resetNotice && albumId === snapshot.albumId && snapshot.choiceCleared,
    })
  } catch {
    // Keep the in-memory choice if storage is blocked or becomes unavailable.
    sessionOnly = true
    publish({ ...snapshot, persistent: false })
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
  if (event.key !== VOTE_STORAGE_KEY && event.key !== null) return
  try {
    if (event.storageArea && event.storageArea !== window.localStorage) return
  } catch {
    sessionOnly = true
    publish({ ...snapshot, persistent: false })
    return
  }
  refresh(true)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', syncStorage)
    // Another tab may have changed its vote while this UI was unmounted.
    refresh()
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', syncStorage)
    }
  }
}

function choose(albumId: string | null) {
  initialized = true
  let persistent = false

  try {
    if (albumId === null) window.localStorage.removeItem(VOTE_STORAGE_KEY)
    else window.localStorage.setItem(VOTE_STORAGE_KEY, albumId)
    persistent = true
  } catch {
    // The choice still works in this session when browser storage is blocked.
  }

  sessionOnly = !persistent
  publish({ albumId, persistent, choiceCleared: albumId === null })
}

/** A single local demo choice, shared by all mounted voting controls. */
export function useDemoVote() {
  const vote = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  return { ...vote, choose }
}
