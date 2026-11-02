// Four-point area-light integration for sand and a compact volumetric approximation.
// Source radiance comes from the same linear artwork samples as the visible cover.
#define SCREEN_COUNT 12
#define SCREEN_SAMPLES 48
uniform vec3 uLightPositions[SCREEN_COUNT];
uniform vec3 uScreenSamples[SCREEN_SAMPLES];
uniform float uLightPower;
uniform float uScreenSize;

vec3 screenIrradiance(int index, vec3 p, vec3 receiverNormal, bool surface) {
 vec3 center = uLightPositions[index];
 vec3 outward = normalize(vec3(center.x, 0., center.z));
 float frontDistance = dot(p - center, outward);
 if (frontDistance <= 0.) return vec3(0.);
 vec3 tangent = vec3(outward.z, 0., -outward.x);
 vec3 light = vec3(0.);
 float area = uScreenSize * uScreenSize;
 // Finite emitters have no point-source singularity. Smooth the sparse quadrature
 // footprint near the screen to keep four individual light spots from appearing.
 float softening = area * .035;
 for (int sampleIndex = 0; sampleIndex < 4; sampleIndex++) {
  vec2 grid = vec2(float(sampleIndex - (sampleIndex / 2) * 2), float(sampleIndex / 2));
  vec2 local = (grid * 2. - 1.) * (uScreenSize * .288675135);
  vec3 source = center + tangent * local.x + vec3(0., local.y, 0.) + outward * .012;
  vec3 toLight = source - p;
  float distanceSquared = max(dot(toLight, toLight), .0001);
  vec3 direction = toLight * inversesqrt(distanceSquared);
  float emitterCosine = max(dot(outward, -direction), 0.);
  float receiverCosine = surface ? max(dot(receiverNormal, direction), 0.) : 1.;
  light += uScreenSamples[index * 4 + sampleIndex] * emitterCosine * receiverCosine
         / (distanceSquared + softening);
 }
 // Integrate emitter area; the diffuse receiver's 1/pi is applied by terrain.
 return light * (area * .25) * uLightPower;
}

// Fog only needs the broad, mixed color of an emitter. Averaging its four artwork
// samples on the CPU avoids repeating the surface quadrature throughout the air.
// The finite-area denominator closely matches the original four points while
// keeping the light soft even immediately in front of an album.
vec3 screenFogIrradiance(vec3 center, vec3 radiance, vec3 p) {
 vec3 offset = p - center;
 vec2 outward = center.xz * inversesqrt(max(dot(center.xz, center.xz), .001));
 float frontDistance = dot(offset.xz, outward);
 if (frontDistance <= 0.) return vec3(0.);
 float area = uScreenSize * uScreenSize;
 float inverseDistance = inversesqrt(dot(offset, offset) + area * .2);
 return radiance * (area * frontDistance * inverseDistance * inverseDistance
      * inverseDistance * uLightPower);
}
