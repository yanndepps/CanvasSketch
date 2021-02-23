uniform float time;
uniform float playhead;
uniform vec4 resolution;
uniform vec3 colors[5];
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float aastep(float threshold, float value) {

#ifdef GL_OES_standard_derivatives
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold-afwidth, threshold+afwidth, value);
#else
  return step(threshold, value);
#endif  
}

float maskline(float p, float index) {
  return aastep(p, index*1./5.) - aastep(p, (index-1.)*1./5.);
}

vec3 getColor(float i) {
  vec3 c1 = colors[0] * maskline(i, 1.);
  vec3 c2 = colors[1] * maskline(i, 2.);
  vec3 c3 = colors[2] * maskline(i, 3.);
  vec3 c4 = colors[3] * maskline(i, 4.);
  vec3 c5 = colors[4] * maskline(i, 5.);

  return c1 + c2 + c3 + c4 + c5;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main(){
  float pi = 3.14159265359;
  vec3 n = rotate(vNormal, vec3(0., 1., 0.), playhead*2.*pi);
  float diff = clamp( dot(vec3(1.), n), 0., 1. );
  gl_FragColor=vec4(getColor(fract(vUv.y*3. - playhead)) + 0.3 * vec3(diff), 1.);
  // gl_FragColor=vec4(colors[0], 1.);
}
