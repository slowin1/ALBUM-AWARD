// Ocean and cloudscape background (cube removed, the wheel stands in its place).
// Based on the Shadertoy "Enscape cube in the clouds" scene: Perlin-style clouds
// with Mie phase scattering, procedural "Seascape" waves by TDM, ACES tone map.
// Noise textures are generated in OceanSky.tsx; there is no temporal pass, so the
// sampling jitter is a static interleaved-gradient pattern instead of random noise.
uniform sampler2D uNoise;
uniform mat4 uInverseProjection;
uniform mat4 uCameraWorld;
uniform mat4 uViewProjection;
uniform vec2 uResolution;
uniform float uTime;
uniform int uCloudSteps;
varying vec2 vUv;

const float OPI = 3.14159265;

// Cloud parameters
const float EARTH_RADIUS = 6300e3;
const float CLOUD_START = 800.0;
const float CLOUD_HEIGHT = 600.0;
const vec3 SUN_POWER = vec3(1.0, 0.9, 0.6) * 750.;
const vec3 LOW_SCATTER = vec3(1.0, 0.7, 0.5);

// Ocean parameters
const float SEA_LEVEL = -0.55;
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_FREQ = 0.16;
const vec3 SEA_BASE = 8.0 * vec3(0.1, 0.21, 0.35);

// Slow, calm motion.
#define CLOUD_TIME (uTime * 0.3)
#define SEA_TIME (uTime * 0.6)

float gJitter = 0.0;

vec3 sunDirection() {
 return normalize(vec3(0.35, 0.30, -0.85));
}

float hash11(float n) {
 return fract(sin(n) * 43758.5453);
}

