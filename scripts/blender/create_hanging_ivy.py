"""Create an editable, rigged hanging ivy and its self-contained WebGL export.

Run with Blender, not system Python:
  blender -b --python scripts/blender/create_hanging_ivy.py
The model uses real cupped leaf geometry and cylindrical stems/aerial roots.
"""
import bpy
import math
import os
import random
import json
from pathlib import Path
from mathutils import Vector, Quaternion

ROOT = Path(__file__).resolve().parents[2]
OUT_BLEND = ROOT / 'assets/models/hanging-ivy.blend'
OUT_GLB = ROOT / 'public/models/hanging-ivy.glb'
OUT_RENDER = ROOT / 'artifacts/hanging-ivy-white.png'
ALBEDO_PATH = ROOT / 'assets/textures/ivy-leaf-albedo-muted.png'
RNG = random.Random(385721)
TAU = math.tau

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for data in list(bpy.data.collections):
    if data.name != 'Collection':
        bpy.data.collections.remove(data)
base_collection = bpy.data.collections.get('Collection')
base_collection.name = 'Hanging Ivy'

def collection(name):
    result = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(result)
    return result

CANOPY = collection('Canopy')
TRAILS = collection('Trailing branches')
ROOTS = collection('Aerial roots')
RIG = collection('Rig')
STUDIO = collection('Studio')

def image_node(nodes, path, color_space='sRGB'):
    if not path.exists():
        return None
    image = bpy.data.images.load(str(path), check_existing=True)
    image.colorspace_settings.name = color_space
    image.pack()
    node = nodes.new('ShaderNodeTexImage')
    node.image = image
    return node

def foliage_material():
    material = bpy.data.materials.new('Ivy • living leaf surface')
    material.use_nodes = True
    material.diffuse_color = (0.16, 0.20, 0.11, 1)
    material.use_backface_culling = False
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    bsdf = nodes.get('Principled BSDF')
    bsdf.inputs['Roughness'].default_value = 0.72
    bsdf.inputs['Specular IOR Level'].default_value = 0.18
    color = nodes.new('ShaderNodeVertexColor')
    color.layer_name = 'Leaf variation'
    albedo = image_node(nodes, ALBEDO_PATH)
    if albedo:
        multiply = nodes.new('ShaderNodeMixRGB')
        multiply.blend_type = 'MULTIPLY'
        multiply.inputs[0].default_value = 1
        links.new(albedo.outputs['Color'], multiply.inputs[1])
        links.new(color.outputs['Color'], multiply.inputs[2])
        links.new(multiply.outputs[0], bsdf.inputs['Base Color'])
    else:
        links.new(color.outputs['Color'], bsdf.inputs['Base Color'])
    rough = image_node(nodes, ROOT / 'assets/textures/ivy-leaf-roughness.png', 'Non-Color')
    if rough:
        # Keep the original map packed for editing, while the web material
        # uses a deliberate matte .72 rather than the old .52–.68 range.
        rough.label = 'Original roughness • optional editing source'
    normal = image_node(nodes, ROOT / 'assets/textures/ivy-leaf-normal.png', 'Non-Color')
    if normal:
        normal_map = nodes.new('ShaderNodeNormalMap')
        normal_map.inputs['Strength'].default_value = 0.18
        links.new(normal.outputs['Color'], normal_map.inputs['Color'])
        links.new(normal_map.outputs['Normal'], bsdf.inputs['Normal'])
    return material

LEAF_MAT = foliage_material()
ROOT_MAT = bpy.data.materials.new('Aerial roots • warm weathered grey')
ROOT_MAT.use_nodes = True
ROOT_MAT.diffuse_color = (0.19, 0.18, 0.135, 1)
root_bsdf = ROOT_MAT.node_tree.nodes.get('Principled BSDF')
root_bsdf.inputs['Base Color'].default_value = (0.19, 0.18, 0.135, 1)
root_bsdf.inputs['Roughness'].default_value = 0.95

