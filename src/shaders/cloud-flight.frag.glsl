/*
  Volumetric moonlit clouds from "Starry night sky with moonlit clouds" by al-ro
  https://www.shadertoy.com/view/3sffzj (MIT licence, see night-common.glsl).
  Uses the pre-baked Perlin-Worley 6x6 atlas + cloud map in uNightTexture,
  two-lobed Henyey-Greenstein phase function, 4-octave multiple scattering
  approximation, Beer-Lambert + powder effect, and Frostbite energy-conserving
  integration. Composited over the full-resolution starry sky and 12 track covers.
*/
#define MAX_PRIMARY_STEPS 56
#define STEPS_LIGHT 8
// __NIGHT_COMMON__
uniform sampler2D uDepth;
uniform sampler2D uScene;
uniform sampler2D uNightTexture;
uniform mat4 uInverseProjection;
uniform mat4 uCameraWorld;
uniform float uTime;
uniform float uDensity;
uniform int uFogSteps;
uniform vec3 uActiveScreen;
varying vec2 vUv;

const float shapeSpeed = -4.0;
const float detailSpeed = -8.0;

const float power = 100.0;
const float densityMultiplier = 0.075;

const float shapeSize = 0.05;
const float detailSize = 0.3;

const float shapeStrength = 0.7;
const float detailStrength = 0.2;

const vec3 minCorner = vec3(-CLOUD_EXTENT, cloudStart, -CLOUD_EXTENT);
const vec3 maxCorner = vec3(CLOUD_EXTENT, cloudEnd, CLOUD_EXTENT);

// https://gist.github.com/DomNomNom/46bb1ce47f68d255fd5d
vec2 intersectAABB(vec3 rayOrigin, vec3 rayDir, vec3 boxMin, vec3 boxMax){
 vec3 safeDir = (step(vec3(0.0), rayDir) * 2.0 - 1.0) * max(abs(rayDir), vec3(1e-6));
 vec3 tMin = (boxMin - rayOrigin) / safeDir;
 vec3 tMax = (boxMax - rayOrigin) / safeDir;
 vec3 t1 = min(tMin, tMax);
 vec3 t2 = max(tMin, tMax);
 float tNear = max(max(t1.x, t1.y), t1.z);
 float tFar = min(min(t2.x, t2.y), t2.z);
 return vec2(tNear, tFar);
}

bool insideAABB(vec3 p){
 float eps = 1e-4;
 return (p.x > minCorner.x - eps) && (p.y > minCorner.y - eps) && (p.z > minCorner.z - eps) &&
        (p.x < maxCorner.x + eps) && (p.y < maxCorner.y + eps) && (p.z < maxCorner.z + eps);
}

bool getCloudIntersection(vec3 org, vec3 dir, out float distToStart, out float totalDistance){
 vec2 intersections = intersectAABB(org, dir, minCorner, maxCorner);
 if(insideAABB(org)){
  intersections.x = 1e-4;
 }
 distToStart = intersections.x;
 totalDistance = intersections.y - intersections.x;
 return intersections.x > 0.0 && (intersections.x < intersections.y);
}

float getPerlinWorleyNoise(vec3 pos){
 const float dataWidth = 204.0;
 const float tileRows = 6.0;
 const vec3 atlasDimensions = vec3(32.0, 32.0, 36.0);

 vec3 p = pos.xzy;
 vec3 coord = vec3(mod(p, atlasDimensions));
 float f = fract(coord.z);
 float level = floor(coord.z);
 float tileY = floor(level / tileRows);
 float tileX = level - tileY * tileRows;

 vec2 offset = atlasDimensions.x * vec2(tileX, tileY) + 2.0 * vec2(tileX, tileY) + 1.0;
 vec2 pixel = coord.xy + offset;
 vec2 data = texture2D(uNightTexture, mod(pixel, dataWidth) / 256.0).rg;
 return mix(data.x, data.y, f);
}

