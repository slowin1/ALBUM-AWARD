import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'

type AlbumCardMossProps = { enabled?: boolean }
type ModelRequest = {
  url: string
  controller: AbortController
  promise: Promise<ArrayBuffer>
  consumers: number
  settled: boolean
}
type Model = { gltf: GLTF; mixer: THREE.AnimationMixer | null }
type Gpu = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
}

const MODEL_URL = '/models/hanging-ivy-web.glb?v=3'
const FRAME_INTERVAL = 1000 / 30
const VIEW_WIDTH = 5.5
const VIEW_TOP = .5
let modelRequest: ModelRequest | null = null
let modelPreview: { url: string; image: string } | null = null

/** Cache bytes, not parsed scenes, so each mounted card owns its skins and GPU resources. */
function acquireModel() {
  if (!modelRequest || modelRequest.url !== MODEL_URL) {
    const controller = new AbortController()
    const request: ModelRequest = {
      url: MODEL_URL,
      controller,
      consumers: 0,
      settled: false,
      promise: Promise.resolve(new ArrayBuffer(0)),
    }
    request.promise = fetch(MODEL_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Moss model is unavailable')
        return response.arrayBuffer()
      })
      .then(bytes => {
        request.settled = true
        return bytes
      })
      .catch(error => {
        request.settled = true
        if (modelRequest === request) modelRequest = null
        throw error
      })
    modelRequest = request
  }

  const request = modelRequest
  request.consumers++
  let released = false
  return {
    promise: request.promise,
    invalidate() {
      if (modelRequest === request) modelRequest = null
    },
    release() {
      if (released) return
      released = true
      request.consumers--
      if (request.consumers === 0 && !request.settled) {
        if (modelRequest === request) modelRequest = null
        request.controller.abort()
      }
    },
  }
}

function disposeModel(gltf: GLTF) {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  const skeletons = new Set<THREE.Skeleton>()

  function collectTexture(value: unknown) {
    if (value && (value as THREE.Texture).isTexture) textures.add(value as THREE.Texture)
    else if (Array.isArray(value)) value.forEach(collectTexture)
  }

  for (const scene of new Set([gltf.scene, ...gltf.scenes])) {
    scene.traverse(object => {
      const mesh = object as THREE.Mesh
      if (mesh.geometry) geometries.add(mesh.geometry)
      if (mesh.material) {
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material)
      }
      const skinned = object as THREE.SkinnedMesh
      if (skinned.isSkinnedMesh) skeletons.add(skinned.skeleton)
    })
  }
  for (const material of materials) {
    Object.values(material).forEach(collectTexture)
    if ((material as THREE.ShaderMaterial).isShaderMaterial) {
      for (const uniform of Object.values((material as THREE.ShaderMaterial).uniforms)) collectTexture(uniform.value)
    }
  }

  const images = new Set<ImageBitmap>()
  for (const texture of textures) {
    const image = texture.source?.data
    if (image && typeof image.close === 'function') images.add(image)
    texture.dispose()
  }
  for (const image of images) image.close()
  for (const skeleton of skeletons) skeleton.dispose()
  for (const material of materials) material.dispose()
  for (const geometry of geometries) geometry.dispose()
}

function createGpu(model: Model): Gpu {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
    powerPreference: 'low-power',
  })
  try {
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.debug.onShaderError = () => { throw new Error('Moss shader is unavailable') }
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-VIEW_WIDTH / 2, VIEW_WIDTH / 2, 1, -1, .1, 20)
    scene.add(model.gltf.scene)
    scene.add(new THREE.HemisphereLight(0xdeddd6, 0x3c3932, 1))
    const light = new THREE.DirectionalLight(0xf6f2e9, 2)
    light.position.set(-3, 5, 6)
    scene.add(light)
    const fill = new THREE.DirectionalLight(0xc9d6e3, .35)
    fill.position.set(4, 1, 3)
    scene.add(fill)
    return { renderer, scene, camera }
  } catch (error) {
    renderer.dispose()
    renderer.forceContextLoss()
    throw error
  }
}

