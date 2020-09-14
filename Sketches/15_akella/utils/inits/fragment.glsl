uniform float time;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
  gl_FragColor=vec4(vUv,0.,1.);
  // gl_FragColor=vec4(.1,.2,.3,1.);
}