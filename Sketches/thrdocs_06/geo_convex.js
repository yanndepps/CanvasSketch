// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/math/ConvexHull");
require("three/examples/js/geometries/ConvexGeometry");


const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 1000);
  camera.position.set(15,20,30);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  // Setup your scene
  const scene = new THREE.Scene();

  // light
  scene.add(new THREE.AmbientLight(0x222222));
  const light = new THREE.PointLight(0xffffff, 1);
  camera.add(light);

  // helper
  scene.add(new THREE.AxesHelper(20));

  // textures
  const loader = new THREE.TextureLoader();
  const texture = loader.load('./textures/sprites/disc.png');

  // group
  const group = new THREE.Group();
  scene.add(group);

  // points
  const vertices = new THREE.DodecahedronGeometry(10).vertices;
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x0080ff,
    map: texture,
    size: 1,
    alphaTest: 0.5
  });

  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(points);

  // convex hull
  const meshMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true 
  });

  // Setup a geometry
  const meshGeometry = new THREE.ConvexBufferGeometry(vertices);

  const mesh_b = new THREE.Mesh(meshGeometry, meshMaterial);
  mesh_b.material.side = THREE.BackSide;
  mesh_b.renderOrder = 0;
  group.add(mesh_b);

  const mesh = new THREE.Mesh(meshGeometry, meshMaterial.clone());
  mesh.material.side = THREE.FrontSide;
  mesh.renderOrder = 1;
  group.add(mesh);


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
      group.rotation.y += 0.005;
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
