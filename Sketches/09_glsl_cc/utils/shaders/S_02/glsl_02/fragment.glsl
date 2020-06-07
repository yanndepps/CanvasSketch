uniform float time;
uniform vec4 resolution;
uniform vec3 u_color;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
  // gl_FragColor=vec4(vUv,0.,1.);
  gl_FragColor=vec4(u_color, 1.).grba;
}
