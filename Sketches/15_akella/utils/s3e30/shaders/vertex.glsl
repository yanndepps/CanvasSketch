uniform float time;
uniform float playhead;
uniform vec4 resolution;
uniform vec3 colors[5];
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
  vUv=uv;
  vPosition = position;
  vNormal = normal;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
