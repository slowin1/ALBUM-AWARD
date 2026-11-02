// __SCREEN_LIGHT__
uniform float uRippleScale;
uniform float uBumpStrength;
uniform float uAmbient;
uniform sampler2D uHeightMap;
uniform float uTerrainExtent;
varying vec3 vWorld;
varying vec3 vNormalWorld;

// __DUNES__
// Sand pattern and screen-blended rotated layers adapted from Desert Sand.
float grad(float x,float offset){
 x=abs(fract(x/6.283+offset-.25)-.5)*2.;
 return mix(smoothstep(0.,1.,x),clamp(x*x*(-1.+2.*x),0.,1.),.15);
}
float sandL(vec2 p){
 vec2 q=rot2(3.14159/18.)*p;
 q.y+=(gradN2D(q*18.)-.5)*.05;
 float a=grad(q.y*80.,0.);
 q=rot2(-3.14159/20.)*p;
 q.y+=(gradN2D(q*12.)-.5)*.05;
 float b=grad(q.y*80.,.5);
 q=rot2(3.14159/4.)*p;
 float blend=dot(sin(q*12.-cos(q.yx*12.)),vec2(.25))+.5;
 return 1.-(1.-a*(1.-blend))*(1.-b*blend);
}
float sand(vec2 p){
 p=vec2(p.y-p.x,p.x+p.y)*.7071/4.;
 return mix(sandL(p),sandL(rot2(3.14159/12.)*p*1.25),smoothstep(.1,.9,gradN2D(p*4.)));
}
void main(){
 vec3 base=normalize(vNormalWorld);
 // Warp ripples with the geometric slope; avoids repeated height evaluations.
 vec2 p=(vWorld.xz+base.xz*.65)*(uRippleScale/22.);
 float footprint=max(length(dFdx(p)),length(dFdy(p)));
 float detailFilter=1.-smoothstep(.025,.16,footprint);
 float distanceToCamera=length(cameraPosition-vWorld);
 float fade=detailFilter/(1.+distanceToCamera*distanceToCamera*.002);
 // Derivatives recover the same surface gradient from one filtered ripple
 // evaluation instead of four additional procedural sand evaluations.
 float bump=sand(p);
 vec3 dx=dFdx(vWorld),dy=dFdy(vWorld);
 vec3 rx=cross(dy,base),ry=cross(base,dx);
 float determinant=dot(dx,rx);
 vec3 rippleGradient=(dFdx(bump)*rx+dFdy(bump)*ry)
  /max(abs(determinant),1.e-7)*sign(determinant);
 vec3 normal=normalize(base-rippleGradient*uBumpStrength*fade);
 // A shallow second relief layer reads as fine sand only near the camera. Both
 // grain and wind-etched lines fade before they are smaller than a pixel.
 vec2 grainUv=vWorld.xz*58.;
 float grainFootprint=max(length(dFdx(grainUv)),length(dFdy(grainUv)));
 float grainFilter=1.-smoothstep(.18,.62,grainFootprint);
 float grain=gradN2D(grainUv)-.5;
 float fineRippleFilter=1.-smoothstep(.6,1.8,footprint*95.);
 float fineRipple=sin(dot(p,vec2(-.23,.97))*95.+bump*1.7);
 float microHeight=(grain*.009*grainFilter+fineRipple*.003*fineRippleFilter)*uBumpStrength;
 rx=cross(dy,normal);ry=cross(normal,dx);
 determinant=dot(dx,rx);
 vec3 microGradient=(dFdx(microHeight)*rx+dFdy(microHeight)*ry)/max(abs(determinant),1.e-7)*sign(determinant);
 normal=normalize(normal-microGradient);
 float variation=mix(.75,1.12,gradN2D(vWorld.xz*8.));
 vec3 color=vec3(.028,.030,.034)*uAmbient*(.7+.3*base.y);
 for(int i=0;i<SCREEN_COUNT;i++){
  vec3 contribution=screenIrradiance(i,vWorld,normal,true);
  // The static height field is cached on the GPU for the configured dunes.
  // All four emitter samples share the same three soft-shadow texture queries.
  float visibility=1.;
  vec3 toScreen=uLightPositions[i]-vWorld;
  if(dot(contribution,vec3(.2126,.7152,.0722))>.002 && dot(toScreen,toScreen)<144.){
   for(int sampleIndex=1;sampleIndex<=3;sampleIndex++){
    float fraction=float(sampleIndex)*.22;
    vec3 q=mix(vWorld+base*.06,uLightPositions[i],fraction);
    float clearance=q.y-texture2D(uHeightMap,q.xz/uTerrainExtent+.5).r;
    // A finite album screen casts a broad penumbra; let it grow with the
    // distance along the ray rather than cutting a hard band across the sand.
    float penumbra=.12+fraction*uScreenSize*.09;
    visibility=min(visibility,smoothstep(-penumbra*.65,penumbra,clearance));
   }
  }
  color+=contribution*visibility*.318309886;
 }
 color*=variation*mix(1.,.7+bump*.5,fade);
 color*=1.+grain*.075*grainFilter+fineRipple*.018*fineRippleFilter;
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 
}
