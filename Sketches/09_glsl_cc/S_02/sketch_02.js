// The vec class

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");
//---
// import fragment from './shaders/fragment_01.glsl';
// import vertex from './shaders/vertex_01.glsl';
//---
const fragment = require("../utils/shaders/S_02/glsl_02/fragment.glsl");
const vertex = require("../utils/shaders/S_02/glsl_02/vertex.glsl");

const settings = {
  dimensions: [800, 800],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true
  }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#1c1c1c", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  // setup a shader material
  const shdrMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      playhead: { value: 0 },
      u_color: { value: new THREE.Color(0xfffd01) }
    },
    wireframe: false,
    side: THREE.DoubleSide,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, shdrMaterial);
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
    render({ time, playhead }) {
      // mesh.rotation.y = time * (10 * Math.PI / 100);
      // mesh.position.z = -1 - playhead * 6;
      // mesh.material.uniforms.playhead.value = playhead;
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

// ---------------------------- NOTES -------------------------------------- //
// 1. Jumbling the elements of a vec variable is called swizzling :
// color.grba -> swaps the red and green channels.
// ------------------------------------------------------------------------- //
