uniform float time;
uniform float playhead;
uniform float level;
uniform float black;
varying vec2 vUv;

void main(){
  // smooth the edges
  float w = 0.4;
  float smoothness = 0.003;
  float border = smoothstep(w, w+smoothness, vUv.x);
  float border1 = smoothstep(w, w+smoothness, vUv.y);
  float border2 = smoothstep(w, w+smoothness, 1. - vUv.y);
  float border3 = smoothstep(w, w+smoothness, 1. - vUv.x);
  border *= border1 * border2 * border3;

  if (border == 1.) discard;

  gl_FragColor = vec4(vec3(0.267, 0.970, 0.970), border);
}
