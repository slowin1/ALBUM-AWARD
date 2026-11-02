import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const output = fileURLToPath(new URL('../public/models/album-moss-v1.glb', import.meta.url))
const directory = fileURLToPath(new URL('../public/models/', import.meta.url))
const DURATION = 12
const SEED = 0x6d6f7373
const CLUMPS = [
  { x: -1.94, spread: .16, strength: .9, fronds: 4, minLength: .25, maxLength: .5 },
  { x: -1.31, spread: .23, strength: 1, fronds: 8, minLength: .4, maxLength: .76 },
  { x: -.73, spread: .12, strength: .76, fronds: 3, minLength: .23, maxLength: .55 },
  { x: -.08, spread: .21, strength: 1, fronds: 9, minLength: .42, maxLength: .78 },
  { x: .58, spread: .14, strength: .85, fronds: 4, minLength: .25, maxLength: .62 },
  { x: 1.23, spread: .2, strength: 1, fronds: 7, minLength: .35, maxLength: .72 },
  { x: 1.92, spread: .15, strength: .82, fronds: 5, minLength: .18, maxLength: .4 },
]

function ridgeAt(x) {
  const growth = Math.min(1, CLUMPS.reduce((sum, clump) => sum + clump.strength * Math.exp(-Math.pow((x - clump.x) / clump.spread, 2) * 1.6), 0))
  return {
    growth,
    y: .005 + .035 * growth + .012 * Math.sin(x * 13) + .008 * Math.sin(x * 29),
    z: .055 + .012 * Math.sin(x * 8.3),
    yRadius: .06 + .055 * growth,
    zRadius: .085 + .075 * growth,
  }
}

// The exporter only needs Blob conversion; no browser, canvas or WebGL is used.
globalThis.FileReader ??= class NodeFileReader {
  result = null
  error = null
  onload = null
  onloadend = null
  onerror = null
  readAsArrayBuffer(blob) { this.read(blob, false) }
  readAsDataURL(blob) { this.read(blob, true) }
  read(blob, dataUrl) {
    blob.arrayBuffer().then(buffer => {
      this.result = dataUrl ? `data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}` : buffer
      this.onload?.({ target: this })
      this.onloadend?.({ target: this })
    }, error => {
      this.error = error
      this.onerror?.({ target: this })
      this.onloadend?.({ target: this })
    })
  }
}

function randomGenerator(seed) {
  return () => {
    seed |= 0
    seed = seed + 0x6d2b79f5 | 0
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed)
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value
    return ((value ^ value >>> 14) >>> 0) / 4294967296
  }
}

