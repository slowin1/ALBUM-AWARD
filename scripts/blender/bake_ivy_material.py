"""Bake subtle leaf micro-surface maps from the project's ivy albedo in Blender.

Run with Blender's Python, not system Python:
  blender -b --python scripts/blender/bake_ivy_material.py

The source remains untouched. Tangent normals use glTF/OpenGL +Y convention;
Blender's actual Cycles bump evaluation is baked on a square, unscaled UV plane.
The full albedo image maps to each cupped leaf in create_hanging_ivy.py.
"""
from pathlib import Path
import json
import math

import bpy

ROOT = Path(__file__).resolve().parents[2]
TEXTURES = ROOT / 'assets/textures'
SIZE = 1024

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 1
scene.render.bake.use_clear = True
scene.render.bake.margin = 0
scene.render.bake.normal_space = 'TANGENT'
scene.render.bake.normal_r = 'POS_X'
scene.render.bake.normal_g = 'POS_Y'
scene.render.bake.normal_b = 'POS_Z'

# A generated Blender plane has a true 0..1 square UV and unapplied scale 1.
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0))
plane = bpy.context.object
plane.name = 'Leaf technical bake surface'
material = bpy.data.materials.new('Ivy coherent vein micro-surface')
material.use_nodes = True
plane.data.materials.append(material)
nodes = material.node_tree.nodes
links = material.node_tree.links
nodes.clear()
output = nodes.new('ShaderNodeOutputMaterial')
bsdf = nodes.new('ShaderNodeBsdfPrincipled')
links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
source = nodes.new('ShaderNodeTexImage')
source.image = bpy.data.images.load(str(TEXTURES / 'ivy-leaf-albedo.png'))
source.image.colorspace_settings.name = 'sRGB'
source.interpolation = 'Linear'
gray = nodes.new('ShaderNodeRGBToBW')
links.new(source.outputs['Color'], gray.inputs['Color'])

# Light veins become a shallow raised relief. No unrelated procedural noise
# is added, so normal and albedo details stay registered at all resolutions.
veins = nodes.new('ShaderNodeMapRange')
veins.clamp = True
veins.inputs['From Min'].default_value = 0.06
veins.inputs['From Max'].default_value = 0.34
veins.inputs['To Min'].default_value = 0
veins.inputs['To Max'].default_value = 1
links.new(gray.outputs['Val'], veins.inputs['Value'])
bump = nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 0.32
bump.inputs['Distance'].default_value = 0.002
links.new(veins.outputs['Result'], bump.inputs['Height'])
links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])


def target_image(name):
    image = bpy.data.images.new(name, width=SIZE, height=SIZE, alpha=False,
                                float_buffer=False, is_data=True)
    image.colorspace_settings.name = 'Non-Color'
    image.file_format = 'PNG'
    image.filepath_raw = str(TEXTURES / name)
    node = nodes.new('ShaderNodeTexImage')
    node.image = image
    nodes.active = node
    node.select = True
    return image


normal = target_image('ivy-leaf-normal.png')
bpy.ops.object.bake(type='NORMAL')
normal.save()

# Waxy raised veins are a little smoother than the blade; a narrow range
# prevents sparkling highlights on the small, overlapping real leaf meshes.
roughness = nodes.new('ShaderNodeMapRange')
roughness.clamp = True
roughness.inputs['From Min'].default_value = 0.04
roughness.inputs['From Max'].default_value = 0.38
roughness.inputs['To Min'].default_value = 0.68
roughness.inputs['To Max'].default_value = 0.52
links.new(gray.outputs['Val'], roughness.inputs['Value'])
emission = nodes.new('ShaderNodeEmission')
emission.inputs['Strength'].default_value = 1
links.new(roughness.outputs['Result'], emission.inputs['Color'])
links.new(emission.outputs['Emission'], output.inputs['Surface'])
rough = target_image('ivy-leaf-roughness.png')
bpy.ops.object.bake(type='EMIT')
rough.save()

# Reload final PNGs rather than checking only in-memory float targets.
report = {}
for name in ('ivy-leaf-normal.png', 'ivy-leaf-roughness.png'):
    image = bpy.data.images.load(str(TEXTURES / name), check_existing=False)
    image.colorspace_settings.name = 'Non-Color'
    assert tuple(image.size) == (SIZE, SIZE), (name, image.size[:])
    pixels = list(image.pixels[:])
    assert all(math.isfinite(x) for x in pixels), name
    channels = [pixels[c::4] for c in range(3)]
    report[name] = {'size': list(image.size),
                    'range': [[round(min(c), 6), round(max(c), 6)] for c in channels]}
    if 'normal' in name:
        assert min(channels[2]) > .75, 'Normal must stay in the +Z hemisphere'
        lengths = [math.sqrt((pixels[i]*2-1)**2 + (pixels[i+1]*2-1)**2 +
                             (pixels[i+2]*2-1)**2) for i in range(0, len(pixels), 4)]
        assert min(lengths) > .98 and max(lengths) < 1.02, 'Non-unit tangent normal'
        report[name]['normal_length'] = [round(min(lengths), 6), round(max(lengths), 6)]
    else:
        assert min(channels[0]) >= .50 and max(channels[0]) <= .70
print('IVY_MATERIAL_MAPS ' + json.dumps(report))
