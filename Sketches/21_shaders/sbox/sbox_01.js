const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  dimensions: [ 800, 800 ],
  // dimensions: [ 21, 21 ],
  // dimensions: 'Letter',
  // units: 'cm',
  // pixelsPerInch: 300,
  animate: true,
  attributes: {
    antialias: true,
  }
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  uniform vec2 resolution;

  #define SPEED 5.

  void main () {
    vec2 uv = ( gl_FragCoord.xy );
    vec2 c = vec2(0.);
    for(float i = 0.0; i < 5.0; i++){
      float r1 = pow(length(uv - vec2(630. - i * 70., 400)), 0.6);
      c.x += sin( r1 * 0.3 - time * SPEED) * i;
      c.y += 0.1 / (2. - sin(r1/100. - time));

      c.x *= pow(0.1, c.y);
      c.y /= pow(0.6, c.x);
    }
    gl_FragColor = vec4( vec3(c, 1. - c.x * c.y), 1.0 );
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time
    }
  });
};

canvasSketch(sketch, settings);