float hash12(vec2 p) {
 return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Cheap 3D value noise from a single 2D fetch (iq): layers are offset by (37, 17).
float noise3(vec3 x) {
 vec3 p = floor(x);
 vec3 f = fract(x);
 f = f * f * (3.0 - 2.0 * f);
 vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
 vec2 rg = textureLod(uNoise, (uv + 0.5) / 256.0, 0.0).yx;
 return mix(rg.x, rg.y, f.z);
}

// Smooth, blobby weather map (blue channel of the noise texture).
float weatherMap(vec2 uv) {
 return textureLod(uNoise, uv, 0.0).b;
}

float noise2(vec2 p) {
 return textureLod(uNoise, (p + 0.5) / 256.0, 0.0).g * 2.0 - 1.0;
}

float fbm(vec3 p) {
 mat3 m = mat3(0.00, 0.80, 0.60,
              -0.80, 0.36, -0.48,
              -0.60, -0.48, 0.64);
 float f;
 f  = 0.5000 * noise3(p); p = m * p * 2.02;
 f += 0.2500 * noise3(p); p = m * p * 2.03;
 f += 0.1250 * noise3(p);
 return f;
}

float intersectSphere(vec3 origin, vec3 dir, vec3 spherePos, float sphereRad) {
 vec3 oc = origin - spherePos;
 float b = 2.0 * dot(dir, oc);
 float c = dot(oc, oc) - sphereRad * sphereRad;
 float disc = b * b - 4.0 * c;
 if (disc < 0.0) return -1.0;
 float q = (-b + ((b < 0.0) ? -sqrt(disc) : sqrt(disc))) / 2.0;
 float t0 = q;
 float t1 = c / q;
 if (t0 > t1) {
  float temp = t0;
  t0 = t1;
  t1 = temp;
 }
 if (t1 < 0.0) return -1.0;
 return (t0 < 0.0) ? t1 : t0;
}

float clouds(vec3 p, out float cloudHeight, bool fast) {
 float atmoHeight = length(p - vec3(0.0, -EARTH_RADIUS, 0.0)) - EARTH_RADIUS;
 cloudHeight = clamp((atmoHeight - CLOUD_START) / CLOUD_HEIGHT, 0.0, 1.0);
 p.z += CLOUD_TIME * 10.3;
 float largeWeather = clamp((weatherMap(-0.00005 * p.zx) - 0.18) * 5.0, 0.0, 2.0);
 p.x += CLOUD_TIME * 8.3;
 float weather = largeWeather * max(0.0, weatherMap(0.0002 * p.zx) - 0.28) / 0.72;
 weather *= smoothstep(0.0, 0.5, cloudHeight) * smoothstep(1.0, 0.5, cloudHeight);
 float cloudShape = pow(weather, 0.3 + 1.5 * smoothstep(0.2, 0.5, cloudHeight));
 if (cloudShape <= 0.0) return 0.0;
 p.x += CLOUD_TIME * 12.3;
 float den = max(0.0, cloudShape - 0.7 * fbm(p * 0.01));
 if (den <= 0.0) return 0.0;
 if (fast) return largeWeather * 0.2 * min(1.0, 5.0 * den);
 p.y += CLOUD_TIME * 15.2;
 den = max(0.0, den - 0.2 * fbm(p * 0.05));
 return largeWeather * 0.2 * min(1.0, 5.0 * den);
}

// From https://www.shadertoy.com/view/4sjBDG
float numericalMieFit(float costh) {
 float p1 = costh + 8.194068e-01;
 vec4 expValues = exp(vec4(-6.500000e+01 * costh - 5.500000e+01,
                           -8.370334e+01 * p1 * p1,
                           7.810083e+00 * costh,
                           -4.552125e-12 * costh));
 vec4 expValWeight = vec4(9.805233e-06, 1.388198e-01, 2.054747e-03, 2.600563e-02);
 return dot(expValues, expValWeight);
}

float lightRay(vec3 p, float phaseFunction, float dC, float mu, vec3 sunDir, float height, bool fast) {
 int nbSampleLight = fast ? 3 : 5;
 float zMaxl = 600.0;
 float stepL = zMaxl / float(nbSampleLight);
 float lightRayDen = 0.0;
 p += sunDir * stepL * fract(gJitter * 3.7 + dot(p, vec3(0.0123, 0.0071, 0.0097)));
 for (int j = 0; j < 5; j++) {
  if (j >= nbSampleLight) break;
  float h;
  lightRayDen += clouds(p + sunDir * float(j) * stepL, h, true);
 }
 if (fast) {
  return (0.5 * exp(-0.4 * stepL * lightRayDen) + max(0.0, -mu * 0.6 + 0.3) * exp(-0.02 * stepL * lightRayDen)) * phaseFunction;
 }
 float scatterAmount = mix(0.008, 1.0, smoothstep(0.96, 0.0, mu));
 float beersLaw = exp(-stepL * lightRayDen) + 0.5 * scatterAmount * exp(-0.1 * stepL * lightRayDen) + scatterAmount * 0.4 * exp(-0.02 * stepL * lightRayDen);
 return beersLaw * phaseFunction * mix(0.05 + 1.5 * pow(min(1.0, dC * 8.5), 0.3 + 5.5 * height), 1.0, clamp(lightRayDen * 0.4, 0.0, 1.0));
}

vec3 skyRay(vec3 org, vec3 dir, vec3 sunDir, bool fast) {
 const float ATM_START = EARTH_RADIUS + CLOUD_START;
 const float ATM_END = ATM_START + CLOUD_HEIGHT;
 int nbSample = fast ? 6 : uCloudSteps;
 vec3 color = vec3(0.0);
 float distToAtmStart = intersectSphere(org, dir, vec3(0.0, -EARTH_RADIUS, 0.0), ATM_START);
 float distToAtmEnd = intersectSphere(org, dir, vec3(0.0, -EARTH_RADIUS, 0.0), ATM_END);
 vec3 p = org + distToAtmStart * dir;
 float stepS = (distToAtmEnd - distToAtmStart) / float(nbSample);
 float T = 1.0;
 float mu = dot(sunDir, dir);
 float phaseFunction = numericalMieFit(mu);
 p += dir * stepS * gJitter;
 if (dir.y > 0.015) {
  for (int i = 0; i < 15; i++) {
   if (i >= nbSample) break;
   float cloudHeight;
   float density = clouds(p, cloudHeight, fast);
   if (density > 0.0) {
    float intensity = lightRay(p, phaseFunction, density, mu, sunDir, cloudHeight, fast);
    vec3 ambient = (0.5 + 0.6 * cloudHeight) * vec3(0.2, 0.5, 1.0) * 6.5 + vec3(0.8) * max(0.0, 1.0 - 2.0 * cloudHeight);
    vec3 radiance = ambient + SUN_POWER * intensity;
    radiance *= density;
    color += T * (radiance - radiance * exp(-density * stepS)) / density; // By Seb Hillaire
    T *= exp(-density * stepS);
    if (T <= 0.05) break;
   }
   p += dir * stepS;
  }
 }
 if (!fast) {
  vec3 pC = org + intersectSphere(org, dir, vec3(0.0, -EARTH_RADIUS, 0.0), ATM_END + 1000.0) * dir;
  color += T * vec3(3.0) * max(0.0, fbm(vec3(1.0, 1.0, 1.8) * pC * 0.002) - 0.4);
 }
 vec3 background = 6.0 * mix(vec3(0.2, 0.52, 1.0), vec3(0.8, 0.95, 1.0), pow(0.5 + 0.5 * mu, 15.0)) + mix(vec3(3.5), vec3(0.0), min(1.0, 2.3 * dir.y));
 if (!fast) background += T * vec3(1e4 * smoothstep(0.9998, 1.0, mu));
 color += background * T;
 return color;
}

// Fast analytic + 2D weather-map sky reflection for ocean waves (avoids 3D volumetric raymarching per water pixel).
vec3 skyReflectionFast(vec3 org, vec3 dir, vec3 sunDir) {
 float mu = dot(sunDir, dir);
 float up = max(0.02, dir.y);
 vec3 background = 6.0 * mix(vec3(0.2, 0.52, 1.0), vec3(0.8, 0.95, 1.0), pow(0.5 + 0.5 * mu, 15.0)) + mix(vec3(3.5), vec3(0.0), min(1.0, 2.3 * up));
 vec2 cloudUv = (org.xz + dir.xz * (1100.0 / up)) * 0.00012 + vec2(CLOUD_TIME * 0.0015);
 float w1 = weatherMap(cloudUv * 0.45);
 float w2 = weatherMap(cloudUv * 1.35 + vec2(0.37, 0.19));
 float cloudCov = smoothstep(0.36, 0.72, w1 * 0.65 + w2 * 0.35) * smoothstep(0.02, 0.18, dir.y);
 vec3 cloudLit = vec3(4.8, 5.6, 7.2) + SUN_POWER * 0.0085 * pow(max(0.0, 0.5 + 0.5 * mu), 3.0);
 return mix(background, cloudLit, cloudCov * 0.75);
}

// Signed distance to the 3D album wheel cylinder (radius 5.7, y in [-0.12 .. 3.08]),
// replacing the original Shadertoy cube so the wheel casts a soft shadow and wave swell on the ocean.
float mapWheel(vec3 pos) {
 vec2 d = abs(vec2(length(pos.xz), pos.y - 1.48)) - vec2(5.7, 1.6);
 return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sea_octave(vec2 uv, float choppy) {
 uv += noise2(uv);
 vec2 wv = 1.0 - abs(sin(uv));
 vec2 swv = abs(cos(uv));
 wv = mix(wv, swv, wv);
 return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

float wheelWaveOffset(vec2 xz) {
 float radius = length(xz);
 // Keep water inside the black wheel cylinder below card bottoms (y = -0.12),
 // while swelling an animated wave bank around the outer ring so waves lap onto the lower part of the cards.
 float innerDepression = -0.85 * (1.0 - smoothstep(5.55, 5.98, radius));
 float bankDist = (radius - 6.32) / 0.85;
 float bankMask = exp(-bankDist * bankDist) * smoothstep(5.94, 6.18, radius);
 float waveSurge = 0.86 + 0.16 * sin(xz.x * 1.25 + SEA_TIME * 1.35) + 0.12 * cos(xz.y * 1.15 - SEA_TIME * 0.95);
 return innerDepression + bankMask * waveSurge;
}

float mapWater(vec3 p, int steps, bool wheelWave) {
 float freq = SEA_FREQ;
 float amp = SEA_HEIGHT;
 float choppy = SEA_CHOPPY;
 vec2 uv = p.xz;
 uv.x *= 0.75;
 float d, h = 0.0;
 const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);
 float seaTime = 1.0 + SEA_TIME;
 for (int i = 0; i < 5; i++) {
  if (i >= steps) break;
  d = sea_octave((uv + seaTime) * freq, choppy);
  d += sea_octave((uv - seaTime) * freq, choppy);
  h += d * amp;
  uv *= octave_m; freq *= 1.9; amp *= 0.22;
  choppy = mix(choppy, 1.0, 0.2);
 }
 if (!wheelWave) return p.y - SEA_LEVEL - h;
 return p.y - SEA_LEVEL - h - wheelWaveOffset(p.xz);
}

float Schlick(float f0, float VoH) {
 return f0 + (1.0 - f0) * pow(1.0 - VoH, 5.0);
}

float D_GGX(float r, float NoH) {
 float a = NoH * r;
 float k = r / ((1.0 - NoH * NoH) + a * a);
 return k * k * (1.0 / OPI);
}

float HenyeyGreenstein(float mu, float inG) {
 return (1.0 - inG * inG) / (pow(1.0 + inG * inG - 2.0 * inG * mu, 1.5) * 4.0 * OPI);
}

vec3 getSeaColor(vec3 p, vec3 N, vec3 sunDir, vec3 dir, float mu, float cloudShadow) {
 vec3 L = normalize(reflect(dir, N));
 vec3 V = -dir;
 float NoV = clamp(abs(dot(N, V)) + 1e-5, 0.0, 1.0);
 float fresnel = Schlick(0.02, NoV);
 vec3 reflection = skyReflectionFast(p, L, sunDir);
 vec3 color = mix(cloudShadow * SEA_BASE, reflection, fresnel);
 float seaY = p.y - SEA_LEVEL - wheelWaveOffset(p.xz);
 float subsurfaceAmount = 12.0 * HenyeyGreenstein(mu, 0.5);
 const vec3 SEA_WATER_COLOR = 0.6 * vec3(0.8, 0.9, 0.6);
 color += subsurfaceAmount * SEA_WATER_COLOR * max(0.0, 1.0 + seaY - 0.6 * SEA_HEIGHT);
 vec3 H = normalize(V + sunDir);
 float NoL = max(0.0, dot(N, sunDir));
 color += LOW_SCATTER * 0.4 * vec3(NoL / OPI * fresnel * SUN_POWER * D_GGX(0.05, max(0.0, dot(N, H))));
 color += 9.0 * max(0.0, smoothstep(0.35, 0.6, seaY - SEA_HEIGHT) * N.x); // foam
 return color;
}

vec3 getNormalWater(vec3 p, float eps) {
 vec3 n;
 n.y = mapWater(p, 4, true);
 n.x = mapWater(vec3(p.x + eps, p.y, p.z), 4, true) - n.y;
 n.z = mapWater(vec3(p.x, p.y, p.z + eps), 4, true) - n.y;
 n.y = eps;
 return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
 float tm = 0.0;
 float tx = 1e8;
 p = ori;
 float hm = mapWater(ori, 2, true);

 // When the camera is near the wheel, step through the foreground wave bank only for rays
 // aimed at the lower part of the cards so grazing rays catch the wave crest with minimal cost.
 if (ori.y < 14.0 && abs(dir.x) < 0.52 && dir.y < 0.03 && dir.y > -0.45) {
  float tPrev = 1.8;
  float hPrev = mapWater(ori + dir * tPrev, 2, true);
  if (hPrev < 0.0) {
   tx = tPrev;
  } else {
   bool hitNear = false;
   const int NEAR_STEPS = 10;
   const float T_START = 1.8;
   const float T_END = 5.4;
   float dt = (T_END - T_START) / float(NEAR_STEPS);
   for (int i = 1; i <= NEAR_STEPS; i++) {
    float tCurr = T_START + float(i) * dt;
    float hCurr = mapWater(ori + dir * tCurr, 2, true);
    if (hCurr < 0.0) {
     tm = tPrev;
     hm = hPrev;
     tx = tCurr;
     hitNear = true;
     break;
    }
    tPrev = tCurr;
    hPrev = hCurr;
   }
   if (hitNear) {
    float hxNear = mapWater(ori + dir * tx, 2, true);
    float tmidNear = tm;
    for (int i = 0; i < 5; i++) {
     tmidNear = mix(tm, tx, clamp(hm / max(1e-5, hm - hxNear), 0.15, 0.85));
     p = ori + dir * tmidNear;
     float hmid = mapWater(p, 2, true);
     if (hmid < 0.0) {
      tx = tmidNear;
      hxNear = hmid;
     } else {
      tm = tmidNear;
      hm = hmid;
     }
    }
    p = ori + dir * tmidNear;
    return tmidNear;
   }
   tm = T_END;
   hm = hPrev;
  }
 }

 float hx = mapWater(ori + dir * tx, 2, false);
 if (hx > 0.0) return tx;
 float tmid = 0.0;
 for (int i = 0; i < 6; i++) {
  tmid = mix(tm, tx, hm / (hm - hx));
  p = ori + dir * tmid;
  float hmid = mapWater(p, 2, true);
  if (hmid < 0.0) {
   tx = tmid;
   hx = hmid;
  } else {
   tm = tmid;
   hm = hmid;
  }
 }
 return tmid;
}

// https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
vec3 tonemapACES(vec3 x) {
 float a = 2.51;
 float b = 0.03;
 float c = 2.43;
 float d = 0.59;
 float e = 0.14;
 return (x * (a * x + b)) / (x * (c * x + d) + e);
}

void main() {
 vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
 vec4 viewPoint = uInverseProjection * ndc;
 viewPoint /= viewPoint.w;
 vec3 dir = normalize((uCameraWorld * vec4(viewPoint.xyz, 0.0)).xyz);
 vec3 org = uCameraWorld[3].xyz;
 // Interleaved gradient noise: stable per pixel, no frame-to-frame flicker.
 gJitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));

 vec3 sunDir = sunDirection();
 float mu = dot(sunDir, dir);
 vec3 color;
 float fogDistance = intersectSphere(org, dir, vec3(0.0, -EARTH_RADIUS, 0.0), EARTH_RADIUS);

 if (fogDistance == -1.0) {
  color = skyRay(org, dir, sunDir, false);
  fogDistance = intersectSphere(org, dir, vec3(0.0, -EARTH_RADIUS, 0.0), EARTH_RADIUS + 160.0);
  gl_FragDepth = 0.999999;
 } else {
  vec3 waterHitPoint;
  heightMapTracing(org, dir, waterHitPoint);
  vec3 dist = waterHitPoint - org;
  float epsilonNormal = 0.1 / max(1.0, uResolution.x);
  vec3 n = getNormalWater(waterHitPoint, max(0.02, dot(dist, dist) * epsilonNormal));
  float shadow = clamp(1.0 - 0.65 * exp(-0.35 * max(0.0, mapWheel(waterHitPoint + sunDir * 2.5))), 0.35, 1.0);
  color = getSeaColor(waterHitPoint, n, sunDir, dir, mu, shadow * 0.5);

  vec4 clipPos = uViewProjection * vec4(waterHitPoint, 1.0);
  float ndcZ = clipPos.z / max(1e-6, clipPos.w);
  gl_FragDepth = clamp(ndcZ * 0.5 + 0.5, 0.0, 0.999998);
 }

 float fogPhase = 0.5 * HenyeyGreenstein(mu, 0.7) + 0.5 * HenyeyGreenstein(mu, -0.6);
 color = mix(fogPhase * 0.1 * LOW_SCATTER * SUN_POWER + 10.0 * vec3(0.55, 0.8, 1.0), color, exp(-0.0003 * fogDistance));

 // Post: fixed exposure, ACES, vignette and display gamma.
 vec2 v = vUv * 2.0 - 1.0;
 v.x *= uResolution.x / max(1.0, uResolution.y);
 float vign = smoothstep(4.0, 0.6, length(v));
 color = tonemapACES(0.06 * color);
 gl_FragColor = vec4(pow(vign * color, vec3(0.2 + 1.0 / 2.2)), 1.0);
}