float getCloudMap(vec3 p){
 vec2 uv = 0.5 + 0.5 * (p.xz / (2.0 * CLOUD_EXTENT));
 return texture2D(uNightTexture, uv).b;
}

float clouds(vec3 p, out float cloudHeight, bool sampleDetail){
 if(!insideAABB(p)){
  cloudHeight = 0.0;
  return 0.0;
 }
 cloudHeight = saturate((p.y - cloudStart) / (cloudEnd - cloudStart));
 float cloud = getCloudMap(p);
 if(cloud <= 0.0) return 0.0;

 float height = cloud;
 // Round the top of the cloud.
 cloud *= saturate(remap(cloudHeight, 0.8 * height, height, 1.0, 0.0));
 if(cloud <= 0.0) return 0.0;

 // Animate main shape.
 p += vec3(shapeSpeed * uTime);
 float shape = (1.0 - getPerlinWorleyNoise(shapeSize * p)) * shapeStrength;
 cloud = saturate(remap(cloud, shape, 1.0, 0.0, 1.0));
 if(cloud <= 0.0) return 0.0;

 if(sampleDetail){
  p += vec3(detailSpeed * uTime, 0.0, 0.5 * detailSpeed * uTime);
  float detail = getPerlinWorleyNoise(detailSize * p) * detailStrength;
  cloud = saturate(remap(cloud, detail, 1.0, 0.0, 1.0));
 }
 return densityMultiplier * cloud;
}

float HenyeyGreenstein(float g, float costh){
 return (1.0 / (4.0 * 3.1415)) * ((1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * costh, 1.5));
}

// https://twitter.com/FewesW/status/1364629939568451587/photo/1
float multipleOctaves(float extinction, float mu, float stepL){
 float luminance = 0.0;
 const float octaves = 4.0;
 float a = 1.0;
 float b = 1.0;
 float c = 1.0;
 for(float i = 0.0; i < octaves; i++){
  float phase = mix(HenyeyGreenstein(-0.1 * c, mu), HenyeyGreenstein(0.3 * c, mu), 0.7);
  luminance += b * phase * exp(-stepL * extinction * a);
  a *= 0.25;
  b *= 0.5;
  c *= 0.5;
 }
 return luminance;
}

float lightRay(vec3 p, float mu, vec3 lightDirection){
 float lightRayDistance = CLOUD_EXTENT * 1.5;
 float distToStart = 0.0;
 getCloudIntersection(p, lightDirection, distToStart, lightRayDistance);
 float stepL = lightRayDistance / float(STEPS_LIGHT);
 float lightRayDensity = 0.0;
 float cloudHeight = 0.0;
 for(int j = 0; j < STEPS_LIGHT; j++){
  bool sampleDetail = lightRayDensity <= 0.3;
  lightRayDensity += mix(1.0, 0.75, mu) *
   clouds(p + lightDirection * float(j) * stepL, cloudHeight, sampleDetail);
 }
 float beersLaw = multipleOctaves(lightRayDensity, mu, stepL);
 return mix(beersLaw * 2.0 * (1.0 - exp(-stepL * lightRayDensity * 2.0)), beersLaw, 0.5 + 0.5 * mu);
}

