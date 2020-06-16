uniform vec2 u_resolution;
varying vec2 v_uv;
varying vec3 v_position;

void main(){
  /* vec3 color = vec3(v_uv.x, v_uv.y, 0.0); */ 
  vec3 color = vec3(v_position.x, v_position.y, 0.0); 
  gl_FragColor = vec4(color, 1.);
}
