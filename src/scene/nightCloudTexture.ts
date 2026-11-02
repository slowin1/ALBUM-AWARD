/*
  CPU port of BufferB from "Starry night sky with moonlit clouds" by al-ro
  (https://www.shadertoy.com/view/3sffzj, MIT licence, Copyright (c) 2020 al-ro).
  Based on https://github.com/sebh/TileableVolumeNoise.

  Red & Green: 6x6 atlas of 32x32 Perlin-Worley tiles with a one-pixel halo
               (green holds the slice one level above red).
  Blue:        cloud map (shallow bowl).
  Alpha:       moon texture.
  Baked once and shared by the night sky dome and the cloud pass.
*/
import { ClampToEdgeWrapping, DataTexture, LinearFilter, NoColorSpace, RGBAFormat } from 'three'

const TEXTURE_SIZE = 256
const SIZE = 8
const NUM_CELLS = 2

const fract = (x: number) => x - Math.floor(x)
const mod = (a: number, n: number) => a - n * Math.floor(a / n)
const saturate = (x: number) => Math.min(1, Math.max(0, x))
const remap = (x: number, l1: number, h1: number, l2: number, h2: number) => l2 + (x - l1) * (h2 - l2) / (h1 - l1)
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

let hx = 0, hy = 0, hz = 0
function hash(x: number, y: number, z: number) {
  x = fract(mod(x, SIZE) * .1031); y = fract(mod(y, SIZE) * .1030); z = fract(mod(z, SIZE) * .0973)
  const d = x * (y + 33.33) + y * (x + 33.33) + z * (z + 33.33)
  x += d; y += d; z += d
  hx = 2 * fract((x + y) * z) - 1
  hy = 2 * fract((x + x) * y) - 1
  hz = 2 * fract((y + x) * x) - 1
}

function corner(ix: number, iy: number, iz: number, fx: number, fy: number, fz: number) {
  hash(ix, iy, iz)
  return hx * fx + hy * fy + hz * fz
}

function gradientNoise(px: number, py: number, pz: number) {
  const ix = Math.floor(px), iy = Math.floor(py), iz = Math.floor(pz)
  const fx = px - ix, fy = py - iy, fz = pz - iz
  const ux = fade(fx), uy = fade(fy), uz = fade(fz)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  return lerp(
    lerp(lerp(corner(ix, iy, iz, fx, fy, fz), corner(ix + 1, iy, iz, fx - 1, fy, fz), ux),
      lerp(corner(ix, iy + 1, iz, fx, fy - 1, fz), corner(ix + 1, iy + 1, iz, fx - 1, fy - 1, fz), ux), uy),
    lerp(lerp(corner(ix, iy, iz + 1, fx, fy, fz - 1), corner(ix + 1, iy, iz + 1, fx - 1, fy, fz - 1), ux),
      lerp(corner(ix, iy + 1, iz + 1, fx, fy - 1, fz - 1), corner(ix + 1, iy + 1, iz + 1, fx - 1, fy - 1, fz - 1), ux), uy),
    uz)
}

function perlin(x: number, y: number, z: number, frequency: number) {
  let sum = 0, weightSum = 0, weight = 1
  for (let octave = 0; octave < 3; octave++) {
    sum += (.5 + .5 * gradientNoise(x * frequency, y * frequency, z * frequency)) * weight
    weightSum += weight
    weight *= .5
    frequency *= 2
  }
  return saturate(sum / weightSum)
}

function worley(x: number, y: number, z: number, numCells: number) {
  const px = x * numCells, py = y * numCells, pz = z * numCells
  const fx = Math.floor(px), fy = Math.floor(py), fz = Math.floor(pz)
  let d = 1e10
  for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) for (let oz = -1; oz <= 1; oz++) {
    const tx = fx + ox, ty = fy + oy, tz = fz + oz
    hash(mod(tx, numCells), mod(ty, numCells), mod(tz, numCells))
    const dx = px - tx - (.5 + .5 * hx), dy = py - ty - (.5 + .5 * hy), dz = pz - tz - (.5 + .5 * hz)
    d = Math.min(d, dx * dx + dy * dy + dz * dz)
  }
  return 1 - saturate(d)
}