# Preserve the off-centre reference curtain, with the two outside growth
# groups hanging even lower as requested for the album-card composition.
# x, length, width, leaf count, depth, lateral bend
BRANCHES = [
    (-2.25, 5.35, .22, 850, -.01, -.08),
    (-2.16, 4.95, .22, 780, .04, -.01),
    (-1.57, 1.82, .27, 510, -.02, .11),
    (-1.31, 2.02, .17, 370, -.09, .02),
    (-1.01, 1.22, .19, 230, -.03, -.09),
    (-.78, .91, .20, 200, .04, -.05),
    (-.51, 1.55, .16, 290, -.01, .08),
    (-.39, 2.74, .15, 390, -.10, .06),
    (-.05, 1.62, .23, 350, .02, -.08),
    (.24, 2.75, .29, 690, -.06, .08),
    (.30, 4.76, .18, 710, -.14, .09),
    (.60, 2.38, .23, 420, -.01, -.09),
    (.82, 1.56, .21, 310, .07, -.07),
    (1.08, 1.34, .20, 230, -.02, .04),
    (1.39, 1.06, .19, 220, .03, -.09),
    (1.68, .74, .17, 160, -.01, .03),
    (2.17, 5.10, .21, 800, .04, .03),
    (2.28, 5.55, .22, 900, -.03, .08),
]

def path_point(branch_index, t):
    x, length, width, count, depth, bend = BRANCHES[branch_index]
    return Vector((x + bend*t + math.sin(t*7.1+branch_index)*.045*t,
                   depth + math.sin(t*4.5+branch_index*1.8)*.045*t,
                   .07 - length*t))

armature = bpy.data.armatures.new('Ivy flexible branch skeleton')
rig = bpy.data.objects.new('Ivy Breeze Rig', armature)
RIG.objects.link(rig)
bpy.context.view_layer.objects.active = rig
rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
anchor = armature.edit_bones.new('Canopy_anchor')
anchor.head = (0, 0, 0)
anchor.tail = (0, 0, .2)
bone_names = [['Canopy_anchor']]
for index, spec in enumerate(BRANCHES):
    names = []
    previous = anchor
    for segment in range(5):
        bone = armature.edit_bones.new(f'Trail_{index+1:02d}_{segment+1:02d}')
        bone.head = path_point(index, segment/5)
        bone.tail = path_point(index, (segment+1)/5)
        bone.parent = previous
        bone.use_connect = segment > 0
        previous = bone
        names.append(bone.name)
    bone_names.append(names)
bpy.ops.object.mode_set(mode='OBJECT')
rig.select_set(False)

def weights(branch, t):
    if branch is None:
        return [('Canopy_anchor', 1.0)]
    value = max(0, min(4, t*5-.5))
    low = int(value)
    high = min(4, low+1)
    fraction = value-low
    if high == low:
        return [(bone_names[branch+1][low], 1.0)]
    return [(bone_names[branch+1][low], 1-fraction),
            (bone_names[branch+1][high], fraction)]

