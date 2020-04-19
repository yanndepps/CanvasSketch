// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],   // 1000/1920
  animate: true,
  duration: 4,
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
  camera.position.set(0, 0, -8);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup a scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16);
  // const geometry = new THREE.CylinderGeometry(1, 1, 19, 8);

  // Extruded Shape

  const shape = new THREE.Shape();
  shape.moveTo(0.5, 0.5);
  shape.lineTo(0.5, -0.5);
  shape.lineTo(-0.5, -0.5);
  shape.lineTo(-0.5, 0.5);
  shape.lineTo(0.5, 0.5);

  const extrudeSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
  };

  const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

  // Shaders
  // vertex shader 
  const vertex = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform vec3 color;

    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // fragment shader 
  const fragment = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform vec3 color;

    void main() {
      // vec3 color = (1.0, .0, .0);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // setup a shader material
  const shdrmaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color("tomato") }
    },
    wireframe: false,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  // setup a normal material 
  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  // mesh.rotation.x = Math.PI / 2;

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
      mesh.rotation.y = time * (10 * Math.PI / 100);
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
