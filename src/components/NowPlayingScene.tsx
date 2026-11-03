import { Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Group, MathUtils, PerspectiveCamera, SRGBColorSpace, TextureLoader, Vector3, type Texture } from 'three'
import { NightSky } from '../scene/Scene'
import { ALBUM_COUNT, ALBUM_SIZE, RADIUS, SCENE_DEFAULTS } from '../scene/config'
import { VolumetricFog } from '../scene/VolumetricFog'
import { formatAudioTime, seekAudioTo, useAudioPlayer, useAudioProgress, type PlayableTrack } from '../hooks/useAudioPlayer'
import { scrollToPosition, setSmoothScrollLocked } from '../navigation/smoothScroll'
import './NowPlayingScene.css'

type LyricLine = { time: number; text: string }
type LyricsState =
  | { status: 'loading' }
  | { status: 'synced'; lines: LyricLine[] }
  | { status: 'plain'; lines: string[] }
  | { status: 'none' }

const lyricsCache = new Map<string, LyricsState>()

function cleanTitle(title: string, artist: string): string {
  let t = title.replace(/\s*[([](?:feat|ft|with|prod)[^)\]]*[)\]]/gi, '')
  const lower = t.toLowerCase()
  const a = artist.split(',')[0].trim().toLowerCase()
  for (const sep of [' - ', ' – ', ' — ']) {
    const idx = lower.indexOf(sep)
    if (idx > 0 && a && lower.slice(0, idx).includes(a)) t = t.slice(idx + sep.length)
  }
  return t.trim()
}

function parseLrc(raw: string): LyricLine[] {
  const lines: LyricLine[] = []
  for (const row of raw.split('\n')) {
    const stamps = [...row.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)]
    if (!stamps.length) continue
    const text = row.replace(/\[[^\]]*\]/g, '').trim()
    for (const m of stamps) lines.push({ time: Number(m[1]) * 60 + Number(m[2]), text })
  }
  return lines.sort((x, y) => x.time - y.time)
}

type LrcRecord = { syncedLyrics?: string | null; plainLyrics?: string | null }

function toState(rec: LrcRecord | undefined): LyricsState {
  if (rec?.syncedLyrics) {
    const lines = parseLrc(rec.syncedLyrics)
    if (lines.length) return { status: 'synced', lines }
  }
  if (rec?.plainLyrics) {
    const lines = rec.plainLyrics.split('\n').map(l => l.trim())
    if (lines.some(Boolean)) return { status: 'plain', lines }
  }
  return { status: 'none' }
}

async function fetchLyrics(track: PlayableTrack, signal: AbortSignal): Promise<LyricsState> {
  const artist = track.artist.split(',')[0].trim()
  const title = cleanTitle(track.title, track.artist)
  try {
    const res = await fetch(
      `/api/audio/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`,
      { signal },
    )
    if (res.ok) {
      const data: { synced?: string | null; plain?: string | null } = await res.json()
      return toState({ syncedLyrics: data.synced, plainLyrics: data.plain })
    }
  } catch {
    // network error or abort
  }
  return { status: 'none' }
}

