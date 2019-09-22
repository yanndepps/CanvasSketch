const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  dimensions: [ 1440, 900 ],
  exportPixelRatio: 2,
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  void main () {
    // mix (lerp) two colors
    vec3 col_a = vec3(1.0, 0.5, 1.0);
    vec3 col_b = vec3(1.0, 0.6, 0.4);
    // get a vector from current UV to (0.5, 0.5)
    vec2 center = vUv - 0.5;
    // fix for current aspect ratio
    center.x *= aspect;
    // get length of the vector (radius of polar coordinate)
    float dist = length(center);
    // create a "mask" circle
    float mask = smoothstep(0.2025, 0.2, dist);
    // our color(s)
    // vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
    vec3 color = mix(col_a, col_b, vUv.y + vUv.x * sin(time));
    // draw our pixels
    gl_FragColor = vec4(color, mask);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // background color (if false will create a transparent background at export)
    clearColor: 'hsl(0, 0%, 95%)',
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
