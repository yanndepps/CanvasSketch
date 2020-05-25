varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform float playhead;
uniform vec3 color;

void main(){
  vUv=uv;
  vec3 newpos=position;
  
  newpos+=.276*normal*(4.*vUv.x-.03);
  
  vPosition=newpos;
  vNormal=normal;
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(newpos,1.);
}