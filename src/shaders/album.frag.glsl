uniform float uBrightness;
uniform sampler2D uCover;
uniform sampler2D uTitleAtlas;
uniform float uTitleOpacity;
uniform float uTitleIndex;
uniform float uTitleColumns;
uniform float uTitleRows;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main(){
 float edgeDistance=min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y));
 float edgeBlur=1.-smoothstep(0.,.12,edgeDistance);
 // Use the existing mip chain to soften only the border, with one texture lookup.
 vec3 color=texture2D(uCover,vUv,edgeBlur*2.4).rgb*uBrightness;
 float vignette=smoothstep(.4,1.35,length((vUv-.5)*2.));
 color*=1.-vignette*.18;
 vec3 viewDirection=normalize(cameraPosition-vWorldPosition);
 vec3 normal=normalize(vWorldNormal);
 float grazing=pow(1.-max(dot(viewDirection,normal),0.),4.);
 vec3 reflected=reflect(-viewDirection,normal);
 float reflection=pow(max(dot(reflected,normalize(vec3(-.4,.65,.7))),0.),24.);
 // Restrained protective-glass highlight; artwork remains legible front-on.
 color+=vec3(.018,.02,.024)*(grazing+reflection*.4);
 // Titles share the cover's depth, fog and distortion; no extra overlay mesh.
 if(uTitleOpacity>.001){
  float scrim=smoothstep(.6,.84,vUv.y)*(1.-smoothstep(.96,1.,vUv.y));
  color*=1.-scrim*uTitleOpacity*.25;
  // 512x192 atlas tiles keep their aspect ratio inside the square cover.
  vec2 titleUv=(vUv-vec2(.06,.61))/vec2(.88,.33);
  if(titleUv.x>=0.&&titleUv.x<=1.&&titleUv.y>=0.&&titleUv.y<=1.){
   float column=mod(uTitleIndex,uTitleColumns);
   float row=uTitleRows-1.-floor(uTitleIndex/uTitleColumns);
   vec2 atlasUv=(vec2(column,row)+titleUv)/vec2(uTitleColumns,uTitleRows);
   vec4 title=texture2D(uTitleAtlas,atlasUv);
   // HDR lettering and its baked soft halo stay luminous through tone mapping.
   color=mix(color,title.rgb*uBrightness*2.8,title.a*uTitleOpacity);
  }
 }
 // A narrow dark feather blends the image into its black frame.
 color*=smoothstep(0.,.006,edgeDistance);
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 
}
