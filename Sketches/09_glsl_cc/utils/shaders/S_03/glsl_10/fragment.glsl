#define PI2 6.28318530718
#define PI 3.14159265359

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float time;

varying vec3 v_position;
varying vec2 v_uv;

// rotation matrix
mat2 getRotationMatrix(float theta){
  float s=sin(theta);
  float c=cos(theta);
  return mat2(c,-s,s,c);
}

// scale matrix
mat2 getScaleMatrix(float scale){
  return mat2(scale,0,0,scale);
}

// returns 1.0 when point, pt, is inside a rectangle defined by size and center
float rect(vec2 pt,vec2 anchor,vec2 size,vec2 center){
  vec2 p=pt-center;
  vec2 halfsize=size*.5;
  float horz=step(-halfsize.x-anchor.x,p.x)-step(halfsize.x-anchor.x,p.x);
  float vert=step(-halfsize.y-anchor.y,p.y)-step(halfsize.y-anchor.y,p.y);
  return horz*vert;
}

// circle
float circle(vec2 pt,vec2 center,float radius){
  vec2 p=pt-center;
  return 1.-step(radius,length(p));
}

// circle softened
float circle(vec2 pt,vec2 center,float radius,bool soften){
  vec2 p=pt-center;
  float edge=(soften)?radius*.05:0.;
  return 1.-smoothstep(radius-edge,radius+edge,length(p));
}

// circle with outline
float circle(vec2 pt,vec2 center,float radius,float line_width){
  vec2 p=pt-center;
  float len=length(p);
  float half_line_width=line_width/2.;
  return step(radius-half_line_width,len)-step(radius+half_line_width,len);
}

// circle with outline softened
float circle(vec2 pt,vec2 center,float radius,float line_width,bool soften){
  vec2 p=pt-center;
  float len=length(p);
  float half_line_width=line_width/2.;
  float edge=(soften)?radius*.05:0.;
  return smoothstep(radius-half_line_width-edge,radius-half_line_width,len)-smoothstep(radius+half_line_width,radius+half_line_width+edge,len);
}

float circle(vec2 pt,vec2 center,float radius,float line_width,float edge_thickness){
  pt-=center;
  float len=length(pt);
  float result=smoothstep(radius-line_width/2.-edge_thickness,radius-line_width/2.,len)-smoothstep(radius+line_width/2.,radius+line_width/2.+edge_thickness,len);
  
  return result;
}

// line function
float line(float a,float b,float line_width,float edge_thickness){
  float half_line_width=line_width*.5;
  return smoothstep(a-half_line_width-edge_thickness,a-half_line_width,b)-smoothstep(a+half_line_width,a+half_line_width+edge_thickness,b);
}

// sweep function
float sweep(vec2 pt,vec2 center,float radius,float line_width,float edge_thickness){
  vec2 d=pt-center;
  float theta=time*2.;
  vec2 p=vec2(cos(theta),-sin(theta))*radius;
  float h=clamp(dot(d,p)/dot(p,p),0.,1.);
  //float h = dot(d,p)/dot(p,p);
  float l=length(d-p*h);
  
  float gradient=0.;
  const float gradient_angle=PI*1.5;
  
  if(length(d)<radius){
    float angle=mod(theta+atan(d.y,d.x),PI2);
    gradient=clamp(gradient_angle-angle,0.,gradient_angle)/gradient_angle*.5;
  }
  
  return gradient+1.-smoothstep(line_width,line_width+edge_thickness,l);
}
void main(){
  vec2 uv=v_uv;
  vec3 axis_color=vec3(.8);
  vec3 color=line(v_uv.y,.5,.002,.001)*axis_color;
  color+=line(v_uv.x,.5,.002,.001)*axis_color;
  color+=circle(v_uv,vec2(.5),.3,.003,.001)*axis_color;
  color+=circle(v_uv,vec2(.5),.2,.003,.001)*axis_color;
  color+=circle(v_uv,vec2(.5),.1,.003,.001)*axis_color;
  color+=sweep(v_uv,vec2(.5),.3,.003,.001)*vec3(.1,.3,1.);
  gl_FragColor=vec4(color,1.);
}
