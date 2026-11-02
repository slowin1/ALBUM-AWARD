// Linear artwork radiance before brightness. Keep the scalar pattern in sync
// with screenEmission.ts so screen pixels and their sampled light agree.
vec3 albumArt(vec2 uv, float seed, float time, vec3 tint) {
 vec2 p = (uv - .5) * 2.;
 float wave = sin(p.x * 4. + sin(p.y * 4. + seed) * 2. + time * .12);
 float folds = pow(.5 + .5 * sin(length(p + vec2(wave * .2, 0.)) * 12. - atan(p.y, p.x) * 3. + seed), 3.);
 float vignette = 1. - smoothstep(.2, 1.5, length(p));
 return mix(tint * .055, tint, folds) * vignette;
}
