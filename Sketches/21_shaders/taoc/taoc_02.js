// ShaderToy Part_02 : build stuff with circles
const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  dimensions: [512, 256],
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(/*glsl*/`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;


  void main () {
    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float d = length(center);
    float r = 0.3;
    float c = smoothstep(r, r-0.1, d);
    // float c = d;
    // if(d < .25) c = 1.; else c = 0.;
    gl_FragColor = vec4(vec3(c),  1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // clearColor: 'hsl(0, 0%, 85%)',
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
