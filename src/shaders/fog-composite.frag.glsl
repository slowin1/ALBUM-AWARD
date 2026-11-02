// __POINTER_WAKE_COUNT__
uniform sampler2D uScene;
uniform sampler2D uFog;
uniform sampler2D uDepth;
uniform sampler2D uNoise;
uniform vec2 uFogSize;
uniform mat4 uInverseProjection;
uniform vec2 uViewportSize;
uniform bool uFogEnabled;
uniform float uDistortionTime;
uniform float uDistortionStrength;
uniform float uGlitchStrength;
uniform float uGlitchSeed;
uniform float uGlitchPhase;
uniform float uGlitchJitter;
uniform float uGrainStrength;
uniform float uGrainFrame;
uniform vec4 uPointerWake[POINTER_WAKE_COUNT];
uniform float uPointerStrength;
varying vec2 vUv;

// Small arithmetic hash for frame offsets and the intermittent signal dropouts.
vec3 signalHash(vec3 value) {
 vec3 p = fract(value * vec3(.1031, .103, .0973));
 p += dot(p, p.yxz + 33.33);
 return fract((p.xxy + p.yxx) * p.zyx);
}

vec2 refractedUv(vec2 uv, out vec2 glitchSignal) {
 vec2 offset = vec2(0.);
 glitchSignal = vec2(0.);
 if (uDistortionStrength > 0.) {
  vec2 p = vec2(uv.x * uViewportSize.x / uViewportSize.y, uv.y);
  float time = uDistortionTime;
  vec2 wave = vec2(
   sin(p.y * 14. + time * .75 + sin(p.x * 7. - time * .35))
    + .35 * sin(p.y * 31. - time * 1.1 + p.x * 6.),
   .4 * sin(p.x * 11. - time * .55 + p.y * 8.)
  );
  offset = wave * uDistortionStrength;
 }
 if (uPointerStrength > 0.) {
  for (int i = 0; i < POINTER_WAKE_COUNT; i++) {
   vec4 wake = uPointerWake[i];
   if (wake.z <= .001) continue;
   vec2 delta = (uv - wake.xy) * uViewportSize;
   float age = clamp(wake.w, 0., 1.);
   float radius = 105. + age * 70.;
   float squaredDistance = dot(delta, delta);
   if (squaredDistance >= radius * radius) continue;
   float r2 = squaredDistance / (radius * radius);
   float distance = sqrt(squaredDistance);
   float r = distance / radius;
   float falloff = (1. - r2) * (1. - r2);
   float weight = .7 / (1. + float(i) * .75);
   float ripple = sin(r * 10. - age * 6.3);
   offset += delta / max(distance, 1.) * (ripple * .75 + .25) * falloff * wake.z * uPointerStrength * weight;
  }
 }
 if (uGlitchStrength > 0.) {
  // Broken fragments vary in height and thickness across each tear.
  for (int i = 0; i < 3; i++) {
   float layer = float(i);
   vec3 random = signalHash(vec3(uGlitchSeed * 37. + layer * 13.7));
   if (i > 0 && random.z < .25 + layer * .15) continue;
   float center = .14 + random.x * .72;
   float width = i == 0 ? 8. + random.y * 22. : 1.5 + random.y * 3.;
   float drift = uGlitchJitter * (i == 0 ? 2. : 4.);
   vec2 noiseUv = vec2(uv.x * (7. + random.y * 11.), uGlitchSeed * 97. + layer * 17.) / 128.;
   float roughEdge = texture2D(uNoise, noiseUv).r;
   float thickness = texture2D(uNoise, noiseUv + vec2(.17, .31)).r;
   float tornCenter = (roughEdge - .5) * (i == 0 ? 42. : 16.);
   float localWidth = width * mix(.25, 1.5, thickness);
   float distance = abs((uv.y - center) * uViewportSize.y - drift - tornCenter);
   float band = 1. - smoothstep(localWidth - .6, localWidth + 1.2, distance);
   if (band <= 0.) continue;
   float packet = floor((uv.x * uViewportSize.x + uGlitchJitter * 6.) / (28. + random.y * 57.));
   vec3 damage = signalHash(vec3(packet, uGlitchSeed * 73. + layer, floor(uGlitchPhase * 4.)));
   band *= smoothstep(.18, .36, damage.x + roughEdge * .15);
   if (band <= 0.) continue;
   float direction = random.z < .5 ? -1. : 1.;
   float shift = (i == 0 ? 18. + random.y * 16. : 6. + random.y * 14.) * direction;
   offset.x += (shift * (.8 + .2 * abs(uGlitchJitter)) + uGlitchJitter * 4. + (damage.y - .5) * 13.) * band * uGlitchStrength;
   // Hold a few adjacent rows together, as if a short packet of scanlines repeats.
   float rowSize = 2. + floor(random.y * 4.);
   float heldRow = (floor(uv.y * uViewportSize.y / rowSize) + .5) * rowSize;
   offset.y += (heldRow - uv.y * uViewportSize.y) * band * uGlitchStrength * .65;
   float dropout = smoothstep(.55, .8, damage.z);
   glitchSignal = max(glitchSignal, vec2(band, band * dropout) * uGlitchStrength);
  }
 }
 // CSS pixels keep the shimmer consistent across render-quality and DPR changes.
 vec2 border = smoothstep(vec2(0.), vec2(.12), min(uv, 1. - uv));
 glitchSignal *= border.x * border.y;
 vec2 displacement = offset / uViewportSize * border.x * border.y;
 // Overlapping tears on narrow screens must not smear the outermost texels.
 vec2 margin = min(uv, 1. - uv) * .8;
 return uv + clamp(displacement, -margin, margin);
}

