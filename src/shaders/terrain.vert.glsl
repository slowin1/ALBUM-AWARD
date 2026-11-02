varying vec3 vWorld;
varying vec3 vNormalWorld;

// __DUNES__
void main(){
 vec3 p=position;
 vec3 terrain=heightAtGradient(p.xz);
 p.y=terrain.x;
 vNormalWorld=normalize(mat3(modelMatrix)*vec3(-terrain.y,1.,-terrain.z));
 vWorld=(modelMatrix*vec4(p,1.)).xyz;
 vec4 mvPosition=viewMatrix*vec4(vWorld,1.);
 gl_Position=projectionMatrix*mvPosition;
}
