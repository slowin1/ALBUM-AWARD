import { useEffect, useMemo } from 'react'
import {
 CanvasTexture,
 ClampToEdgeWrapping,
 LinearFilter,
 NoColorSpace,
 type Texture,
} from 'three'
import { albums } from '../data/albums'
import { tracks } from '../data/tracks'
import { monthArtists } from '../data/monthArtists'

export const TITLE_ATLAS_COLUMNS = 2
export const TITLE_ATLAS_ROWS = Math.ceil(albums.length / TITLE_ATLAS_COLUMNS)

const TILE_WIDTH = 512
const TILE_HEIGHT = 192
const PADDING = 16
const FONT_SIZE = 34

function wrapTitle(context: CanvasRenderingContext2D, title: string): string[] {
 const lines: string[] = []
 let line = ''
 for (const word of title.trim().split(/\s+/)) {
  const candidate = line ? `${line} ${word}` : word
  if (context.measureText(candidate).width <= TILE_WIDTH - PADDING * 2) {
   line = candidate
   continue
  }
  if (line) lines.push(line)
  line = ''
  // Keep an unusually long single word inside its tile as well.
  for (const character of word) {
   if (line && context.measureText(line + character).width > TILE_WIDTH - PADDING * 2) {
    lines.push(line)
    line = ''
   }
   line += character
  }
 }
 if (line) lines.push(line)
 return lines
}

function drawTitles(canvas: HTMLCanvasElement, items: ReadonlyArray<{ title: string }>): void {
 const context = canvas.getContext('2d')
 if (!context) return
 context.clearRect(0, 0, canvas.width, canvas.height)
 context.fillStyle = '#fff'
 context.textAlign = 'left'
 context.textBaseline = 'middle'
 context.shadowColor = 'rgba(245, 247, 255, .9)'
 context.shadowBlur = 14
 context.shadowOffsetY = 0

 items.forEach((album, index) => {
  // Keep the luminous halo inside this title's atlas tile.
  context.save()
  context.beginPath()
  context.rect((index % TITLE_ATLAS_COLUMNS) * TILE_WIDTH, Math.floor(index / TITLE_ATLAS_COLUMNS) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
  context.clip()
  let fontSize = FONT_SIZE
  let lines: string[]
  do {
   context.font = `500 ${fontSize}px Onest, sans-serif`
   lines = wrapTitle(context, album.title)
   if (lines.length <= 3 || fontSize <= 20) break
   fontSize -= 2
  } while (true)

  const lineHeight = fontSize * 1.2
  const x = (index % TITLE_ATLAS_COLUMNS) * TILE_WIDTH + PADDING
  const centerY = Math.floor(index / TITLE_ATLAS_COLUMNS) * TILE_HEIGHT + TILE_HEIGHT / 2
  lines.forEach((line, lineIndex) => {
   const y = centerY + (lineIndex - (lines.length - 1) / 2) * lineHeight
   context.fillText(line, x, y)
  })
  context.restore()
 })
}

function useTitleAtlas(items: ReadonlyArray<{ title: string }>): Texture {
 const titlesKey = items.map(i => i.title).join('|')
 const texture = useMemo(() => {
  const canvas = document.createElement('canvas')
  canvas.width = TITLE_ATLAS_COLUMNS * TILE_WIDTH
  canvas.height = TITLE_ATLAS_ROWS * TILE_HEIGHT
  drawTitles(canvas, items)
  const atlas = new CanvasTexture(canvas)
  atlas.colorSpace = NoColorSpace
  atlas.minFilter = LinearFilter
  atlas.magFilter = LinearFilter
  atlas.generateMipmaps = false
  atlas.wrapS = atlas.wrapT = ClampToEdgeWrapping
  return atlas
 }, [titlesKey])

 useEffect(() => {
  let active = true
  // Strict Mode may dispose and reuse this memoized texture during effect replay.
  texture.needsUpdate = true
  if (document.fonts?.load) {
   void document.fonts.load(`500 ${FONT_SIZE}px Onest`).then(() => {
    if (!active) return
    drawTitles(texture.image as HTMLCanvasElement, items)
    texture.needsUpdate = true
   }).catch(() => {
    // The initial system-font atlas remains usable if the web font cannot load.
   })
  }
  return () => {
   active = false
   texture.dispose()
  }
 }, [texture, titlesKey])

 return texture
}

export function useAlbumTitleAtlas(): Texture {
 return useTitleAtlas(albums)
}

export function useTrackTitleAtlas(): Texture {
 return useTitleAtlas(tracks)
}

export function useMonthArtistTitleAtlas(): Texture {
  return useTitleAtlas(monthArtists)
}
