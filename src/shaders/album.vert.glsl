varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main(){
 vUv=uv;
 vWorldPosition=(modelMatrix*vec4(position,1.)).xyz;
 vWorldNormal=normalize(mat3(modelMatrix)*vec3(0.,0.,1.));
 vec4 mvPosition=modelViewMatrix*vec4(position,1.);
 gl_Position=projectionMatrix*mvPosition;
 
}
