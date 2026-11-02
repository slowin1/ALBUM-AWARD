import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import vertexShader from '../shaders/fullscreen.vert.glsl?raw'
import fluidShader from '../shaders/card-fluid.frag.glsl?raw'
import displayShader from '../shaders/card-fluid-display.frag.glsl?raw'

type FluidBackgroundProps = { animated?: boolean }
type TargetPair = [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget]
type FluidGpu = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  geometry: THREE.PlaneGeometry
  simulation: THREE.ShaderMaterial
  display: THREE.ShaderMaterial
  quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  read: THREE.WebGLRenderTarget
  write: THREE.WebGLRenderTarget
  simulationWidth: number
  simulationHeight: number
  displayWidth: number
  displayHeight: number
}

const FRAME_INTERVAL = 1000 / 30
const neutralFluid = new THREE.Color(.5, .5, 0)
const clampUnit = (value: number) => Math.max(0, Math.min(1, value))

function allocateTargets(renderer: THREE.WebGLRenderer, width: number, height: number): TargetPair {
  const halfFloat = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float')

  function allocate(type: THREE.TextureDataType): TargetPair {
    const targets: THREE.WebGLRenderTarget[] = []
    try {
      for (let index = 0; index < 2; index++) {
        const target = new THREE.WebGLRenderTarget(width, height, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type,
          depthBuffer: false,
          stencilBuffer: false,
        })
        targets.push(target)
        renderer.setRenderTarget(target)
        renderer.setClearColor(neutralFluid, 1)
        renderer.clear()
        const context = renderer.getContext()
        if (context.checkFramebufferStatus(context.FRAMEBUFFER) !== context.FRAMEBUFFER_COMPLETE) {
          throw new Error('Fluid framebuffer is unavailable')
        }
      }
      return targets as TargetPair
    } catch (error) {
      for (const target of targets) target.dispose()
      throw error
    } finally {
      renderer.setRenderTarget(null)
    }
  }

  if (halfFloat) {
    try { return allocate(THREE.HalfFloatType) } catch { /* Fall back to an encoded RGBA8 simulation. */ }
  }
  return allocate(THREE.UnsignedByteType)
}

function createGpu(): FluidGpu {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' })
  let geometry: THREE.PlaneGeometry | undefined
  let simulation: THREE.ShaderMaterial | undefined
  let display: THREE.ShaderMaterial | undefined
  let targets: TargetPair | undefined

  try {
    renderer.setPixelRatio(1)
    renderer.debug.onShaderError = () => { throw new Error('Fluid shader is unavailable') }
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    geometry = new THREE.PlaneGeometry(2, 2)
    simulation = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fluidShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uPrevious: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uAspect: { value: 1 },
        uTime: { value: 0 },
        uDelta: { value: 1 / 30 },
        uPointer: { value: new THREE.Vector4(.5, .5, .5, .5) },
        uPointerActive: { value: 0 },
      },
    })
    display = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: displayShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uFluid: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Vector3(7 / 255, 7 / 255, 8 / 255) },
        uColor2: { value: new THREE.Vector3(23 / 255, 23 / 255, 25 / 255) },
        uColor3: { value: new THREE.Vector3(66 / 255, 66 / 255, 70 / 255) },
        uColor4: { value: new THREE.Vector3(129 / 255, 129 / 255, 138 / 255) },
      },
    })
    const quad = new THREE.Mesh(geometry, simulation)
    scene.add(quad)
    targets = allocateTargets(renderer, 1, 1)
    return {
      renderer, scene, camera, geometry, simulation, display, quad,
      read: targets[0], write: targets[1], simulationWidth: 1, simulationHeight: 1,
      displayWidth: 0, displayHeight: 0,
    }
  } catch (error) {
    targets?.forEach(target => target.dispose())
    geometry?.dispose()
    simulation?.dispose()
    display?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    throw error
  }
}

