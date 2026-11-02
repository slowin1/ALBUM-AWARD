// Adapted from user-supplied "Desert Sand". Original comments and attributions:
// references/desert-sand-original.glsl.txt. Shared height field for both stages.
uniform float uRadius;
uniform float uHeight;
uniform float uFrequency;
mat2 rot2(float a){ float c=cos(a),s=sin(a);return mat2(c,s,-s,c); }
vec2 hash22(vec2 p){float n=sin(dot(p,vec2(113.,1.)));return fract(vec2(2097152.,262144.)*n)*2.-1.;}
float gradN2D(vec2 f){
 vec2 p=floor(f);f-=p;vec2 w=f*f*(3.-2.*f);
 return mix(mix(dot(hash22(p),f),dot(hash22(p+vec2(1,0)),f-vec2(1,0)),w.x),
 mix(dot(hash22(p+vec2(0,1)),f-vec2(0,1)),dot(hash22(p+vec2(1)),f-vec2(1)),w.x),w.y)*.5+.5;
}
float n2D(vec2 p){
 vec2 i=floor(p);p-=i;p*=p*(3.-2.*p);
 return dot(mat2(fract(sin(mod(vec4(0,1,113,114)+dot(i,vec2(1,113)),6.2831853))*43758.5453))*vec2(1.-p.y,p.y),vec2(1.-p.x,p.x));
}
float surfFunc(vec2 p){
 p*=uFrequency*2.2;
 float a=smoothstep(0.,1.05,n2D(p*.2)*2.-.5);
 float b=1.-abs(n2D(p*.275)-.5)*2.;b=smoothstep(.2,1.,b*b);
 return a*.7+b*.25+n2D(p*1.5)*.05;
}
float heightAt(vec2 p){
 float radius=length(p);
 float outside=smoothstep(uRadius+.1,uRadius+2.3,radius);
 float terrain=(surfFunc(p+vec2(14.,7.))-.38)*3.;
 float crestDistance=(p.y-(uRadius+3.3)+sin(p.x*.23)*1.3)/1.8;
 float crest=exp(-crestDistance*crestDistance);
 // An irregular sand bank overlaps the lower part of the album screens.
 // Keep its inner edge outside the black center; terrain stays still as albums rotate.
 float bankDistance=(radius-(uRadius+.35))/.85;
 float bankMask=exp(-bankDistance*bankDistance)*smoothstep(uRadius-.4,uRadius-.05,radius);
 float bankHeight=1.05+.18*sin(p.x*1.15+p.y*.6)+.10*(gradN2D(p*1.7)-.5);
 return uHeight*(terrain*outside*(1.-crest)+crest*.8)-.4+bankMask*bankHeight;
}
float smoothSlope(float low,float high,float value){
 float t=clamp((value-low)/(high-low),0.,1.);
 return 6.*t*(1.-t)/(high-low);
}
// Noise value and exact x/z derivatives. The same corner hashes preserve the
// original terrain while avoiding four extra height-field evaluations per vertex.
vec3 n2DGradient(vec2 p){
 vec2 i=floor(p),f=fract(p);
 vec2 w=f*f*(3.-2.*f),dw=6.*f*(1.-f);
 vec4 corners=fract(sin(mod(vec4(0,1,113,114)+dot(i,vec2(1,113)),6.2831853))*43758.5453);
 float lo=mix(corners.x,corners.y,w.x),hi=mix(corners.z,corners.w,w.x);
 return vec3(mix(lo,hi,w.y),
  mix(corners.y-corners.x,corners.w-corners.z,w.y)*dw.x,(hi-lo)*dw.y);
}
vec3 gradN2DGradient(vec2 p){
 vec2 cell=floor(p),f=fract(p);
 vec2 w=f*f*(3.-2.*f),dw=6.*f*(1.-f);
 vec2 a=hash22(cell),b=hash22(cell+vec2(1,0));
 vec2 c=hash22(cell+vec2(0,1)),d=hash22(cell+vec2(1));
 float va=dot(a,f),vb=dot(b,f-vec2(1,0));
 float vc=dot(c,f-vec2(0,1)),vd=dot(d,f-vec2(1));
 float lo=mix(va,vb,w.x),hi=mix(vc,vd,w.x);
 vec2 gradient=mix(mix(a,b,w.x),mix(c,d,w.x),w.y);
 gradient+=vec2(mix(vb-va,vd-vc,w.y)*dw.x,(hi-lo)*dw.y);
 return vec3(mix(lo,hi,w.y)*.5+.5,gradient*.5);
}
vec3 surfFuncGradient(vec2 p){
 float scale=uFrequency*2.2;
 p*=scale;
 vec3 na=n2DGradient(p*.2),nb=n2DGradient(p*.275),nc=n2DGradient(p*1.5);
 na.yz*=scale*.2;nb.yz*=scale*.275;nc.yz*=scale*1.5;
 float av=na.x*2.-.5;
 vec3 a=vec3(smoothstep(0.,1.05,av),na.yz*(2.*smoothSlope(0.,1.05,av)));
 float bv=1.-abs(nb.x-.5)*2.;
 vec2 bd=-sign(nb.x-.5)*2.*nb.yz;
 vec3 b=vec3(smoothstep(.2,1.,bv*bv),bd*(2.*bv*smoothSlope(.2,1.,bv*bv)));
 return a*.7+b*.25+nc*.05;
}
vec3 heightAtGradient(vec2 p){
 float radius=length(p);
 vec2 radial=p/max(radius,1.e-6);
 float outside=smoothstep(uRadius+.1,uRadius+2.3,radius);
 vec2 outsideD=radial*smoothSlope(uRadius+.1,uRadius+2.3,radius);
 vec3 terrain=surfFuncGradient(p+vec2(14.,7.));
 terrain.x-=.38;terrain*=3.;
 float crestDistance=(p.y-(uRadius+3.3)+sin(p.x*.23)*1.3)/1.8;
 float crest=exp(-crestDistance*crestDistance);
 vec2 crestD=-2.*crestDistance*crest*vec2(cos(p.x*.23)*1.3*.23,1.)/1.8;
 float bankDistance=(radius-(uRadius+.35))/.85;
 float bankFalloff=exp(-bankDistance*bankDistance);
 float bankInner=smoothstep(uRadius-.4,uRadius-.05,radius);
 float bankMask=bankFalloff*bankInner;
 vec2 bankD=radial*bankFalloff*(smoothSlope(uRadius-.4,uRadius-.05,radius)-bankInner*2.*bankDistance/.85);
 vec3 bankNoise=gradN2DGradient(p*1.7);
 float bankAngle=p.x*1.15+p.y*.6;
 float bankHeight=1.05+.18*sin(bankAngle)+.10*(bankNoise.x-.5);
 vec2 bankHeightD=.18*cos(bankAngle)*vec2(1.15,.6)+.17*bankNoise.yz;
 vec2 gradient=uHeight*(terrain.yz*outside*(1.-crest)+terrain.x*outsideD*(1.-crest)
  +( .8-terrain.x*outside)*crestD)+bankD*bankHeight+bankMask*bankHeightD;
 float height=uHeight*(terrain.x*outside*(1.-crest)+crest*.8)-.4+bankMask*bankHeight;
 return vec3(height,gradient);
}
