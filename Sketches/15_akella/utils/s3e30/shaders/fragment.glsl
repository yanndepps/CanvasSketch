uniform float time;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 colors[5];

void main(){
  gl_FragColor=vec4(colors[0],1.);
}
