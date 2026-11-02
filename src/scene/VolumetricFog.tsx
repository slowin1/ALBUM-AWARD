import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
 BufferGeometry, Camera, DataTexture, DepthTexture, Float32BufferAttribute,
 HalfFloatType, LinearFilter, LinearSRGBColorSpace, Matrix4, Mesh, NearestFilter,
 NoColorSpace, RepeatWrapping, RGBAFormat, Scene, ShaderMaterial, UnsignedIntType,
 Vector2, Vector3, WebGLRenderTarget,
} from 'three'
import vertexShader from '../shaders/fullscreen.vert.glsl?raw'
import fogShaderSource from '../shaders/volume-fog.frag.glsl?raw'
import cloudFlightShaderSource from '../shaders/cloud-flight.frag.glsl?raw'
import nightCommon from '../shaders/night-common.glsl?raw'
import screenLight from '../shaders/screen-light.glsl?raw'
const fogShader = fogShaderSource.replace('// __SCREEN_LIGHT__', screenLight)
const cloudFlightShader = cloudFlightShaderSource.replace('// __NIGHT_COMMON__', nightCommon)
import compositeShaderSource from '../shaders/fog-composite.frag.glsl?raw'
import { ALBUM_COUNT, ALBUM_SIZE, type SceneSettings } from './config'
import { getNightCloudTexture } from './nightCloudTexture'
import { useRenderQuality } from './RenderQuality'
import { sampleGlitch } from './glitch'
import { POINTER_WAKE_COUNT, usePointerWake } from './usePointerWake'

const compositeShader = compositeShaderSource.replace('// __POINTER_WAKE_COUNT__', `#define POINTER_WAKE_COUNT ${POINTER_WAKE_COUNT}`)

function noiseTexture() {
 // No external iChannel0 asset: deterministic, repeatable linear noise data.
 const size = 128
 const data = new Uint8Array(size * size * 4)
 let seed = 20261016
 for (let i = 0; i < data.length; i += 4) {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5
  const value = seed & 255
  data[i] = data[i + 1] = data[i + 2] = value; data[i + 3] = 255
 }
 const texture = new DataTexture(data, size, size, RGBAFormat)
 texture.wrapS = texture.wrapT = RepeatWrapping
 texture.minFilter = texture.magFilter = LinearFilter
 texture.colorSpace = NoColorSpace
 texture.generateMipmaps = false
 texture.needsUpdate = true
 return texture
}

