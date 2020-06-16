uniform float time;
uniform float playhead;
uniform float off;
uniform vec3 color;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
}
