const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Frame it
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  const camera = new THREE.OrthographicCamera();
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry(1, 1, 1);
  const palette = random.pick(palettes);

  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette), 
      })
    );
    // set a random position for each of these cubes
    mesh.position.set(
      // a random number between a min and a max
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    // set a random scale for each cubes
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    );

    // scale our meshes down a bit
    mesh.scale.multiplyScalar(0.5);
    
    scene.add(mesh);
  }

  // add an ambient light using hsl to produce a very low intensity gray
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 40%)'));
  // add a light
  const light = new THREE.DirectionalLight('white', 1);
  // add it to our scene
  scene.add(light);
  // postion it above the scene such as to cast no shadows
  light.position.set(0, 0, 4);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      // aspect ratio while using ortho camera
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 3.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ playhead }) {
      scene.rotation.x = playhead * Math.PI * 2;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
