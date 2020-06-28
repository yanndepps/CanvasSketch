// 21.48
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
let palettes = require("nice-color-palettes");
let myColors = palettes[Math.floor(Math.random() * 100)];
let colors = myColors.map(color => new THREE.Color(color));
// console.log(colors);
const fragment = require("./utils/s3e30/shaders/fragment.glsl");
const vertex = require("./utils/s3e30/shaders/vertex.glsl");
const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [ 800, 800 ],
  animate: true,
  // duration: 4,
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
  let number = 100;
  let points = [];

  for (let i = 0; i < number; i++) {
    let p = i/number;
    let x = p*Math.cos(p*40);
    let y = p*4;
    let z = p*Math.sin(p*40);
    points.push(new THREE.Vector3(x, y, z));
  }

  let curve = new THREE.CatmullRomCurve3(points);
  let geometry = new THREE.TubeGeometry(curve, 1000, 0.1, 30, false);
  let material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
  const shdrmat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      colors: { type: "fv1", value: colors },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    wireframe: false,
    transparent: false,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  let mesh = new THREE.Mesh(geometry, shdrmat);
  mesh.position.y = -2;
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
      mesh.rotation.y = time;
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
