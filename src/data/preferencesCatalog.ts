import { artists, allAlbums, allTracks } from './artists'
import { artistCatalog } from './artistCatalog'
import { monthArtists } from './monthArtists'
import type { PreferenceItem } from '../hooks/useAuth'

// Curated sound producers with their signature engineering styles and cover art
const TOP_PRODUCERS: PreferenceItem[] = [
  { id: 'prod-skryptonite', name: 'Скриптонит', subtitle: 'Звукорежиссура, живые инструменты, авторский саунд-дизайн', cover: '/artists/basta.jpg' },
  { id: 'prod-metro-boomin', name: 'Metro Boomin', subtitle: 'Cinematic 808 & Dark Trap, Heroes & Villains', cover: '/artists/kendrick-lamar.jpg' },
  { id: 'prod-saluki', name: 'SALUKI', subtitle: 'Многослойный аналоговый продакшн, сэмплирование, WILD EA$T', cover: '/artists/saluki.jpg' },
  { id: 'prod-white-punk', name: 'White Punk', subtitle: 'Мрачные синты, гитары, трэп-электроника, Вампиръ', cover: '/artists/big-baby-tape.jpg' },
  { id: 'prod-slava-marlow', name: 'Slava Marlow', subtitle: 'Хит-мейкинг, плотный бас, поп-инженерия', cover: '/artists/sqwoz-bab.jpg' },
  { id: 'prod-aarne', name: 'Aarne', subtitle: 'AA LANGUAGE, международные фиты, европейский трэп', cover: '/artists/clout.jpg' },
  { id: 'prod-mike-dean', name: 'Mike Dean', subtitle: 'Аналоговые синтезаторы, грандиозное сведение, соло-партии', cover: '/artists/daft-punk.jpg' },
  { id: 'prod-kanye-west', name: 'Kanye West', subtitle: 'Soul-сэмплирование, хоровой хип-хоп, звуковые эксперименты', cover: '/artists/tyler-the-creator.jpg' },
  { id: 'prod-pierre-bourne', name: 'Pi\'erre Bourne', subtitle: 'Playboi Carti, 8-битный саунд, психоделический трэп', cover: '/artists/kai-angel.jpg' },
  { id: 'prod-wheezy', name: 'Wheezy', subtitle: 'Wheezy Outta Here, футуристичный мелодичный трэп', cover: '/artists/temny-princ.jpg' },
  { id: 'prod-southside', name: 'Southside', subtitle: '808 Mafia, агрессивный атлантский трэп', cover: '/artists/heronwater.jpg' },
  { id: 'prod-murda-beatz', name: 'Murda Beatz', subtitle: 'Канадский трэп, хитовые флейты и снейры', cover: '/artists/9mice.jpg' },
  { id: 'prod-palagin', name: 'Palagin', subtitle: 'Мелодичный автотюн-хип-хоп, акустические гитары', cover: '/artists/trinadtsat-karat.jpg' },
  { id: 'prod-doomee', name: 'DooMee', subtitle: 'Трэп-продакшн, плотный низ, YANIX, Rocket', cover: '/artists/sabu.jpg' },
  { id: 'prod-pharrell-williams', name: 'Pharrell Williams', subtitle: 'The Neptunes, фанковый минимализм, 4-тактовый старт', cover: '/artists/frank-ocean.jpg' },
  { id: 'prod-boi-1da', name: 'Boi-1da', subtitle: 'Дрейк, OVO Sound, кинематографичный канадский R&B-трэп', cover: '/artists/massive-attack.jpg' },
  { id: 'prod-kenny-beats', name: 'Kenny Beats', subtitle: 'Don\'t Over Think Shit, Denzel Curry, универсальный продакшн', cover: '/artists/deftones.jpg' },
  { id: 'prod-brodsky', name: 'Brodsky', subtitle: 'DOPECLVB, мрачный минималистичный хип-хоп', cover: '/artists/maladoy-prince.jpg' },
  { id: 'prod-tay-keith', name: 'Tay Keith', subtitle: 'Мемфис-трэп, Sicko Mode, Look Alive, тяжелый 808', cover: '/artists/basta.jpg' },
]

