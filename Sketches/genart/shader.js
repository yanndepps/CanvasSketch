// Creative Coding in Canvas & WebGL : Part III
// paused at : 5:45:00

const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  dimensions: [ 512, 512 ],
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    // vec3 colorA = vec3(1.0, 0.0, 0.0);
    // vec3 colorB = vec3(0.0, 0.0, 1.0);
    
    vec2 center = vUv - 0.5;
    center.x *= aspect;

    float dist = length(center);
    
    float alpha = smoothstep(0.25, 0.247, dist);

    // vec3 color = mix(colorA, colorB, vUv.x + vUv.y * sin(time));
    // gl_FragColor = vec4(color, alpha);

    // --- using simplex noise and hsl2rgb colors ---

    float n = noise(vec3( center * 1.5, time * 0.25 ));

    vec3 color = hsl2rgb(
      0.66 + n * 0.2,
      0.4,
      0.5
    );

    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // background color
    clearColor: ('hsl(0, 0%, 85%)'),
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
