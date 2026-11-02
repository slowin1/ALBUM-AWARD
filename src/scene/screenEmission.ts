import type { Color, Vector3 } from 'three'

const GAUSS_UV = [.2113248654, .7886751346] as const

// Keep this pattern and seed convention synchronized with album-pattern.glsl.
// Four preallocated samples per screen avoid evaluating art inside the fog march.
export function updateScreenEmission(
 samples: Vector3[], colors: Color[], time: number, brightness: number,
): void {
 for (let album = 0; album < colors.length; album++) {
  const seed = album * 1.7
  const tint = colors[album]
  for (let sample = 0; sample < 4; sample++) {
   const x = (GAUSS_UV[sample % 2] - .5) * 2
   const y = (GAUSS_UV[Math.floor(sample / 2)] - .5) * 2
   const wave = Math.sin(x * 4 + Math.sin(y * 4 + seed) * 2 + time * .12)
   const folds = Math.pow(.5 + .5 * Math.sin(
    Math.hypot(x + wave * .2, y) * 12 - Math.atan2(y, x) * 3 + seed,
   ), 3)
   const edge = Math.min(1, Math.max(0, (Math.hypot(x, y) - .2) / 1.3))
   const vignette = 1 - edge * edge * (3 - 2 * edge)
   const scalar = (.055 + .945 * folds) * vignette * brightness
   samples[album * 4 + sample].set(tint.r * scalar, tint.g * scalar, tint.b * scalar)
  }
 }
}
