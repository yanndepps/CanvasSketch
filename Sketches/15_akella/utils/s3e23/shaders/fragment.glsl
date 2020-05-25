varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform float playhead;
uniform vec3 color;

float Hash21(vec2 p){
  p=fract(p*vec2(2345.34,435.345));
  p+=dot(p,p+34.23);
  return fract(p.x*p.y);
}

void main(){
  float pi=3.1415926;
  float angle=(atan(vPosition.y,vPosition.x)+pi)/(2.*pi);
  vec2 nUV=6.*vec2(7.*angle+6.*playhead,vUv.y*5.-3.*playhead);
  vec2 guv=fract(nUV)-.5;
  vec2 id=mod(floor(nUV),vec2(6.,6.));
  float n=Hash21(id);
  guv.x*=2.*step(.5,n)-1.;
  float d=abs(abs(guv.x+guv.y)-.5);
  float mask=smoothstep(-.01,.01,d-.3);
  float diff=clamp(dot(vec3(0.,0.,1.),vNormal),.3,1.);
  
  if(mask<.0001)discard;
  
  gl_FragColor=vec4(vec3(mask)*diff,mask);
  
  if(!gl_FrontFacing){
    gl_FragColor.a*=.5;
  }
}