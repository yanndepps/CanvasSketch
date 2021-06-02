// 1.05.33
const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  suffix: "b_simon_01",
  dimensions: [512, 512],
  context: 'webgl',
  animate: true,
  duration: 7,
  fps: 24,
  attributes: {
    antialias: true
  }
};

// Your glsl code
const frag = glsl(`
  precision highp float;
  #pragma glslify: cnoise2 = require('glsl-noise/classic/2d');

  #define M_PI 3.1415926535897932384626433832795

  uniform float time;
  // uniform float playhead;
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
    elevation += abs( cnoise2(vUv * 900.0) * 0.15 );

    return elevation;
  }

  // colors
  vec3 getTerrainColor(float elevation) {
    vec3 sandColor = vec3(0.96, 0.64, 0.38);
    vec3 forestColor = vec3(0.0, 0.5, 0.0);
    vec3 meltedSnowColor = vec3(0.7, 0.9, 1.0);
    vec3 snowColor = vec3(1.0);

    vec3 color = mix(sandColor, forestColor, elevation);

    if(elevation > 0.7) {
      color = mix(meltedSnowColor, snowColor, (elevation - 0.7) / 0.3);
    }

    return color;
  }

  vec3 getWaterColor(float elevation) {
    vec3 depthColor = vec3(0.2, 0.54, 0.75) * 0.5;
    vec3 shoreColor = vec3(0.2, 0.54, 0.75);

    float strength = -elevation;

    vec3 color = mix(shoreColor, depthColor, strength);

    return color;
  }

  void main () {
    vec2 pos = vUv - 0.5;
    vec2 radialUv = getRadialUv(pos);
    radialUv.y -= time * 0.01;
    radialUv.x -= time * 0.02;

    float elevation = getElevation(radialUv);

    vec3 color = vec3(0.0);
    if(elevation < 0.0) {
      color = getTerrainColor(elevation);
    } else {
      color = getWaterColor(elevation);
    }

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
      time: ({ time }) => time * Math.PI
      // playhead: ({ playhead }) => playhead * (Math.PI * 2)
    }
  });
};

canvasSketch(sketch, settings);
