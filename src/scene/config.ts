export const ALBUM_COUNT = 12
export const RADIUS = 7.5
export const ALBUM_SIZE = 3.5
export const INTRO_ALBUM_INDEX = 4
export type SceneSettings = {
 height: number; frequency: number; rippleScale: number; bumpStrength: number
 lightPower: number; ambient: number; brightness: number
 haze: number; hazeSpeed: number; hazeScale: number
 distortion: number; glitch: number; grain: number; cursorDistortion: number; animate: boolean
}
export const SCENE_DEFAULTS = {
 height: 1.4, frequency: .45, rippleScale: 22, bumpStrength: .09,
 lightPower: 2.8, ambient: .5, brightness: 1.1,
 haze: .28, hazeSpeed: 1, hazeScale: 120,
 distortion: 7.5, glitch: 1, grain: .10, cursorDistortion: 12,
} as const satisfies Omit<SceneSettings, 'animate'>
// Scroll travel in viewport heights. Extend only the gallery to slow the wheel.
export const CAMERA_SCROLL_PAGES = 2.28
export const WHEEL_SCROLL_PAGES = 3.8
export const TOTAL_SCROLL_PAGES = CAMERA_SCROLL_PAGES + WHEEL_SCROLL_PAGES
export const WHEEL_SCROLL_START = CAMERA_SCROLL_PAGES / TOTAL_SCROLL_PAGES
export const LOGO_SCROLL_END = .304 / TOTAL_SCROLL_PAGES
export const palette = ['#bb87fa','#6fa4cf','#d09a66','#abb5bd','#78a790','#c38191', '#8b8ed2','#bb955d','#85b8b1','#ba8dc9','#778eac','#b7a080']
