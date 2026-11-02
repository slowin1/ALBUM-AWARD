import { useEffect, useMemo, useRef, useState } from 'react'
import { useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Group, MathUtils, Matrix4, PerspectiveCamera, PlaneGeometry, ShaderMaterial, Vector3, type MeshBasicMaterial, type Texture } from 'three'
import terrainVertexSource from '../shaders/terrain.vert.glsl?raw'
import terrainFragmentSource from '../shaders/terrain.frag.glsl?raw'
import dunes from '../shaders/dunes.glsl?raw'
import screenLight from '../shaders/screen-light.glsl?raw'
import albumVertex from '../shaders/album.vert.glsl?raw'
import albumFragment from '../shaders/album.frag.glsl?raw'
import nightCommon from '../shaders/night-common.glsl?raw'
import nightSkyVertex from '../shaders/night-sky.vert.glsl?raw'
import nightSkyFragmentSource from '../shaders/night-sky.frag.glsl?raw'
import { ALBUM_COUNT, ALBUM_SIZE, RADIUS, WHEEL_SCROLL_START, type SceneSettings } from './config'
import { albums } from '../data/albums'
import { tracks } from '../data/tracks'
import { monthArtists } from '../data/monthArtists'
import { OceanSky } from './OceanSky'
import { VolumetricFog } from './VolumetricFog'
import { useAlbumTextures } from './albumTextures'
import { getNightCloudTexture } from './nightCloudTexture'
import { TERRAIN_EXTENT, useTerrainHeightmap } from './TerrainHeightmap'
import { advanceWheelMotion, createWheelMotion } from './wheelMotion'
import { TITLE_ATLAS_COLUMNS, TITLE_ATLAS_ROWS, useAlbumTitleAtlas, useMonthArtistTitleAtlas, useTrackTitleAtlas } from './albumTitles'
import { albumTitleOpacity } from './albumTitleMotion'

const terrainVertex = terrainVertexSource.replace('// __DUNES__', dunes)
const terrainFragment = terrainFragmentSource.replace('// __DUNES__', dunes).replace('// __SCREEN_LIGHT__', screenLight)
const nightSkyFragment = nightSkyFragmentSource.replace('// __NIGHT_COMMON__', nightCommon)

// Alpha marks the opaque black body for the offscreen fog pass.
function markBlackWheel(shader: Parameters<MeshBasicMaterial['onBeforeCompile']>[0]) {
 shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a = 0.;')
}

type SceneProps = {
 mode?: 'albums' | 'tracks' | 'artists'
 settings: SceneSettings
 scroll: React.RefObject<number>
 detailScroll: React.RefObject<number>
 pointerEnabled: boolean
 selectedIndex: number | null
 detailMode: boolean
 transitioning: boolean
 onSelect: (index: number) => void
 onActiveChange: (index: number) => void
}

