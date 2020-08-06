varying vec2 v_uv;
varying vec3 v_position;
// returns 1.0 when point, pt, is inside a rectangle defined by size and center
float rect(vec2 pt, vec2 size, vec2 center) {
  vec2 p = pt - center;
  vec2 halfsize = size * 0.5;
  float horz = step(-halfsize.x, p.x) - step(halfsize.x, p.x);
  float vert = step(-halfsize.y, p.y) - step(halfsize.y, p.y);
  return horz * vert;
}

void main(){
  float square1 = rect(v_position.xy, vec2(0.3), vec2(-0.5, 0.0)); 
  float square2 = rect(v_position.xy, vec2(0.4), vec2(0.5, 0.0)); 
  vec3 color = vec3(1.0, 1.0, 0.0) * square1 + vec3(0.0, 1.0, 0.0) * square2;

  gl_FragColor = vec4(color, 1.);
}
