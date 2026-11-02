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

// «Артист месяца» — Номинация премии Album Awards, newest first.
export const monthArtists: MonthArtist[] = [
  {
    id: 'kai-angel',
    title: 'Kai Angel',
    artist: 'Kai Angel',
    month: 'Сентябрь 2026',
    year: 2026,
    cover: '/artists/kai-angel.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/damage/1836514358',
    pageId: 'kai-angel',
  },
  {
    id: 'villian',
    title: 'VILLIAN',
    artist: 'VILLIAN',
    month: 'Август 2026',
    year: 2026,
    cover: '/artists/villian.jpg',
    sourceUrl: 'https://music.apple.com/ru/artist/villian/1818347359',
    pageId: 'villian',
  },
  {
    id: 'temny-princ',
    title: 'тёмный принц',
    artist: 'тёмный принц',
    month: 'Июль 2026',
    year: 2026,
    cover: '/artists/temny-princ.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/%D0%BC%D1%80%D0%B0%D1%87%D0%BD%D1%8B%D0%B5-%D1%82%D1%80%D0%B5%D0%B4%D1%8B/1828741427?i=1828741432',
    pageId: 'temny-princ',
  },
  {
    id: 'mayot',
    title: 'MAYOT',
    artist: 'MAYOT',
    month: 'Июнь 2026',
    year: 2026,
    cover: '/artists/mayot.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/%D0%B4%D0%BE-%D1%81%D0%B8%D1%85-%D0%BF%D0%BE%D1%80/1698975492?i=1698975725',
    pageId: 'mayot',
  },
  {
    id: 'cupsize',
    title: 'CUPSIZE',
    artist: 'CUPSIZE',
    month: 'Май 2026',
    year: 2026,
    cover: '/artists/cupsize.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/%D1%82%D1%8B-%D0%BB%D1%8E%D0%B1%D0%B8%D1%88%D1%8C-%D1%82%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0%D1%82%D1%8C/1813552757?i=1813552767',
    pageId: 'cupsize',
  },
  {
    id: 'basta',
    title: 'Баста',
    artist: 'Баста',
    month: 'Апрель 2026',
    year: 2026,
    cover: '/artists/basta.jpg',
    sourceUrl: 'https://music.apple.com/ru/artist/%D0%B1%D0%B0%D1%81%D1%82%D0%B0/1372953342',
    pageId: 'basta',
  },
  {
    id: 'guf',
    title: 'GUF',
    artist: 'GUF',
    month: 'Апрель 2026',
    year: 2026,
    cover: '/artists/guf.jpg',
    sourceUrl: 'https://music.apple.com/ru/artist/%D0%B3%D1%83%D1%84/642924098',
    pageId: 'guf',
  },
  {
    id: 'sqwoz-bab',
    title: 'SQWOZ BAB',
    artist: 'SQWOZ BAB',
    month: 'Март 2026',
    year: 2026,
    cover: '/artists/sqwoz-bab.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/tokyo/1804949576?i=1804949577',
    pageId: 'sqwoz-bab',
  },
  {
    id: 'saluki',
    title: 'SALUKI',
    artist: 'SALUKI',
    month: 'Декабрь 2025',
    year: 2025,
    cover: '/artists/saluki.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%BE/1819388407?i=1819388408',
    pageId: 'saluki',
  },
  {
    id: 'lida',
    title: 'Lida',
    artist: 'Lida',
    month: 'Ноябрь 2025',
    year: 2025,
    cover: '/artists/lida.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/%D1%84%D0%BE%D1%82%D0%BE-%D1%81%D0%BE-%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D0%BE%D0%B9/1771650769?i=1771650772',
    pageId: 'lida',
  },
  {
    id: '9mice',
    title: '9mice',
    artist: '9mice',
    month: 'Октябрь 2025',
    year: 2025,
    cover: '/artists/9mice.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/%D1%82%D1%83%D1%80%D0%B8%D1%81%D1%82/1850861288?i=1850861289',
    pageId: '9mice',
  },
  {
    id: 'elyaplugg',
    title: 'elyaplugg!',
    artist: 'elyaplugg!',
    month: 'Май 2026 · 2 место',
    year: 2026,
    cover: '/artists/elyaplugg.jpg',
    sourceUrl: 'https://music.apple.com/ru/album/1782308862?i=1782309118',
    pageId: 'elyaplugg',
  },
]
