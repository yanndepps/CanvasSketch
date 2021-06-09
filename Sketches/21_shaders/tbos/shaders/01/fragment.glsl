precision highp float;

#define PI 3.14159265359

uniform float time;
uniform vec2 u_resolution;

// palette function by Inigo Quilez
vec3 palette(float t, vec3 brightness, vec3 contrast, vec3 osc, vec3 phase) {
    return brightness + contrast * cos(6.28318 * (osc*t+phase));
}

// circle
float circleDF(vec2 uv) {
    vec2 centerPt = vec2(.5) - uv;
    float dist = length(centerPt);

    return dist;
}

void main(){
  // vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.yy + 0.5;
  vec3 color = vec3(0.0);
  vec3 yellow = vec3(1., 1., 0.);
  vec3 pink = vec3(1., .41, .78);

  // color = vec3(circle);

  float amount = 12.;
  float slantR = uv.x + uv.y;
  float slantL = uv.x - uv.y;

  float tau = PI * 2.;
  tau += sin(time) * 2.;
  float t = time * .125;
  slantR += tau * 0.05;

  float wave = sin(slantR * tau) * cos(slantL * tau);
  float wave2 = sin(slantR / tau) * PI +
      cos(slantL * tau) +
      cos(slantR * tau) *
      sin(slantL / tau) * PI;

  vec3 grid = vec3(fract(slantR*amount) + wave * fract(slantL*amount));

  vec3 gradient = mix(yellow, pink, grid);
  color += gradient;

  float circle = smoothstep(0.025, 0.1, circleDF(fract(uv * amount * 0.75 + wave2)));
  vec3 dots = vec3(circle);
  color /= dots;

  vec3 cPalette = palette(
      // uv.y += 0.1 * time,
      0.05,
      color + vec3(0.0, 0.05, 0.5) * sin(slantL + time) * .5, // brightness
      vec3(0.), // contrast
      vec3(0.5), // osc
      vec3(0.5, 0.5, 1.0) // phase
  );


  gl_FragColor=vec4(cPalette, 1.0);
}
