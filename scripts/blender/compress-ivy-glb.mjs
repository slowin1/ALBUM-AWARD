// Lossless geometry compression. Keep the standard GLB beside this web version.
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer'

const input = new URL('../../public/models/hanging-ivy.glb', import.meta.url)
const output = new URL('../../public/models/hanging-ivy-web.glb', import.meta.url)
const source = await readFile(input)
assert.equal(source.readUInt32LE(0), 0x46546c67)
const jsonLength = source.readUInt32LE(12)
const doc = JSON.parse(source.subarray(20, 20 + jsonLength).toString())
const binHeader = 20 + jsonLength
const binary = source.subarray(binHeader + 8, binHeader + 8 + source.readUInt32LE(binHeader))
assert.equal(doc.buffers.length, 1, 'self-contained source GLB')
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready])
const components = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 }
const sizes = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }
const indexViews = new Set(doc.meshes.flatMap(mesh => mesh.primitives.map(p => doc.accessors[p.indices]?.bufferView)))
const chunks = []
let offset = 0
let compressedViews = 0
function append(bytes) {
  const start = offset
  chunks.push(bytes)
  const padding = (4 - bytes.byteLength % 4) % 4
  if (padding) chunks.push(Buffer.alloc(padding))
  offset += bytes.byteLength + padding
  return start
}

for (let index = 0; index < doc.bufferViews.length; index++) {
  const view = doc.bufferViews[index]
  const accessors = doc.accessors.filter(a => a.bufferView === index)
  const bytes = binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength)
  const accessor = accessors[0]
  const indices = indexViews.has(index)
  const stride = accessor && (view.byteStride || components[accessor.componentType] * sizes[accessor.type])
  const eligible = stride && bytes.byteLength % stride === 0 && (indices ? [2, 4].includes(stride) : stride % 4 === 0 && stride <= 256)
  if (!eligible) {
    view.buffer = 0
    view.byteOffset = append(bytes)
    continue
  }
  // INDICES preserves exact index ordering as well as topology.
  const mode = indices ? 'INDICES' : 'ATTRIBUTES'
  const count = bytes.byteLength / stride
  const encoded = MeshoptEncoder.encodeGltfBuffer(bytes, count, stride, mode)
  const decoded = new Uint8Array(bytes.byteLength)
  MeshoptDecoder.decodeGltfBuffer(decoded, count, stride, encoded, mode)
  assert.equal(Buffer.compare(bytes, decoded), 0, `lossless buffer view ${index}`)
  view.buffer = 1
  view.extensions = { ...view.extensions, EXT_meshopt_compression: {
    buffer: 0, byteOffset: append(encoded), byteLength: encoded.byteLength,
    byteStride: stride, count, mode, filter: 'NONE',
  } }
  compressedViews++
}
doc.buffers = [
  { byteLength: offset },
  { byteLength: binary.byteLength, extensions: { EXT_meshopt_compression: { fallback: true } } },
]
doc.extensionsUsed = [...new Set([...(doc.extensionsUsed ?? []), 'EXT_meshopt_compression'])]
doc.extensionsRequired = [...new Set([...(doc.extensionsRequired ?? []), 'EXT_meshopt_compression'])]
const json = Buffer.from(JSON.stringify(doc))
const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)])
const data = Buffer.concat(chunks)
const header = Buffer.alloc(20)
header.writeUInt32LE(0x46546c67, 0)
header.writeUInt32LE(2, 4)
header.writeUInt32LE(28 + jsonPadded.length + data.length, 8)
header.writeUInt32LE(jsonPadded.length, 12)
header.writeUInt32LE(0x4e4f534a, 16)
const bin = Buffer.alloc(8)
bin.writeUInt32LE(data.length, 0)
bin.writeUInt32LE(0x004e4942, 4)
const result = Buffer.concat([header, jsonPadded, bin, data])
assert.equal(result.length, result.readUInt32LE(8))
await writeFile(output, result)
console.log(JSON.stringify({ file: output.pathname, sourceBytes: source.length, webBytes: result.length, compressedViews, geometry: 'byte-identical after decoding', decoder: 'GLTFLoader.setMeshoptDecoder(MeshoptDecoder)' }, null, 2))