/** A decorative, independently owned GLB; the PNG stays visible until its first successful frame. */
export function AlbumCardMoss({ enabled = true }: AlbumCardMossProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = hostRef.current
    if (!element || !enabled) return
    const host = element
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const initialBounds = host.getBoundingClientRect()
    let inView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight && initialBounds.right > 0 && initialBounds.left < window.innerWidth
    let width = host.clientWidth
    let height = host.clientHeight
    let disposed = false
    let failed = false
    let loading = false
    let model: Model | null = null
    let gpu: Gpu | null = null
    let releaseModel: (() => void) | null = null
    let frame = 0
    let previousTime: number | null = null
    let dirty = true
    let sizeDirty = true
    let ready = false

    const canRender = () => !disposed && !failed && !document.hidden && inView && width > 0 && height > 0
    const hide = () => {
      ready = false
      host.removeAttribute('data-ready')
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      previousTime = null
    }

    function disposeGpu() {
      if (!gpu) return
      const current = gpu
      gpu = null
      const canvas = current.renderer.domElement
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      if (model) current.scene.remove(model.gltf.scene)
      current.scene.clear()
      current.renderer.dispose()
      current.renderer.forceContextLoss()
      canvas.remove()
    }

    function releaseResources() {
      releaseModel?.()
      releaseModel = null
      if (model?.mixer) {
        model.mixer.stopAllAction()
        model.mixer.uncacheRoot(model.gltf.scene)
      }
      disposeGpu()
      if (model) disposeModel(model.gltf)
      model = null
    }

    function fail() {
      failed = true
      stop()
      hide()
      releaseResources()
    }

    function onContextLost(event: Event) {
      event.preventDefault()
      // Keep the PNG after a context reset instead of repeatedly allocating replacement contexts.
      fail()
    }

    function onContextRestored() {
      fail()
    }

    function resizeGpu(current: Gpu) {
      const scale = Math.min(1, 960 / width)
      current.renderer.setSize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)), false)
      const viewHeight = VIEW_WIDTH / (width / height)
      const centerY = VIEW_TOP - viewHeight / 2
      current.camera.left = -VIEW_WIDTH / 2
      current.camera.right = VIEW_WIDTH / 2
      current.camera.top = viewHeight / 2
      current.camera.bottom = -viewHeight / 2
      current.camera.position.set(0, centerY, 6)
      current.camera.lookAt(0, centerY, 0)
      current.camera.updateProjectionMatrix()
      sizeDirty = false
    }

    function tick(time: number) {
      frame = 0
      if (!canRender() || !gpu || !model) return
      if (!dirty && previousTime !== null && time - previousTime < FRAME_INTERVAL - .75) {
        frame = requestAnimationFrame(tick)
        return
      }
      const delta = previousTime === null ? 0 : Math.min(.05, Math.max(0, (time - previousTime) / 1000))
      previousTime = time
      try {
        if (sizeDirty) resizeGpu(gpu)
        if (!motion.matches) model.mixer?.update(delta)
        gpu.renderer.render(gpu.scene, gpu.camera)
        if (gpu.renderer.getContext().isContextLost()) {
          fail()
          return
        }
        if (!ready) {
          // Reuse this transparent still during the card flip instead of opening another context.
          if (modelPreview?.url !== MODEL_URL) {
            try {
              modelPreview = { url: MODEL_URL, image: gpu.renderer.domElement.toDataURL('image/png') }
            } catch { /* The existing PNG also covers browsers that cannot capture the canvas. */ }
          }
          host.setAttribute('data-ready', '')
          ready = true
        }
        dirty = false
      } catch {
        fail()
        return
      }
      if (!motion.matches && model.mixer) frame = requestAnimationFrame(tick)
    }

    async function loadModel() {
      loading = true
      const lease = acquireModel()
      releaseModel = lease.release
      let parsed: GLTF | null = null
      try {
        const [bytes, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
          lease.promise,
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/libs/meshopt_decoder.module.js'),
        ])
        if (disposed || failed) return
        parsed = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes, '/models/')
        if (disposed || failed) {
          disposeModel(parsed)
          parsed = null
          return
        }
        const mixer = parsed.animations.length ? new THREE.AnimationMixer(parsed.scene) : null
        if (mixer) {
          mixer.clipAction(parsed.animations[0]).play()
          mixer.setTime(0)
        }
        model = { gltf: parsed, mixer }
        parsed = null
        dirty = true
        sync()
      } catch {
        lease.invalidate()
        if (parsed) disposeModel(parsed)
        if (!disposed) fail()
      } finally {
        lease.release()
        if (releaseModel === lease.release) releaseModel = null
        loading = false
      }
    }

    function sync() {
      if (!canRender()) {
        stop()
        return
      }
      if (!model) {
        if (!loading) void loadModel()
        return
      }
      if (!gpu) {
        try {
          gpu = createGpu(model)
          const canvas = gpu.renderer.domElement
          canvas.addEventListener('webglcontextlost', onContextLost)
          canvas.addEventListener('webglcontextrestored', onContextRestored)
          host.appendChild(canvas)
          dirty = sizeDirty = true
        } catch {
          fail()
          return
        }
      }
      if (!frame && (dirty || (!motion.matches && model.mixer))) frame = requestAnimationFrame(tick)
    }

    function updateVisibility() {
      const bounds = host.getBoundingClientRect()
      inView = bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth
    }

    function onResize() {
      width = host.clientWidth
      height = host.clientHeight
      dirty = sizeDirty = true
      if (!intersectionObserver) updateVisibility()
      sync()
    }

    function onFallbackScroll() {
      updateVisibility()
      sync()
    }

    function onMotionChange() {
      stop()
      model?.mixer?.setTime(0)
      dirty = true
      sync()
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      const entry = entries.find(candidate => candidate.target === host)
      if (!entry) return
      inView = entry.isIntersecting
      sync()
    })
    resizeObserver?.observe(host)
    intersectionObserver?.observe(host)
    if (!intersectionObserver) window.addEventListener('scroll', onFallbackScroll, { passive: true, capture: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', onMotionChange)
    sync()

    return () => {
      disposed = true
      stop()
      hide()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      if (!intersectionObserver) window.removeEventListener('scroll', onFallbackScroll, true)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', onMotionChange)
      releaseResources()
    }
  }, [enabled, MODEL_URL])

  const preview = !enabled && modelPreview?.url === MODEL_URL ? modelPreview.image : null
  return (
    <div className="album-card-moss-model" ref={hostRef} data-preview={preview ? '' : undefined} aria-hidden="true">
      {preview && <img src={preview} alt="" draggable={false} />}
    </div>
  )
}