export function Scene({ mode = 'albums', settings, scroll, detailScroll, pointerEnabled, selectedIndex, detailMode, transitioning, onSelect, onActiveChange }: SceneProps) {
 const isTracks = mode === 'tracks'
 const isArtists = mode === 'artists'
 const artworks = useAlbumTextures(isArtists ? monthArtists : isTracks ? tracks : albums)
 const albumTitleAtlas = useAlbumTitleAtlas()
 const trackTitleAtlas = useTrackTitleAtlas()
 const artistTitleAtlas = useMonthArtistTitleAtlas()
 const titleAtlas = isArtists ? artistTitleAtlas : isTracks ? trackTitleAtlas : albumTitleAtlas
 const heightmap = useTerrainHeightmap(settings.height, settings.frequency, RADIUS)
 const smooth = useRef(detailMode ? WHEEL_SCROLL_START : 0)
 const cameraApproach = useRef(detailMode ? 1 : 0)
 const wheel = useRef<Group>(null)
 const cards = useRef<Array<Group | null>>([])
 const pulls = useRef(Array<number>(ALBUM_COUNT).fill(0))
 const titleOpacities = useRef(Array<number>(ALBUM_COUNT).fill(0))
 const wheelMotion = useRef(createWheelMotion())
 const reportedIndex = useRef(-1)
 const interactive = useRef(false)
 const [hovered, setHovered] = useState<number | null>(null)
 useCursor(hovered !== null)
 useEffect(() => { if (detailMode || transitioning) setHovered(null) }, [detailMode, transitioning])
 const positions = useMemo(() => Array.from({ length: ALBUM_COUNT }, (_, i) => {
  const angle = i / ALBUM_COUNT * Math.PI * 2
  return new Vector3(Math.sin(angle) * RADIUS, ALBUM_SIZE * .5 - .12, Math.cos(angle) * RADIUS)
 }), [])
 const lightPositions = useMemo(() => positions.map(p => p.clone()), [positions])
 const screenSamples = useMemo(() => Array.from({ length: ALBUM_COUNT * 4 }, () => new Vector3()), [])
 const activeScreen = useMemo(() => positions[0].clone(), [positions])
 const geometry = useMemo(() => new PlaneGeometry(TERRAIN_EXTENT, TERRAIN_EXTENT, 240, 240).rotateX(-Math.PI / 2), [])
 useEffect(() => () => geometry.dispose(), [geometry])
 const uniforms = useMemo(() => ({
  uRadius: { value: RADIUS }, uHeight: { value: 1.4 }, uFrequency: { value: .45 },
  uRippleScale: { value: 22 }, uBumpStrength: { value: .09 }, uLightPower: { value: 3 },
  uScreenSize: { value: ALBUM_SIZE }, uAmbient: { value: .6 },
  uLightPositions: { value: lightPositions }, uScreenSamples: { value: screenSamples },
  uHeightMap: { value: heightmap }, uTerrainExtent: { value: TERRAIN_EXTENT },
 }), [lightPositions, screenSamples, heightmap])

 useFrame(({ camera }, dt) => {
  const frameDt = Math.min(dt, .1)
  const target = detailMode ? WHEEL_SCROLL_START : Number.isFinite(scroll.current) ? MathUtils.clamp(scroll.current, 0, 1) : 0
  const motion = wheelMotion.current
  // Document scrolling already carries inertia; keep the camera close to that motion.
  smooth.current = detailMode || !motion.initialized ? target : MathUtils.damp(smooth.current, target, 14, frameDt)
  if (Math.abs(smooth.current - target) < 1.e-5) smooth.current = target
  const t = detailMode ? 1 : MathUtils.smoothstep(smooth.current, 0, WHEEL_SCROLL_START)
  const activeIndex = advanceWheelMotion(motion, target, t, selectedIndex, settings.animate, frameDt)
  interactive.current = t > .98 && target >= WHEEL_SCROLL_START && motion.introComplete && !detailMode && !transitioning
  if (activeIndex !== reportedIndex.current) {
   reportedIndex.current = activeIndex
   onActiveChange(activeIndex)
  }
  const rotation = -motion.angle
  if (wheel.current) wheel.current.rotation.y = rotation
  const c = Math.cos(rotation), s = Math.sin(rotation)
  positions.forEach((p, i) => {
   const titleTarget = albumTitleOpacity(motion.angle, i, ALBUM_COUNT, t, !detailMode && !transitioning)
   titleOpacities.current[i] = settings.animate ? MathUtils.damp(titleOpacities.current[i], titleTarget, 9, frameDt) : titleTarget
   const pullTarget = selectedIndex !== i && settings.animate && interactive.current && hovered === i ? .12 : 0
   pulls.current[i] = settings.animate ? MathUtils.damp(pulls.current[i], pullTarget, 10, frameDt) : pullTarget
   const card = cards.current[i]
   if (card) {
    card.position.z = pulls.current[i]
    card.scale.setScalar(1)
   }
   const factor = 1 + pulls.current[i] / RADIUS
   const x = p.x * factor, z = p.z * factor
   lightPositions[i].set(x * c + z * s, p.y, -x * s + z * c)
   artworks[i].emission.forEach((color, sample) => {
    screenSamples[i * 4 + sample].copy(color).multiplyScalar(settings.brightness)
   })
  })
  activeScreen.lerp(lightPositions[selectedIndex ?? activeIndex], 1 - Math.exp(-8 * frameDt))
  uniforms.uHeight.value = settings.height
  uniforms.uFrequency.value = settings.frequency
  uniforms.uBumpStrength.value = settings.bumpStrength
  uniforms.uRippleScale.value = settings.rippleScale
  uniforms.uLightPower.value = settings.lightPower
  uniforms.uAmbient.value = settings.ambient
  // Keep the chosen desktop angle; narrow screens pull back enough to show the cover.
  const fit = camera instanceof PerspectiveCamera
   ? ALBUM_SIZE * 1.1 / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * Math.max(camera.aspect, .35))
   : 4
  const approachTarget = selectedIndex !== null ? 1 : 0
  cameraApproach.current = settings.animate ? MathUtils.damp(cameraApproach.current, approachTarget, 8, frameDt) : approachTarget
  const detailProgress = Number.isFinite(detailScroll.current) ? MathUtils.clamp(detailScroll.current, 0, 1) : 0
  const detailRetreat = detailMode && settings.animate ? MathUtils.smoothstep(detailProgress, 0, 1) : 0
  const distanceToRing = Math.max(4, fit) * MathUtils.lerp(1, .9, cameraApproach.current) * (1 + .18 * detailRetreat)
  const camY = MathUtils.lerp(RADIUS * 22 / 5.7, 1.3, t)
  const camRadius = MathUtils.lerp(.01, RADIUS + distanceToRing, t)
  const lookRadius = RADIUS * t
  const lookY = 1.9 * t
  // The camera descends straight down from above the wheel, while the wheel rotates.
  camera.position.set(0, camY, camRadius)
  camera.lookAt(0, lookY, lookRadius)
 }, -1)

 return <>
  <color attach="background" args={[isArtists ? '#5f86b5' : isTracks ? '#020408' : '#08090b']} />
  <ambientLight intensity={.18} />
  <directionalLight position={[-5, 8, 8]} intensity={1.1} />
  {isArtists ? <OceanSky animate={settings.animate} speed={settings.hazeSpeed} /> : isTracks ? <NightSky animate={settings.animate} speed={settings.hazeSpeed} /> : <mesh geometry={geometry} frustumCulled={false}>
   <shaderMaterial key={terrainVertex + terrainFragment} vertexShader={terrainVertex} fragmentShader={terrainFragment} uniforms={uniforms} />
  </mesh>}
  <group ref={wheel}>
   <mesh renderOrder={-1} position={[0, ALBUM_SIZE / 2 - .12, 0]} onPointerOver={event => event.stopPropagation()}>
    <cylinderGeometry args={[RADIUS - .045, RADIUS - .045, ALBUM_SIZE, 128, 1, true]} />
    <meshBasicMaterial color="#000000" toneMapped={false} side={DoubleSide} onBeforeCompile={markBlackWheel} />
   </mesh>
   <mesh renderOrder={-1} rotation={[-Math.PI / 2, 0, 0]} position={[0, ALBUM_SIZE - .12, 0]} onPointerOver={event => event.stopPropagation()}>
    <circleGeometry args={[RADIUS - .02, 128]} />
    <meshBasicMaterial color="#000000" toneMapped={false} onBeforeCompile={markBlackWheel} />
   </mesh>
   {positions.map((p, i) => <group key={i} position={[p.x, p.y, p.z]} rotation={[0, i / ALBUM_COUNT * Math.PI * 2, 0]}>
    <group ref={node => { cards.current[i] = node }}>
     <mesh renderOrder={-1} position={[0, 0, -.04]}>
      <boxGeometry args={[ALBUM_SIZE + .02, ALBUM_SIZE + .02, .08]} />
      <meshBasicMaterial color="#000000" toneMapped={false} onBeforeCompile={markBlackWheel} />
     </mesh>
     {[-1, 1].map(side => <mesh key={side} position={[side * (ALBUM_SIZE / 2 + .003), 0, .004]}>
      <boxGeometry args={[.009, ALBUM_SIZE - .01, .008]} />
      <meshStandardMaterial color="#131417" metalness={.35} roughness={.38} />
     </mesh>)}
     <mesh position={[0, 0, .003]}
      onPointerOver={event => { if (interactive.current) { event.stopPropagation(); setHovered(i) } }}
      onPointerOut={() => setHovered(current => current === i ? null : current)}
      onClick={event => { if (interactive.current && event.delta < 6) { event.stopPropagation(); setHovered(null); onSelect(i) } }}>
      <planeGeometry args={[ALBUM_SIZE, ALBUM_SIZE]} />
      <Cover texture={artworks[i].texture} brightness={settings.brightness} titleAtlas={titleAtlas} titleOpacities={titleOpacities} index={i} />
     </mesh>
    </group>
   </group>)}
  </group>
  {!isArtists && <VolumetricFog settings={isTracks ? { ...settings, grain: 0, glitch: 0, distortion: 0 } : settings} positions={lightPositions} samples={screenSamples} activeScreen={activeScreen} pointerEnabled={pointerEnabled} variant={isTracks ? 'clouds' : 'dunes'} />}
 </>
}