function useLyrics(track: PlayableTrack): LyricsState {
  const key = `${track.artist}|${track.title}`
  const [state, setState] = useState<LyricsState>(() => lyricsCache.get(key) ?? { status: 'loading' })

  useEffect(() => {
    const cached = lyricsCache.get(key)
    if (cached) {
      setState(cached)
      return
    }
    setState({ status: 'loading' })
    const controller = new AbortController()
    void fetchLyrics(track, controller.signal).then(result => {
      if (controller.signal.aborted) return
      if (result.status !== 'none') lyricsCache.set(key, result)
      setState(result)
    })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}

function useCoverTexture(url: string): Texture | null {
  const [texture, setTexture] = useState<Texture | null>(null)
  useEffect(() => {
    let alive = true
    const loader = new TextureLoader()
    loader.setCrossOrigin('anonymous')
    setTexture(null)
    loader.load(
      url,
      tex => {
        tex.colorSpace = SRGBColorSpace
        tex.anisotropy = 8
        if (alive) setTexture(tex)
      },
      undefined,
      () => {
        if (alive) setTexture(null)
      },
    )
    return () => {
      alive = false
    }
  }, [url])
  return texture
}

const COVER_BASE_Y = ALBUM_SIZE / 2 - 0.12
const FOG_SETTINGS = { ...SCENE_DEFAULTS, lightPower: 5, haze: 0.4, animate: true, grain: 0, glitch: 0, distortion: 0, cursorDistortion: 0 }
const linearChannel = (v: number) => {
  const c = v / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

const linearChannel255 = (v: number) => linearChannel(v * 255)

function averageColor(texture: Texture | null): [number, number, number] {
  if (!texture) return [0.16, 0.16, 0.16]
  try {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 16
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return [0.16, 0.16, 0.16]
    ctx.drawImage(texture.image as CanvasImageSource, 0, 0, 16, 16)
    const px = ctx.getImageData(0, 0, 16, 16).data
    let r = 0, g = 0, b = 0
    for (let i = 0; i < px.length; i += 4) {
      r += linearChannel(px[i]); g += linearChannel(px[i + 1]); b += linearChannel(px[i + 2])
    }
    const n = px.length / 4
    return [r / n, g / n, b / n]
  } catch {
    return [0.16, 0.16, 0.16]
  }
}

/** Vivid dominant colour (sRGB 0..1) so even muted covers still tint the scene. */
function dominantTint(texture: Texture | null): [number, number, number] {
  if (!texture) return [0.5, 0.55, 0.7]
  try {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 16
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return [0.5, 0.55, 0.7]
    ctx.drawImage(texture.image as CanvasImageSource, 0, 0, 16, 16)
    const px = ctx.getImageData(0, 0, 16, 16).data
    let r = 0, g = 0, b = 0, w = 0
    for (let i = 0; i < px.length; i += 4) {
      const max = Math.max(px[i], px[i + 1], px[i + 2]), min = Math.min(px[i], px[i + 1], px[i + 2])
      const weight = 0.15 + (max - min) / 255 // favour colourful pixels
      r += px[i] * weight; g += px[i + 1] * weight; b += px[i + 2] * weight; w += weight
    }
    r /= w * 255; g /= w * 255; b /= w * 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    const l = (max + min) / 2
    const d = max - min
    let h = 0
    if (d > 0) {
      if (max === r) h = ((g - b) / d) % 6
      else if (max === g) h = (b - r) / d + 2
      else h = (r - g) / d + 4
      h /= 6
      if (h < 0) h += 1
    }
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
    const sat = Math.min(1, Math.max(s * 1.35, d === 0 ? 0 : 0.45))
    const lig = MathUtils.clamp(l, 0.42, 0.62)
    const k = (n: number) => (n + h * 12) % 12
    const a = sat * Math.min(lig, 1 - lig)
    const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [f(0), f(8), f(4)]
  } catch {
    return [0.5, 0.55, 0.7]
  }
}

function CameraRig() {
  const progress = useRef(1)
  useFrame(({ camera, pointer }) => {
    // Fixed camera in front of the cover with a light pointer parallax.
        const t = MathUtils.smootherstep(progress.current, 0, 1)
    const distance = 9
    const camY = MathUtils.lerp(RADIUS * 22 / 5.7, 1.3, t)
    const camZ = MathUtils.lerp(0.01, RADIUS + distance, t)
    const sway = t * 0.35
    camera.position.set(pointer.x * sway, camY + pointer.y * sway * 0.5, camZ)
    camera.lookAt(0, 1.9 * t, RADIUS * t)
    if (camera instanceof PerspectiveCamera) camera.updateProjectionMatrix()
  }, -1)
  return null
}

function CoverStage({ cover, controlsRef, onTint }: { cover: string; controlsRef: RefObject<HTMLDivElement | null>; onTint: (rgb: [number, number, number]) => void }) {
  const texture = useCoverTexture(cover)
  const group = useRef<Group>(null)
  const appear = useRef(0)
  const size = useThree(state => state.size)

  // Fog lights and samples shared with the cloud pass; one lit cover, the other lights parked far away.
  const lights = useMemo(() => Array.from({ length: ALBUM_COUNT }, () => new Vector3(0, -80, -80)), [])
  const samples = useMemo(() => Array.from({ length: ALBUM_COUNT * 4 }, () => new Vector3(0, 0, 0)), [])
  const activeScreen = useMemo(() => new Vector3(0, COVER_BASE_Y, RADIUS), [])

  useEffect(() => {
    const tint = dominantTint(texture)
    onTint(tint)
    // Strong, saturated light so the clouds visibly take the cover's colour.
    const [r, g, b] = tint.map(linearChannel255)
    for (let i = 0; i < 4; i++) samples[i].set(r, g, b).multiplyScalar(SCENE_DEFAULTS.brightness * 6)
  }, [texture, samples, onTint])

  useFrame(({ pointer, camera }, dt) => {
    const g = group.current
    if (!g) return
    const frameDt = Math.min(dt, 0.1)
    appear.current = MathUtils.damp(appear.current, 1, 5, frameDt)
    const wide = size.width / size.height > 1.05
    const targetX = wide ? -3.3 : 0
    const targetY = wide ? 0 : 1.2
    g.position.x = MathUtils.damp(g.position.x, targetX, 6, frameDt)
    g.position.y = MathUtils.damp(g.position.y, targetY, 6, frameDt)
    g.scale.setScalar(MathUtils.lerp(0.55, wide ? 1.1 : 0.8, MathUtils.smootherstep(appear.current, 0, 1)))
    g.rotation.y = MathUtils.damp(g.rotation.y, pointer.x * 0.2, 4, frameDt)
    g.rotation.x = MathUtils.damp(g.rotation.x, -pointer.y * 0.1, 4, frameDt)
    lights[0].set(g.position.x, COVER_BASE_Y + g.position.y, RADIUS)
    activeScreen.copy(lights[0])

    // Pin the transport controls under the projected cover.
    const el = controlsRef.current
    if (el) {
      const half = (ALBUM_SIZE / 2) * g.scale.x
      const cy = COVER_BASE_Y + g.position.y
      const bottom = new Vector3(g.position.x, cy - half, RADIUS).project(camera)
      const left = new Vector3(g.position.x - half, cy, RADIUS).project(camera)
      const right = new Vector3(g.position.x + half, cy, RADIUS).project(camera)
      const toX = (n: number) => ((n + 1) / 2) * size.width
      const toY = (n: number) => ((1 - n) / 2) * size.height
      el.style.left = `${toX(left.x)}px`
      el.style.width = `${toX(right.x) - toX(left.x)}px`
      el.style.top = `${toY(bottom.y) + 22}px`
      el.style.opacity = '1'
      el.style.pointerEvents = 'auto'
    }
  })

  return (
    <>
      <group ref={group} position={[0, 0, RADIUS]}>
        <group position={[0, COVER_BASE_Y, 0]}>
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[ALBUM_SIZE + 0.02, ALBUM_SIZE + 0.02, 0.08]} />
            <meshBasicMaterial color="#000000" toneMapped={false} />
          </mesh>
          {[-1, 1].map(side => (
            <mesh key={side} position={[side * (ALBUM_SIZE / 2 + 0.003), 0, 0.004]}>
              <boxGeometry args={[0.009, ALBUM_SIZE - 0.01, 0.008]} />
              <meshStandardMaterial color="#131417" metalness={0.35} roughness={0.38} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.003]}>
            <planeGeometry args={[ALBUM_SIZE, ALBUM_SIZE]} />
            <meshBasicMaterial key={texture ? 'map' : 'blank'} map={texture ?? undefined} color={texture ? '#ffffff' : '#101218'} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <CameraRig />
      <VolumetricFog
        settings={FOG_SETTINGS}
        positions={lights}
        samples={samples}
        activeScreen={activeScreen}
        pointerEnabled={false}
        variant="clouds"
      />
    </>
  )
}

function LyricsPanel({ track }: { track: PlayableTrack }) {
  const lyrics = useLyrics(track)
  const { currentTime } = useAudioProgress()
  const { isPlaying } = useAudioPlayer()
  const listRef = useRef<HTMLDivElement>(null)
  const clock = useRef({ time: 0, stamp: 0, playing: false })

  useEffect(() => {
    clock.current = { time: currentTime, stamp: performance.now(), playing: isPlaying }
  }, [currentTime, isPlaying])

  const activeIndex = useMemo(() => {
    if (lyrics.status !== 'synced') return -1
    let idx = -1
    for (let i = 0; i < lyrics.lines.length; i++) {
      if (lyrics.lines[i].time <= currentTime + 0.25) idx = i
      else break
    }
    return idx
  }, [lyrics, currentTime])

  useEffect(() => {
    if (activeIndex < 0) return
    const container = listRef.current
    const el = container?.querySelector<HTMLElement>(`[data-line="${activeIndex}"]`)
    if (!container || !el) return
    container.scrollTo({
      top: el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2,
      behavior: 'smooth',
    })
  }, [activeIndex])

  // Word-by-word fill: LRC has line timestamps only, so words share the line's time by length.
  useEffect(() => {
    if (lyrics.status !== 'synced' || activeIndex < 0) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-line="${activeIndex}"]`)
    if (!el) return
    const words = [...el.querySelectorAll<HTMLElement>('.np-word')]
    if (!words.length) return
    const line = lyrics.lines[activeIndex]
    const next = lyrics.lines[activeIndex + 1]
    const duration = Math.max(0.5, Math.min((next ? next.time : line.time + 4) - line.time, 10)) * 0.92
    const weights = words.map(w => (w.textContent?.length ?? 1) + 1)
    const total = weights.reduce((a, b) => a + b, 0)
    let raf = 0
    const tick = () => {
      const c = clock.current
      const now = c.playing ? c.time + (performance.now() - c.stamp) / 1000 : c.time
      const pos = MathUtils.clamp((now - line.time) / duration, 0, 1) * total
      let start = 0
      words.forEach((w, i) => {
        w.style.setProperty('--p', MathUtils.clamp((pos - start) / weights[i], 0, 1).toFixed(3))
        start += weights[i]
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [lyrics, activeIndex])

  return (
    <section className="np-lyrics" aria-label="Текст трека">
      <div className="np-lyrics-head">
        <h2 className="np-title">{track.title}</h2>
        <p className="np-artist">{track.artist}</p>
      </div>

      <div className="np-lyrics-list" ref={listRef} data-smooth-scroll-prevent>
        {lyrics.status === 'loading' && <p className="np-status">Ищем текст…</p>}
        {lyrics.status === 'none' && <p className="np-status">Текст для этого трека не найден</p>}

        {lyrics.status === 'synced' &&
          lyrics.lines.map((line, i) => (
            <button
              key={`${line.time}-${i}`}
              type="button"
              data-line={i}
              className={`np-line${i === activeIndex ? ' is-active' : i < activeIndex ? ' is-past' : ''}`}
              onClick={() => seekAudioTo(line.time)}
            >
              {i === activeIndex && line.text
                ? line.text.split(/\s+/).map((word, w) => (
                    <span key={w} className="np-word">
                      {word}
                    </span>
                  ))
                : line.text || '♪'}
            </button>
          ))}

        {lyrics.status === 'plain' &&
          lyrics.lines.map((line, i) => (
            <p key={i} className="np-line is-plain">
              {line || '\u00a0'}
            </p>
          ))}
      </div>
    </section>
  )
}

function SceneControls({ controlsRef }: { controlsRef: RefObject<HTMLDivElement | null> }) {
  const { isPlaying, isLoading, togglePlay, playNext, playPrev, seekTo } = useAudioPlayer()
  const { currentTime, duration } = useAudioProgress()
  const safeDuration = duration > 0 ? duration : 30
  const current = Math.min(safeDuration, Math.max(0, currentTime))
  const pct = (current / safeDuration) * 100

  return (
    <div className="np-controls" ref={controlsRef} style={{ opacity: 0, pointerEvents: 'none' }}>
      <div className="np-seek" style={{ '--np-pct': `${pct.toFixed(2)}%` } as CSSProperties}>
        <div className="np-seek-track" aria-hidden="true">
          <div className="np-seek-fill" />
          <div className="np-seek-thumb" />
        </div>
        <input
          type="range"
          className="np-seek-input"
          min={0}
          max={safeDuration}
          step={0.05}
          value={current}
          onChange={e => seekTo(Number(e.target.value))}
          aria-label={`Позиция воспроизведения: ${formatAudioTime(current)} из ${formatAudioTime(safeDuration)}`}
        />
      </div>
      <div className="np-times">
        <span>{formatAudioTime(current)}</span>
        <span>-{formatAudioTime(Math.max(0, safeDuration - current))}</span>
      </div>
      <div className="np-transport">
        <button type="button" className="np-btn" onClick={playPrev} aria-label="Предыдущий трек">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.9 6.1c.76-.55 1.82-.01 1.82.93v9.94c0 .94-1.06 1.48-1.82.93L2.05 12.93a1.15 1.15 0 0 1 0-1.86L8.9 6.1ZM20.4 6.1c.76-.55 1.82-.01 1.82.93v9.94c0 .94-1.06 1.48-1.82.93l-6.85-4.97a1.15 1.15 0 0 1 0-1.86l6.85-4.97Z" />
          </svg>
        </button>
        <button type="button" className="np-btn is-main" onClick={togglePlay} aria-label={isPlaying ? 'Пауза' : 'Играть'}>
          {isLoading ? (
            <span className="np-spinner" />
          ) : isPlaying ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4.2" height="14" rx="1.3" />
              <rect x="13.8" y="5" width="4.2" height="14" rx="1.3" />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.6c0-.9 1-1.45 1.76-.97l9.1 5.9a1.15 1.15 0 0 1 0 1.94l-9.1 5.9C9 18.85 8 18.3 8 17.4V5.6Z" />
            </svg>
          )}
        </button>
        <button type="button" className="np-btn" onClick={playNext} aria-label="Следующий трек">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.1 6.1c-.76-.55-1.82-.01-1.82.93v9.94c0 .94 1.06 1.48 1.82.93l6.85-4.97a1.15 1.15 0 0 0 0-1.86L15.1 6.1ZM3.6 6.1c-.76-.55-1.82-.01-1.82.93v9.94c0 .94 1.06 1.48 1.82.93l6.85-4.97a1.15 1.15 0 0 0 0-1.86L3.6 6.1Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function NowPlayingScene({ track, onClose }: { track: PlayableTrack; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [idle, setIdle] = useState(false)

  // The close button hides after 2.5s without pointer movement and returns on any movement.
  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 2500)
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), 2500)
    }
    window.addEventListener('pointermove', wake)
    window.addEventListener('pointerdown', wake)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointermove', wake)
      window.removeEventListener('pointerdown', wake)
    }
  }, [])

  // Freeze background scroll safely: no html/body overflow mutation (which destroys document.documentElement.scrollHeight and causes scroll jumping/track rewind).
  useEffect(() => {
    setSmoothScrollLocked(true)
    const savedY = window.scrollY

    const onWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null
      const inLyrics = target?.closest('.np-lyrics-list') as HTMLElement | null
      if (!inLyrics) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      const { scrollTop, scrollHeight, clientHeight } = inLyrics
      const atTop = scrollTop <= 0 && event.deltaY < 0
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && event.deltaY > 0
      if (atTop || atBottom) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    let touchStartY = 0
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null
      const inLyrics = target?.closest('.np-lyrics-list') as HTMLElement | null
      if (!inLyrics) {
        if (event.cancelable) event.preventDefault()
        event.stopPropagation()
        return
      }
      const touchY = event.touches[0]?.clientY ?? 0
      const deltaY = touchStartY - touchY
      const { scrollTop, scrollHeight, clientHeight } = inLyrics
      const atTop = scrollTop <= 0 && deltaY < 0
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && deltaY > 0
      if (atTop || atBottom) {
        if (event.cancelable) event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })

    return () => {
      setSmoothScrollLocked(false)
      window.removeEventListener('wheel', onWheel, true)
      window.removeEventListener('touchstart', onTouchStart, true)
      window.removeEventListener('touchmove', onTouchMove, true)
      if (Math.abs(window.scrollY - savedY) > 0.5) {
        scrollToPosition(savedY, true)
      }
    }
  }, [])

  const controlsRef = useRef<HTMLDivElement>(null)
  const [tint, setTint] = useState<[number, number, number]>([0.5, 0.55, 0.7])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  return (
    <div ref={overlayRef} className="np-overlay" role="dialog" aria-label="Сцена трека" data-scene-pointer-ignore data-smooth-scroll-prevent>
      <div className="np-canvas">
        <Canvas
          camera={{ position: [0, 1.3, RADIUS + 9], fov: 48, near: 0.1, far: 100 }}
          dpr={[1, 1.75]}
          gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#020408']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[-5, 8, 8]} intensity={1.1} />
          <Suspense fallback={null}>
            <NightSky animate speed={1} />
            <CoverStage cover={track.cover} controlsRef={controlsRef} onTint={setTint} />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="np-tint"
        aria-hidden="true"
        style={{ '--np-rgb': tint.map(v => Math.round(v * 255)).join(' ') } as CSSProperties}
      />

      <LyricsPanel track={track} />
      <SceneControls controlsRef={controlsRef} />

      <button
        type="button"
        className={`np-close${idle ? ' is-idle' : ''}`}
        onPointerDown={e => {
          e.stopPropagation()
        }}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
        aria-label="Закрыть сцену трека"
      >
        Закрыть
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m4 4 16 16M20 4 4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
        </svg>
      </button>
    </div>
  )
}
