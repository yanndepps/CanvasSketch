const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  // dimensions: [ 2048, 2048 ],
  // exportPixelRatio: 2,
  dimensions: [ 512, 512 ],
  // pixelsPerInch: 300,
  // duration: 4,
  // fps: 24,
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl( /* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);
    float mask = smoothstep(0.25, 0.245, dist);
    float n = noise(vec3(center * 1.25, time * 0.25));
    vec3 color = hsl2rgb(
       0.176 + n * 0.13,
       0.5,
       0.5 + n * 0.15
    );
    gl_FragColor = vec4(color, mask);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // background color (if false will create a transparent background at export)
    clearColor: 'hsl(0, 0%, 85%)',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