float filmGrain(vec2 uv) {
 vec2 pixels = uv * uViewportSize;
 vec3 frame = signalHash(vec3(uGrainFrame + 7., uGrainFrame + 91., uGrainFrame + 313.));
 // Reuse the atmosphere's linear noise: rounded grains rather than square cells.
 float fine = texture2D(uNoise, pixels / (128. * 1.25) + frame.xy).r - .5;
 vec2 rotated = mat2(.8, -.6, .6, .8) * pixels;
 float soft = texture2D(uNoise, rotated / (128. * 2.4) + frame.yz + vec2(.31, .67)).r - .5;
 return (fine * .65 + soft * .35) * 1.8;
}

float viewDepth(vec2 uv) {
 float depth = texture2D(uDepth, uv).x;
 vec4 p = uInverseProjection * vec4(uv * 2. - 1., depth * 2. - 1., 1.);
 return -p.z / p.w;
}
void main() {
 // Warp color, depth and atmosphere together so silhouettes stay aligned.
 vec2 glitchSignal;
 vec2 uv = refractedUv(vUv, glitchSignal);
 vec4 scene = texture2D(uScene, uv);
 // This alpha mask belongs only to the fully black wheel. Black remains black
 // through tone mapping, so skip the depth reconstruction and upscale entirely.
 if (scene.a < .5) { gl_FragColor = vec4(0.,0.,0.,1.); return; }
 vec3 color = scene.rgb;
 if (uFogEnabled) {
 // Depth-aware four-tap upscale keeps half-resolution fog off foreground edges.
 vec2 pixel = uv * uFogSize - .5;
 vec2 cell = floor(pixel);
 vec2 fraction = fract(pixel);
 float centerDepth = viewDepth(uv);
 vec4 fog = vec4(0.);
 vec4 nearestFog = vec4(0.);
 float nearestDifference = 1.e10;
 float nearestDepth = centerDepth;
 float total = 0.;
 for (int y = 0; y < 2; y++) {
  for (int x = 0; x < 2; x++) {
   vec2 offset = vec2(float(x), float(y));
   vec2 sampleUv = (cell + offset + .5) / uFogSize;
   vec2 weight2 = mix(1. - fraction, fraction, offset);
   float sampleDepth = viewDepth(sampleUv);
   float difference = abs(sampleDepth - centerDepth);
   vec4 sampleFog = texture2D(uFog, sampleUv);
   if (difference < nearestDifference) {
    nearestDifference = difference;
    nearestDepth = sampleDepth;
    nearestFog = sampleFog;
   }
   float agreement = exp(-difference * 12.);
   float weight = weight2.x * weight2.y * agreement;
   fog += sampleFog * weight;
   total += weight;
  }
 }
 // Thin silhouettes can miss all half-resolution samples. Retain soft atmosphere,
 // reducing a deeper sample's opacity instead of producing a completely clear outline.
 fog = total > .0001 ? fog / total : nearestFog * min(1., centerDepth / max(nearestDepth, .001));
 color = scene.rgb * (1. - fog.a) + fog.rgb;
 }
 // Signal loss remains local to the damaged fragments.
 color *= max(0., 1. - glitchSignal.x * .045 - glitchSignal.y * .14);
 gl_FragColor = vec4(color, 1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 // The damaged image itself turns black and white, with ragged partial coverage.
 float monochrome = dot(gl_FragColor.rgb, vec3(.2126, .7152, .0722));
 vec3 damaged = vec3(clamp((monochrome - .04) * 1.12, 0., 1.));
 gl_FragColor.rgb = mix(gl_FragColor.rgb, damaged, smoothstep(.025, .3, glitchSignal.x));
 // Visible film grain persists between glitches and holds for two cinema frames.
 if (uGrainStrength > 0.) {
  float luminance = clamp(dot(gl_FragColor.rgb, vec3(.2126, .7152, .0722)), 0., 1.);
  float response = smoothstep(0., .018, luminance) * (.68 + .32 * (1. - abs(luminance * 2. - 1.)));
  gl_FragColor.rgb = clamp(gl_FragColor.rgb + vec3(filmGrain(vUv) * uGrainStrength * response), 0., 1.);
 }
}
