uniform float time;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

void main(){
  vUv=uv;
  vPosition = position;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
