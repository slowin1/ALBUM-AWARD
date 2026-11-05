import { getAuthToken } from '../hooks/useAuth'

export type AlbumTrackItem = {
  id: string
  title: string
  artist?: string
  duration?: string
  soundcloudUrl?: string
  soundcloudTrackId?: string
  cover?: string
}

export type AlbumDefinition = {
  id: string
  title: string
  artist: string
  year: number
  cover: string
  sourceUrl: string
  audioUrl?: string
  soundcloudUrl?: string
  soundcloudPlaylistId?: string
  tracks?: AlbumTrackItem[]
}

const DEFAULT_COVER = '/covers/placeholder.jpg'

export const INITIAL_ALBUMS: AlbumDefinition[] = Array.from({ length: 12 }, (_, i) => ({
  id: `slot-album-${i + 1}`,
  title: `Слот ${i + 1}`,
  artist: 'Исполнитель',
  year: 2026,
  cover: DEFAULT_COVER,
  sourceUrl: '',
  soundcloudUrl: '',
}))

function loadCachedAlbums(): AlbumDefinition[] {
  if (typeof window === 'undefined') return [...INITIAL_ALBUMS]
  try {
    const raw = localStorage.getItem('aa_scene_albums')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length >= 12) {
        return parsed.slice(0, 12)
      }
    }
  } catch {}
  return [...INITIAL_ALBUMS]
}

export const albums: AlbumDefinition[] = loadCachedAlbums()

export function updateSceneAlbumSlot(slotIndex: number, updated: Partial<AlbumDefinition>) {
  if (slotIndex < 0 || slotIndex >= 12) return
  albums[slotIndex] = { ...albums[slotIndex], ...updated }
  try {
    localStorage.setItem('aa_scene_albums', JSON.stringify(albums))
  } catch {}
  const token = getAuthToken()
  fetch('/api/scene/slot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type: 'album', slotIndex, data: updated }),
  }).catch(() => {})
  window.dispatchEvent(new CustomEvent('aa:scene_updated'))
}

export function setSceneAlbums(newAlbums: AlbumDefinition[]) {
  if (!Array.isArray(newAlbums) || newAlbums.length < 12) return
  for (let i = 0; i < 12; i++) {
    albums[i] = { ...albums[i], ...newAlbums[i] }
  }
  try {
    localStorage.setItem('aa_scene_albums', JSON.stringify(albums))
  } catch {}
  const token = getAuthToken()
  fetch('/api/scene/albums', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ albums: albums.slice(0, 12) }),
  }).catch(() => {})
  window.dispatchEvent(new CustomEvent('aa:scene_updated'))
}

// Background sync from backend on startup
if (typeof window !== 'undefined') {
  fetch('/api/scene/albums')
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (Array.isArray(data) && data.length >= 12) {
        let changed = false
        for (let i = 0; i < 12; i++) {
          if (
            albums[i].title !== data[i].title ||
            albums[i].cover !== data[i].cover ||
            albums[i].artist !== data[i].artist ||
            albums[i].soundcloudUrl !== data[i].soundcloudUrl ||
            (data[i].tracks && albums[i].tracks?.length !== data[i].tracks.length)
          ) {
            albums[i] = { ...albums[i], ...data[i] }
            changed = true
          }
        }
        if (changed) {
          try {
            localStorage.setItem('aa_scene_albums', JSON.stringify(albums))
          } catch {}
          window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        }
      }
    })
    .catch(() => {})
}
