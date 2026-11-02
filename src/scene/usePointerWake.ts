import { useLayoutEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector4 } from 'three'

export const POINTER_WAKE_COUNT = 4

const IGNORE_SELECTOR = 'a,button,input,textarea,select,[role="button"],[data-scene-pointer-ignore]'
const WAKE_LIFETIME = 1.35
const SPRING_FREQUENCY = 18
const SPRING_DAMPING = .62
const MAX_HEAD_DISTANCE = 40
const MAX_HEAD_SPEED = 900

/** Stable screen-space points: x/y are bottom-origin UVs, z is energy, w is age. */
export function usePointerWake(enabled: boolean): { points: Vector4[]; reset: () => void } {
 const { gl, size } = useThree()
 const wake = useMemo(() => {
  const points = Array.from({ length: POINTER_WAKE_COUNT }, () => new Vector4(.5, .5, 0, 1))
  const strengths = new Float32Array(POINTER_WAKE_COUNT)
  const state = {
   x: .5, y: .5, clientX: 0, clientY: 0,
   velocityX: 0, velocityY: 0,
   energy: 0, age: WAKE_LIFETIME, lastEvent: 0, sampled: false,
   boundsDirty: true, left: 0, top: 0, width: 0, height: 0,
  }
  const reset = () => {
   state.energy = 0
   state.age = WAKE_LIFETIME
   state.lastEvent = 0
   state.sampled = false
   state.velocityX = 0
   state.velocityY = 0
   strengths.fill(0)
   for (let i = 0; i < points.length; i++) points[i].set(state.x, state.y, 0, 1)
  }
  return { points, strengths, state, reset }
 }, [])

 useLayoutEffect(() => {
  const { state, points, reset } = wake
  state.boundsDirty = true
  reset()
  if (!enabled) return

  // Window events also reach the detail hero, where the canvas ignores pointer hits.
  const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
  const move = (event: PointerEvent) => {
   if (!finePointer.matches || document.hidden || event.isPrimary === false || event.pointerType !== 'mouse') {
    reset()
    return
   }
   if (event.target instanceof Element && event.target.closest(IGNORE_SELECTOR)) {
    reset()
    return
   }
   if (state.boundsDirty) {
    const bounds = gl.domElement.getBoundingClientRect()
    state.left = bounds.left; state.top = bounds.top
    state.width = bounds.width; state.height = bounds.height
    state.boundsDirty = false
   }
   const x = (event.clientX - state.left) / state.width
   const y = 1 - (event.clientY - state.top) / state.height
   if (!Number.isFinite(x) || !Number.isFinite(y) || state.width <= 0 || state.height <= 0 || x < 0 || x > 1 || y < 0 || y > 1) {
    reset()
    return
   }
   const now = performance.now() * .001
   const elapsed = now - state.lastEvent
   const distance = Math.hypot(event.clientX - state.clientX, event.clientY - state.clientY)
   state.x = x; state.y = y
   state.clientX = event.clientX; state.clientY = event.clientY
   state.lastEvent = now
   // A short pause preserves momentum; entry, a long gap or a jump starts cleanly.
   if (!state.sampled || elapsed > .85 || elapsed <= 0 || distance > Math.max(160, Math.min(state.width, state.height) * .35)) {
    reset()
    state.sampled = true
    state.lastEvent = now
    for (let i = 0; i < points.length; i++) points[i].set(x, y, 0, 1)
    return
   }
   if (distance > .025) {
    const speed = distance / Math.max(elapsed, 1 / 240)
    // Keep deliberate, slow motion visible; frame smoothing absorbs event-rate jitter.
    state.energy = .25 + .65 * Math.sqrt(Math.min(1, speed / 320))
    state.age = 0
   }
  }
  const invalidateBounds = () => { state.boundsDirty = true; reset() }
  const leave = (event: PointerEvent) => { if (event.relatedTarget === null) reset() }
  const visibility = () => { if (document.hidden) reset() }
  const capability = () => { if (!finePointer.matches) reset() }
  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerout', leave, { passive: true })
  window.addEventListener('blur', reset)
  window.addEventListener('resize', invalidateBounds, { passive: true })
  window.addEventListener('scroll', invalidateBounds, { passive: true, capture: true })
  document.addEventListener('visibilitychange', visibility)
  finePointer.addEventListener('change', capability)
  return () => {
   window.removeEventListener('pointermove', move)
   window.removeEventListener('pointerout', leave)
   window.removeEventListener('blur', reset)
   window.removeEventListener('resize', invalidateBounds)
   window.removeEventListener('scroll', invalidateBounds, true)
   document.removeEventListener('visibilitychange', visibility)
   finePointer.removeEventListener('change', capability)
   reset()
  }
 }, [enabled, gl, size.width, size.height, wake])

 // Runs before the scene and its composite render; no React state or frame allocations.
 useFrame((_, delta) => {
  const { state, points, strengths, reset } = wake
  if (!enabled || !Number.isFinite(delta) || delta > .25) { reset(); return }
  if (!state.sampled) return
  const dt = Math.max(0, delta)
  state.age = Math.min(WAKE_LIFETIME, state.age + dt)
  const age = state.age / WAKE_LIFETIME
  const fade = 1 - age * age * (3 - 2 * age)
  // An analytic damped spring carries directional momentum after the mouse stops.
  // Its displacement and velocity use CSS pixels, independent of aspect ratio/DPR.
  const head = points[0]
  const dx = (head.x - state.x) * state.width
  const dy = (head.y - state.y) * state.height
  const damping = SPRING_FREQUENCY * SPRING_DAMPING
  const frequency = SPRING_FREQUENCY * Math.sqrt(1 - SPRING_DAMPING * SPRING_DAMPING)
  const decay = Math.exp(-damping * dt)
  const cosine = Math.cos(frequency * dt)
  const sine = Math.sin(frequency * dt)
  let offsetX = decay * (dx * cosine + (state.velocityX + damping * dx) / frequency * sine)
  let offsetY = decay * (dy * cosine + (state.velocityY + damping * dy) / frequency * sine)
  state.velocityX = decay * (state.velocityX * cosine - (damping * state.velocityX + SPRING_FREQUENCY * SPRING_FREQUENCY * dx) / frequency * sine)
  state.velocityY = decay * (state.velocityY * cosine - (damping * state.velocityY + SPRING_FREQUENCY * SPRING_FREQUENCY * dy) / frequency * sine)
  const distance = Math.hypot(offsetX, offsetY)
  if (distance > MAX_HEAD_DISTANCE) {
   offsetX *= MAX_HEAD_DISTANCE / distance
   offsetY *= MAX_HEAD_DISTANCE / distance
  }
  const speed = Math.hypot(state.velocityX, state.velocityY)
  if (speed > MAX_HEAD_SPEED) {
   state.velocityX *= MAX_HEAD_SPEED / speed
   state.velocityY *= MAX_HEAD_SPEED / speed
  }
  const x = state.x + offsetX / state.width
  const y = state.y + offsetY / state.height
  head.x = Math.max(0, Math.min(1, x))
  head.y = Math.max(0, Math.min(1, y))
  if (head.x !== x) state.velocityX = 0
  if (head.y !== y) state.velocityY = 0
  for (let i = 0; i < points.length; i++) {
   const point = points[i]
   if (i > 0) {
    const previous = points[i - 1]
    const follow = 1 - Math.exp(-dt * 10)
    point.x += (previous.x - point.x) * follow
    point.y += (previous.y - point.y) * follow
   }
   const energy = i === 0 ? state.energy : strengths[i - 1] * .86
   strengths[i] += (energy - strengths[i]) * (1 - Math.exp(-dt * (energy > strengths[i] ? 18 : 7)))
   // Fade outside the strength filter so the tail reaches zero with a flat slope.
   point.z = strengths[i] * fade
   point.w = Math.min(1, (state.age + i * .055) / WAKE_LIFETIME)
  }
 }, -2)

 return wake
}
