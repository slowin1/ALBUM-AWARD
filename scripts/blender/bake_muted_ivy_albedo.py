"""Bake a restrained forest/olive variant of the existing photographic albedo.

Run in Blender:
  blender -b --python scripts/blender/bake_muted_ivy_albedo.py

This is a material colour adjustment, not a new texture composition: the source
is untouched, and a true square 0..1 UV plane preserves every existing vein.
"""
from pathlib import Path
import colorsys
import json
import math

import bpy

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'assets/textures/ivy-leaf-albedo.png'
TARGET = ROOT / 'assets/textures/ivy-leaf-albedo-muted.png'
SIZE = 1024
SATURATION = .62
VALUE = .92

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 1
scene.render.bake.margin = 0
scene.render.bake.use_clear = True
scene.view_settings.view_transform = 'Standard'
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0))
plane = bpy.context.object
material = bpy.data.materials.new('Ivy muted forest albedo bake')
material.use_nodes = True
plane.data.materials.append(material)
nodes = material.node_tree.nodes
links = material.node_tree.links
nodes.clear()
output = nodes.new('ShaderNodeOutputMaterial')
source = nodes.new('ShaderNodeTexImage')
source.image = bpy.data.images.load(str(SOURCE))
source.image.colorspace_settings.name = 'sRGB'
source.interpolation = 'Linear'
colour = nodes.new('ShaderNodeHueSaturation')
colour.inputs['Hue'].default_value = .5
colour.inputs['Saturation'].default_value = SATURATION
colour.inputs['Value'].default_value = VALUE
colour.inputs['Fac'].default_value = 1
links.new(source.outputs['Color'], colour.inputs['Color'])
emission = nodes.new('ShaderNodeEmission')
emission.inputs['Strength'].default_value = 1
links.new(colour.outputs['Color'], emission.inputs['Color'])
links.new(emission.outputs['Emission'], output.inputs['Surface'])
image = bpy.data.images.new(TARGET.name, width=SIZE, height=SIZE,
                            alpha=False, float_buffer=False, is_data=False)
image.colorspace_settings.name = 'sRGB'
image.file_format = 'PNG'
image.filepath_raw = str(TARGET)
target = nodes.new('ShaderNodeTexImage')
target.image = image
nodes.active = target
target.select = True
bpy.ops.object.bake(type='EMIT')
image.save()


def image_stats(path):
    # Non-Color reload exposes the stored RGB values without a display look;
    # sRGB-to-linear below is explicit for consistent luminance statistics.
    image = bpy.data.images.load(str(path), check_existing=False)
    image.colorspace_settings.name = 'Non-Color'
    assert tuple(image.size) == (SIZE, SIZE)
    pixels = list(image.pixels[:])
    assert all(math.isfinite(v) for v in pixels)
    rgb = [pixels[i:i + 3] for i in range(0, len(pixels), 4)]
    mean = [sum(c[k] for c in rgb) / len(rgb) for k in range(3)]
    hsv = [colorsys.rgb_to_hsv(*c) for c in rgb]
    def linear(c):
        return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
    luma = [.2126 * linear(c[0]) + .7152 * linear(c[1]) + .0722 * linear(c[2]) for c in rgb]
    luma_mean = sum(luma) / len(luma)
    luma_sd = math.sqrt(sum((v-luma_mean)**2 for v in luma) / len(luma))
    return {'size': list(image.size), 'mean_stored_rgb': [round(v, 6) for v in mean],
            'mean_stored_hsv_saturation': round(sum(c[1] for c in hsv) / len(hsv), 6),
            'mean_linear_luminance': round(luma_mean, 6),
            'linear_luminance_sd': round(luma_sd, 6)}


report = {'parameters': {'hue': .5, 'saturation': SATURATION, 'value': VALUE,
                         'bake': 'Cycles EMIT, 1:1 UV, sRGB PNG'},
          'source': image_stats(SOURCE), 'muted': image_stats(TARGET),
          'bytes': TARGET.stat().st_size}
assert report['muted']['mean_stored_hsv_saturation'] < report['source']['mean_stored_hsv_saturation']
assert report['muted']['linear_luminance_sd'] > report['source']['linear_luminance_sd'] * .75
print('IVY_MUTED_ALBEDO ' + json.dumps(report))