function buildMoss() {
  const random = randomGenerator(SEED)
  const between = (low, high) => low + (high - low) * random()
  const positions = [], colors = [], indices = [], joints = [], weights = []
  const palette = ['#36562e', '#476636', '#4c6b38', '#597542', '#304d2d', '#456238'].map(color => new THREE.Color(color))
  const skeletonRoot = new THREE.Bone()
  skeletonRoot.name = 'MossRoot'
  const bones = [skeletonRoot]
  const animatedBones = []
  const fixedSkin = { first: 0, second: 0, blend: 0 }

  function colorFor(brightness = 1) {
    return palette[Math.floor(random() * palette.length)].clone().multiplyScalar(brightness * between(.74, 1.2))
  }

  function vertex(point, color, skin = fixedSkin, brightness = 1) {
    const index = positions.length / 3
    positions.push(point.x, point.y, point.z)
    colors.push(
      Math.round(THREE.MathUtils.clamp(color.r * brightness, 0, 1) * 255),
      Math.round(THREE.MathUtils.clamp(color.g * brightness, 0, 1) * 255),
      Math.round(THREE.MathUtils.clamp(color.b * brightness, 0, 1) * 255),
    )
    joints.push(skin.first, skin.second, 0, 0)
    const blend = Math.round(skin.blend * 65535)
    weights.push(65535 - blend, blend, 0, 0)
    return index
  }
  const triangle = (a, b, c) => indices.push(a, b, c)

  function skinAt(frond, fraction) {
    const scaled = THREE.MathUtils.clamp(fraction, 0, 1) * 3
    const segment = Math.min(2, Math.floor(scaled))
    return { first: frond.joints[segment], second: frond.joints[segment + 1], blend: scaled - segment }
  }

  // Closed, softly cupped ivy leaves with three broad rounded lobes. Both
  // surfaces and a thin rim are geometry, not alpha cards or a bitmap cutout.
  function leaf(base, direction, length, width, color, skin = fixedSkin, detailed = true, bend = .18) {
    const axis = direction.clone().normalize()
    const reference = Math.abs(axis.z) < .85 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)
    const right = new THREE.Vector3().crossVectors(axis, reference).normalize()
    const front = new THREE.Vector3().crossVectors(right, axis).normalize()
    const outline = [[0, 0], [-.92, .23], [-1, .5], [-.52, .69], [-.28, .63], [-.37, .88], [0, 1.13], [.37, .88], [.28, .63], [.52, .69], [1, .5], [.92, .23]]
    const halfWidth = Math.max(width, length * .36)
    const thickness = Math.max(.0008, halfWidth * .055)
    const center = base.clone().addScaledVector(axis, length * .47).addScaledVector(front, length * bend * .42)
    const upperCenter = vertex(center.clone().addScaledVector(front, halfWidth * .12), color, skin, 1.07)
    const lowerCenter = vertex(center.clone().addScaledVector(front, -thickness), color, skin, .72)
    const upper = [], lower = []
    for (const [x, y] of outline) {
      const edge = base.clone().addScaledVector(axis, y * length).addScaledVector(right, x * halfWidth)
        .addScaledVector(front, Math.sin(y * Math.PI) * length * bend * .22 + Math.abs(x) * halfWidth * .04)
      upper.push(vertex(edge.clone().addScaledVector(front, thickness / 2), color, skin, .86 + y * .15))
      lower.push(vertex(edge.clone().addScaledVector(front, -thickness / 2), color, skin, .64 + y * .1))
    }
    for (let side = 0; side < outline.length; side++) {
      const next = (side + 1) % outline.length
      triangle(upperCenter, upper[next], upper[side])
      triangle(lowerCenter, lower[side], lower[next])
      triangle(upper[side], upper[next], lower[side])
      triangle(upper[next], lower[next], lower[side])
    }
  }

  // Real tapered tubes connect each frond and its smaller branches.
  function tube(path, segments, radius, color, skinFor = () => fixedSkin, sides = 4) {
    const rings = []
    for (let sample = 0; sample <= segments; sample++) {
      const fraction = sample / segments
      const point = path(fraction)
      const axis = path(Math.min(1, fraction + .001)).sub(path(Math.max(0, fraction - .001))).normalize()
      const reference = Math.abs(axis.z) < .85 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)
      const right = new THREE.Vector3().crossVectors(axis, reference).normalize()
      const front = new THREE.Vector3().crossVectors(right, axis).normalize()
      const ring = []
      for (let side = 0; side < sides; side++) {
        const angle = side * Math.PI * 2 / sides
        const r = radius * (1 - fraction * .8)
        ring.push(vertex(point.clone().addScaledVector(right, Math.cos(angle) * r).addScaledVector(front, Math.sin(angle) * r), color, skinFor(fraction), .75))
      }
      rings.push(ring)
    }
    const start = vertex(path(0), color, skinFor(0), .7)
    const end = vertex(path(1), color, skinFor(1), .85)
    for (let side = 0; side < sides; side++) {
      const next = (side + 1) % sides
      triangle(start, rings[0][side], rings[0][next])
      triangle(end, rings.at(-1)[next], rings.at(-1)[side])
      for (let segment = 0; segment < segments; segment++) {
        triangle(rings[segment][side], rings[segment + 1][side], rings[segment][next])
        triangle(rings[segment + 1][side], rings[segment + 1][next], rings[segment][next])
      }
    }
  }

  // Seven thick growth patches connected by thin, crooked sections of dark moss.
  const cushionRings = []
  for (let step = 0; step <= 128; step++) {
    const x = THREE.MathUtils.lerp(-2.18, 2.18, step / 128)
    const ridge = ridgeAt(x)
    const endTaper = Math.sqrt(Math.max(.025, 1 - Math.pow(Math.abs(x) / 2.18, 12)))
    const ring = []
    for (let side = 0; side < 8; side++) {
      const angle = side * Math.PI / 4
      const irregularity = 1 + .13 * Math.sin(step * .73 + side * 1.4)
      ring.push(vertex(new THREE.Vector3(x, ridge.y + Math.sin(angle) * ridge.yRadius * endTaper * irregularity, ridge.z + Math.cos(angle) * ridge.zRadius * endTaper * irregularity), colorFor(.66)))
    }
    cushionRings.push(ring)
  }
  for (let step = 0; step < 128; step++) {
    for (let side = 0; side < 8; side++) {
      const next = (side + 1) % 8
      triangle(cushionRings[step][side], cushionRings[step + 1][side], cushionRings[step][next])
      triangle(cushionRings[step + 1][side], cushionRings[step + 1][next], cushionRings[step][next])
    }
  }
  const cushionSideIndexCount = indices.length
  const startRidge = ridgeAt(-2.18), endRidge = ridgeAt(2.18)
  const cushionStart = vertex(new THREE.Vector3(-2.18, startRidge.y, startRidge.z), colorFor(.5))
  const cushionEnd = vertex(new THREE.Vector3(2.18, endRidge.y, endRidge.z), colorFor(.5))
  for (let side = 0; side < 8; side++) {
    triangle(cushionStart, cushionRings[0][side], cushionRings[0][(side + 1) % 8])
    triangle(cushionEnd, cushionRings.at(-1)[(side + 1) % 8], cushionRings.at(-1)[side])
  }
  const cushionIndexCount = indices.length

  // Overlapping lobed leaves wrap a thick, shaggy canopy, with extra density at
  // its growth patches and a few small gaps between them.
  for (let blade = 0; blade < 850; blade++) {
    const clump = CLUMPS[Math.floor(random() * CLUMPS.length)]
    const x = blade % 3 === 0 ? between(-2.14, 2.14) : THREE.MathUtils.clamp(clump.x + (random() + random() - 1) * clump.spread * 1.9, -2.14, 2.14)
    const ridge = ridgeAt(x)
    const angle = between(-Math.PI * .6, Math.PI * .8)
    const base = new THREE.Vector3(x, ridge.y + Math.sin(angle) * ridge.yRadius + between(-.02, .02), ridge.z + Math.cos(angle) * ridge.zRadius + between(-.015, .015))
    const direction = new THREE.Vector3(between(-1, 1), between(-1, .65), between(-.7, .7))
    leaf(base, direction, between(.037, .071), between(.021, .034), colorFor(), fixedSkin, true, between(.12, .35))
  }

  function addFrond(name, root, length, edge) {
    const phase = between(0, Math.PI * 2)
    const wander = edge ? between(.012, .021) : between(.025, .065)
    const curve = between(-1, 1)
    const depth = between(.014, .04)
    const path = fraction => new THREE.Vector3(
      root.x + Math.sin(fraction * Math.PI * (1.2 + curve * .5) + phase) * Math.sin(fraction * Math.PI) * wander + curve * wander * fraction * .25,
      root.y - fraction * length,
      root.z + Math.sin(fraction * Math.PI + phase) * Math.sin(fraction * Math.PI) * depth + fraction * .008,
    )
    const frond = { joints: [], path, length, edge }
    let parent = skeletonRoot
    let previous = new THREE.Vector3()
    for (let joint = 0; joint < 4; joint++) {
      const bone = new THREE.Bone()
      bone.name = `${name}_J${joint}`
      const point = path(joint / 3)
      bone.position.copy(joint === 0 ? point : point.clone().sub(previous))
      previous.copy(point)
      parent.add(bone)
      frond.joints.push(bones.length)
      bones.push(bone)
      if (joint > 0) animatedBones.push({ bone, phase: phase + joint * .67, joint, edge })
      parent = bone
    }
    const stemColor = colorFor(.6)
    tube(path, edge ? 26 : 12, edge ? .0047 : .004, stemColor, fraction => skinAt(frond, fraction))
    // Small radial tufts hide each curved stem. Irregular nodes and branchlets
    // avoid the paired leaves and evenly spaced ribs of a fern.
    const nodeSpacing = edge ? [.075, .11] : [.065, .10]
    for (let fraction = between(.012, .04); fraction < .96; fraction += between(...nodeSpacing) / length) {
      const point = path(fraction)
      const taper = .26 + .74 * Math.pow(1 - fraction, .6)
      const leaves = 2 + Math.floor(random() * 2)
      const swirl = between(0, Math.PI * 2)
      for (let blade = 0; blade < leaves; blade++) {
        const angle = swirl + blade * 2.39996 + between(-.8, .8)
        const leafDirection = new THREE.Vector3(Math.cos(angle) * between(.4, 1), between(-1, .2), Math.sin(angle) * between(.4, .9))
        const leafLength = (edge ? between(.039, .067) : between(.043, .075)) * (.6 + taper * .4)
        const base = point.clone().add(new THREE.Vector3(between(-.005, .005), between(-.012, .01), between(-.005, .005)))
        leaf(base, leafDirection, leafLength, between(.022, .035) * (.5 + taper * .5), colorFor(), skinAt(frond, fraction), true, between(.12, .36))
      }
      if (random() < (edge ? .16 : .23) && fraction < .8) {
        const side = random() < .5 ? -1 : 1
        const branch = new THREE.Vector3(side * between(.018, edge ? .027 : .047), between(-.026, .009), between(-.017, .027)).multiplyScalar(taper * 1.25)
        const tip = point.clone().add(branch)
        tube(t => point.clone().lerp(tip, t).add(new THREE.Vector3(0, Math.sin(t * Math.PI) * .008, 0)), 2, .0021, stemColor, () => skinAt(frond, fraction), 3)
        for (let bud = 0; bud < 2; bud++) {
          const angle = between(0, Math.PI * 2)
          leaf(tip, new THREE.Vector3(Math.cos(angle), between(-.8, .4), Math.sin(angle)), between(.03, .052) * (.65 + taper * .35), .022 * (.6 + taper * .4), colorFor(), skinAt(frond, fraction), true, .22)
        }
      }
    }
    leaf(path(1), new THREE.Vector3(edge ? .025 : .12, -1, .08), edge ? .014 : .02, .003, colorFor(), skinAt(frond, 1), false, .2)
  }

  let centralIndex = 0
  for (const clump of CLUMPS) {
    for (let strand = 0; strand < clump.fronds; strand++) {
      const x = clump.x + between(-clump.spread * .7, clump.spread * .7)
      const ridge = ridgeAt(x)
      const length = clump.x === -.08 && strand === 0 ? clump.maxLength : clump.minLength + Math.pow(random(), .8) * (clump.maxLength - clump.minLength)
      addFrond(`Central_${String(centralIndex++).padStart(2, '0')}`, new THREE.Vector3(x, ridge.y + between(-.065, -.025), ridge.z + between(.01, .075)), length, false)
    }
  }
  for (const side of [-1, 1]) {
    const lengths = side < 0 ? [1.86, 2.08, 1.98] : [1.91, 2.04, 1.78]
    for (let strand = 0; strand < 3; strand++) {
      addFrond(`Edge_${side < 0 ? 'Left' : 'Right'}_${strand}`, new THREE.Vector3(side * (2.12 + strand * .025), .04, .045 + strand * .035), lengths[strand], true)
    }
  }

  // Fine muted aerial roots sit behind the leaves. Central roots stop before
  // the metadata; longer fibres are confined to the edges of the card.
  const rootPalette = ['#635f52', '#777265', '#514e45', '#807c70'].map(color => new THREE.Color(color))
  for (let group = 0; group < CLUMPS.length + 2; group++) {
    const edge = group >= CLUMPS.length
    const side = group === CLUMPS.length ? -1 : 1
    const centerX = edge ? side * 2.125 : CLUMPS[group].x
    const chainLength = edge ? 1.72 : .7
    const chainRoot = new THREE.Vector3(centerX, -.065, -.045)
    const chain = { joints: [] }
    let parent = skeletonRoot
    const phase = between(0, Math.PI * 2)
    for (let joint = 0; joint < 4; joint++) {
      const bone = new THREE.Bone()
      bone.name = `Aerial_${edge ? 'Edge' : 'Central'}_${group}_J${joint}`
      bone.position.copy(joint === 0 ? chainRoot : new THREE.Vector3(0, -chainLength / 3, 0))
      parent.add(bone)
      chain.joints.push(bones.length)
      bones.push(bone)
      if (joint > 0) animatedBones.push({ bone, phase: phase + joint * .83, joint, edge, aerial: true })
      parent = bone
    }
    const count = edge ? 16 : 10
    for (let root = 0; root < count; root++) {
      const x = edge ? side * between(2.055, 2.205) : centerX + between(-CLUMPS[group].spread * .85, CLUMPS[group].spread * .85)
      const length = edge ? between(.65, 1.7) : between(.25, .7)
      const y = between(-.075, -.035)
      const z = between(-.075, -.025)
      const phase = between(0, Math.PI * 2)
      const curl = between(.003, edge ? .011 : .019)
      const path = t => new THREE.Vector3(x + Math.sin(t * Math.PI * 2.4 + phase) * Math.sin(t * Math.PI) * curl, y - t * length, z + Math.sin(t * 5 + phase) * t * .012)
      const color = rootPalette[Math.floor(random() * rootPalette.length)].clone().multiplyScalar(between(.8, 1.1))
      tube(path, edge ? 18 : 12, between(.0009, .0017), color, t => skinAt(chain, Math.min(1, t * length / chainLength)), 3)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Uint8BufferAttribute(colors, 3, true))
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(joints, 4))
  geometry.setAttribute('skinWeight', new THREE.Uint16BufferAttribute(weights, 4, true))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  const material = new THREE.MeshStandardMaterial({ name: 'ForestMoss', color: 0xffffff, roughness: .98, metalness: 0, vertexColors: true })
  const mesh = new THREE.SkinnedMesh(geometry, material)
  mesh.name = 'AlbumMoss'
  mesh.add(skeletonRoot)
  mesh.updateMatrixWorld(true)
  mesh.bind(new THREE.Skeleton(bones))
  mesh.userData = { seed: SEED, description: 'Dense shaggy canopy of real cupped three-lobed ivy leaves, asymmetrical leafy tassels and fine grey-brown aerial roots. Fixed base with independently skinned wind layers.', centralMinimumY: -.86, cushionSideIndexCount, cushionIndexCount }
  const scene = new THREE.Group()
  scene.name = 'AlbumMossModel'
  scene.add(mesh)

  const tracks = []
  const samples = 48
  const times = Array.from({ length: samples + 1 }, (_, index) => index * DURATION / samples)
  for (const { bone, phase, joint, edge, aerial } of animatedBones) {
    const values = []
    for (let sample = 0; sample <= samples; sample++) {
      const cycle = sample === samples ? 0 : sample / samples * Math.PI * 2
      const x = Math.sin(cycle + phase) * (aerial ? .012 + joint * .003 : .031 + joint * .009)
      const y = Math.sin(cycle + phase + .8) * (aerial ? .005 : edge ? .012 : .023)
      const z = Math.sin(cycle + phase + 1.3) * (aerial ? .009 : edge ? .018 : .03 + joint * .006)
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'XYZ'))
      values.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values))
  }
  return { scene, clip: new THREE.AnimationClip('MossBreeze', DURATION, tracks) }
}

