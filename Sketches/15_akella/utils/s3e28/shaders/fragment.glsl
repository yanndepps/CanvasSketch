uniform float time;
uniform float playhead;
uniform float off;
uniform vec3 color;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

float quinticOut(float t) {
  return 1.0 - (pow(t - 1.0, 5.0));
}

void main(){
  float localProgress = mod( playhead*2. + off*2., 2. );

  localProgress = quinticOut( localProgress / 0.9 ) * 2.0;

  if (vUv.x > localProgress || vUv.x + 1. < localProgress) discard;

  gl_FragColor = vec4(color, 1.);
}
