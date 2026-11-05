import { getAuthToken } from '../hooks/useAuth'

export type TrackDefinition = {
  id: string
  albumId: string
  title: string
  albumTitle: string
  artist: string
  year: number
  duration: string
  cover: string
  sourceUrl: string
  audioUrl?: string
  soundcloudUrl?: string
  soundcloudTrackId?: string
}

const DEFAULT_COVER = '/covers/placeholder.jpg'

export const INITIAL_TRACKS: TrackDefinition[] = Array.from({ length: 12 }, (_, i) => ({
  id: `slot-track-${i + 1}`,
  albumId: `slot-track-${i + 1}`,
  title: `Слот ${i + 1}`,
  albumTitle: 'Сингл',
  artist: 'Исполнитель',
  year: 2026,
  duration: '3:00',
  cover: DEFAULT_COVER,
  sourceUrl: '',
  soundcloudUrl: '',
}))


export const tracks: TrackDefinition[] = [...INITIAL_TRACKS]

export function updateSceneTrackSlot(slotIndex: number, updated: Partial<TrackDefinition>) {
  if (slotIndex < 0 || slotIndex >= 12) return
  tracks[slotIndex] = { ...tracks[slotIndex], ...updated }
  const token = getAuthToken()
  void fetch('/api/scene/slot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type: 'track', slotIndex, data: updated }),
  })
    .catch(() => {})
    .finally(() => window.dispatchEvent(new CustomEvent('aa:scene_updated')))
}

export function setSceneTracks(newTracks: TrackDefinition[]) {
  if (!Array.isArray(newTracks) || newTracks.length < 12) return
  for (let i = 0; i < 12; i++) {
    tracks[i] = { ...tracks[i], ...newTracks[i] }
  }
  const token = getAuthToken()
  void fetch('/api/scene/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ tracks: tracks.slice(0, 12) }),
  })
    .catch(() => {})
    .finally(() => window.dispatchEvent(new CustomEvent('aa:scene_updated')))
}

/** Загружает 12 слотов колеса с сервера (таблица SceneSlot) и заменяет их на месте. */
export async function loadSceneTracks(): Promise<void> {
  try {
    const res = await fetch('/api/scene/tracks')
    if (!res.ok) return
    const data = await res.json()
    if (!Array.isArray(data) || data.length < 12) return
    for (let i = 0; i < 12; i++) tracks[i] = { ...INITIAL_TRACKS[i], ...data[i] }
  } catch {
    // сервер недоступен — остаются текущие слоты
  }
}
