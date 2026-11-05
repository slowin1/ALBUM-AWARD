import { getAuthToken } from '../hooks/useAuth'

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


export const monthArtists: MonthArtist[] = [...INITIAL_MONTH_ARTISTS]

export function updateSceneArtistSlot(slotIndex: number, updated: Partial<MonthArtist>) {
  if (slotIndex < 0 || slotIndex >= 12) return
  monthArtists[slotIndex] = { ...monthArtists[slotIndex], ...updated }
  const token = getAuthToken()
  void fetch('/api/scene/slot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type: 'artist', slotIndex, data: updated }),
  })
    .catch(() => {})
    .finally(() => window.dispatchEvent(new CustomEvent('aa:scene_updated')))
}

export function setSceneArtists(newArtists: MonthArtist[]) {
  if (!Array.isArray(newArtists) || newArtists.length < 12) return
  for (let i = 0; i < 12; i++) {
    monthArtists[i] = { ...monthArtists[i], ...newArtists[i] }
  }
  const token = getAuthToken()
  void fetch('/api/scene/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ artists: monthArtists.slice(0, 12) }),
  })
    .catch(() => {})
    .finally(() => window.dispatchEvent(new CustomEvent('aa:scene_updated')))
}

/** Загружает 12 слотов колеса с сервера (таблица SceneSlot) и заменяет их на месте. */
export async function loadSceneArtists(): Promise<void> {
  try {
    const res = await fetch('/api/scene/artists')
    if (!res.ok) return
    const data = await res.json()
    if (!Array.isArray(data) || data.length < 12) return
    for (let i = 0; i < 12; i++) monthArtists[i] = { ...INITIAL_MONTH_ARTISTS[i], ...data[i] }
  } catch {
    // сервер недоступен — остаются текущие слоты
  }
}
