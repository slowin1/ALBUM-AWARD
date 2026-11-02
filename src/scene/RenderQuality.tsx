import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export const renderProfiles = [
 { name: 'Экономное', dpr: .85, fogScale: .33, fogSteps: 12 },
 { name: 'Среднее', dpr: 1, fogScale: .4, fogSteps: 18 },
 { name: 'Высокое', dpr: 1.25, fogScale: .5, fogSteps: 24 },
] as const
const QualityContext = createContext<(typeof renderProfiles)[number]>(renderProfiles[1])
export const useRenderQuality = () => useContext(QualityContext)

/** Slow hysteresis avoids oscillating resolution while scrolling or compiling. */
export function RenderQuality({ onDprChange, enabled = true, children }: { onDprChange: (dpr: number) => void; enabled?: boolean; children: ReactNode }) {
 const [automaticTier, setAutomaticTier] = useState(1)
 const automaticCeiling = useRef(renderProfiles.length - 1)
 const setFrameloop = useThree(state => state.setFrameloop)
 const sample = useRef({ warmup: 3, duration: 0, frames: 0, stable: 0, slowSpikes: 0 })
 const tier = automaticTier
 const profile = renderProfiles[tier]

 useEffect(() => {
  const resetCeiling = () => { automaticCeiling.current = renderProfiles.length - 1 }
  resetCeiling()
  window.addEventListener('resize', resetCeiling)
  return () => window.removeEventListener('resize', resetCeiling)
 }, [])

 useEffect(() => {
  const resize = () => onDprChange(Math.min(window.devicePixelRatio || 1, profile.dpr))
  resize()
  window.addEventListener('resize', resize)
  sample.current = { warmup: 3, duration: 0, frames: 0, stable: 0, slowSpikes: 0 }
  return () => window.removeEventListener('resize', resize)
 }, [onDprChange, profile])

 useLayoutEffect(() => {
  const visibility = () => {
   setFrameloop(document.hidden || !enabled ? 'never' : 'always')
   sample.current = { warmup: 3, duration: 0, frames: 0, stable: 0, slowSpikes: 0 }
  }
  visibility()
  document.addEventListener('visibilitychange', visibility)
  return () => { document.removeEventListener('visibilitychange', visibility); setFrameloop('always') }
 }, [setFrameloop, enabled])

 useFrame((_, dt) => {
  if (document.hidden || !enabled) return
  const s = sample.current
  if (dt <= 0) return
  // Ignore one pause, but still recover if a very slow GPU stays below 4 FPS.
  if (dt > .25) {
   s.duration = 0; s.frames = 0; s.stable = 0; s.slowSpikes++
   if (s.slowSpikes >= 3 && tier > 0) {
    automaticCeiling.current = tier - 1
    setAutomaticTier(tier - 1)
   }
   return
  }
  s.slowSpikes = 0
  if (s.warmup > 0) { s.warmup -= dt; return }
  s.duration += dt; s.frames++
  if (s.duration < 1.5) return
  const frameMs = s.duration * 1000 / s.frames
  if (frameMs > 24 && tier > 0) {
   // Once a tier exceeds the budget, do not keep retrying it at the same size.
   automaticCeiling.current = tier - 1
   setAutomaticTier(tier - 1)
   s.stable = 0
  } else {
   s.stable = frameMs < 18.5 ? s.stable + s.duration : 0
   if (s.stable >= 10 && tier < automaticCeiling.current) {
    setAutomaticTier(tier + 1)
    s.stable = 0
   }
  }
  s.duration = 0; s.frames = 0
 }, -3)

 return <QualityContext.Provider value={profile}>{children}</QualityContext.Provider>
}
