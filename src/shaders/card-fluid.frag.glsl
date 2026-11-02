uniform sampler2D uPrevious;
uniform vec2 uResolution;
uniform float uAspect;
uniform float uTime;
uniform float uDelta;
uniform vec4 uPointer;
uniform float uPointerActive;
varying vec2 vUv;

float segmentDistance(vec2 point, vec2 start, vec2 end) {
  vec2 segment = end - start;
  float along = clamp(dot(point - start, segment) / max(dot(segment, segment), .00001), 0., 1.);
  return length(point - start - segment * along);
}

void main() {
  float dt = clamp(uDelta, .001, .05);
  vec2 texel = 1. / uResolution;
  vec2 velocity = (texture2D(uPrevious, vUv).rg - .5) * 2.;
  vec2 source = clamp(vUv - velocity * dt * .65, texel * .5, 1. - texel * .5);
  vec4 state = texture2D(uPrevious, source);
  vec4 neighbours = (
    texture2D(uPrevious, source + vec2(texel.x, 0.)) +
    texture2D(uPrevious, source - vec2(texel.x, 0.)) +
    texture2D(uPrevious, source + vec2(0., texel.y)) +
    texture2D(uPrevious, source - vec2(0., texel.y))
  ) * .25;
  state = mix(state, neighbours, min(.22, dt * 4.));
  velocity = (state.rg - .5) * 2. * exp(-dt * 2.1);
  float density = state.b * exp(-dt * .68);

  // Aspect-correct brush strokes follow the whole segment between frames.
  vec2 metric = vec2(uAspect, 1.);
  vec2 point = vUv * metric;
  vec2 current = uPointer.xy * metric;
  vec2 previous = uPointer.zw * metric;
  float distanceToStroke = segmentDistance(point, previous, current);
  float brush = exp(-distanceToStroke * distanceToStroke / .012);
  vec2 force = (uPointer.xy - uPointer.zw) / dt;
  force /= max(1., length(force));
  vec2 offset = point - current;
  vec2 curl = vec2(-offset.y, offset.x) / max(length(offset), .04);
  velocity += (force * 1.65 + curl * .14) * brush * uPointerActive * dt;
  density = min(1., density + brush * uPointerActive * dt * 2.4);

  // A slow current carries the residual ink after the pointer leaves.
  velocity += vec2(
    sin(vUv.y * 6. + uTime * .16),
    cos(vUv.x * 5. - uTime * .13)
  ) * density * dt * .055;
  gl_FragColor = vec4(clamp(velocity, -.9, .9) * .5 + .5, clamp(density, 0., 1.), 1.);
}
