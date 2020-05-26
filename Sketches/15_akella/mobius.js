// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

import { getBrick } from "./utils/s3e26/getBrick";

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const fragment = require("./utils/s3e26/shaders/fragment.glsl");
const vertex = require("./utils/s3e26/shaders/vertex.glsl");

const settings = {
  dimensions: [800, 800],
  animate: true,
  duration: 3,
  context: "webgl",
  attributes: {
    antialias: true
  }
};

const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#1d1d1d", 1);
  renderer.setScissorTest(true);

  // Setup a camera
  //const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  let frustumSize = 3;
  let aspect = 0.5 * width / height;
  const camera = new THREE.OrthographicCamera(frustumSize*aspect/-2, frustumSize*aspect/2, frustumSize/2, frustumSize/-2, -1000, 1000);
  camera.position.set(0, 2, 2);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  const scene1 = new THREE.Scene();

  let num = 15;
  let space = 0.05;
  let gr = new THREE.Group();
  scene.add(gr);

  for (let i = 0; i < num; i++) {
    let mesh = getBrick(i, num, space);
    gr.add(mesh);
  } 

 let gr1 = new THREE.Group();

  for (let i = 0; i < num; i++) {
    let mesh = getBrick(i, num, space);
    gr1.add(mesh);
  }

  gr1.rotation.x = Math.Pi/2;
  scene1.add(gr1);

  // specify an ambient/unlit color
  scene.add(new THREE.AmbientLight( '#59414f' ));
  scene1.add(new THREE.AmbientLight( '#59414f' ));

  // add some light 
  const light = new THREE.DirectionalLight('#45caf7', 1);
  const light1 = new THREE.DirectionalLight('#45caf7', 1);
  light.position.set(0,1,0);
  light1.position.set(0,1,0);
  scene.add(light);
  scene1.add(light1);

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
    render({ time, width, height }) {
      // left part
      renderer.setViewport(0,0,width/2,height);
      renderer.setScissor(0,0,width/2,height);
      renderer.render(scene, camera);
      // right part
      renderer.setViewport(width/2,0,width/2,height);
      renderer.setScissor(width/2,0,width/2,height);
      renderer.render(scene1, camera);

      //mesh.rotation.y = time * (10 * Math.PI / 100);
      controls.update();
      
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
