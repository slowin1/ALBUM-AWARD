type ScrollOptions = { immediate?: boolean }

export type SmoothScrollController = {
 destroy(): void
 stop(): void
 sync(): void
 scrollTo(top: number, options?: ScrollOptions): void
 setEnabled(enabled: boolean): void
 setLocked(locked: boolean): void
}

let activeController: SmoothScrollController | undefined
const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'])

const maximumScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
const bounded = (top: number) => Math.min(maximumScroll(), Math.max(0, Number.isFinite(top) ? top : 0))
const nativeJump = (top: number) => window.scrollTo({ top: bounded(top), left: window.scrollX, behavior: 'instant' })

/** Keep nested scrolling, editable controls and explicit opt-outs under native control. */
function usesNativeScroll(event: WheelEvent, delta: number) {
 for (const node of event.composedPath()) {
  if (!(node instanceof Element)) continue
  if (node.matches('[data-smooth-scroll-prevent], textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="spinbutton"], [role="listbox"], input[type="range"], input[type="number"]')) return true
  if (node === document.body || node === document.documentElement) break
  const style = getComputedStyle(node)
  if (!/^(auto|scroll|overlay)$/.test(style.overflowY)) continue
  const max = node.scrollHeight - node.clientHeight
  if (max > 1 && (delta < 0 ? node.scrollTop > 0 : node.scrollTop < max - 1)) return true
  if (style.overscrollBehaviorY === 'contain' || style.overscrollBehaviorY === 'none') return true
 }
 return false
}

/** Native document positions with an exact, critically damped spring; no transformed page. */
export function installSmoothScroll(): SmoothScrollController {
 activeController?.destroy()
 let enabled = true
 let locked = false
 let destroyed = false
 let frame = 0
 let previousTime = 0
 let position = window.scrollY
 let target = position
 let expectedPosition = position
 let velocity = 0

 const sync = () => {
  cancelAnimationFrame(frame)
  frame = 0
  previousTime = 0
  position = target = expectedPosition = window.scrollY
  velocity = 0
 }

 const write = (top: number) => {
  nativeJump(top)
  // Browsers may round or clamp document offsets. Compare against the actual write.
  expectedPosition = window.scrollY
 }

 const tick = (time: number) => {
  frame = 0
  if (!enabled || locked || document.hidden || destroyed || Math.abs(window.scrollY - expectedPosition) > 1.25) {
   sync()
   return
  }
  const dt = Math.min(0.064, Math.max(0, (time - previousTime) / 1000))
  previousTime = time
  target = bounded(target)
  // Analytic integration gives the same travel and damping at 30, 60 or 120 Hz.
  const frequency = 9
  const distance = target - position
  if (velocity * distance < 0) velocity = 0
  velocity = Math.sign(velocity) * Math.min(Math.abs(velocity), frequency * Math.abs(distance))
  const offset = position - target
  const spring = velocity + frequency * offset
  const decay = Math.exp(-frequency * dt)
  position = target + (offset + spring * dt) * decay
  velocity = (velocity - frequency * spring * dt) * decay
  if (Math.abs(target - position) < 0.35 && Math.abs(velocity) < 3) {
   write(target)
   position = target = expectedPosition
   velocity = 0
   previousTime = 0
   return
  }
  position = bounded(position)
  write(position)
  frame = requestAnimationFrame(tick)
 }

 const start = () => {
  if (frame) return
  previousTime = performance.now()
  frame = requestAnimationFrame(tick)
 }

 const onWheel = (event: WheelEvent) => {
  if (!enabled || locked || destroyed) return
  if (event.ctrlKey || event.metaKey || event.defaultPrevented || !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
   sync()
   return
  }
  const scale = event.deltaMode === 1 ? (parseFloat(getComputedStyle(document.documentElement).lineHeight) || 16) : event.deltaMode === 2 ? window.innerHeight : 1
  const delta = event.deltaY * scale
  if (!Number.isFinite(delta) || delta === 0) return
  if (usesNativeScroll(event, delta)) {
   sync()
   return
  }
  if (Math.abs(window.scrollY - expectedPosition) > 1.25) sync()
  event.preventDefault()
  target = bounded(target + delta)
  start()
 }

 const onScroll = () => {
  if (!frame || Math.abs(window.scrollY - expectedPosition) > 1.25) sync()
 }
 const onKeyDown = (event: KeyboardEvent) => { if (navigationKeys.has(event.key)) sync() }
 const onVisibility = () => sync()

 const controller: SmoothScrollController = {
  stop: sync,
  sync,
  scrollTo(top, options = {}) {
   if (destroyed) return
   if (options.immediate || document.hidden) {
    sync()
    write(top)
    position = target = expectedPosition
   } else if (!enabled) {
    sync()
    window.scrollTo({ top: bounded(top), left: window.scrollX, behavior: 'smooth' })
   } else if (!locked) {
    if (Math.abs(window.scrollY - expectedPosition) > 1.25) sync()
    target = bounded(top)
    start()
   }
  },
  setEnabled(value) { if (enabled !== value) { enabled = value; sync() } },
  setLocked(value) { if (locked !== value) { locked = value; sync() } },
  destroy() {
   if (destroyed) return
   sync()
   destroyed = true
   window.removeEventListener('wheel', onWheel)
   window.removeEventListener('scroll', onScroll)
   window.removeEventListener('touchstart', sync)
   window.removeEventListener('pointerdown', sync)
   window.removeEventListener('keydown', onKeyDown, true)
   window.removeEventListener('resize', sync)
   window.removeEventListener('pagehide', sync)
   document.removeEventListener('visibilitychange', onVisibility)
   if (activeController === controller) activeController = undefined
  },
 }

 window.addEventListener('wheel', onWheel, { passive: false })
 window.addEventListener('scroll', onScroll, { passive: true })
 window.addEventListener('touchstart', sync, { passive: true })
 window.addEventListener('pointerdown', sync, { passive: true })
 window.addEventListener('keydown', onKeyDown, true)
 window.addEventListener('resize', sync, { passive: true })
 window.addEventListener('pagehide', sync)
 document.addEventListener('visibilitychange', onVisibility)
 activeController = controller
 return controller
}

export const stopSmoothScroll = () => activeController?.stop()
export const syncSmoothScroll = () => activeController?.sync()

export function scrollToPosition(top: number, immediate = false) {
 if (activeController) activeController.scrollTo(top, { immediate })
 else window.scrollTo({ top: bounded(top), behavior: immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}

export function scrollToElement(element: Element, immediate = false) {
 const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0
 const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
 scrollToPosition(window.scrollY + element.getBoundingClientRect().top - margin - padding, immediate)
}
