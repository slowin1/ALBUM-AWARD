uniform sampler2D uFluid;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
varying vec2 vUv;

float hash(vec2 point) {
  vec3 p = fract(vec3(point.xyx) * .1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3. - 2. * local);
  return mix(
    mix(hash(cell), hash(cell + vec2(1., 0.)), local.x),
    mix(hash(cell + vec2(0., 1.)), hash(cell + 1.), local.x),
    local.y
  );
}

float fbm(vec2 point) {
  float value = 0.;
  float amplitude = .56;
  mat2 turn = mat2(.8, -.6, .6, .8);
  for (int octave = 0; octave < 3; octave++) {
    value += noise(point) * amplitude;
    point = turn * point * 2.03 + vec2(3.1, 1.7);
    amplitude *= .48;
  }
  return value;
}

void main() {
  vec4 fluid = texture2D(uFluid, vUv);
  vec2 velocity = (fluid.rg - .5) * 2.;
  float density = fluid.b;
  vec2 point = (vUv - .5) * vec2(uResolution.x / uResolution.y, 1.);
  point += velocity * .65;
  float time = uTime * .075;
  vec2 warp = vec2(
    fbm(point * 1.7 + vec2(time, -time * .4)),
    fbm(point * 1.7 + vec2(4.8 - time * .6, -1.3 + time * .3))
  );
  warp += vec2(density * .18, -density * .14);
  float field = fbm(point * 1.8 + warp * 2.8 + vec2(time * .3, 0.));
  field += density * .12;

  vec3 color = mix(uColor1, uColor2, smoothstep(.15, .7, field));
  color = mix(color, uColor3, smoothstep(.38, .76, field) * .52);
  float fold = exp(-pow((field - .53) * 15., 2.));
  vec2 gradient = vec2(dFdx(field) * uResolution.x, dFdy(field) * uResolution.y);
  vec3 normal = normalize(vec3(-gradient * .45, 1.));
  float specular = pow(max(dot(normal, normalize(vec3(-.45, .65, 1.))), 0.), 18.);
  color += uColor4 * (fold * .13 + specular * .095 + density * .11);

  // Keep the title side dark while the silver folds move across the right.
  color *= mix(.68, 1., smoothstep(.02, .85, vUv.x));
  float vignette = smoothstep(.32, .8, length((vUv - .5) * vec2(.75, 1.)));
  color = mix(color, uColor1, vignette * .5);
  float grain = (hash(gl_FragCoord.xy) - .5) / 255.;
  gl_FragColor = vec4(clamp(color + grain, 0., 1.), 1.);
}
