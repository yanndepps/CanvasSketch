uniform float time;
uniform float playhead;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

float PI = 3.1415926535897932384626433832795;

void main(){
  gl_FragColor=vec4(1.,vUv,1.);
  // gl_FragColor=vec4(.1,.2,.3,1.);
}
