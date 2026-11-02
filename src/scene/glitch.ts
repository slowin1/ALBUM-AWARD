const WINDOW_SECONDS = 5.5

export type GlitchSample = Readonly<{
 strength: number
 seed: number
 phase: number
 jitter: number
}>

const QUIET: GlitchSample = Object.freeze({ strength: 0, seed: 0, phase: 0, jitter: 0 })

// Integer mixing keeps the schedule deterministic without textures or random state.
function hash(value: number) {
 let bits = Math.imul(value | 0, 0x45d9f3b)
 bits = Math.imul(bits ^ (bits >>> 16), 0x45d9f3b)
 return ((bits ^ (bits >>> 16)) >>> 0) / 0x100000000
}

function smoothstep(value: number) {
 const t = Math.max(0, Math.min(1, value))
 return t * t * (3 - 2 * t)
}

/** Irregular short tears, sometimes followed by weaker echoes, with long quiet gaps. */
export function sampleGlitch(time: number): GlitchSample {
 if (!Number.isFinite(time) || time < 0) return QUIET

 const window = Math.floor(time / WINDOW_SECONDS)
 const salt = window * 41
 // Skipping some windows and moving each cluster avoids a mechanical beat.
 if (hash(salt + 1) < .14) return QUIET
 const localTime = time % WINDOW_SECONDS
 let start = 1.15 + hash(salt + 2) * 2.55
 if (localTime <= start) return QUIET

 const cluster = hash(salt + 3)
 const taps = cluster < .5 ? 1 : cluster < .9 ? 2 : 3
 for (let tap = 0; tap < taps; tap++) {
  const duration = tap === 0 ? .18 + hash(salt + 4) * .035 : .15 + hash(salt + 4 + tap) * .01
  if (localTime <= start) return QUIET
  if (localTime < start + duration) {
   const phase = (localTime - start) / duration
   const tick = Math.floor(phase * 4)
   const step = hash(salt + 21 + tap * 5 + tick)
   const amplitude = tap === 0 ? .9 + hash(salt + 11) * .1 : .72 - tap * .17 + hash(salt + 11 + tap) * .17
   const envelope = smoothstep(phase / .09) * smoothstep((1 - phase) / .23)
   return {
    strength: envelope * amplitude * (.78 + step * .22),
    seed: hash(salt + 10 + tap),
    phase,
    jitter: step * 2 - 1,
   }
  }
  start += duration + .055 + hash(salt + 7 + tap) * .02
 }
 return QUIET
}
