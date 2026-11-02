/*
  Shared parts of "Starry night sky with moonlit clouds" by al-ro
  https://www.shadertoy.com/view/3sffzj

  Copyright (c) 2020 al-ro

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
#define PI 3.14159
#define TWO_PI 2.0*PI
#define CLOUD_EXTENT 1000.0

const float moonDistance = 100.0;
const float moonSize = 8.0;
const float moonLocation = 4.45;
const float moonHeight = 0.20;

const vec3 lightColour = vec3(0.65, 0.8, 1.0);
const vec3 skyColour = 0.1 * vec3(0.32, 0.65, 1.0);

const float cloudStart = 0.0;
const float cloudEnd = CLOUD_EXTENT;
const float WORLD_TO_CLOUD = 20.0;

float saturate(float x){ return clamp(x, 0.0, 1.0); }

float remap(float x, float low1, float high1, float low2, float high2){
 return low2 + (x - low1) * (high2 - low2) / (high1 - low1);
}

vec3 moonDirection(){
 return normalize(vec3(cos(moonLocation), moonHeight, sin(moonLocation)));
}

float getGlow(float dist, float radius, float intensity){
 dist = max(dist, 5e-7);
 return pow(radius/dist, intensity);
}

// Static interleaved gradient noise: hides banding without animated grain.
float staticDither(vec2 fragCoord){
 return fract(52.9829189 * fract(dot(fragCoord, vec2(0.06711056, 0.00583715))));
}

// https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
vec3 ACESFilm(vec3 x){
 return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

vec3 worldAt(vec2 uv, float depth, mat4 inverseProjection, mat4 cameraWorld){
 vec4 p = inverseProjection * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
 return (cameraWorld * vec4(p.xyz / p.w, 1.0)).xyz;
}

// Maps 3D world space into al-ro's cloud box [-1000..1000] x [0..1000] x [-1000..1000].
// The stationary wheel (world y in [-0.12, 3.38]) sits above the moonlit cloud tops,
// while the dune camera descends from y = 28.95 to y = 1.3.
vec3 worldToCloud(vec3 worldP){
 return vec3(
  worldP.x * WORLD_TO_CLOUD,
  cloudEnd * 0.7 + (worldP.y - 1.3) * WORLD_TO_CLOUD,
  worldP.z * WORLD_TO_CLOUD
 );
}

void getNightCamera(vec2 uv, mat4 inverseProjection, mat4 cameraWorld, out vec3 cameraPos, out vec3 rayDir){
 vec3 worldOrigin = cameraWorld[3].xyz;
 vec3 worldFar = worldAt(uv, 1.0, inverseProjection, cameraWorld);
 vec3 rawDir = normalize(worldFar - worldOrigin);
 // In the gallery the dune camera at y = 1.3 tilts slightly upward toward y = 1.9 (+0.15 rad).
 // Align the cloud/sky horizon with the lower half of the wheel so the cloud sea fills the
 // space beneath the wheel and the starry sky + moon sit above it.
 float galleryLevel = smoothstep(6.0, 1.5, worldOrigin.y);
 cameraPos = worldToCloud(worldOrigin);
 rayDir = normalize(rawDir - vec3(0.0, 0.145 * galleryLevel, 0.0));
}
