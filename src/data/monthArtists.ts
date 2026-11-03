export type MonthArtist = {
  id: string
  /** Name shown on the wheel title. */
  title: string
  artist: string
  /** Award period of «Артист месяца» (Album Awards). */
  month: string
  year: number
  cover: string
  sourceUrl: string
  /** Id of the matching page in `artists`. */
  pageId: string
}

const DEFAULT_COVER = '/covers/placeholder.jpg'

export const INITIAL_MONTH_ARTISTS: MonthArtist[] = Array.from({ length: 12 }, (_, i) => ({
  id: `slot-artist-${i + 1}`,
  title: `Исполнитель ${i + 1}`,
  artist: `Исполнитель ${i + 1}`,
  month: 'Сезон 2026',
  year: 2026,
  cover: DEFAULT_COVER,
  sourceUrl: '',
  pageId: `slot-artist-${i + 1}`,
}))

function loadCachedMonthArtists(): MonthArtist[] {
  if (typeof window === 'undefined') return [...INITIAL_MONTH_ARTISTS]
  try {
    const raw = localStorage.getItem('aa_scene_artists')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length >= 12) {
        return parsed.slice(0, 12)
      }
    }
  } catch {}
  return [...INITIAL_MONTH_ARTISTS]
}

export const monthArtists: MonthArtist[] = loadCachedMonthArtists()

export function updateSceneArtistSlot(slotIndex: number, updated: Partial<MonthArtist>) {
  if (slotIndex < 0 || slotIndex >= 12) return
  monthArtists[slotIndex] = { ...monthArtists[slotIndex], ...updated }
  try {
    localStorage.setItem('aa_scene_artists', JSON.stringify(monthArtists))
  } catch {}
  fetch('/api/scene/slot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'artist', slotIndex, data: updated }),
  }).catch(() => {})
  window.dispatchEvent(new CustomEvent('aa:scene_updated'))
}

export function setSceneArtists(newArtists: MonthArtist[]) {
  if (!Array.isArray(newArtists) || newArtists.length < 12) return
  for (let i = 0; i < 12; i++) {
    monthArtists[i] = { ...monthArtists[i], ...newArtists[i] }
  }
  try {
    localStorage.setItem('aa_scene_artists', JSON.stringify(monthArtists))
  } catch {}
  fetch('/api/scene/artists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artists: monthArtists.slice(0, 12) }),
  }).catch(() => {})
  window.dispatchEvent(new CustomEvent('aa:scene_updated'))
}

// Background sync from backend on startup
if (typeof window !== 'undefined') {
  fetch('/api/scene/artists')
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (Array.isArray(data) && data.length >= 12) {
        let changed = false
        for (let i = 0; i < 12; i++) {
          if (
            monthArtists[i].title !== data[i].title ||
            monthArtists[i].cover !== data[i].cover ||
            monthArtists[i].artist !== data[i].artist ||
            monthArtists[i].month !== data[i].month
          ) {
            monthArtists[i] = { ...monthArtists[i], ...data[i] }
            changed = true
          }
        }
        if (changed) {
          try {
            localStorage.setItem('aa_scene_artists', JSON.stringify(monthArtists))
          } catch {}
          window.dispatchEvent(new CustomEvent('aa:scene_updated'))
        }
      }
    })
    .catch(() => {})
}
