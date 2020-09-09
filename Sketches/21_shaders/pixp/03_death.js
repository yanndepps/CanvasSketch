// PixelSpirit : Death
const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  dimensions: [512, 512],
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;
  
  #ifndef PI
  #define PI 3.1415926535897932384626433832795
  #endif

  uniform float time;
  varying vec2 vUv;

  void main () {
    vec3 color = vec3(0.);
    color += step(.5, (vUv.x+vUv.y)*.5);
    gl_FragColor = vec4(color, 1.0);
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