class MeshBuilder:
    def __init__(self):
        self.verts, self.faces, self.uvs, self.colors, self.weights = [], [], [], [], []

    def vertex(self, co, uv, color, skin):
        self.verts.append(tuple(co))
        self.uvs.append(uv)
        self.colors.append((*color, 1))
        self.weights.append(skin)
        return len(self.verts)-1

    def leaf(self, center, size, rotation, color, branch=None, t=0):
        # A five-lobed heart/ivy outline. The cupped centre and raised vein
        # give every leaf actual depth; no camera-facing texture rectangles.
        outline = [(-.10,-.50), (-.30,-.40), (-.35,-.15), (-.60,-.02),
                   (-.39,.18), (-.48,.42), (-.20,.34), (0,.65),
                   (.21,.34), (.48,.42), (.38,.17), (.60,-.02),
                   (.35,-.15), (.30,-.40), (.10,-.50), (0,-.40)]
        skin = weights(branch, t)
        local_center = Vector((0, -.075*size, 0))
        first = self.vertex(center+rotation@local_center, (.5,.44), color, skin)
        perimeter = []
        for x,z in outline:
            depth = (.025 + .04*abs(x) + .035*max(z,0))*size
            p = Vector((x*size, depth, z*size))
            perimeter.append(self.vertex(center+rotation@p,
                             ((x+.65)/1.3,(z+.5)/1.15), color, skin))
        for i in range(len(perimeter)):
            # Viewed from −Y, this winding faces towards the camera.
            self.faces.append((first,perimeter[i],perimeter[(i+1)%len(perimeter)]))

    def tube(self, points, radius, color, branch=None, fractions=None, sides=3):
        indices = []
        count = len(points)
        for i, p in enumerate(points):
            t = i/(count-1)
            direction = points[min(i+1,count-1)]-points[max(0,i-1)]
            direction.normalize()
            side = direction.cross(Vector((0,1,0)))
            if side.length < .001:
                side = Vector((1,0,0))
            side.normalize()
            up = direction.cross(side).normalized()
            r = radius*(1-.84*t)
            skin = weights(branch, fractions[i] if fractions else t)
            ring = []
            for j in range(sides):
                a = TAU*j/sides
                co = p + r*(side*math.cos(a)+up*math.sin(a))
                ring.append(self.vertex(co,(j/sides,t),color,skin))
            indices.append(ring)
        for a,b in zip(indices,indices[1:]):
            for j in range(sides):
                nj = (j+1)%sides
                self.faces.append((a[j],b[j],b[nj],a[nj]))

    def object(self, name, target_collection, material):
        mesh = bpy.data.meshes.new(name+' geometry')
        mesh.from_pydata(self.verts, [], self.faces)
        mesh.materials.append(material)
        mesh.update()
        uv = mesh.uv_layers.new(name='Leaf UV')
        if material == LEAF_MAT:
            color = mesh.color_attributes.new(name='Leaf variation', type='BYTE_COLOR', domain='POINT')
            for i,value in enumerate(self.colors):
                color.data[i].color = value
        for polygon in mesh.polygons:
            polygon.use_smooth = True
            for loop in polygon.loop_indices:
                uv.data[loop].uv = self.uvs[mesh.loops[loop].vertex_index]
        obj = bpy.data.objects.new(name, mesh)
        target_collection.objects.link(obj)
        groups = {}
        for i, influences in enumerate(self.weights):
            for bone_name, influence in influences:
                if influence < .0001:
                    continue
                if bone_name not in groups:
                    groups[bone_name] = obj.vertex_groups.new(name=bone_name)
                groups[bone_name].add([i], influence, 'REPLACE')
        modifier = obj.modifiers.new('Wind deformation', 'ARMATURE')
        modifier.object = rig
        obj.parent = rig
        return obj

def leaf_rotation(facing_randomness=.8):
    # All leaves have independent 3D orientation, but enough front-facing
    # surfaces remain visible for a naturally dense photographed silhouette.
    from mathutils import Euler
    return Euler((RNG.uniform(-.9,.9)*facing_randomness,
                  RNG.uniform(-math.pi,math.pi),
                  RNG.uniform(-.95,.95)*facing_randomness), 'XYZ').to_quaternion()

def leaf_color():
    # Vertex tint modulates the photographic/procedural albedo texture.
    # New lighter leaves and old dark leaves are mixed through each branch.
    if ALBEDO_PATH.exists():
        # Exactly three calls retain the geometry random stream. Neutral
        # warm/cool shade variation lets the muted scan supply foliage color.
        value = RNG.uniform(.60,1.00)
        return (value*RNG.uniform(.98,1.08), value*.98,
                value*RNG.uniform(.95,1.07))
    h = RNG.uniform(.25,.41)
    return (.10+h*.26, .18+h*.60, .025+h*.10)

leaf_objects = []
root_objects = []
canopy = MeshBuilder()
# Densely layered green top, with irregular growth above its hanging edge.
for i in range(3000):
    x = RNG.uniform(-2.23,2.23)
    y = RNG.uniform(-.14,.20)
    upper = .14 + .09*math.sin(x*3.5)+.045*math.sin(x*9.0)
    z = upper - RNG.random()**1.25*.49
    size = RNG.uniform(.060,.123)
    canopy.leaf(Vector((x,y,z)),size,leaf_rotation(1.0),leaf_color())
leaf_objects.append(canopy.object('Dense uneven canopy • 3000 cupped leaves',CANOPY,LEAF_MAT))

