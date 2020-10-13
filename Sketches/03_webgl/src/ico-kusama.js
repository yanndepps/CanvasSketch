// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glslify = require("glslify");
const rndm = require("canvas-sketch-util/random");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  // increase the details of the geom to add points 
  const baseGeom = new THREE.IcosahedronGeometry(1, 1);
  const points = baseGeom.vertices;
  // console.log(points);

  const circleGeom = new THREE.CircleGeometry(1, 32);

  points.forEach(point => {
    // create a mesh for each of the ico points 
    const mesh = new THREE.Mesh(
      // geometry, 
      circleGeom,
      new THREE.MeshBasicMaterial({
        color: 'white',
        wireframe: false,
        // show only the back of the circles
        side: THREE.BackSide
      })
    );
    // position the new meshes at the ico points 
    mesh.position.copy(point);
    // mesh.position.copy(point).multiplyScalar(1.05);
    // scale them down
    mesh.scale.setScalar(rndm.range(0.25, 1) * 0.2);
    // mesh.scale.setScalar(rndm.gaussian() * 0.20);
    // snap the meshes to the surface 
    mesh.lookAt(new THREE.Vector3());
    // add them to the scene 
    scene.add(mesh);
  });

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color("tomato") }
    },
    vertexShader: /* glsl */ `
    varying vec3 vPosition;
    varying vec2 vUv;
    void main () {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: glslify(/* glsl */ `
    #pragma glslify: noise = require('glsl-noise/simplex/3d');
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform vec3 color;
    uniform float time;
    void main () {
      gl_FragColor = vec4(vec3(color), 1.0);
    }
  `) 
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
      material.uniforms.time.value = time;
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
