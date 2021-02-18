global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

import fragment from "../utils/s3e20/shaders/fragment.glsl";
import vertex from "../utils/s3e20/shaders/vertex.glsl";

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800], // 1000/1920
  animate: true,
  duration: 10,
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
  camera.position.set(0, 0, -1);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup a scene
  const scene = new THREE.Scene();

  // Extruded Shape
  let n = 1000;
  const shape = new THREE.Shape();
  shape.moveTo(0.0, 0.2);

  for (let i = 0; i <= n; i++) {
    let theta = (2 * Math.PI * i) / n;
    let r = 0.2 + 0.2 * Math.sin(2 * theta) ** 2;
    let x = r * Math.sin(theta);
    let y = r * Math.cos(theta);
    shape.lineTo(x, y);
  }

  const extrudeSettings = {
    steps: 150,
    depth: 40,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

  // setup a shader material
  const shdrmaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      playhead: { value: 0 },
      // color: { value: new THREE.Color("tomato") }
    },
    wireframe: false,
    side: THREE.DoubleSide,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  // setup a normal material
  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, shdrmaterial);
  scene.add(mesh);
  // mesh.rotation.x = Math.PI / 2;
  mesh.position.z = -1;

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
      mesh.position.z = -1 - playhead * 6;
      mesh.material.uniforms.playhead.value = playhead;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
