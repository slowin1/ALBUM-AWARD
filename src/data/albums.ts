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


export const albums: AlbumDefinition[] = [...INITIAL_ALBUMS]

export function updateSceneAlbumSlot(slotIndex: number, updated: Partial<AlbumDefinition>) {
  if (slotIndex < 0 || slotIndex >= 12) return
  albums[slotIndex] = { ...albums[slotIndex], ...updated }
  const token = getAuthToken()
  void fetch('/api/scene/slot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type: 'album', slotIndex, data: updated }),
  })
    .catch(() => {})
    .finally(() => window.dispatchEvent(new CustomEvent('aa:scene_updated')))
}

export function setSceneAlbums(newAlbums: AlbumDefinition[]) {
  if (!Array.isArray(newAlbums) || newAlbums.length < 12) return
  for (let i = 0; i < 12; i++) {
    albums[i] = { ...albums[i], ...newAlbums[i] }
  }
  const token = getAuthToken()
  void fetch('/api/scene/albums', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ albums: albums.slice(0, 12) }),
  })
    .catch(() => {})
    .finally(() => window.dispatchEvent(new CustomEvent('aa:scene_updated')))
}

/** Загружает 12 слотов колеса с сервера (таблица SceneSlot) и заменяет их на месте. */
export async function loadSceneAlbums(): Promise<void> {
  try {
    const res = await fetch('/api/scene/albums')
    if (!res.ok) return
    const data = await res.json()
    if (!Array.isArray(data) || data.length < 12) return
    for (let i = 0; i < 12; i++) albums[i] = { ...INITIAL_ALBUMS[i], ...data[i] }
  } catch {
    // сервер недоступен — остаются текущие слоты
  }
}
