function smoothstep(low: number, high: number, value: number) {
 const t = Math.min(1, Math.max(0, (value - low) / (high - low)))
 return t * t * (3 - 2 * t)
}

/** Reveal only the cover facing the camera, late in the descent into the gallery. */
export function albumTitleOpacity(angle: number, index: number, count: number, cameraProgress: number, enabled: boolean) {
 if (!enabled || !Number.isInteger(count) || count < 1 || !Number.isInteger(index) || index < 0 || index >= count || !Number.isFinite(angle) || !Number.isFinite(cameraProgress)) return 0
 const step = Math.PI * 2 / count
 const delta = angle - index * step
 const distance = Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta)))
 const facing = 1 - smoothstep(step * .12, step * .82, distance)
 return facing * smoothstep(.82, .995, cameraProgress)
}
