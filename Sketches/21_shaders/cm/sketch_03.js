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
  duration: 8,
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

  vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size * 0.5) / size);
    p = mod(p + size * 0.5, size) - size * 0.5;
    return c;
  }

  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c*t+d));
  }

  void main () {
    // distance metric
    vec2 pos = vUv - 0.5;

    // move everything left to right by adding sin(playhead) in the x component
    // sin goes from -1 to 1 as time increases
    pos = pos + vec2(sin(playhead * 0.25), 0.);

    // repeat the space every 1 unit in both x and y direction
    pMod2(pos, vec2(0.20));

    // create our shape. scale position by x
    float shape = circ(pos * vec2(64.0, 64.0));

    // get our color. add shape to time/playhead so the shape
    // affects how the color are chosen.
    vec3 col = cosPalette(shape + playhead * 0.8, vec3(0.5), vec3(0.5), vec3(2.0, 1.0, 1.0), vec3(0.00, 0.25, 0.25));

    col = vec3(shape) * col;
    // output pixel color
    gl_FragColor = vec4(col.rgb, 1.);
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
