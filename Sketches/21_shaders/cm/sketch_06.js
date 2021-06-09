const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  dimensions: [640, 640],
  context: 'webgl',
  animate: true,
  fps: 24,
  attributes: {
    antialias: true
  }
};

// Your glsl code
const vert = glsl(`
  precision highp float;
  attribute vec3 position;
  varying vec2 vUv;

  void main() {
    gl_Position = vec4(position.xyz, 1.0);
    vUv = gl_Position.xy * 0.5 + 0.5;
}
`);

const frag = glsl(`
  precision highp float;

  #define PI 3.14159265359

  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;

  float circleDF(vec2 uv) {
    vec2 centerPt = vec2(.5) - uv;
    float dist = length(centerPt);
    return dist;
}

  void main () {

    // vec2 pos = vUv - 0.5;
    vec3 color = vec3(circleDF(vUv));
    gl_FragColor = vec4(color, 1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl, canvasWidth, canvasHeight }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    vert,
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      resolution: [canvasWidth, canvasHeight]
    }
  });
};

canvasSketch(sketch, settings);
