uniform vec2 u_resolution;
varying vec2 v_uv;
varying vec3 v_position;

void main(){
  vec3 color = vec3(0.0);
  // change between -1.0 and 1.0
  /* color.r = step(-1.0, v_position.x); */
  /* color.g = step(-0.3, v_position.y); */
  color.r = smoothstep(0.0, 0.1, v_position.x);
  color.g = smoothstep(0.0, 0.1, v_position.y);
  gl_FragColor = vec4(color, 1.);
}
