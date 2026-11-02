// Sky, stars, moon and moon glow from "Starry night sky with moonlit clouds"
// by al-ro (MIT, see night-common.glsl). Rendered at full resolution so the
// 20,000 tiny stars and moon texture stay sharp; clouds are composited on top.
// __NIGHT_COMMON__
uniform sampler2D uNightTexture;
uniform mat4 uInverseProjection;
uniform mat4 uCameraWorld;
uniform float uTime;
varying vec2 vUv;

const float starCount = 20000.0;
const float flickerSpeed = 6.0;

vec3 getStarPosition(float theta, float phi){
 return normalize(vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta)));
}

// https://www.shadertoy.com/view/4djSRW
float rand(float p){
 p = fract(p * .1031);
 p *= p + 33.33;
 p *= p + p;
 return fract(p);
}

float rand(vec2 co){
 return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

bool isActiveElevation(float theta, float level){
 return sin(theta) > rand(vec2(theta, level));
}

float getDistToStar(vec3 p, float theta, float phi){
 vec3 starPos = getStarPosition(theta, phi);
 return 0.5 + 0.5 * dot(starPos, p);
}

float getStars(vec3 rayDir){
 float theta = acos(clamp(rayDir.z, -1.0, 1.0));
 float width = PI / starCount;
 float level = floor((theta / PI) * starCount);
 float stars = 0.0;
 for(float l = -10.0; l <= 10.0; l++){
  float level_ = min(starCount - 1.0, max(0.0, level + l));
  float theta_ = (level_ + 0.5) * width;
  // Uniform latitudes would concentrate stars at the poles.
  if(!isActiveElevation(theta_, 0.0)) continue;
  float rnd = rand(PI + theta_);
  float phi_ = TWO_PI * rand(level_);
  float dist = getDistToStar(rayDir, theta_, phi_);
  stars += getGlow(1.0 - dist, rnd * 8e-7, 2.9 + sin(rand(rnd) * flickerSpeed * uTime));
 }
 return 0.05 * stars;
}

vec3 getSkyColour(vec3 rayDir, float mu){
 float stars = 0.0;
 if(rayDir.y > 0.0) stars = getStars(rayDir.xzy);
 return stars + mix(0.2 * skyColour, 0.5 * skyColour, pow(mu, 8.0));
}

bool getPlaneIntersection(vec3 org, vec3 ray, vec3 planePoint, vec3 normal, out float t){
 float denom = dot(normal, ray);
 if (denom > 1e-6) {
  t = dot(planePoint - org, normal) / denom;
  return (t >= 0.0);
 }
 return false;
}

vec3 getMoon(vec3 rayDir, vec3 moonDir, out bool covered){
 covered = false;
 vec3 p0 = moonDir * moonDistance;
 vec3 offsetDir = normalize(vec3(cos(moonLocation), moonHeight + 0.01, sin(moonLocation)));
 float t = 0.0;
 getPlaneIntersection(vec3(0.), offsetDir, p0, moonDir, t);
 vec3 p1 = offsetDir * t;
 vec3 v = normalize(p1 - p0);
 vec3 u = normalize(cross(moonDir, v));
 if(getPlaneIntersection(vec3(0.), rayDir, p0, moonDir, t)){
  vec3 p = rayDir * t;
  if(length(p - p0) > moonSize) return vec3(0);
  vec2 uv = vec2(dot(p, u), dot(p, v)) / (2.0 * moonSize);
  covered = true;
  return texture2D(uNightTexture, uv + 0.5).aaa;
 }
 return vec3(0);
}

void main(){
 vec3 cameraPos;
 vec3 rayDir;
 getNightCamera(vUv, uInverseProjection, uCameraWorld, cameraPos, rayDir);
 vec3 lightDirection = moonDirection();
 float mu = 0.5 + 0.5 * dot(rayDir, lightDirection);
 float offset = staticDither(gl_FragCoord.xy);
 vec3 background = getSkyColour(rayDir, 0.05 * offset + mu);
 if(rayDir.y > 0.0 && mu > 0.85){
  bool covered = false;
  vec3 moonColour = getMoon(rayDir, lightDirection, covered);
  if(covered) background = moonColour;
 }
 background += lightColour * saturate(getGlow(1.0 - mu, 0.5 * (1.0 - cos(atan(moonSize / moonDistance))), 2.0));
 // ACES tonemapping in linear space; fog-composite applies final sRGB gamma.
 gl_FragColor = vec4(ACESFilm(background), 1.0);
}
