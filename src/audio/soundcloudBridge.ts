// Background bridge for playing SoundCloud tracks inside our custom capsule player
declare global {
  interface Window {
    SC?: {
      Widget: {
        (iframe: HTMLIFrameElement): SCWidget
        Events: {
          READY: string
          PLAY: string
          PAUSE: string
          FINISH: string
          PLAY_PROGRESS: string
          ERROR: string
        }
      }
    }
  }
}

export type SCWidget = {
  load: (url: string, options?: any) => void
  play: () => void
  pause: () => void
  toggle: () => void
  seekTo: (milliseconds: number) => void
  setVolume: (volume: number) => void
  getDuration: (callback: (durationMs: number) => void) => void
  getPosition: (callback: (positionMs: number) => void) => void
  bind: (eventName: string, listener: (...args: any[]) => void) => void
  unbind: (eventName: string) => void
}

export type SCPlayerCallbacks = {
  onPlay?: () => void
  onPause?: () => void
  onProgress?: (currentTime: number, duration: number) => void
  onFinish?: () => void
  onError?: (err: any) => void
}

let widgetInstance: SCWidget | null = null
let scriptPromise: Promise<void> | null = null
let currentCallbacks: SCPlayerCallbacks | null = null
let cachedDurationSec = 0

export function ensureSoundcloudWidgetScript(): Promise<void> {
  if (window.SC?.Widget) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="w.soundcloud.com/player/api.js"]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('SoundCloud script error')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load SoundCloud Widget API'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function getOrCreateSoundcloudWidget(): Promise<SCWidget> {
  await ensureSoundcloudWidgetScript()

  if (widgetInstance) return widgetInstance

  let iframe = document.getElementById('sc-hidden-widget-frame') as HTMLIFrameElement | null
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'sc-hidden-widget-frame'
    iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/386265671'
    iframe.style.position = 'fixed'
    iframe.style.bottom = '-9999px'
    iframe.style.left = '-9999px'
    iframe.style.width = '100px'
    iframe.style.height = '100px'
    iframe.style.opacity = '0'
    iframe.style.pointerEvents = 'none'
    iframe.allow = 'autoplay'
    document.body.appendChild(iframe)
  }

  const widget = window.SC!.Widget(iframe)

  const events = window.SC!.Widget.Events
  widget.bind(events.PLAY, () => {
    currentCallbacks?.onPlay?.()
  })

  widget.bind(events.PAUSE, () => {
    currentCallbacks?.onPause?.()
  })

  widget.bind(events.FINISH, () => {
    currentCallbacks?.onFinish?.()
  })

  widget.bind(events.ERROR, (err: any) => {
    currentCallbacks?.onError?.(err)
  })

  widget.bind(events.PLAY_PROGRESS, (data: { currentPosition: number; relativePosition: number }) => {
    const curSec = (data.currentPosition || 0) / 1000
    if (cachedDurationSec <= 0) {
      widget.getDuration((ms: number) => {
        if (ms > 0) cachedDurationSec = ms / 1000
        currentCallbacks?.onProgress?.(curSec, cachedDurationSec)
      })
    } else {
      currentCallbacks?.onProgress?.(curSec, cachedDurationSec)
    }
  })

  widgetInstance = widget
  return widget
}

export async function loadAndPlaySoundCloudTrack(
  url: string,
  volume = 0.8,
  callbacks?: SCPlayerCallbacks,
): Promise<void> {
  const widget = await getOrCreateSoundcloudWidget()
  currentCallbacks = callbacks ?? null
  cachedDurationSec = 0

  return new Promise((resolve) => {
    widget.load(url, {
      auto_play: true,
      show_artwork: false,
      callback: () => {
        widget.setVolume(Math.round(volume * 100))
        widget.play()
        widget.getDuration((ms: number) => {
          if (ms > 0) cachedDurationSec = ms / 1000
        })
        resolve()
      },
    })
  })
}

export function pauseSoundCloudTrack() {
  widgetInstance?.pause()
}

export function resumeSoundCloudTrack() {
  widgetInstance?.play()
}

export function seekSoundCloudTrack(seconds: number) {
  widgetInstance?.seekTo(Math.max(0, seconds * 1000))
}

export function setSoundCloudTrackVolume(vol: number) {
  const clamped = Math.max(0, Math.min(1, vol))
  widgetInstance?.setVolume(Math.round(clamped * 100))
}

export function stopSoundCloudTrack() {
  currentCallbacks = null
  widgetInstance?.pause()
}
