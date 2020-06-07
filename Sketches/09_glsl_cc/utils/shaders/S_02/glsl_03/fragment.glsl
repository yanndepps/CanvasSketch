uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_color;

void main(){
  vec3 color = vec3(u_mouse.x/u_resolution.x, 0.0, u_mouse.y/u_resolution.y);
  gl_FragColor = vec4(color, 1.);
}
