// @ts-nocheck
// 42:20
// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true
  }
};

const planeFunction = (u, v, target) => {

  let x = u - 0.5;
  let y = v - 0.5;
  let z = 0;

  target.set(x, y, z);
};

const kleinFunction = (u, v, target) => {
  let a = 1;
  u *= Math.PI * 2;
  v *= Math.PI * 2;

  let x = Math.cos(u) * (a + Math.sin(v) * Math.cos(u / 2) - Math.sin(2 * v) * Math.sin(u / 2) / 2);
  let y = Math.sin(u) * (a + Math.sin(v) * Math.cos(u / 2) - Math.sin(2 * v) * Math.sin(u / 2) / 2);
  let z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v) / 2;

  target.set(x, y, z);
};

const graykleinFunction = (u, v, target) => {

  u *= Math.PI * 4;
  v *= Math.PI * 2;

  let a = 3;
  let n = 3;
  let m = 1;

  let x = (a + Math.cos(n * u / 2.0) * Math.sin(v) - Math.sin(n * u / 2.0) * Math.sin(2 * v)) * Math.cos(m * u / 2.0);
  let y = (a + Math.cos(n * u / 2.0) * Math.sin(v) - Math.sin(n * u / 2.0) * Math.sin(2 * v)) * Math.sin(m * u / 2.0);
  let z = Math.sin(n * u / 2.0) * Math.sin(v) + Math.cos(n * u / 2.0) * Math.sin(2 * v);

  target.set(x, y, z);
};

const sphereFunction = (u, v, target) => {
  u *= Math.PI;
  v *= -Math.PI * 2;

  let x = Math.sin(u) * Math.sin(v);
  let y = Math.sin(u) * Math.cos(v);
  let z = Math.cos(u);

  target.set(x, y, z);
};

const torFunction = (u, v, target) => {
  u *= Math.PI * 2;
  v *= Math.PI * 2;
  u -= -Math.PI;

  let x = Math.cos(v) + Math.sin(u) * Math.cos(v);
  let y = Math.sin(v) + Math.sin(u) * Math.sin(v);
  let z = Math.cos(u);

  target.set(x, y, z);
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#407060", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup a scene
  const scene = new THREE.Scene();

  // Setup a geometry
  //const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);

  const geometry = new THREE.ParametricBufferGeometry(torFunction, 100, 100);
  const geometry1 = new THREE.ParametricBufferGeometry(graykleinFunction, 100, 100);
  geometry.setAttribute('position1', new THREE.BufferAttribute(geometry1.attributes.position.array, 3));



  // vertex shader 
  const vertex = /* glsl */ `
    // ---
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    attribute vec3 position1;
    uniform float time;

    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;

      vec3 final = mix(position, position1, 0.5 + 0.5 * sin(time));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(final, 1.0);
    }
  `;

  // fragment shader 
  const fragment = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    //uniform vec3 color;

    void main() {
      float diff = abs(dot(normalize(vec3(1.,1.,1.)), vNormal));

      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(2.0, 1.0, 0.0);
      vec3 d = vec3(0.5, 0.2, 0.25);

      vec3 color = a + b * cos(2. * 3.1415925 * (c * diff + d + time/3.));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
      //color: { value: new THREE.Color("#ff665e") }
    },
    //wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);



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
      material.uniforms.time.value = time;
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

