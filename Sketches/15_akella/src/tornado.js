// 53.23
global.THREE = require("three");

import vertex from "./utils/s3e28/shaders/vertex.glsl";
import fragment from "./utils/s3e28/shaders/fragment.glsl";

require("three/examples/js/controls/OrbitControls");

// const vertex = require("./utils/s3e28/shaders/vertex.glsl");
// const fragment = require("./utils/s3e28/shaders/fragment.glsl");

const colors = require("nice-color-palettes");
let palette = colors[Math.floor(Math.random() * 100)];
// console.log(palette);
const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
  animate: true,
  duration: 2,
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
  renderer.setClearColor("#000000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 8);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // setup a shader material
  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      off: { type: "f", value: 0.0 },
      color: { type: "v3", value: new THREE.Color("#000000") },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  // setup a geometry
  function range(min, max) {
    return min + Math.random() * (max - min);
  }

  let number = 250;
  let animated = [];

  scene.rotation.z = Math.PI / 9;

  for (let i = 0; i < number; i++) {
    let level = range(-300, 300);
    let zero = level / 300;
    // console.log(zero);
    let precision = 100;
    // let rad = 130*zero*zero + Math.random()*10;
    // let rad = 130*Math.sin(zero*10) + Math.random()*10;
    // let rad = 130*(Math.sin(zero*4) + Math.sin(zero*10)) + Math.random()*10;
    let rad = 130 * zero + Math.random() * 10;
    let spline = [];
    let off = Math.abs(zero);
    let wdt = Math.random() * 0.5 + 0.5;
    let angle = range(0, 2 * Math.PI);
    let center = {
      x: range(-10, 10),
      y: range(-10, 10),
    };

    for (let j = 0; j <= precision * wdt; j++) {
      // let x = rad * Math.sin(Math.PI*2*j/precision);
      // let z = rad * Math.cos(Math.PI*2*j/precision);
      let x =
        range(-2, 2) * zero + rad * Math.sin((Math.PI * 2 * j) / precision);
      let z =
        range(-2, 2) * zero + rad * Math.cos((Math.PI * 2 * j) / precision);
      // let x = center.x + rad * Math.sin(Math.PI*2*j/precision);
      // let z = center.y + rad * Math.cos(Math.PI*2*j/precision);
      spline.push(new THREE.Vector3(x, level, z));
    }

    let sampleClosedSpline = new THREE.CatmullRomCurve3(spline);

    let params = {
      scale: 4,
      extrusionSegments: 400,
      radiusSegments: 16,
      closed: false,
    };

    let tubeGeometry = new THREE.TubeBufferGeometry(
      sampleClosedSpline,
      params.extrusionSegments,
      0.5,
      params.radiusSegments,
      params.closed
    );
    let tubeGeometry1 = new THREE.TubeBufferGeometry(
      sampleClosedSpline,
      params.extrusionSegments,
      0.5 + 0.5,
      params.radiusSegments,
      params.closed
    );

    let m = material.clone();
    let m1 = material.clone();

    // m.uniforms.color.value = new THREE.Color('#fff');
    m.uniforms.color.value = new THREE.Color(
      palette[Math.floor(Math.random() * 5)]
    );
    m.uniforms.off.value = off;
    m1.uniforms.off.value = off;

    m1.side = THREE.BackSide;

    let mesh = new THREE.Mesh(tubeGeometry, m);
    let mesh1 = new THREE.Mesh(tubeGeometry1, m1);

    mesh.scale.set(0.01, 0.01, 0.01);
    mesh1.scale.set(0.01, 0.01, 0.01);

    mesh.rotation.y = mesh1.rotation.y = angle;

    scene.add(mesh);
    scene.add(mesh1);

    animated.push({
      mesh: mesh,
      material: m,
      material1: m1,
    });
  }

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
    render({ playhead }) {
      animated.forEach((o) => {
        o.material.uniforms.playhead.value = playhead;
        o.material1.uniforms.playhead.value = playhead;
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
