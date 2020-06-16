uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_color;

void main(){
  /* vec2 v = u_mouse/u_resolution; */
  /* vec3 color = vec3(v.x, 0.0, v.y); */
  vec3 color = vec3((sin(time) + 1.0)/2.0, 0.0, (cos(time) + 1.0)/2.0);
  gl_FragColor = vec4(color, 1.);
}
