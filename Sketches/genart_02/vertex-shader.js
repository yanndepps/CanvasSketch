const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');
const glslify = require('glslify');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  dimensions: [512, 512],
  fps: 24,
  playbackRate: 'throttle',
  duration: 4,
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
  // const box = new THREE.BoxGeometry(1, 1, 1);
  // box.computeFlatVertexNormals();
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  geometry.computeFlatVertexNormals();
  const meshes = [];
  const palette = random.pick(palettes);

  const fragmentShader = `
    varying vec2 vUv;
    uniform vec3 color;

    void main() {
      // gl_FragColor = vec4(vec3(color * vUv.x), 1.0);
      gl_FragColor = vec4(vec3(color), 1.0);
    }
`;

  const vertexShader = glslify(`
    varying vec2 vUv;
    uniform float time;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main() {
      vUv = uv;
      vec3 pos = position.xyz;
      // vec3 transformed = position.xyz;
      // float offset = 0.0;
      // offset += 0.5 * (noise(vec4(normal.xyz * 1.0, time * 0.25)) * 0.5 + 0.5);
      // transformed += normal * offset;
      pos += normal * noise(vec4(position.xyz, time)) * 8.25; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`);

  for (let i = 0; i < 30; i++) {
    const mesh = new THREE.Mesh(
      // box,
      geometry,
      new THREE.ShaderMaterial({
        flatShading: true,
        side: THREE.DoubleSide,
        fragmentShader,
        vertexShader,
        uniforms: {
          color: { value: new THREE.Color(random.pick(palette)) },
          time: { value: 0 }
        }
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
    meshes.push(mesh);
  }

  // lights
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 40%)'));
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(1, 2, 1);
  scene.add(light);

  // bezier easing function
  const easeFn = BezierEasing(0,0,1,1);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
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
    render ({ playhead, time }) {
      const t = Math.sin( playhead * Math.PI );
      scene.rotation.x = easeFn(t); 
      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time;
        mesh.rotation.z = 0.1 * time;
      });
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
