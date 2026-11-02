import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRenderQuality } from './RenderQuality'

const percentile = (values: number[], fraction: number) => {
 const sorted = [...values].sort((a, b) => a - b)
 return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))] ?? 0
}

/** Opt-in development measurements: ?perf=1. No production UI or frame work. */
export function FrameProfiler() {
 const { gl, size, viewport } = useThree()
 const quality = useRenderQuality()
 const output = useRef<HTMLOutputElement | null>(null)
 const state = useRef({ started: 0, warmup: performance.now() + 2500, reportAt: 0, frames: [] as number[], cpu: [] as number[], gpu: [] as number[], calls: 0, triangles: 0 })
 const timing = useMemo(() => {
  const context = gl.getContext() as WebGL2RenderingContext
  const extension = context.getExtension('EXT_disjoint_timer_query_webgl2')
  return { context, extension, free: [] as WebGLQuery[], pending: [] as WebGLQuery[], current: null as WebGLQuery | null }
 }, [gl])

 useEffect(() => {
  const element = document.createElement('output')
  element.id = 'scene-performance'
  element.hidden = true
  element.setAttribute('aria-hidden', 'true')
  document.body.append(element)
  output.current = element
  const autoReset = gl.info.autoReset
  gl.info.autoReset = false
  return () => {
   output.current = null
   element.remove()
   gl.info.autoReset = autoReset
   for (const query of [...timing.free, ...timing.pending]) timing.context.deleteQuery(query)
  }
 }, [gl, timing])

 useEffect(() => {
  const reset = () => {
   state.current = { started: 0, warmup: performance.now() + 2500, reportAt: 0, frames: [], cpu: [], gpu: [], calls: 0, triangles: 0 }
   if (output.current) output.current.textContent = ''
  }
  reset()
  document.addEventListener('visibilitychange', reset)
  return () => document.removeEventListener('visibilitychange', reset)
 }, [quality, size.width, size.height, viewport.dpr])

 useFrame(() => {
  const s = state.current
  s.started = performance.now()
  gl.info.reset()
  const { context, extension, pending, free } = timing
  if (!extension) return
  while (pending.length && context.getQueryParameter(pending[0], context.QUERY_RESULT_AVAILABLE)) {
   const query = pending.shift()!
   if (!context.getParameter(extension.GPU_DISJOINT_EXT) && s.started >= s.warmup) {
    s.gpu.push(context.getQueryParameter(query, context.QUERY_RESULT) / 1e6)
    if (s.gpu.length > 180) s.gpu.shift()
   }
   free.push(query)
  }
  if (pending.length >= 4) return
  const query = free.pop() ?? context.createQuery()
  if (query) {
   context.beginQuery(extension.TIME_ELAPSED_EXT, query)
   timing.current = query
  }
 }, -2)

 useFrame((_, dt) => {
  const s = state.current
  const now = performance.now()
  if (timing.current) {
   timing.context.endQuery(timing.extension!.TIME_ELAPSED_EXT)
   timing.pending.push(timing.current)
   timing.current = null
  }
  if (now < s.warmup || document.visibilityState !== 'visible') return
  s.frames.push(dt * 1000)
  s.cpu.push(now - s.started)
  if (s.frames.length > 180) { s.frames.shift(); s.cpu.shift() }
  s.calls = gl.info.render.calls
  s.triangles = gl.info.render.triangles
  if (now < s.reportAt || !output.current) return
  s.reportAt = now + 1000
  const mean = s.frames.reduce((a, b) => a + b, 0) / s.frames.length
  output.current.textContent = JSON.stringify({
   frames: s.frames.length, fps: +(1000 / mean).toFixed(1), medianMs: +percentile(s.frames, .5).toFixed(2),
   p95Ms: +percentile(s.frames, .95).toFixed(2), cpuMs: +percentile(s.cpu, .5).toFixed(2),
   gpuMs: s.gpu.length ? +percentile(s.gpu, .5).toFixed(2) : null,
   dpr: gl.getPixelRatio(), calls: s.calls, triangles: s.triangles,
   quality: quality.name, fogSteps: quality.fogSteps, fogScale: quality.fogScale,
   drawingBuffer: [gl.domElement.width, gl.domElement.height],
  })
 }, 2)
 return null
}
