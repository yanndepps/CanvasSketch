varying vec2 v_uv;
varying vec3 v_position;
uniform float time;

// rotation matrix
mat2 getRotationMatrix(float theta) {
  float s = sin(theta);
  float c = cos(theta);
  return mat2(c, -s, s, c);
}

// scale matrix 
mat2 getScaleMatrix(float scale) {
  return mat2(scale, 0, 0, scale);
}

// returns 1.0 when point, pt, is inside a rectangle defined by size and center
float rect(vec2 pt, vec2 anchor, vec2 size, vec2 center) {
  vec2 p = pt - center;
  vec2 halfsize = size * 0.5;
  float horz = step(-halfsize.x - anchor.x, p.x) - step(halfsize.x - anchor.x, p.x);
  float vert = step(-halfsize.y - anchor.y, p.y) - step(halfsize.y - anchor.y, p.y);
  return horz * vert;
}

void main(){
  vec2 center = vec2(0.5, 0.0);
  mat2 matr = getRotationMatrix(time);
  mat2 mats = getScaleMatrix((sin(time) + 1.0) / 3.0 + 0.5);
  vec2 pt = ( mats * matr * ( v_position.xy - center ) ) + center;
  float inRect = rect(pt, vec2(0.15), vec2(0.3), center); 
  vec3 color = vec3(1.0, 1.0, 0.0) * inRect;

  gl_FragColor = vec4(color, 1.);
}
