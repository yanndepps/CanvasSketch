const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  suffix: "mutek_01",
  dimensions: [512, 512],
  context: 'webgl',
  animate: true,
  duration: 8,
  fps: 30
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float playhead;
  varying vec2 vUv;

  void main () {
    vec2 pos = vUv - 0.5;
    float r = sin(playhead + pos.x);
    float g = sin(-playhead + pos.y * 20.);
    float b = mod(pos.x/ pos.y, 1.);
    vec4 color = vec4(r,g,b,1.);
    // ---
    gl_FragColor = color;
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
      // time: ({ time }) => time
      playhead: ({ playhead }) => playhead * Math.PI * 2
    }
  });
};

canvasSketch(sketch, settings);