// Build cached searchable artists
function buildArtists(): PreferenceItem[] {
  const map = new Map<string, PreferenceItem>()

  // 1. App artists
  for (const a of artists) {
    const key = a.name.trim().toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        id: a.id,
        name: a.name,
        subtitle: a.tracks.length > 0 ? 'Исполнитель' : 'Артист',
        cover: a.avatar,
      })
    }
  }

  // 2. Month artists
  for (const m of monthArtists) {
    const key = m.title.trim().toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        id: m.id,
        name: m.title,
        subtitle: `Артист месяца · ${m.month}`,
        cover: m.cover,
      })
    }
  }

  // 3. Catalog entries
  for (const [slug, entry] of Object.entries(artistCatalog)) {
    const name = entry.name || slug
    const key = name.trim().toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        id: slug,
        name,
        subtitle: 'Артист каталога',
        cover: entry.avatar || `/artists/${slug}.jpg`,
      })
    }
  }

  return Array.from(map.values())
}

// Build cached searchable albums
function buildAlbums(): PreferenceItem[] {
  const map = new Map<string, PreferenceItem>()

  // 1. App albums
  for (const alb of allAlbums) {
    const key = `${alb.title}__${alb.artist}`.toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        id: alb.id,
        name: alb.title,
        subtitle: `${alb.artist} · ${alb.year}`,
        cover: alb.cover,
      })
    }
  }

  // 2. Catalog albums
  for (const entry of Object.values(artistCatalog)) {
    for (const alb of entry.albums || []) {
      const key = `${alb.title}__${alb.artist}`.toLowerCase()
      if (!map.has(key)) {
        map.set(key, {
          id: alb.id,
          name: alb.title,
          subtitle: `${alb.artist} · ${alb.year}`,
          cover: alb.cover,
        })
      }
    }
  }

  return Array.from(map.values())
}

// Build cached searchable tracks
function buildTracks(): PreferenceItem[] {
  const map = new Map<string, PreferenceItem>()

  // 1. App tracks
  for (const t of allTracks) {
    const key = `${t.title}__${t.artist}`.toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        id: t.id,
        name: t.title,
        subtitle: `${t.artist} · ${t.albumTitle || 'Сингл'}`,
        cover: t.cover,
      })
    }
  }

  // 2. Catalog tracks
  for (const entry of Object.values(artistCatalog)) {
    for (const t of entry.tracks || []) {
      const key = `${t.title}__${t.artist}`.toLowerCase()
      if (!map.has(key)) {
        map.set(key, {
          id: t.id,
          name: t.title,
          subtitle: `${t.artist} · ${t.albumTitle || 'Релиз'}`,
          cover: t.cover,
        })
      }
    }
  }

  return Array.from(map.values())
}

export const SEARCH_CATALOG = {
  artists: buildArtists(),
  albums: buildAlbums(),
  producers: TOP_PRODUCERS,
  tracks: buildTracks(),
}

export function normalizeSearch(str: string): string {
  return str
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

export function searchCategoryItems(
  category: 'artists' | 'albums' | 'producers' | 'tracks',
  query: string
): PreferenceItem[] {
  const items = SEARCH_CATALOG[category]
  const clean = normalizeSearch(query)
  if (!clean) {
    return items.slice(0, 30)
  }

  // Prioritize starts-with then includes
  const startsWithList: PreferenceItem[] = []
  const includesList: PreferenceItem[] = []

  for (const item of items) {
    const nameNorm = normalizeSearch(item.name)
    const subNorm = normalizeSearch(item.subtitle || '')
    if (nameNorm.startsWith(clean)) {
      startsWithList.push(item)
    } else if (nameNorm.includes(clean) || subNorm.includes(clean)) {
      includesList.push(item)
    }
  }

  return [...startsWithList, ...includesList].slice(0, 30)
}
