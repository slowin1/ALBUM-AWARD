// Adapted from the fog code supplied by the user (Shadertoy mainImage).
// The texture-sliced noise, five octaves and cloud field are retained.
// Camera, ground raymarch, sunlight and final gamma are supplied by our scene.
#define MAX_FOG_STEPS 24
#define FOG_LIGHT_COUNT 12
// __SCREEN_LIGHT__
uniform sampler2D uDepth;
uniform sampler2D uScene;
uniform sampler2D uNoise;
uniform mat4 uInverseProjection;
uniform mat4 uCameraWorld;
uniform float uTime;
uniform float uDensity;
uniform float uNoiseScale;
uniform int uFogSteps;
// All album centers and their average linear artwork colors, prepared on the CPU.
uniform vec3 uFogLightPositions[FOG_LIGHT_COUNT];
uniform vec3 uFogLightColors[FOG_LIGHT_COUNT];
// World center of the focused album, including its small hover displacement.
uniform vec3 uActiveScreen;
varying vec2 vUv;

float noise(vec3 x) {
 float z = x.z * 64.;
 vec2 offz = vec2(.317, .123);
 vec2 uv1 = x.xy + offz * floor(z);
 vec2 uv2 = uv1 + offz;
 return mix(textureLod(uNoise, uv1, 0.).x, textureLod(uNoise, uv2, 0.).x, fract(z)) - .5;
}
float noises(vec3 p) {
 float a = 0.;
 for (int octave = 1; octave < 6; octave++) {
  float i = float(octave);
  a += noise(p) / i;
  p = p * 2. + vec3(0., a * .001 / i, a * .0001 / i);
 }
 return a;
}
float base(vec3 p) { return noise(p * .00002) * 1200.; }
float clouds(vec3 p) {
 float b = base(p);
 // Original abs(p.y) could divide by zero on the ground.
 p.y += b * .5 / max(abs(p.y), 1.) + 100.;
 return noises(vec3(p.x * .3 + uTime * 30., p.y, p.z) * .00002)
      - max(p.y, 0.) * .00009;
}
vec3 worldAt(vec2 uv, float depth) {
 vec4 p = uInverseProjection * vec4(uv * 2. - 1., depth * 2. - 1., 1.);
 return (uCameraWorld * vec4(p.xyz / p.w, 1.)).xyz;
}
vec3 screenLight(vec3 p) {
 vec3 light = vec3(.07, .075, .085);
 for (int i = 0; i < FOG_LIGHT_COUNT; i++) {
  light += screenFogIrradiance(uFogLightPositions[i], uFogLightColors[i], p) * .35;
 }
 return light;
}
void main() {
 if (uDensity <= 0. || texture2D(uScene, vUv).a < .5) { gl_FragColor = vec4(0.); return; }
 vec3 origin = uCameraWorld[3].xyz;
 vec3 direction = normalize(worldAt(vUv, 1.) - origin);
 float depth = texture2D(uDepth, vUv).x;
 // Stop at the existing dune/card surface, not a separate Shadertoy ground.
 float limit = depth < .999999 ? min(length(worldAt(vUv, depth) - origin), 38.) : 38.;
 int stepCount = min(max(uFogSteps, 12), MAX_FOG_STEPS);
 float stepSize = limit / float(stepCount);
 int lightStride = max(stepCount / 3, 1);
 // Keep samples close to the interval midpoint. A full-step random offset also
 // shifted the sparse light samples by up to 1.2 world units on background rays,
 // which appeared as gray pixel grain in the half-resolution fog target.
 float randomOffset = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
 float jitter = .5 + (randomOffset - .5) * .12;
 vec3 scattering = vec3(0.);
 float transmission = 1.;
 vec3 focusRay=origin-uActiveScreen;
 float focusRayLengthSquared=max(dot(focusRay,focusRay),.001);
 float wheelRadius=length(uActiveScreen.xz);
 vec2 focusAxis=uActiveScreen.xz/max(wheelRadius,.001);
 vec2 focusTangent=vec2(-focusAxis.y,focusAxis.x);
 // Three lighting evaluations per occupied ray are enough for diffuse colors.
 vec3 light = vec3(.07,.075,.085);
 int nextLightSample = 0;
 for (int i = 0; i < MAX_FOG_STEPS; i++) {
  if (i >= stepCount) break;
  float distanceAlongRay = (float(i) + jitter) * stepSize;
  vec3 p = origin + direction * distanceAlongRay;
  if (p.y > 24.61) {
   if (direction.y >= 0.) break;
   continue;
  }
  float altitude = exp(-max(p.y - .4, 0.) * .24);
  float cloud = clouds(p * uNoiseScale);
  // Broad moving cells break the field into slow wisps. The original five-octave
  // cloud field still supplies its finer structure, with no extra march loop.
  vec3 drift=vec3(uTime*.00055,0.,-uTime*.0003);
  float broad=noise(p*vec3(.0011,.0018,.0014)+drift);
  float wisp=smoothstep(-.24,.24,broad+cloud*.3);
  float structure=smoothstep(-.14,.36,cloud+broad*.32);
  float groundLayer=exp(-max(p.y+.15,0.)*.95);
  float radialSquared=dot(p.xz,p.xz);
  float ringDistance=(sqrt(radialSquared)-wheelRadius-1.)/3.;
  float ringBand=exp(-ringDistance*ringDistance);
  // sin(6*angle)^2 via sin(3*x): identical bands without atan/sin per step.
  float twiceAngle=2.*dot(p.xz,focusAxis)*dot(p.xz,focusTangent)
                  /max(radialSquared,.001);
  float gapWave=twiceAngle*(3.-4.*twiceAngle*twiceAngle);
  float betweenScreens=gapWave*gapWave;
  // Dust gathers near the sand and in the gaps, leaving the display fronts crisp.
  float bank=1.+groundLayer*(.35+ringBand*betweenScreens*.8);
  vec3 fromFocus=p-uActiveScreen;
  float alongFocus=clamp(dot(fromFocus,focusRay)/focusRayLengthSquared,0.,1.);
  vec3 toCorridor=fromFocus-focusRay*alongFocus;
  float focusClearance=exp(-dot(toCorridor,toCorridor)/(uScreenSize*uScreenSize*.46));
  float clarity=1.-focusClearance*.58;
  float density=structure*mix(.3,1.35,wisp)*altitude*bank*clarity*uDensity*.65;
  if (density < .00005) continue;
  if (i >= nextLightSample) {
   light = screenLight(p);
   nextLightSample = i + lightStride;
  }
  float opacity = 1. - exp(-density * stepSize);
  scattering += transmission * opacity * light;
  transmission *= 1. - opacity;
  if (transmission < .025) break;
 }
 // Linear premultiplied light; conversion happens once in fog-composite.
 gl_FragColor = vec4(scattering, 1. - transmission);
}
