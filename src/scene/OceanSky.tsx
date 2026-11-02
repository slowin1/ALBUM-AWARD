import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  BufferGeometry, DataTexture, Float32BufferAttribute, LinearFilter, Matrix4, NoColorSpace,
  RepeatWrapping, RGBAFormat, ShaderMaterial, Vector2,
} from 'three'
import oceanSkyVertex from '../shaders/night-sky.vert.glsl?raw'
import oceanSkyFragment from '../shaders/ocean-sky.frag.glsl?raw'
import { useRenderQuality } from './RenderQuality'

const SIZE = 256

/**
 * Deterministic tileable noise, packed for the cloud/ocean shader:
 * G = random field, R = the same field shifted by (37, 17) (cheap 3D value noise),
 * B = blurred, contrast-normalised field (smooth weather map).
 */
function createOceanNoise() {
  const count = SIZE * SIZE
  const field = new Float32Array(count)
  let seed = 0x2f6e2b1
  for (let i = 0; i < count; i++) {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5
    field[i] = ((seed >>> 0) & 0xffff) / 65535
  }

  const radius = 4
  let source = field
  let scratch = new Float32Array(count)
  let target = new Float32Array(count)
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        let sum = 0
        for (let k = -radius; k <= radius; k++) sum += source[y * SIZE + ((x + k + SIZE) & (SIZE - 1))]
        scratch[y * SIZE + x] = sum / (radius * 2 + 1)
      }
    }
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        let sum = 0
        for (let k = -radius; k <= radius; k++) sum += scratch[((y + k + SIZE) & (SIZE - 1)) * SIZE + x]
        target[y * SIZE + x] = sum / (radius * 2 + 1)
      }
    }
    source = target
    target = new Float32Array(count)
  }

  let mean = 0
  for (let i = 0; i < count; i++) mean += source[i]
  mean /= count
  let variance = 0
  for (let i = 0; i < count; i++) variance += (source[i] - mean) ** 2
  const deviation = Math.sqrt(variance / count) || 1

  const data = new Uint8Array(count * 4)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = y * SIZE + x
      const shifted = field[((y + 17) & (SIZE - 1)) * SIZE + ((x + 37) & (SIZE - 1))]
      const weather = Math.min(1, Math.max(0, .5 + (source[i] - mean) / deviation * .17))
      data[i * 4] = Math.round(shifted * 255)
      data[i * 4 + 1] = Math.round(field[i] * 255)
      data[i * 4 + 2] = Math.round(weather * 255)
      data[i * 4 + 3] = 255
    }
  }
  const texture = new DataTexture(data, SIZE, SIZE, RGBAFormat)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.minFilter = texture.magFilter = LinearFilter
  texture.colorSpace = NoColorSpace
  texture.generateMipmaps = false
  texture.needsUpdate = true
  return texture
}

/** Fullscreen ocean + clouds backdrop. Outputs display-referred colour directly. */
export function OceanSky({ animate, speed }: { animate: boolean; speed: number }) {
  const material = useRef<ShaderMaterial>(null)
  const gl = useThree(state => state.gl)
  const quality = useRenderQuality()
  const geometry = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
    g.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2))
    return g
  }, [])
  const noise = useMemo(createOceanNoise, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => noise.dispose(), [noise])
  const uniforms = useMemo(() => ({
    uNoise: { value: noise },
    uInverseProjection: { value: new Matrix4() },
    uCameraWorld: { value: new Matrix4() },
    uViewProjection: { value: new Matrix4() },
    uResolution: { value: new Vector2(1, 1) },
    uTime: { value: 0 },
    uCloudSteps: { value: 12 },
  }), [noise])

  useFrame(({ camera }, dt) => {
    const live = material.current?.uniforms
    if (!live) return
    if (animate) live.uTime.value += Math.min(dt, .1) * speed
    live.uCloudSteps.value = Math.max(8, Math.min(15, Math.round(quality.fogSteps * 0.65)))
    camera.updateMatrixWorld()
    live.uInverseProjection.value.copy(camera.projectionMatrixInverse)
    live.uCameraWorld.value.copy(camera.matrixWorld)
    live.uViewProjection.value.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    gl.getDrawingBufferSize(live.uResolution.value)
  })

  return (
    <mesh geometry={geometry} renderOrder={-100} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        key={oceanSkyVertex + oceanSkyFragment}
        vertexShader={oceanSkyVertex}
        fragmentShader={oceanSkyFragment}
        uniforms={uniforms}
        depthTest={true}
        depthWrite={true}
        toneMapped={false}
      />
    </mesh>
  )
}
