import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
 BufferGeometry, Camera, Float32BufferAttribute, HalfFloatType, LinearFilter,
 Mesh, NoColorSpace, RGBAFormat, Scene, ShaderMaterial, WebGLRenderTarget,
} from 'three'
import vertexShader from '../shaders/fullscreen.vert.glsl?raw'
import dunes from '../shaders/dunes.glsl?raw'

export const TERRAIN_EXTENT = 65
const HEIGHTMAP_SIZE = 512
const HEIGHTMAP_DETAIL_SIZE = 1024
const fragmentShader = `
varying vec2 vUv;
uniform float uTerrainExtent;
${dunes}
void main() {
 float height = heightAt((vUv - .5) * uTerrainExtent);
 gl_FragColor = vec4(height, 0., 0., 1.);
}
`

// Cache only the shadow queries. Displacement and smooth terrain normals keep
// using the original procedural surface, so the silhouette stays unchanged.
export function useTerrainHeightmap(height: number, frequency: number, radius: number) {
 const { gl } = useThree()
 const resources = useMemo(() => {
  const target = new WebGLRenderTarget(HEIGHTMAP_SIZE, HEIGHTMAP_SIZE, {
   type: HalfFloatType, format: RGBAFormat, minFilter: LinearFilter, magFilter: LinearFilter,
   depthBuffer: false, stencilBuffer: false, generateMipmaps: false,
  })
  target.texture.colorSpace = NoColorSpace
  target.texture.name = 'Terrain shadow height cache'
  const uniforms = {
   uHeight: { value: height }, uFrequency: { value: frequency }, uRadius: { value: radius },
   uTerrainExtent: { value: TERRAIN_EXTENT },
  }
  const material = new ShaderMaterial({
   vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false, toneMapped: false,
  })
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
  geometry.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2))
  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  const scene = new Scene()
  scene.add(mesh)
  return { target, uniforms, material, geometry, scene, camera: new Camera(), baked: false }
 }, [vertexShader, fragmentShader])

 useEffect(() => {
  const restored = () => { resources.baked = false }
  gl.domElement.addEventListener('webglcontextrestored', restored)
  return () => {
   gl.domElement.removeEventListener('webglcontextrestored', restored)
   resources.target.dispose(); resources.material.dispose(); resources.geometry.dispose()
  }
 }, [gl, resources])

 // Scene updates its terrain uniforms at -1; this cache is ready before the
 // fog pass renders the scene at priority 1. Unchanged frames do no extra work.
 useFrame(() => {
  const { uniforms } = resources
  // The default field is smooth at 512²; stronger/tighter dunes need a finer
  // cache to keep interpolation error below their broad shadow penumbra.
  const size = frequency > .75 || height > 2 ? HEIGHTMAP_DETAIL_SIZE : HEIGHTMAP_SIZE
  if (resources.baked && uniforms.uHeight.value === height
   && uniforms.uFrequency.value === frequency && uniforms.uRadius.value === radius
   && resources.target.width === size) return
  if (resources.target.width !== size) resources.target.setSize(size, size)
  uniforms.uHeight.value = height
  uniforms.uFrequency.value = frequency
  uniforms.uRadius.value = radius
  const previousTarget = gl.getRenderTarget()
  const previousFace = gl.getActiveCubeFace(), previousLevel = gl.getActiveMipmapLevel()
  try {
   gl.setRenderTarget(resources.target)
   gl.render(resources.scene, resources.camera)
   resources.baked = true
  } finally { gl.setRenderTarget(previousTarget, previousFace, previousLevel) }
 }, -.5)

 return resources.target.texture
}
