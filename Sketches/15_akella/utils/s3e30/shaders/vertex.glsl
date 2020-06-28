uniform float time;
uniform float playhead;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
  vUv=uv;
  vPosition = position;
  vNormal = normal;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