for index, (x,length,width,count,depth,bend) in enumerate(BRANCHES):
    leaves = MeshBuilder()
    original_count = {0:120,1:180,16:150,17:95}.get(index,count)
    continuation_state = None
    for i in range(count):
        # Additional edge leaves use a separate deterministic stream. Keeping
        # the old stream intact preserves every central leaf's placement.
        if i == original_count:
            continuation_state = RNG.getstate()
            RNG.seed(114297+index)
        # Top-heavy distribution creates dense curtains with a narrowing tip.
        t = RNG.random()**1.48
        if index == 10:
            t = RNG.random()**1.67
        center = path_point(index,t)
        spread = width*(.24+.76*(1-t)**.58)
        lateral = RNG.gauss(0,.45)
        if index in (0,1,16,17):
            # Retain a loose natural silhouette, but remove the rare Gaussian
            # outlier that would leave the orthographic card view in wind.
            lateral = max(-1.1,min(1.1,lateral))
        center.x += lateral*spread
        center.y += RNG.uniform(-.10,.10)*(1-.6*t)
        center.z += RNG.uniform(-.045,.045)
        size = RNG.uniform(.058,.105)*(1-.20*t)
        leaves.leaf(center,size,leaf_rotation(.92),leaf_color(),index,t)
    if continuation_state is not None:
        RNG.setstate(continuation_state)
    # Several slender structural stems inside each hanging leafy cluster.
    stems = MeshBuilder()
    for stem_index in range(3):
        offset = RNG.uniform(-width*.4,width*.4)
        stem_length = RNG.uniform(.66,1.0)
        points=[]
        fractions=[]
        for k in range(20):
            t = k/19*stem_length
            p = path_point(index,t)
            p.x += offset*(1-.7*t)+math.sin(t*15+stem_index)*.015
            p.y += .02
            points.append(p)
            fractions.append(t)
        stems.tube(points,.0052,(.2,.2,.13),index,fractions,sides=4)
    leaf_objects.append(leaves.object(f'Leaf curtain {index+1:02d}',TRAILS,LEAF_MAT))
    root_objects.append(stems.object(f'Trailing stems {index+1:02d}',TRAILS,ROOT_MAT))

# The reference has a visible fine grey/brown root veil behind the greenery,
# not only leaf strands. Their independent lengths keep the bottom irregular.
roots = MeshBuilder()
for i in range(820):
    x = RNG.uniform(-2.16,2.16)
    near = min(range(len(BRANCHES)),key=lambda j:abs(BRANCHES[j][0]-x))
    parent_length = BRANCHES[near][1]
    length = RNG.uniform(.38,2.55)
    length *= (.68+.32*math.exp(-(x+.25)**2/1.3))
    if i%11 == 0:
        length *= 1.18
    if abs(x)>1.75 and i%13 == 0:
        length = 3.7 + 1.1*(.5+.5*math.sin(i*.77))
    y = RNG.uniform(.015,.19)
    start_z = RNG.uniform(-.12,.12)
    sway = RNG.uniform(.018,.065)
    phase = RNG.random()*TAU
    points=[]
    fractions=[]
    for j in range(15):
        t=j/14
        points.append(Vector((x+math.sin(t*5+phase)*sway*t,
                              y+math.sin(t*7+phase)*.02*t,
                              start_z-length*t)))
        fractions.append(min(1,length*t/parent_length))
    roots.tube(points,RNG.uniform(.0015,.0027),(.2,.19,.14),near,fractions)
root_objects.append(roots.object('Fine aerial root veil • 820 strands',ROOTS,ROOT_MAT))

# Twenty fps, twelve seconds, seamless gentle wind. Bone roots stay anchored.
scene=bpy.context.scene
scene.render.fps=20
scene.frame_start=1
scene.frame_end=241
for branch_index, names in enumerate(bone_names[1:]):
    phase=branch_index*.91
    for segment,name in enumerate(names):
        bone=rig.pose.bones[name]
        bone.rotation_mode='XYZ'
        for frame in range(1,242,10):
            t=(frame-1)/240*TAU
            strength=(.007+.005*segment)
            bone.rotation_euler=(math.sin(t+phase+segment*.4)*strength*.65,
                                 math.sin(t+phase*.7+segment*.35)*strength,
                                 math.sin(t+phase+segment*.55)*strength*.72)
            bone.keyframe_insert('rotation_euler',frame=frame,group=name)
if rig.animation_data and rig.animation_data.action:
    rig.animation_data.action.name='IvyBreeze'
scene.frame_set(1)

