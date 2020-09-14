uniform float time;
uniform vec4 resolution;
uniform sampler2D chars;
uniform sampler2D canvas;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
  vec4 movie=texture2D(canvas,vUv);
  if(step(vUv.x,.5)>.5)discard;
  gl_FragColor=movie;
}
