varying vec3 v_position;
varying vec2 v_uv;

void main(){
  v_position = position;
  v_uv = uv;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
