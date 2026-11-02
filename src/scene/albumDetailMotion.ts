const TRANSITION_HEIGHTS = 1.25

/** One scroll range keeps camera retreat, scene fade and render pause in sync. */
export function albumDetailMotion(scrollY: number, stageHeight: number) {
 const height = Number.isFinite(stageHeight) && stageHeight > 0 ? stageHeight : 1
 const y = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0
 const progress = Math.min(1, y / (height * TRANSITION_HEIGHTS))
 const fade = Math.max(0, (progress - .06) / .94)
 const opacity = 1 - fade * fade * (3 - 2 * fade)
 return { progress, opacity, visible: progress < 1 }
}
