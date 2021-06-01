// 48.48
const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  suffix: "b_simon_01",
  dimensions: [512, 512],
  context: 'webgl',
  animate: true,
  duration: 8,
  fps: 30
};

// Your glsl code
const frag = glsl(`
  precision highp float;
  #pragma glslify: cnoise2 = require('glsl-noise/classic/2d');

  #define M_PI 3.1415926535897932384626433832795

  // uniform float time;
  uniform float playhead;
  varying vec2 vUv;

  // transform vUv to radial uv
  vec2 getRadialUv(vec2 vUv) {
    float angle = atan(vUv.x, vUv.y);
    vec2 radialUv = vec2(0.0);
    radialUv.x = angle / ( M_PI * 2.0 ) + 0.5;
    radialUv.y = 1.0 - pow(1.0 - length(vUv), 5.0);

    return radialUv;
  }

  // elevation using perlin noise
  float getElevation(vec2 vUv) {
    float elevation = cnoise2(vUv * 15.0);
    elevation += cnoise2(vUv * 80.0) * 0.2;
    elevation += cnoise2(vUv * 200.0) * 0.1;
    elevation += cnoise2(vUv * 900.0) * 0.15;

    return elevation;
  }

  void main () {
    vec2 pos = vUv - 0.5;
    vec2 radialUv = getRadialUv(pos);
    radialUv.y -= playhead * 0.05;
    radialUv.x -= playhead * 0.02;

    float elevation = getElevation(radialUv);

    vec3 color = vec3(elevation);

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
      // time: ({ time }) => time
      playhead: ({ playhead }) => playhead * (Math.PI * 2)
    }
  });
};

canvasSketch(sketch, settings);
