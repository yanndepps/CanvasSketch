varying vec2 v_uv;
varying vec3 v_position;

void main(){
  float inCircle = 1.0 - step(0.5, length(v_position.xy));
  vec3 color = vec3(1.0, 1.0, 0.0) * inCircle;

  gl_FragColor = vec4(color, 1.);
}
