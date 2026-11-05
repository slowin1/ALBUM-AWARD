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

function loadCachedTracks(): TrackDefinition[] {
  if (typeof window === 'undefined') return [...INITIAL_TRACKS]
  try {
    const raw = localStorage.getItem('aa_scene_tracks')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length >= 12) {
        return parsed.slice(0, 12)
      }
    }
  } catch {}
  return [...INITIAL_TRACKS]
}

export const tracks: TrackDefinition[] = loadCachedTracks()

export function updateSceneTrackSlot(slotIndex: number, updated: Partial<TrackDefinition>) {
  if (slotIndex < 0 || slotIndex >= 12) return
  tracks[slotIndex] = { ...tracks[slotIndex], ...updated }
  try {
    localStorage.setItem('aa_scene_tracks', JSON.stringify(tracks))
  } catch {}
  const token = getAuthToken()
  fetch('/api/scene/slot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type: 'track', slotIndex, data: updated }),
  }).catch(() => {})
  window.dispatchEvent(new CustomEvent('aa:scene_updated'))
}

export function setSceneTracks(newTracks: TrackDefinition[]) {
  if (!Array.isArray(newTracks) || newTracks.length < 12) return
  for (let i = 0; i < 12; i++) {
    tracks[i] = { ...tracks[i], ...newTracks[i] }
  }
  try {
    localStorage.setItem('aa_scene_tracks', JSON.stringify(tracks))
  } catch {}
  const token = getAuthToken()
  fetch('/api/scene/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ tracks: tracks.slice(0, 12) }),
  }).catch(() => {})
  window.dispatchEvent(new CustomEvent('aa:scene_updated'))
}

// Background sync from backend on startup
if (typeof window !== 'undefined') {
  fetch('/api/scene/tracks')
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (Array.isArray(data) && data.length >= 12) {
        let changed = false
        for (let i = 0; i < 12; i++) {
          if (
            tracks[i].title !== data[i].title ||
            tracks[i].cover !== data[i].cover ||
            tracks[i].artist !== data[i].artist ||
            tracks[i].soundcloudUrl !== data[i].soundcloudUrl
          ) {
            tracks[i] = { ...tracks[i], ...data[i] }
            changed = true
          }
        }
        if (changed) {
          try {
            localStorage.setItem('aa_scene_tracks', JSON.stringify(tracks))
          } catch {}
          window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        }
      }
    })
    .catch(() => {})
}
