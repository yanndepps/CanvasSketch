const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');
global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

const settings = {
  dimensions: [512, 512],
  fps: 24,
  playbackRate: 'throttle',
  duration: 4,
  animate: true,
  context: 'webgl',
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
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
      new THREE.MeshPhysicalMaterial({
        color: random.pick(palette),
        metalness: 0,
        roughness: 1,
        flatShading: true,
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
      random.range(-1, 1)
    );

    // scale our meshes down a bit
    mesh.scale.multiplyScalar(0.5);

    scene.add(mesh);
  }

  // lights
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 40%)'));
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(1, 2, 1);
  scene.add(light);

  // bezier easing function
  const easeFn = BezierEasing(0.17, 0.67, 0.83, 0.67);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      // aspect ratio while using ortho camera
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.25;

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
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI);
      // using eases module
      // scene.rotation.z = eases.expoInOut(t);
      // using bezier easing
      scene.rotation.z = easeFn(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