# White studio inspection render, matching the reference camera direction.
world=bpy.data.worlds.new('Soft white studio')
world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(1,1,1,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.6
# A white photographic backdrop must not be dulled by AgX's highlight rolloff.
# Separate camera-only radiance from the light used to shade the plant.
world_nodes=world.node_tree.nodes
world_links=world.node_tree.links
camera_white=world_nodes.new('ShaderNodeBackground')
camera_white.inputs['Color'].default_value=(1,1,1,1)
camera_white.inputs['Strength'].default_value=16
light_path=world_nodes.new('ShaderNodeLightPath')
background_mix=world_nodes.new('ShaderNodeMixShader')
world_links.new(light_path.outputs['Is Camera Ray'],background_mix.inputs[0])
world_links.new(world_nodes['Background'].outputs[0],background_mix.inputs[1])
world_links.new(camera_white.outputs[0],background_mix.inputs[2])
world_links.new(background_mix.outputs[0],world_nodes['World Output'].inputs['Surface'])
scene.world=world
def area(name,location,power,size):
    light=bpy.data.lights.new(name,'AREA')
    light.energy=power
    light.shape='DISK'
    light.size=size
    obj=bpy.data.objects.new(name,light)
    STUDIO.objects.link(obj)
    obj.location=location
    obj.rotation_euler=(Vector((0,0,-1.5))-obj.location).to_track_quat('-Z','Y').to_euler()
area('Broad daylight key',(-3,-5,4),650,5)
area('Soft front fill',(4,-3,0),300,4)
area('Canopy rim',(0,3,3),500,4)
camera_data=bpy.data.cameras.new('Reference front orthographic')
camera=bpy.data.objects.new('Reference front orthographic',camera_data)
STUDIO.objects.link(camera)
camera.location=(0,-12,-2.60)
camera.rotation_euler=(Vector((0,0,-2.60))-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.type='ORTHO'
camera_data.ortho_scale=6.65
scene.camera=camera
scene.render.engine='CYCLES'
scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.render.resolution_x=1280
scene.render.resolution_y=1464
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.render.filepath=str(OUT_RENDER)
scene['asset_description']='Hanging ivy with uneven leafy canopy, long asymmetric curtains and fine aerial roots. Real leaf surfaces, packed textures, independently weighted branches.'
scene['reference_note']='Created procedurally from the supplied hanging-plant image; original author geometry was not downloaded or copied.'
scene['web_export']='Two merged skinned meshes; glTF Y-up; IvyBreeze animation.'
for directory in (OUT_BLEND.parent,OUT_GLB.parent,OUT_RENDER.parent):
    directory.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))

# Preserve editable per-branch objects in .blend; export joined duplicates so
# the website needs only two draw calls, one foliage and one root material.
export_objects=[]
for objects,label in ((leaf_objects,'Ivy foliage'),(root_objects,'Ivy roots and stems')):
    bpy.ops.object.select_all(action='DESELECT')
    copies=[]
    for original in objects:
        duplicate=original.copy()
        duplicate.data=original.data.copy()
        scene.collection.objects.link(duplicate)
        duplicate.select_set(True)
        copies.append(duplicate)
    bpy.context.view_layer.objects.active=copies[0]
    bpy.ops.object.join()
    merged=bpy.context.object
    merged.name=label
    export_objects.append(merged)
bpy.ops.object.select_all(action='DESELECT')
for obj in export_objects+[rig]:
    obj.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(OUT_GLB),export_format='GLB',use_selection=True,
    export_animations=True,export_frame_range=True,export_frame_step=2,
    export_anim_slide_to_zero=True,
    export_skins=True,export_yup=True,export_materials='EXPORT',
    export_cameras=False,export_lights=False,export_extras=True,
    export_vertex_color='NAME',export_vertex_color_name='Leaf variation',
    export_all_vertex_colors=False)
for obj in export_objects:
    mesh=obj.data
    bpy.data.objects.remove(obj,do_unlink=True)
    bpy.data.meshes.remove(mesh)

triangles=sum(sum(len(poly.vertices)-2 for poly in obj.data.polygons) for obj in leaf_objects+root_objects)
stats={'leaf_count':3000+sum(spec[3] for spec in BRANCHES),
       'aerial_roots':820,'triangles':triangles,'bones':len(rig.data.bones),
       'animation':'IvyBreeze','duration_seconds':12,
       'blend_bytes':OUT_BLEND.stat().st_size,'glb_bytes':OUT_GLB.stat().st_size,
       'texture_images':[image.name for image in bpy.data.images if image.packed_file]}
print('IVY_STATS '+json.dumps(stats))
if '--no-render' not in __import__('sys').argv:
    bpy.ops.render.render(write_still=True)
print('IVY_DONE '+str(OUT_GLB))
