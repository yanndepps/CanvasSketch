// PixelSpirit : Temperance
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

  float stroke(float x, float s, float w) {
    float d = step(s, x + w * .5) - step(s, x - w * .5);
    return clamp(d, 0., 1.);
  }

  void main () {
    vec3 color = vec3(0.);
    float offset = cos(vUv.y*PI)*.15;
    color += stroke(vUv.x, .28+offset, .1);
    color += stroke(vUv.x, .5+offset, .1);
    color += stroke(vUv.x, .72+offset, .1);
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
