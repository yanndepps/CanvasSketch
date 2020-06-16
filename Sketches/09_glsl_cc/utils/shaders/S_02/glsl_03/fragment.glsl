uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_color;

void main(){
  vec2 v = u_mouse/u_resolution;
  vec3 color = vec3(v.x, 0.0, v.y);
  gl_FragColor = vec4(color, 1.);
}
