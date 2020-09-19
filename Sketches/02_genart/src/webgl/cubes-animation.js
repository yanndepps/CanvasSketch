// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');
const eases = require('eases');

const settings = {
  dimensions: [512, 512],
  // dimensions: [21, 21],
  // units: 'cm',
  // pixelsPerInch: 300,
  fps: 24,
  duration: 12,
  animate: true,
  context: 'webgl',
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    context,
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 15%)', 1);

  const camera = new THREE.OrthographicCamera();
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry(1, 1, 1);
  const palette = random.pick(palettes);

  // test
  let anim = [];
  let gr = new THREE.Group();
  scene.add(gr);

  for (let i = 0; i < 20; i++) {
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
      random.range(-1, 1)
    );

    // scale our meshes down a bit
    mesh.scale.multiplyScalar(0.6);
    gr.add(mesh);
    anim.push({ mesh: mesh });
  }

  // add an ambient light using hsl to produce a very low intensity gray
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
  // add a light
  const light = new THREE.DirectionalLight('hsl(0, 0%, 100%)', 1);
  // add it to our scene
  scene.add(light);
  // postion it above the scene such as to cast no shadows
  light.position.set(0, 4, 2);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
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
    render({ playhead }) {
      anim.forEach((m, i) => {
        // using eases
        const t = Math.sin(Math.PI * playhead);
        m.mesh.scale.x = 1 * random.noise3D(i * 1, i * 1, eases.expoInOut(t));
        m.mesh.scale.y = 2 * random.noise3D(i * 1, i * 1, eases.expoInOut(t));
        m.mesh.scale.z = 1 * random.noise3D(i * 1, i * 1, eases.expoInOut(t));
        // using sin
        // m.mesh.scale.x = 1 * random.noise3D(i * 1, i * 1, Math.sin(Math.PI * playhead) * 2);
        // m.mesh.scale.y = 2 * random.noise3D(i * 1, i * 1, Math.sin(Math.PI * 2 * playhead));
        // m.mesh.scale.z = 1 * random.noise3D(i * 1, i * 1, Math.sin(Math.PI * playhead) * 2);
        // m.mesh.rotation.y = 1 * random.noise3D(i*1, i*1, playhead);
      });
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
