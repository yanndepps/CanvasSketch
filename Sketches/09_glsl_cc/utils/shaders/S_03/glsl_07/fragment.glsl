#define PI2 = 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float time;

varying vec2 v_uv;

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
  /* float tilecount = 6.0; */
  vec2 tilecount = vec2(6.0, 12.0);
  vec2 center = vec2(0.5);
  mat2 mat = getRotationMatrix(time);
  vec2 p = fract(v_uv * tilecount);
  vec2 pt = ( mat * ( p - center ) ) + center;
  float inRect = rect(pt, vec2(0.0), vec2(0.5), center); 
  vec3 color = vec3(1.0, 1.0, 0.0) * inRect;

  gl_FragColor = vec4(color, 1.);
}
