"""Render the real editable ivy asset as the web card's transparent fallback.

Run after create_hanging_ivy.py:
  blender -b --python scripts/blender/render_ivy_fallback.py
The .blend is loaded and never overwritten. The framing exactly matches the
portrait transparent WebGL layer: width 5.5, top +0.5, aspect 0.875.
"""
from pathlib import Path
import json
import math

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'assets/models/hanging-ivy.blend'
TARGET = ROOT / 'public/textures/hanging-ivy-fallback.png'
WIDTH = 5.5
ASPECT = .875
HEIGHT = WIDTH / ASPECT
TOP = .5
CENTER = TOP - HEIGHT / 2

bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
scene = bpy.context.scene
scene.frame_set(1)
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = 875
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.pixel_aspect_x = 1
scene.render.pixel_aspect_y = 1
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'
scene.render.image_settings.compression = 90

# Existing .blend studio objects are soft lights and a camera. Hide any later
# floor or backdrop additions in that collection without touching model leaves.
studio = bpy.data.collections.get('Studio')
if studio:
    for obj in studio.all_objects:
        if obj.type == 'MESH':
            obj.hide_render = True

camera = scene.camera
if camera is None:
    data = bpy.data.cameras.new('Ivy fallback orthographic')
    camera = bpy.data.objects.new(data.name, data)
    scene.collection.objects.link(camera)
    scene.camera = camera
camera.location = (0, -12, CENTER)
camera.rotation_euler = (Vector((0, 0, CENTER)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.shift_x = 0
camera.data.shift_y = 0
camera.data.clip_start = .1
camera.data.clip_end = 100
camera.data.ortho_scale = 1


def frame_size():
    frame = camera.data.view_frame(scene=scene)
    return (max(p.x for p in frame) - min(p.x for p in frame),
            max(p.y for p in frame) - min(p.y for p in frame))


view_width, _ = frame_size()
camera.data.ortho_scale *= WIDTH / view_width
view_width, view_height = frame_size()
assert abs(view_width - WIDTH) < 1e-5, view_width
assert abs(view_height - HEIGHT) < 1e-5, view_height
TARGET.parent.mkdir(parents=True, exist_ok=True)
scene.render.filepath = str(TARGET)
bpy.ops.render.render(write_still=True)

image = bpy.data.images.load(str(TARGET), check_existing=False)
assert tuple(image.size) == (875, 1000), image.size[:]
pixels = list(image.pixels[:])
assert all(math.isfinite(v) for v in pixels)
alpha = pixels[3::4]
assert min(alpha) == 0 and max(alpha) > .99, 'Expected transparent film and opaque leaves'
assert sum(a == 0 for a in alpha) > len(alpha) * .25, 'Fallback must preserve clear card area'
report = {'path': str(TARGET), 'size': list(image.size),
          'bytes': TARGET.stat().st_size, 'alpha': [min(alpha), max(alpha)],
          'transparent_pixels': sum(a == 0 for a in alpha),
          'frame': {'width': view_width, 'height': view_height,
                    'top': TOP, 'bottom': TOP - HEIGHT}}
print('IVY_FALLBACK ' + json.dumps(report))
