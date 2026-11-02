export type AlbumDefinition = {
  id: string
  title: string
  artist: string
  year: number
  cover: string
  sourceUrl: string
}

// Local demo catalogue. Art and metadata sources: references/album-artwork.md.
export const albums: AlbumDefinition[] = [
  {
    "id": "in-rainbows",
    "title": "In Rainbows",
    "artist": "Radiohead",
    "year": 2007,
    "cover": "/covers/in-rainbows.jpg",
    "sourceUrl": "https://music.apple.com/us/album/in-rainbows/1109714933"
  },
  {
    "id": "random-access-memories",
    "title": "Random Access Memories",
    "artist": "Daft Punk",
    "year": 2013,
    "cover": "/covers/random-access-memories.jpg",
    "sourceUrl": "https://music.apple.com/us/album/random-access-memories/617154241"
  },
  {
    "id": "blonde",
    "title": "Blonde",
    "artist": "Frank Ocean",
    "year": 2016,
    "cover": "/covers/blonde.jpg",
    "sourceUrl": "https://music.apple.com/us/album/blonde/1146195596"
  },
  {
    "id": "igor",
    "title": "IGOR",
    "artist": "Tyler, The Creator",
    "year": 2019,
    "cover": "/covers/igor.jpg",
    "sourceUrl": "https://music.apple.com/us/album/igor/1463409338"
  },
  {
    "id": "norman-fucking-rockwell",
    "title": "Norman Fucking Rockwell!",
    "artist": "Lana Del Rey",
    "year": 2019,
    "cover": "/covers/norman-fucking-rockwell.jpg",
    "sourceUrl": "https://music.apple.com/us/album/norman-f-g-rockwell/1474669063"
  },
  {
    "id": "currents",
    "title": "Currents",
    "artist": "Tame Impala",
    "year": 2015,
    "cover": "/covers/currents.jpg",
    "sourceUrl": "https://music.apple.com/us/album/currents/1440838039"
  },
  {
    "id": "damn",
    "title": "DAMN.",
    "artist": "Kendrick Lamar",
    "year": 2017,
    "cover": "/covers/damn.jpg",
    "sourceUrl": "https://music.apple.com/us/album/damn/1440881722"
  },
  {
    "id": "mezzanine",
    "title": "Mezzanine",
    "artist": "Massive Attack",
    "year": 1998,
    "cover": "/covers/mezzanine.jpg",
    "sourceUrl": "https://music.apple.com/us/album/mezzanine/724466069"
  },
  {
    "id": "dummy",
    "title": "Dummy",
    "artist": "Portishead",
    "year": 1994,
    "cover": "/covers/dummy.jpg",
    "sourceUrl": "https://music.apple.com/us/album/dummy/1440653096"
  },
  {
    "id": "selected-ambient-works-85-92",
    "title": "Selected Ambient Works 85-92",
    "artist": "Aphex Twin",
    "year": 1992,
    "cover": "/covers/selected-ambient-works-85-92.jpg",
    "sourceUrl": "https://music.apple.com/us/album/selected-ambient-works-85-92/1668862636"
  },
  {
    "id": "dark-side-of-the-moon",
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "year": 1973,
    "cover": "/covers/dark-side-of-the-moon.jpg",
    "sourceUrl": "https://music.apple.com/us/album/the-dark-side-of-the-moon/1065973699"
  },
  {
    "id": "white-pony",
    "title": "White Pony",
    "artist": "Deftones",
    "year": 2000,
    "cover": "/covers/white-pony.jpg",
    "sourceUrl": "https://music.apple.com/us/album/white-pony/1099848709"
  }
]
