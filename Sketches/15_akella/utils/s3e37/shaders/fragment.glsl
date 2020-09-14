uniform float time;
uniform vec4 resolution;
uniform sampler2D chars;
varying vec2 vUv;
varying vec4 vPosition;

varying float vScale;

void main(){
  float size = 66.;
  vec2 newUV = vUv;
  newUV.x = vUv.x/size + floor( vScale*size )/size;
  vec4 charsMap = texture2D(chars, newUV);
  gl_FragColor=vec4(vUv,0.,1.);
  gl_FragColor = charsMap;
  // gl_FragColor = vec4(vScale);
}
