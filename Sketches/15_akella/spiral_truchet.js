global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");

import fragment from "./utils/s3e23/shaders/fragment.glsl";
import vertex from "./utils/s3e23/shaders/vertex.glsl";

const settings = {
  dimensions: [800, 800],
  animate: true,
  duration: 6,
  context: "webgl",
  attributes: {
    antialias: true,
  },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
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
  // circle shape
  let num = 1000;
  let dots = [];
  for (let i = 0; i < num; i++) {
    let amount = i / num;
    let angle = -80 + 120 * amount;
    let k = 0.05;

    let x = 0.3 * Math.exp(k * angle) * Math.sin(0.25 * angle);
    let y = 0.3 * Math.exp(k * angle) * Math.cos(0.25 * angle);

    let z = Math.cos(0);

    dots.push(new THREE.Vector3(x, y, z));
  }

  // curve from circle shape
  let curve = new THREE.CatmullRomCurve3(dots);

  const geometry = new THREE.TubeGeometry(curve, 1000, 0.01, 30, false);

  // setup a shader material
  const shdrMaterial = new THREE.ShaderMaterial({
    uniforms: {
      playhead: { value: 0.0 },
    },
    wireframe: false,
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    transparent: true,
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
      // material.uniforms.time.value = 3 * time;
      controls.update();
      renderer.render(scene, camera);
      shdrMaterial.uniforms.playhead.value = playhead;
      mesh.rotation.z = 2 * Math.PI * playhead;
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
