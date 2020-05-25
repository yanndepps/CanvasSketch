// Gravity updated with import of simplex3d 
// @ts-nocheck
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glslify = require('glslify');

const settings = {
  dimensions: [800, 800],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true
  }
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#1d1d1d", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereBufferGeometry(1, 462, 462);

  // Setup a material
  // particle shaders 
  const vertexParticles = /* glsl */ `
    uniform float time;
    varying vec2 vUv;
    varying vec4 vPosition;

    void main() {
      vUv = uv;
      vec3 p = position;

      p.y += 0.1 * (sin(p.y * 5. + time) * 0.5 + 0.5);
      p.z += 0.05 * (sin(p.y * 10. + time) * 0.5 + 0.5);

      vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
      gl_PointSize = 5. * (1. / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition; 
    }
  `;

  const fragmentParticles = /* glsl */ `
    uniform float time; 

    void main() {
      gl_FragColor = vec4(0.826, 0.999, 0.999, 0.4);
    }
  `;

  // vertex shader
  const vertexShader = glslify(/* glsl */`
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vColor;
    varying vec3 vNormal;
    uniform float time;

    //	Simplex 3D Noise 
    #pragma glslify: noise = require('glsl-noise/simplex/3d');

    // convert hsl to rgb space
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // main 
    void main() {
      float noiz = noise(position*7.0 + time/20.0);
      vec3 newposition = position*(noiz+0.5 );
      vColor = hsv2rgb(vec3(noiz*0.1+0.03, 0.8, 0.8)); 
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);
    }
  `);

  // fragment shader
  const fragmentShader = /* glsl */ `
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vColor;
    varying vec3 vNormal;
    uniform float time;

    void main() {
      vec3 light = vec3(0.);
      vec3 ligthDirection = normalize( vec3(0., -1., 1.) );
      vec3 skyColor = vec3(1.000, 1.000, 0.547);
      vec3 groundColor = vec3(0.562, 0.275, 0.111);

      light += dot(ligthDirection, vNormal);
      light = mix(skyColor, groundColor, dot(ligthDirection, vNormal));

      gl_FragColor = vec4(vColor, 1.0);
      gl_FragColor = vec4(light*vColor, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    wireframe: false,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });

  // points material
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    transparent: true,
    vertexShader: vertexParticles,
    fragmentShader: fragmentParticles
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // uniform distribution of points on the sphere, using golden ratio
  let N = 60000;
  let positions = new Float32Array(N * 3);
  const particleGeo = new THREE.BufferGeometry();

  let inc = Math.PI * (3 - Math.sqrt(5));
  let offset = 2 / N;
  let rad = 1.7;

  for (let i = 0; i < N; i++) {
    let y = i * offset - 1 + (offset / 2);
    let r = Math.sqrt(1 - y * y);
    let phi = i * inc;

    positions[3 * i] = rad * Math.cos(phi) * r;
    positions[3 * i + 1] = rad * y;
    positions[3 * i + 2] = rad * Math.sin(phi) * r;
  }

  // setup points mesh
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // const particleGeo = new THREE.SphereBufferGeometry(1.5, 163, 162);
  const points = new THREE.Points(particleGeo, particleMat);
  scene.add(points);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      material.uniforms.time.value = 3 * time;
      particleMat.uniforms.time.value = 3 * time;
      points.rotation.y = time / 5.;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
