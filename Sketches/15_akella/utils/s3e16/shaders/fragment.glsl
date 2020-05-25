varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
//uniform vec3 color;

void main(){
  float diff=abs(dot(normalize(vec3(1.,1.,1.)),vNormal));
  
  vec3 a=vec3(.5,.5,.5);
  vec3 b=vec3(.5,.5,.5);
  vec3 c=vec3(2.,1.,0.);
  vec3 d=vec3(.5,.2,.25);
  
  vec3 color=a+b*cos(2.*3.1415925*(c*diff+d+time/3.));
  gl_FragColor=vec4(color,1.);
}