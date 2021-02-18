global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");
// import shaders
const vertex = require("../utils/s3e29/shaders/vertex.glsl");
const fragment = require("../utils/s3e29/shaders/fragment.glsl");
const fragment1 = require("../utils/s3e29/shaders/fragment1.glsl");

const settings = {
  dimensions: [800, 800],
  animate: true,
  duration: 15,
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
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(1.3, 1.3, 1.3);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  let number = 50;
  let geometry = new THREE.PlaneBufferGeometry(1, 1).rotateX(Math.PI / 2);
  // let material = new THREE.MeshBasicMaterial({
  //   wireframe: true
  // });
  // setup a shader material
  const shdrmat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      level: { type: "f", value: 0.0 },
      black: { type: "f", value: 0.0 },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  const planemat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      level: { type: "f", value: 0.0 },
      black: { type: "f", value: 0.0 },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment1,
  });

  let group = new THREE.Group();
  group.position.y = -0.5;
  scene.add(group);

  let shdrmats = [];

  for (let i = 0; i <= number; i++) {
    let level = i / number;
    let m0 = shdrmat.clone();
    let m1 = shdrmat.clone();

    shdrmats.push(m0);
    shdrmats.push(m1);

    m0.uniforms.black.value = 1;
    m1.uniforms.black.value = 0;
    m0.uniforms.level.value = level;
    m1.uniforms.level.value = level;

    let mesh = new THREE.Mesh(geometry, m0);
    let mesh1 = new THREE.Mesh(geometry, m1);

    mesh.position.y = level;
    mesh1.position.y = level - 0.005;

    if (i == number) {
      mesh1.position.y = level - 1 / number;
    }

    group.add(mesh);
    group.add(mesh1);
  }

  let mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(6, 6).rotateX(Math.PI / 2),
    planemat
  );
  mesh.position.y = 0.4;
  group.add(mesh);

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
    render({ time, playhead }) {
      // shdrmat.uniforms.playhead.value = playhead;
      shdrmats.forEach((m) => {
        m.uniforms.playhead.value = playhead;
      });
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
