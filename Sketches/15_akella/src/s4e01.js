/*
 * s4e01
 * hyperbolic helicoid
 * 27.38
 */
/* eslint-disable no-undef */
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const fragment = require("../utils/s4e01/shaders/fragment.glsl");
const vertex = require("../utils/s4e01/shaders/vertex.glsl");
const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [512, 512],
  animate: true,
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
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a parametric geometry
  let geometry = new THREE.IcosahedronBufferGeometry(1, 5);

  function Helicoid(u, v, target) {
    let alpha = Math.PI * 2 * (u - 0.5);
    let theta = Math.PI * 2 * (v - 0.5);
    let t = 5;
    let bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);

    let x = Math.sinh(alpha) * Math.cos(t * theta) / bottom;
    let z = Math.sinh(alpha) * Math.sin(t * theta) / bottom;
    let y = Math.cosh(alpha) * Math.sinh(theta) / bottom;
    target.set(x, y, z);
  }

  geometry = new THREE.ParametricGeometry(Helicoid, 100, 100);

  // Setup a material
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0,
    metalness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.4,
    side: THREE.DoubleSide,
    wireframe: false
  });

  // Setup a shader material
  // shader material
  // const shdrmat = new THREE.ShaderMaterial({
  //   extensions: {
  //     derivatives: "#extension GL_OES_standard_derivatives : enable",
  //   },
  //   side: THREE.DoubleSide,
  //   uniforms: {
  //     playhead: { type: "f", value: 0.0 },
  //     time: { type: "f", value: 0.0 },
  //     resolution: { type: "v4", value: new THREE.Vector4() },
  //     // colors: { type: "fv1", value: colors },
  //     uvRate1: {
  //       value: new THREE.Vector2(1, 1),
  //     },
  //   },
  //   wireframe: true,
  //   transparent: false,
  //   vertexShader: vertex,
  //   fragmentShader: fragment,
  // });

  // Setup a mesh with geometry + material

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // add ambient light
  scene.add(new THREE.AmbientLight(0xcccccc, 0.5));
  // add directional light
  let light = new THREE.DirectionalLight(0xffffff, 1.);
  light.position.x = 1;
  light.position.y = 0;
  light.position.z = 1;
  scene.add(light);



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
