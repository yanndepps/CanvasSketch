// Creative Coding in Canvas & WebGL : Part II
// pause at : 4:11:13

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');

// Assign THREE to global for the examples/
global.THREE = require('three');

// Include any additional ThreeJS utilities
require('three/examples/js/controls/OrbitControls');

// Parameters for the sketch
const settings = {
  dimensions: [ 512, 512],
  fps: 24,
  duration: 4,
  animate: true, // Ensure we get an animation loop
  context: 'webgl', // Setup WebGL instead of 2D canvas
  attributes: { antialias: true } // Turn on MSAA
};

const sketch = ({ context }) => {
  // create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });
  
  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 85%)', 1);

  // Setup a 3D perspective camera
  const camera = new THREE.OrthographicCamera();

  const scene = new THREE.Scene();
  
  const palette = random.pick(palettes);

  // Add basic ThreeJS mesh
  const box = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
        roughness: 1,
        transparent: true,
        opacity: 0.75
      })
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }
  
  // specify an ambient/unlit color
  scene.add(new THREE.AmbientLight('#ef00ef'));
  
  // add some light
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 0, 4).multiplyScalar(1.5);
  scene.add(light);

  // bezier-easing function from cubic-bezier.com
  const easeFn = BezierEasing(0,-0.15,1,-0.36);
  
  // return and render
  return {
    // Handle window resize events
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      // Isometric ThreeJS Camera
      const aspect = viewportWidth / viewportHeight;
      // Ortho zoom
      const zoom = 2.0;
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

    // Render each frame
    render ({ playhead }) {
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.y = eases.expoInOut(t); 
      // scene.rotation.y = easeFn(t); 
      renderer.render(scene, camera);
    },

    // dispose of events & renderer for clean and fast reloads
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
