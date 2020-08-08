#define PI2 = 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float time;

varying vec3 v_position;
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

// circle 
float circle(vec2 pt, vec2 center, float radius) {
  vec2 p = pt - center;
  return 1.0 - step(radius, length(p));
}

// circle softened
float circle(vec2 pt, vec2 center, float radius, bool soften) {
  vec2 p = pt - center;
  float edge = (soften) ? radius * 0.05 : 0.0;
  return 1.0 - smoothstep(radius - edge, radius + edge, length(p));
}

// circle with outline
float circle(vec2 pt, vec2 center, float radius, float line_width) {
  vec2 p = pt - center;
  float len = length(p);
  float half_line_width = line_width / 2.0;
  return step(radius - half_line_width, len) - step(radius + half_line_width, len);
}

// circle with outline softened
float circle(vec2 pt, vec2 center, float radius, float line_width, bool soften) {
  vec2 p = pt - center;
  float len = length(p);
  float half_line_width = line_width / 2.0;
  float edge = (soften) ? radius * 0.05 : 0.0;
  return smoothstep(radius - half_line_width - edge, radius-half_line_width, len) - smoothstep(radius + half_line_width, radius + half_line_width + edge, len);
}

void main(){
  vec3 color = vec3(1.0, 0.0, 0.0) * circle(v_position.xy, vec2(0.5), 0.3, 0.02, true);
  gl_FragColor = vec4(color, 1.);
}
