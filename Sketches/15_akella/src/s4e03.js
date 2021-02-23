/*
 * s4e03
 * travelling particles
 * HOLD
 */
/* eslint-disable no-undef */
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const fragment = require("../utils/s4e03/shaders/fragment.glsl");
const vertex = require("../utils/s4e03/shaders/vertex.glsl");
const canvasSketch = require("canvas-sketch");
const load = require("load-asset");

const settings = {
  dimensions: [512, 512],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true,
  },
};

// --- Clean the mess later on ---
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function(name) {
    element.setAttribute(name, attributes[name]);
  })
}

let svg = document.createElement('svg');
let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
setAttributes(newElement, {
  class: 'cls-1',
  d: "M292,1037S443.877,760.011,647,582L756,691,884,576l24,77s62.951-31.932,107-32l2,4s146.47-29.933,161-36,11.44,1.183,25-11,37.65-37.56,47-41,76,156,76,156,47.56-3.062,179,35l208,63s42.96-143.81,53-157,25.95-64.2,26-68,0,2,0,2,130.12-4.949,150-8,97.26-6.326,113-4"
});
// newElement.setAttribute("d", "M 0 0 L 10 10");
// newElement.setAttribute("class", 'cls-1');
// newElement.setAttribute("d", "M292,1037S443.877,760.011,647,582L756,691,884,576l24,77s62.951-31.932,107-32l2,4s146.47-29.933,161-36,11.44,1.183,25-11,37.65-37.56,47-41,76,156,76,156,47.56-3.062,179,35l208,63s42.96-143.81,53-157,25.95-64.2,26-68,0,2,0,2,130.12-4.949,150-8,97.26-6.326,113-4");
// newElement_1.setAttribute("class", 'cls-1');
// newElement_1.setAttribute("d", "M1904-6s-6.63,49.423-8,60-6,49-6,49-26.3,180.866-26,188,0,7,0,7-236.64-4.365-245-4,4,154,4,154l-77,2s2.99,19.305-2,23,3.18,11.805,3,18,0,116,0,116-51,4.849-58,5-2,18-2,18-105.05-9.242-109-9-38,0-38,0l-7-24-40,16,18,41L1135,754s33.91,38.935,18,59-52,43-52,43-12.19.085-14,0-92,68-92,68-8.8.867-19,12-60,92-60,92");
// svg.appendChild(newElement_0);
svg.appendChild(newElement);
document.body.appendChild(svg);

const getSVG = [...document.querySelectorAll('svg')];
console.log(getSVG[0]);

// -------------------------------

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 6);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16);
  const geometry = new THREE.PlaneGeometry(5, 5, 1, 1);

  // Setup a material
  // const material = new THREE.MeshBasicMaterial({
  //   color: "red",
  //   wireframe: true,
  // });

  // shader material
  const shdrmat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      // colors: { type: "fv1", value: colors },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    wireframe: false,
    transparent: false,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, shdrmat);
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