vec3 mainRay(vec3 org, vec3 dir, vec3 lightDirection, out float totalTransmittance, float mu, float offset, int primarySteps){
 totalTransmittance = 1.0;
 vec3 colour = vec3(0.0);
 float distToStart = 0.0;
 float totalDistance = 0.0;
 if(!getCloudIntersection(org, dir, distToStart, totalDistance)){
  return colour;
 }
 float stepS = totalDistance / float(primarySteps);
 distToStart += stepS * offset;
 float dist = distToStart;
 vec3 p = org + dist * dir;
 vec3 moonLight = lightColour * power;
 float phaseFunction = mix(HenyeyGreenstein(-0.3, mu), HenyeyGreenstein(0.3, mu), 0.7);

 for(int i = 0; i < MAX_PRIMARY_STEPS; i++){
  if(i >= primarySteps) break;
  float cloudHeight;
  float density = clouds(p, cloudHeight, true);
  if(density > 0.0){
   float sampleSigmaS = density;
   float sampleSigmaE = density;
   vec3 ambient = lightColour * mix(0.0, 0.2, cloudHeight);
   vec3 luminance = (0.2 * ambient + moonLight * phaseFunction * lightRay(p, mu, lightDirection)) * sampleSigmaS;
   float transmittance = exp(-sampleSigmaE * stepS);
   colour += totalTransmittance * (luminance - luminance * transmittance) / sampleSigmaE;
   totalTransmittance *= transmittance;
   if(totalTransmittance <= 0.01){
    totalTransmittance = 0.0;
    return colour;
   }
  }
  dist += stepS;
  p = org + dir * dist;
 }
 return colour;
}

void main(){
 if(uDensity <= 0.0 || texture2D(uScene, vUv).a < 0.5){
  gl_FragColor = vec4(0.0);
  return;
 }

 vec3 cameraPos;
 vec3 rayDir;
 getNightCamera(vUv, uInverseProjection, uCameraWorld, cameraPos, rayDir);

 float depth = texture2D(uDepth, vUv).x;
 float cardVeil = 1.0;
 if(depth < 0.99999){
  // Reconstruct the 3D point on the track card so volumetric moonlit clouds
  // creep onto the lower part and corners of the card, leaving the cover & title crisp.
  vec3 worldHit = worldAt(vUv, depth, uInverseProjection, uCameraWorld);
  float cardV = saturate((worldHit.y + 0.12) / 3.5);
  vec2 tangent = normalize(vec2(-uActiveScreen.z, uActiveScreen.x));
  float cardU = abs(dot(tangent, worldHit.xz - uActiveScreen.xz)) / 1.75;
  float sideBoost = smoothstep(0.25, 1.0, clamp(cardU, 0.0, 1.0));
  float distFromActive = length(worldHit.xz - uActiveScreen.xz);
  float neighborBoost = 0.10 * smoothstep(1.2, 5.5, distFromActive);

  // Animated 3D Perlin-Worley billows lapping across the lower portion of the card
  vec3 noisePos = vec3(worldHit.x * 2.8 + shapeSpeed * uTime * 0.25, worldHit.y * 2.8, worldHit.z * 2.8 + detailSpeed * uTime * 0.15);
  float billow = getPerlinWorleyNoise(noisePos);
  float detail = getPerlinWorleyNoise(noisePos * 2.2 + vec3(detailSpeed * uTime * 0.28, 0.0, 0.0));
  float cloudLobe = mix(billow, detail, 0.35);

  float creepHeight = mix(0.28, 0.46, sideBoost) + neighborBoost;
  float envelope = 1.0 - smoothstep(creepHeight * 0.18, creepHeight, cardV);
  cardVeil = smoothstep(0.26, 0.66, cloudLobe + (envelope - 0.38) * 0.9) * envelope * 0.88;
  if(cardVeil <= 0.002){
   gl_FragColor = vec4(0.0);
   return;
  }
  // Ensure the ray samples into the moonlit cloud tops when overlapping the card
  rayDir = normalize(vec3(rayDir.x, min(rayDir.y, -0.12), rayDir.z));
 }

 vec3 lightDirection = moonDirection();
 float offset = staticDither(gl_FragCoord.xy);
 float totalTransmittance = 1.0;
 int primarySteps = min(max(uFogSteps * 2 + 8, 32), MAX_PRIMARY_STEPS);
 float exposure = 0.5;
 vec3 colour = exposure * mainRay(cameraPos, rayDir, lightDirection, totalTransmittance, dot(rayDir, lightDirection), offset, primarySteps);
 colour = ACESFilm(colour);
 float opacity = (1.0 - totalTransmittance) * cardVeil;
 gl_FragColor = vec4(colour * cardVeil, opacity);
}
