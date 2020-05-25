varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
attribute vec3 position1;
uniform float time;

void main(){
  vPosition=position;
  vNormal=normal;
  vUv=uv;
  
  vec3 final=mix(position,position1,.5+.5*sin(time));
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(final,1.);
}