/** One low-resolution fluid surface for the artist profile card. */
export function FluidBackground({ animated = true }: FluidBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = hostRef.current
    if (!element || !element.parentElement || !animated) return
    const host = element
    const card = element.parentElement

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const initialBounds = host.getBoundingClientRect()
    let inView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight && initialBounds.right > 0 && initialBounds.left < window.innerWidth
    let bounds: DOMRect | null = null
    let gpu: FluidGpu | null = null
    let disposed = false
    let failed = false
    let frame = 0
    let previousTime = 0
    let elapsed = 0
    let width = host.clientWidth
    let height = host.clientHeight
    let pointerWanted = 0
    let pointerActive = 0
    let pointerInside = false
    const pointerTarget = new THREE.Vector2(.5, .5)
    const pointer = new THREE.Vector2(.5, .5)
    const pointerPrevious = new THREE.Vector2(.5, .5)

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      pointerWanted = pointerActive = 0
      pointerInside = false
      pointerPrevious.copy(pointer)
    }
    const hide = () => host.removeAttribute('data-ready')
    const canRun = () => !disposed && !failed && !motion.matches && !document.hidden && inView && width > 0 && height > 0

    const onContextLost = (event: Event) => {
      event.preventDefault()
      // Keep the CSS surface after a GPU reset; do not create replacement contexts in a loop.
      failed = true
      stop()
      hide()
      disposeGpu()
    }
    const onContextRestored = () => {
      failed = true
      hide()
    }

    function disposeGpu() {
      if (!gpu) return
      const current = gpu
      gpu = null
      const canvas = current.renderer.domElement
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      current.read.dispose()
      current.write.dispose()
      current.geometry.dispose()
      current.simulation.dispose()
      current.display.dispose()
      current.scene.remove(current.quad)
      current.renderer.dispose()
      current.renderer.forceContextLoss()
      canvas.remove()
    }

    function resizeGpu(current: FluidGpu) {
      const displayScale = Math.min(1, 960 / width, 640 / height)
      const displayWidth = Math.max(1, Math.round(width * displayScale))
      const displayHeight = Math.max(1, Math.round(height * displayScale))
      const simulationScale = Math.min(1, 256 / Math.max(width, height))
      const simulationWidth = Math.max(1, Math.round(width * simulationScale))
      const simulationHeight = Math.max(1, Math.round(height * simulationScale))

      if (current.displayWidth !== displayWidth || current.displayHeight !== displayHeight) {
        current.renderer.setSize(displayWidth, displayHeight, false)
        current.display.uniforms.uResolution.value.set(displayWidth, displayHeight)
        current.displayWidth = displayWidth
        current.displayHeight = displayHeight
      }
      if (current.simulationWidth !== simulationWidth || current.simulationHeight !== simulationHeight) {
        const targets = allocateTargets(current.renderer, simulationWidth, simulationHeight)
        current.read.dispose()
        current.write.dispose()
        current.read = targets[0]
        current.write = targets[1]
        current.simulationWidth = simulationWidth
        current.simulationHeight = simulationHeight
        current.simulation.uniforms.uResolution.value.set(simulationWidth, simulationHeight)
      }
      current.simulation.uniforms.uAspect.value = width / height
    }

    function fail() {
      failed = true
      stop()
      hide()
      disposeGpu()
    }

    function tick(time: number) {
      frame = 0
      if (!canRun() || !gpu) return
      if (previousTime && time - previousTime < FRAME_INTERVAL - .75) {
        frame = requestAnimationFrame(tick)
        return
      }
      const delta = previousTime ? Math.min(.05, (time - previousTime) / 1000) : 1 / 30
      previousTime = time
      elapsed += delta

      try {
        resizeGpu(gpu)
        const damping = 1 - Math.exp(-8 * delta)
        pointerPrevious.copy(pointer)
        pointer.lerp(pointerTarget, damping)
        pointerActive += (pointerWanted - pointerActive) * damping
        const uniforms = gpu.simulation.uniforms
        uniforms.uPrevious.value = gpu.read.texture
        uniforms.uTime.value = elapsed
        uniforms.uDelta.value = delta
        uniforms.uPointer.value.set(pointer.x, pointer.y, pointerPrevious.x, pointerPrevious.y)
        uniforms.uPointerActive.value = pointerActive
        gpu.quad.material = gpu.simulation
        gpu.renderer.setRenderTarget(gpu.write)
        gpu.renderer.render(gpu.scene, gpu.camera)
        gpu.display.uniforms.uFluid.value = gpu.write.texture
        gpu.display.uniforms.uTime.value = elapsed
        gpu.quad.material = gpu.display
        gpu.renderer.setRenderTarget(null)
        gpu.renderer.render(gpu.scene, gpu.camera)
        if (gpu.renderer.getContext().isContextLost()) {
          fail()
          return
        }
        const previous = gpu.read
        gpu.read = gpu.write
        gpu.write = previous
        host.setAttribute('data-ready', '')
      } catch {
        fail()
        return
      }
      frame = requestAnimationFrame(tick)
    }

    function sync() {
      if (!canRun()) {
        stop()
        if (motion.matches) hide()
        return
      }
      if (!gpu) {
        try {
          gpu = createGpu()
          const canvas = gpu.renderer.domElement
          canvas.addEventListener('webglcontextlost', onContextLost)
          canvas.addEventListener('webglcontextrestored', onContextRestored)
          host.appendChild(canvas)
        } catch {
          fail()
          return
        }
      }
      if (!frame) frame = requestAnimationFrame(tick)
    }

    function onResize() {
      bounds = null
      width = host.clientWidth
      height = host.clientHeight
      sync()
    }
    function onScroll() {
      bounds = null
      pointerWanted = 0
      pointerInside = false
    }
    function onPointer(event: PointerEvent) {
      if (!canRun() || event.pointerType === 'touch' || event.isPrimary === false) return
      bounds ??= host.getBoundingClientRect()
      if (bounds.width <= 0 || bounds.height <= 0) return
      const x = (event.clientX - bounds.left) / bounds.width
      const y = 1 - (event.clientY - bounds.top) / bounds.height
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        onPointerLeave()
        return
      }
      pointerTarget.set(clampUnit(x), clampUnit(y))
      if (!pointerInside) {
        pointer.copy(pointerTarget)
        pointerPrevious.copy(pointerTarget)
      }
      pointerInside = true
      pointerWanted = 1
    }
    function onPointerLeave() {
      pointerWanted = 0
      pointerInside = false
    }
    function onVisibility() {
      bounds = null
      sync()
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      const entry = entries.find(candidate => candidate.target === host)
      if (!entry) return
      inView = entry.isIntersecting
      bounds = null
      sync()
    })
    resizeObserver?.observe(host)
    intersectionObserver?.observe(host)
    card.addEventListener('pointerenter', onPointer)
    card.addEventListener('pointermove', onPointer)
    card.addEventListener('pointerleave', onPointerLeave)
    card.addEventListener('pointercancel', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('blur', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)
    motion.addEventListener('change', sync)
    sync()

    return () => {
      disposed = true
      stop()
      hide()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      card.removeEventListener('pointerenter', onPointer)
      card.removeEventListener('pointermove', onPointer)
      card.removeEventListener('pointerleave', onPointerLeave)
      card.removeEventListener('pointercancel', onPointerLeave)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('blur', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      motion.removeEventListener('change', sync)
      disposeGpu()
    }
  }, [animated])

  return <div className="fluid-background" ref={hostRef} aria-hidden="true" />
}
