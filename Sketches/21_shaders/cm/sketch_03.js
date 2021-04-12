const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// 55.41
// Setup our sketch
const settings = {
  suffix: "mutek_03",
  dimensions: [512, 512],
  context: 'webgl',
  animate: true,
  duration: 6,
  fps: 30
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float playhead;
  varying vec2 vUv;

  float circ(vec2 p) {
    return length(p) - .50;
  }

  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c*t+d));
  }

  void main () {
    // distance metric
    vec2 pos = vUv - 0.5;

    // create our shape. scale position by 4
    float shape = circ(pos * vec2(4.0));

    // get our color. add shape to time/playhead so the shape
    // affects how the color are chosen.
    vec3 col = cosPalette(shape + playhead * 0.15, vec3(0.8, 0.5, 0.4), vec3(0.2, 0.4, 0.2), vec3(2.0, 1.0, 1.0), vec3(0.00, 0.25, 0.25));

    // shape is 1 when there is no shape and 0 when there is a shape
    col = vec3(shape) * col;

    // output pixel color
    gl_FragColor = min(vec4(col, 1.0), vec4(0.9));
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
      playhead: ({ playhead }) => playhead * Math.PI * Math.PI * 2
    }
  });
};

canvasSketch(sketch, settings);
