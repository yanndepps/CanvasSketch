const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  suffix: "mutek_04",
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

  float PI = 3.14;

  float circ(vec2 p) {
    float r = 0.1;
    return length(p) - r;
  }

  vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size * 0.5) / size);
    p = mod(p + size * 0.5, size) - size * 0.5;
    return c;
  }

  float pModPolar(inout vec2 p, float repetitions) {
    float angle = 2.*PI/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    float c = floor(a/angle);
    a = mod(a,angle) - angle/2.;
    p = vec2(cos(a), sin(a))*r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.)) c = abs(c);
    return c;
  }

  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c*t+d));
  }

  float sdBox(in vec2 p, in vec2 b) {
    vec2 d = abs(p)-b;
    return length(max(d, vec2(0.))) + min(max(d.x, d.y), 0.0);
  }

  void main () {
    // distance metric
    vec2 pos = vUv - 0.5;

    // move everything left to right by adding sin(playhead) in the x component
    // sin goes from -1 to 1 as time increases
    // pos = pos + vec2(sin(playhead * 0.25), 0.);

    // repeat the space every 1 unit in both x and y direction
    pModPolar(pos, 6.);
    vec2 size = vec2(0.125, 0.125);
    pMod2(pos, size);


    // create our shape. scale position by x
    float shape = circ(pos * vec2(16.0, 16.0));

    // modify pos so the box can move back & forth
    // scale the range down so it doesn't move out of screen
    pos = pos + vec2(sin(playhead) * 0.2, 0.);

    // create box
    float shape2 = sdBox(pos, vec2(0.06));

    // make the box hard edge
    shape2 = ceil(shape2);

    // color pixels according to whatever shape is closer
    shape = min(shape, shape2);

    // get our colors
    vec3 col = cosPalette(playhead / 10., vec3(0.5), vec3(0.5), vec3(1.), vec3(0.00, 0.25, 0.25));

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