function roundedBounds(box) {
  return { min: box.min.toArray().map(value => +value.toFixed(4)), max: box.max.toArray().map(value => +value.toFixed(4)) }
}

async function validate(buffer) {
  const view = new DataView(buffer)
  assert.equal(view.getUint32(0, true), 0x46546c67, 'GLB magic')
  assert.equal(view.getUint32(4, true), 2, 'glTF 2')
  assert.equal(view.getUint32(8, true), buffer.byteLength, 'GLB byte length')
  const gltf = await new GLTFLoader().parseAsync(buffer, '')
  const meshes = []
  gltf.scene.traverse(object => { if (object.isMesh) meshes.push(object) })
  assert.equal(meshes.length, 1, 'one draw-call mesh')
  const mesh = meshes[0]
  assert.ok(mesh.isSkinnedMesh && !Array.isArray(mesh.material), 'one skinned mesh, one PBR material')
  assert.ok(mesh.material.isMeshStandardMaterial && mesh.material.roughness >= .9)
  assert.equal(mesh.material.map, null, 'no image planes or texture dependencies')
  const attributes = mesh.geometry.attributes
  for (const [name, attribute] of Object.entries(attributes)) {
    for (const value of attribute.array) assert.ok(Number.isFinite(value), `finite ${name}`)
  }
  for (let index = 0; index < attributes.position.count; index++) {
    const weight = attributes.skinWeight
    const sum = weight.getX(index) + weight.getY(index) + weight.getZ(index) + weight.getW(index)
    assert.ok(Math.abs(sum - 1) < .00001, 'normalized skin weights')
    assert.ok(new THREE.Vector3().fromBufferAttribute(attributes.normal, index).length() > .8, 'nonzero leaf normals')
  }
  // Check the exported cushion's actual face winding, not just nonzero normals.
  const cushionSideIndexCount = mesh.userData.cushionSideIndexCount
  const cushionIndexCount = mesh.userData.cushionIndexCount
  assert.equal(cushionSideIndexCount, 128 * 8 * 6)
  assert.equal(cushionIndexCount, cushionSideIndexCount + 8 * 6)
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const faceNormal = new THREE.Vector3(), radial = new THREE.Vector3()
  for (let index = 0; index < cushionIndexCount; index += 3) {
    a.fromBufferAttribute(attributes.position, mesh.geometry.index.getX(index))
    b.fromBufferAttribute(attributes.position, mesh.geometry.index.getX(index + 1))
    c.fromBufferAttribute(attributes.position, mesh.geometry.index.getX(index + 2))
    faceNormal.crossVectors(b.clone().sub(a), c.clone().sub(a))
    radial.copy(a).add(b).add(c).multiplyScalar(1 / 3)
    if (index < cushionSideIndexCount) {
      const ridge = ridgeAt(radial.x)
      radial.set(0, radial.y - ridge.y, radial.z - ridge.z)
      assert.ok(faceNormal.dot(radial) > 0, 'cushion side faces point outwards')
    } else {
      assert.ok(faceNormal.x * Math.sign(radial.x) > 0, 'cushion end caps point outwards')
    }
  }
  const triangles = mesh.geometry.index.count / 3
  assert.ok(triangles >= 15000 && triangles <= 120000, `triangle budget: ${triangles}`)
  assert.ok(buffer.byteLength < 5_000_000, 'model size budget')
  assert.equal(gltf.animations.length, 1)
  assert.ok(gltf.animations[0].tracks.length > 0)
  for (const track of gltf.animations[0].tracks) {
    for (let channel = 0; channel < 4; channel++) {
      assert.ok(Math.abs(track.values[channel] - track.values[track.values.length - 4 + channel]) < .000001, 'seamless animation loop')
    }
  }
  const mixer = new THREE.AnimationMixer(gltf.scene)
  mixer.clipAction(gltf.animations[0]).play()
  const point = new THREE.Vector3()
  const reports = []
  for (const time of [0, 3, 6, 9]) {
    mixer.setTime(time)
    gltf.scene.updateMatrixWorld(true)
    mesh.skeleton.update()
    const bounds = new THREE.Box3()
    let centralMinimumY = Infinity
    let edgeMinimumAbsoluteX = Infinity
    for (let index = 0; index < attributes.position.count; index++) {
      point.fromBufferAttribute(attributes.position, index)
      mesh.applyBoneTransform(index, point)
      assert.ok(point.toArray().every(Number.isFinite), 'finite animated vertices')
      bounds.expandByPoint(point)
      const joint = attributes.skinIndex.getX(index)
      const name = mesh.skeleton.bones[joint].name
      if (name.startsWith('Central_') || name.startsWith('Aerial_Central_')) centralMinimumY = Math.min(centralMinimumY, point.y)
      if ((name.startsWith('Edge_') || name.startsWith('Aerial_Edge_')) && point.y < -.86) edgeMinimumAbsoluteX = Math.min(edgeMinimumAbsoluteX, Math.abs(point.x))
    }
    assert.ok(centralMinimumY >= -.86, `central text clearance at ${time}s: ${centralMinimumY}`)
    assert.ok(edgeMinimumAbsoluteX >= 1.98, `edge fronds stay beside the text at ${time}s: ${edgeMinimumAbsoluteX}`)
    assert.ok(bounds.min.x >= -2.29 && bounds.max.x <= 2.29, 'width remains within camera contract')
    assert.ok(bounds.min.y >= -2.1 && bounds.max.y <= .30, 'vertical contract')
    assert.ok(bounds.min.z >= -.32 && bounds.max.z <= .32, 'depth contract')
    reports.push({ time, ...roundedBounds(bounds), centralMinimumY: +centralMinimumY.toFixed(4), edgeMinimumAbsoluteX: +edgeMinimumAbsoluteX.toFixed(4) })
  }
  mixer.stopAllAction()
  return { bytes: buffer.byteLength, vertices: attributes.position.count, triangles, materials: 1, meshes: meshes.length, bones: mesh.skeleton.bones.length, animation: gltf.animations[0].name, duration: gltf.animations[0].duration, tracks: gltf.animations[0].tracks.length, bounds: reports }
}

if (process.argv.includes('--validate')) {
  const file = await readFile(output)
  const buffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)
  console.log(JSON.stringify(await validate(buffer), null, 2))
} else {
  const { scene, clip } = buildMoss()
  const buffer = await new GLTFExporter().parseAsync(scene, { binary: true, animations: [clip], onlyVisible: true })
  const stats = await validate(buffer)
  await mkdir(directory, { recursive: true })
  await writeFile(output, new Uint8Array(buffer))
  console.log(JSON.stringify({ file: output, seed: SEED, ...stats }, null, 2))
}