function perlinWorley(x: number, y: number, z: number) {
  const perlinNoise = perlin(x, y, z, SIZE)
  const fbm = worley(x, y, z, NUM_CELLS * 2) * .625 + worley(x, y, z, NUM_CELLS * 8) * .25 + worley(x, y, z, NUM_CELLS * 14) * .125
  return remap(perlinNoise, 0, 1, fbm, 1)
}

function worleyFbm(x: number, y: number, z: number) {
  const w0 = worley(x, y, z, NUM_CELLS), w1 = worley(x, y, z, NUM_CELLS * 2)
  const w2 = worley(x, y, z, NUM_CELLS * 4), w3 = worley(x, y, z, NUM_CELLS * 8)
  const f0 = w0 * .625 + w1 * .25 + w2 * .125
  const f1 = w1 * .625 + w2 * .25 + w3 * .125
  const f2 = w2 * .75 + w3 * .25
  return f0 * .625 + f1 * .25 + f2 * .125
}

function bake() {
  const tileSize = 34, coreSize = 32, tileRows = 6, tileCount = tileRows * tileRows
  const core = new Uint8Array(coreSize * coreSize * tileCount)
  for (let level = 0; level < tileCount; level++) {
    const z = level / tileCount
    const sliceOffset = level * coreSize * coreSize
    for (let cy = 0; cy < coreSize; cy++) {
      const y = (cy + .5) / coreSize
      for (let cx = 0; cx < coreSize; cx++) {
        const x = (cx + .5) / coreSize
        const v = saturate(remap(perlinWorley(x, y, z), worleyFbm(x, y, z), 1, 0, 1))
        core[sliceOffset + cy * coreSize + cx] = Math.round(v * 255)
      }
    }
  }

  const data = new Uint8Array(TEXTURE_SIZE * TEXTURE_SIZE * 4)
  const atlasWidth = tileRows * tileSize
  for (let py = 0; py < TEXTURE_SIZE; py++) {
    for (let px = 0; px < TEXTURE_SIZE; px++) {
      const i = (py * TEXTURE_SIZE + px) * 4
      if (px < atlasWidth && py < atlasWidth) {
        const tx = Math.floor(px / tileSize), ty = Math.floor(py / tileSize)
        const lx = ((px % tileSize) - 1 + coreSize) % coreSize
        const ly = ((py % tileSize) - 1 + coreSize) % coreSize
        const level = ty * tileRows + tx
        const nextLevel = (level + 1) % tileCount
        const cell = ly * coreSize + lx
        data[i] = core[level * coreSize * coreSize + cell]
        data[i + 1] = core[nextLevel * coreSize * coreSize + cell]
      }
      const u = (px + .5) / TEXTURE_SIZE, v = (py + .5) / TEXTURE_SIZE
      // Cloud map: constant centre height with raised edges like a shallow bowl.
      const cx = (u - .5) * 3.5, cy = (v - .5) * 3.5
      const len = Math.min(1, Math.hypot(cx, cy))
      data[i + 2] = Math.round(Math.max(.72, len * len * (3 - 2 * len)) * 255)
      // Moon: blotchy mix of Perlin and Worley noise.
      const base = perlin(u, v, 0, 2.6)
      data[i + 3] = Math.round(saturate(remap(base, .45 * worley(u, v, 0, 2), 1, 0, 1)) * 255)
    }
  }
  return data
}

let shared: DataTexture | null = null

/** Shared texture; baked on first use (once per page load). */
export function getNightCloudTexture() {
  if (shared) return shared
  const texture = new DataTexture(bake(), TEXTURE_SIZE, TEXTURE_SIZE, RGBAFormat)
  texture.wrapS = texture.wrapT = ClampToEdgeWrapping
  texture.minFilter = texture.magFilter = LinearFilter
  texture.colorSpace = NoColorSpace
  texture.generateMipmaps = false
  texture.needsUpdate = true
  shared = texture
  return texture
}