export function VolumetricFog({ settings, positions, samples, activeScreen, pointerEnabled, variant = 'dunes' }: {
 settings: SceneSettings; positions: Vector3[]; samples: Vector3[]; activeScreen: Vector3; pointerEnabled: boolean; variant?: 'dunes' | 'clouds'
}) {
 const { gl, size, viewport } = useThree()
 const quality = useRenderQuality()
 const wakeEnabled = pointerEnabled && settings.animate && settings.cursorDistortion > 0
 const wake = usePointerWake(wakeEnabled)
 const activeFogShader = variant === 'clouds' ? cloudFlightShader : fogShader
 const resources = useMemo(() => {
  const sceneTarget = new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: true })
  sceneTarget.texture.colorSpace = LinearSRGBColorSpace
  sceneTarget.depthTexture = new DepthTexture(1, 1, UnsignedIntType)
  sceneTarget.depthTexture.minFilter = sceneTarget.depthTexture.magFilter = NearestFilter
  const fogTarget = new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false })
  fogTarget.texture.colorSpace = LinearSRGBColorSpace
  fogTarget.texture.minFilter = fogTarget.texture.magFilter = NearestFilter
  const texture = noiseTexture()
  const nightTexture = variant === 'clouds' ? getNightCloudTexture() : texture
  const projection = new Matrix4()
  const uniforms = {
   uDepth: { value: sceneTarget.depthTexture }, uScene: { value: sceneTarget.texture }, uNoise: { value: texture },
   uNightTexture: { value: nightTexture },
   uInverseProjection: { value: projection }, uCameraWorld: { value: new Matrix4() },
   uTime: { value: 0 }, uDensity: { value: 0 }, uNoiseScale: { value: 120 },
   uLightPower: { value: settings.lightPower },
   uLightPositions: { value: positions }, uScreenSamples: { value: samples }, uScreenSize: { value: ALBUM_SIZE },
   uFogLightPositions: { value: positions },
   uFogLightColors: { value: Array.from({ length: ALBUM_COUNT }, () => new Vector3()) },
   uFogSteps: { value: 18 },
   uActiveScreen: { value: activeScreen },
  }
  const fogMaterial = new ShaderMaterial({
   vertexShader, fragmentShader: activeFogShader, uniforms,
   depthTest: false, depthWrite: false, toneMapped: false,
  })
  const compositeMaterial = new ShaderMaterial({
   vertexShader, fragmentShader: compositeShader,
   uniforms: {
    uScene: { value: sceneTarget.texture }, uFog: { value: fogTarget.texture }, uNoise: { value: texture },
    uDepth: { value: sceneTarget.depthTexture }, uFogSize: { value: new Vector2(1, 1) },
    uInverseProjection: { value: projection },
    uViewportSize: { value: new Vector2(1, 1) }, uFogEnabled: { value: true },
    uDistortionTime: { value: 0 }, uDistortionStrength: { value: 0 },
    uGlitchStrength: { value: 0 }, uGlitchSeed: { value: 0 },
    uGlitchPhase: { value: 0 }, uGlitchJitter: { value: 0 },
    uGrainStrength: { value: 0 }, uGrainFrame: { value: 0 },
    uPointerWake: { value: wake.points }, uPointerStrength: { value: 0 },
   }, depthTest: false, depthWrite: false,
  })
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
  geometry.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2))
  const fogScene = new Scene(), compositeScene = new Scene()
  const fogMesh = new Mesh(geometry, fogMaterial), compositeMesh = new Mesh(geometry, compositeMaterial)
  fogMesh.frustumCulled = compositeMesh.frustumCulled = false
  fogScene.add(fogMesh); compositeScene.add(compositeMesh)
  return { sceneTarget, fogTarget, texture, uniforms, fogMaterial, compositeMaterial, geometry, fogScene, compositeScene, camera: new Camera() }
 }, [positions, samples, activeScreen, activeFogShader, compositeShader, vertexShader, wake.points, variant])

 useEffect(() => {
  const dimensions = gl.getDrawingBufferSize(new Vector2())
  const width = Math.max(1, Math.ceil(dimensions.x * quality.fogScale))
  const height = Math.max(1, Math.ceil(dimensions.y * quality.fogScale))
  resources.sceneTarget.setSize(dimensions.x, dimensions.y)
  resources.fogTarget.setSize(width, height)
  resources.compositeMaterial.uniforms.uFogSize.value.set(width, height)
  resources.compositeMaterial.uniforms.uViewportSize.value.set(Math.max(1, size.width), Math.max(1, size.height))
 }, [gl, size.width, size.height, viewport.dpr, quality.fogScale, resources])

 useEffect(() => () => {
  resources.sceneTarget.dispose(); resources.fogTarget.dispose(); resources.texture.dispose()
  resources.fogMaterial.dispose(); resources.compositeMaterial.dispose(); resources.geometry.dispose()
 }, [resources])

 // Positive priority owns rendering. Scene/camera callbacks run before this pass.
 useFrame(({ scene, camera }, dt) => {
  const density = settings.haze
  const fogEnabled = density > 0
  const distortion = settings.animate ? settings.distortion : 0
  const glitch = settings.animate ? settings.glitch : 0
  const grain = settings.grain
  let wakeEnergy = 0
  for (const point of wake.points) wakeEnergy = Math.max(wakeEnergy, point.z)
  const cursorDistortion = wakeEnabled && wakeEnergy > 0 ? settings.cursorDistortion : 0
  const previousTarget = gl.getRenderTarget()
  if (!fogEnabled && distortion <= 0 && glitch <= 0 && grain <= 0 && cursorDistortion <= 0) { gl.render(scene, camera); return }
  const u = resources.uniforms
  const composite = resources.compositeMaterial.uniforms
  composite.uFogEnabled.value = fogEnabled
  composite.uDistortionStrength.value = distortion
  composite.uPointerStrength.value = cursorDistortion
  if (settings.animate) composite.uDistortionTime.value += Math.min(dt, .1)
  const burst = sampleGlitch(composite.uDistortionTime.value)
  composite.uGlitchStrength.value = glitch * burst.strength
  composite.uGlitchSeed.value = burst.seed
  composite.uGlitchPhase.value = burst.phase
  composite.uGlitchJitter.value = burst.jitter
  composite.uGrainStrength.value = grain
  // Freeze the grain under reduced motion, preserving its texture without shimmer.
  composite.uGrainFrame.value = Math.floor(composite.uDistortionTime.value * 12) % 4096
  if (fogEnabled) u.uTime.value += Math.min(dt, .1) * settings.hazeSpeed
  u.uDensity.value = density
  u.uNoiseScale.value = settings.hazeScale
  u.uLightPower.value = settings.lightPower
  u.uFogSteps.value = quality.fogSteps
  // Fog is diffuse: one averaged radiance per display keeps all twelve colors
  // without repeating the surface material's four-point area-light integration.
  u.uFogLightColors.value.forEach((color, index) => {
   color.copy(samples[index * 4]).add(samples[index * 4 + 1]).add(samples[index * 4 + 2]).add(samples[index * 4 + 3]).multiplyScalar(.25)
  })
  camera.updateMatrixWorld()
  u.uInverseProjection.value.copy(camera.projectionMatrixInverse)
  u.uCameraWorld.value.copy(camera.matrixWorld)
  try {
   gl.setRenderTarget(resources.sceneTarget)
   gl.render(scene, camera)
   if (fogEnabled) {
    gl.setRenderTarget(resources.fogTarget)
    gl.render(resources.fogScene, resources.camera)
   }
   gl.setRenderTarget(previousTarget)
   gl.render(resources.compositeScene, resources.camera)
  } finally { gl.setRenderTarget(previousTarget) }
 }, 1)
 return null
}