function NightSky({ animate, speed }: { animate: boolean; speed: number }) {
 const material = useRef<ShaderMaterial>(null)
 const geometry = useMemo(() => {
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
  g.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2))
  return g
 }, [])
 useEffect(() => () => geometry.dispose(), [geometry])
 const uniforms = useMemo(() => ({
  uNightTexture: { value: getNightCloudTexture() },
  uInverseProjection: { value: new Matrix4() },
  uCameraWorld: { value: new Matrix4() },
  uTime: { value: 0 },
 }), [])
 useFrame(({ camera }, dt) => {
  const live = material.current?.uniforms
  if (!live) return
  if (animate) live.uTime.value += Math.min(dt, .1) * speed
  camera.updateMatrixWorld()
  live.uInverseProjection.value.copy(camera.projectionMatrixInverse)
  live.uCameraWorld.value.copy(camera.matrixWorld)
 })
 return (
  <mesh geometry={geometry} renderOrder={-100} frustumCulled={false}>
   <shaderMaterial
    ref={material}
    key={nightSkyVertex + nightSkyFragment}
    vertexShader={nightSkyVertex}
    fragmentShader={nightSkyFragment}
    uniforms={uniforms}
    depthTest={false}
    depthWrite={false}
    toneMapped={false}
   />
  </mesh>
 )
}

function Cover({ texture, brightness, titleAtlas, titleOpacities, index }: { texture: Texture; brightness: number; titleAtlas: Texture; titleOpacities: React.RefObject<number[]>; index: number }) {
 const material = useRef<ShaderMaterial>(null)
 const uniforms = useMemo(() => ({
  uCover: { value: texture }, uBrightness: { value: brightness },
  uTitleAtlas: { value: titleAtlas }, uTitleOpacity: { value: 0 },
  uTitleIndex: { value: index }, uTitleColumns: { value: TITLE_ATLAS_COLUMNS }, uTitleRows: { value: TITLE_ATLAS_ROWS },
 }), [texture, titleAtlas, index])
 useFrame(() => {
  const liveUniforms = material.current?.uniforms
  if (!liveUniforms) return
  // Fiber copies uniform records when applying props; update the live material.
  liveUniforms.uBrightness.value = brightness
  liveUniforms.uTitleOpacity.value = titleOpacities.current[index]
 })
 return <shaderMaterial ref={material} key={albumVertex + albumFragment} vertexShader={albumVertex} fragmentShader={albumFragment} uniforms={uniforms} />
}
