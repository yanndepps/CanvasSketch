varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform float playhead;
uniform vec3 color;

void main(){
  vec3 color1=vec3(.531,.800,.742);
  vec3 color2=vec3(.198,.256,.606);
  float pi=3.1415926;
  float fline=sin(vUv.y*6.*pi);
  float fline_a=abs(fline);
  float threshold=.005;
  float k=0.;
  float sk=0.;
  
  if(fline<0.){
    k=-1.;
  }else{
    k=1.;
  }
  
  if(fline_a<threshold){
    sk=(threshold-fline_a)/threshold;
    k=k*(1.-sk)+fline_a*sk;
  }
  
  k=(k+1.)/2.;
  
  float fade=12.;
  float fog=1.-clamp((vPosition.z-2.-playhead*6.)/fade,0.,1.);
  vec3 finalColor=mix(color1,color2,k);
  finalColor=mix(vec3(0.),finalColor,fog);
  
  gl_FragColor=vec4(finalColor,1.);
}