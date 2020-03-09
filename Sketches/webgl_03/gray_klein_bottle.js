// @ts-nocheck
// 14:30
// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true
  }
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#407060", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup a scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  // console.log(geometry);

  // Shaders 
  // vertex shader 
  const vertex = /* glsl */ `
    // ---
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;

    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // fragment shader 
  const fragment = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform vec3 color;

    void main() {
      // --
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color("#ff665e") }
    },
    wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
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
    render({ time }) {
      //material.uniforms.time.value = time;
      geometry.vertices.forEach(vector => {
        let u = (vector.x + 0.5) * Math.PI * 2;
        let v = (vector.y + 0.5) * Math.PI;

        vector.x = Math.sin(u) * Math.sin(v);
        vector.y = Math.sin(u) * Math.cos(v);
        vector.z = Math.cos(u);
        //v.z = 0.5 * Math.sin(v.y * 50);
      });
      geometry.verticesNeedsUpdate = true;

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
