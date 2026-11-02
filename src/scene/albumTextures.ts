import { useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import { albums } from '../data/albums'

const linear = (value: number) => {
 const c = value / 255
 return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4)
}

export function useAlbumTextures(items: ReadonlyArray<{ cover: string }> = albums) {
 const textures = useLoader(TextureLoader, items.map(album => album.cover))
 const { gl } = useThree()
 return useMemo(() => textures.map(texture => {
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
  texture.needsUpdate = true
  const emission = Array.from({ length: 4 }, () => new Vector3(.16, .16, .16))
  // Average each quadrant in linear space once, not during the fragment loop.
  // UV row zero is the bottom of the screen, while canvas row zero is the top.
  try {
   const canvas = document.createElement('canvas')
   canvas.width = canvas.height = 64
   const context = canvas.getContext('2d', { willReadFrequently: true })
   if (context) {
    context.drawImage(texture.image, 0, 0, 64, 64)
    const pixels = context.getImageData(0, 0, 64, 64).data
    for (let sample = 0; sample < 4; sample++) {
     const x0 = (sample % 2) * 32
     const y0 = (1 - Math.floor(sample / 2)) * 32
     const color = emission[sample].set(0, 0, 0)
     for (let y = y0; y < y0 + 32; y++) {
      for (let x = x0; x < x0 + 32; x++) {
       const i = (y * 64 + x) * 4
       color.x += linear(pixels[i]); color.y += linear(pixels[i + 1]); color.z += linear(pixels[i + 2])
      }
     }
     color.multiplyScalar(1 / 1024)
    }
   }
  } catch {
   // Covers remain usable if the browser blocks canvas readback.
  }
  return { texture, emission }
 }), [textures, gl])
}
