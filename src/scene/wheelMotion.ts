import { MathUtils } from 'three'
import { ALBUM_COUNT, INTRO_ALBUM_INDEX, WHEEL_SCROLL_START } from './config'

const STEP = Math.PI * 2 / ALBUM_COUNT

export type WheelMotionState = {
 initialized: boolean
 previousProgress: number
 idle: number
 angle: number
 introComplete: boolean
}

export function createWheelMotion(): WheelMotionState {
 return { initialized: false, previousProgress: 0, idle: Infinity, angle: 0, introComplete: false }
}

export function advanceWheelMotion(motion: WheelMotionState, progress: number, cameraProgress: number, selectedIndex: number | null, animate: boolean, dt: number) {
 const albumPosition = MathUtils.clamp((progress - WHEEL_SCROLL_START) / (1 - WHEEL_SCROLL_START), 0, 1) * (ALBUM_COUNT - 1)
 const introAngle = animate ? INTRO_ALBUM_INDEX * STEP * (1 - MathUtils.smoothstep(progress, 0, WHEEL_SCROLL_START)) : 0
 if (!motion.initialized) {
  // A restored gallery or a direct album URL starts at its actual cover, without replaying the intro.
  motion.initialized = true
  motion.previousProgress = progress
  motion.introComplete = selectedIndex !== null || !animate || progress >= WHEEL_SCROLL_START
  motion.angle = selectedIndex !== null ? selectedIndex * STEP : progress < WHEEL_SCROLL_START ? introAngle : Math.round(albumPosition) * STEP
 }
 if (Math.abs(progress - motion.previousProgress) > 1.e-6) {
  motion.previousProgress = progress
  motion.idle = 0
 } else motion.idle += dt
 if (selectedIndex !== null || !animate) motion.introComplete = true
 else if (progress < WHEEL_SCROLL_START) motion.introComplete = false

 // Finish at the first cover before following any gallery scroll that ran ahead of the descent.
 const galleryAngle = (motion.idle >= .18 ? Math.round(albumPosition) : albumPosition) * STEP
 const angleTarget = selectedIndex !== null ? selectedIndex * STEP : motion.introComplete ? galleryAngle : introAngle
 motion.angle = !animate && (selectedIndex !== null || progress <= WHEEL_SCROLL_START)
  ? angleTarget
  : MathUtils.damp(motion.angle, angleTarget, 12, dt)
 if (Math.abs(motion.angle - angleTarget) < 1.e-5) motion.angle = angleTarget
 if (!motion.introComplete && progress >= WHEEL_SCROLL_START && cameraProgress > .98 && Math.abs(motion.angle) < .001) {
  motion.angle = 0
  motion.introComplete = true
 }
 return MathUtils.clamp(Math.round(motion.angle / STEP), 0, ALBUM_COUNT - 1)
}
