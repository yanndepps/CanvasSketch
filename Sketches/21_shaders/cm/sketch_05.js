// 1.33.15
const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  // suffix: random.getSeed(),
  dimensions: [640, 640],
  context: 'webgl',
  animate: true,
  // duration: 8,
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

  // shadows
  float getShadow(float elevation, vec2 vUv) {
    vec2 towardSun = normalize(-vUv);

    const float MAX_ITERS = 5.0;
    float shadow = 0.0;

    for (float i = 1.0; i <= MAX_ITERS; i++) {
      float towardElevation = getElevation(vUv + towardSun / MAX_ITERS * 0.01 * i);
      if(towardElevation > elevation) {
        // shadow += 1.0 / MAX_ITERS;
        shadow += 0.1;
      }
    }
      return shadow;
  }

  // sun
  vec4 getSun(vec2 radialUv) {
    vec3 innerColor = vec3(1.0);
    vec3 outerColor = vec3(1., 1., 0.);

    float strength = 1.0 - radialUv.y;
    strength += clamp(cnoise2(vec2(radialUv.x * 10.0, time * 0.2)), 0.0, 1.0);

    vec3 color = mix(outerColor, innerColor, strength * 0.5);

    return vec4(color, strength * 0.8);
  }

  void main () {
    vec2 pos = vUv - 0.5;

    vec2 radialUv = getRadialUv(pos);
    vec2 animRadialUv = radialUv;

    animRadialUv.y -= time * 0.01;
    animRadialUv.x -= time * 0.002;

    float elevation = getElevation(animRadialUv);

    vec3 color = vec3(0.0);

    float shadow = getShadow(elevation, animRadialUv);

    if(elevation > 0.0) {
      color = getTerrainColor(elevation);
      color -= shadow * 0.5;
    } else {
      color = getWaterColor(elevation);
      color -= shadow * 0.2;
    }

    vec4 sunColor = getSun(radialUv);
    color = mix(color, sunColor.rgb, sunColor.a);

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
      time: ({ time }) => time * Math.PI / 2
      // playhead: ({ playhead }) => playhead * (Math.PI * 2)
    }
  });
};

canvasSketch(sketch, settings);
