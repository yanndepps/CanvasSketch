// s3e48 - raymarching simple scene
/* eslint-disable no-undef */
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const fragment = require("../utils/s3e48/shaders/fragment.glsl");
const vertex = require("../utils/s3e48/shaders/vertex.glsl");
const dat = require("dat.gui");
const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [600, 600],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true,
  },
};

const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#1c1c1c", 1);

  // GUI
  let setprog;
  const setGui = () => {
     setprog = {
      progress: 0,
    };
    // const gui = new dat.GUI();
    // gui.add(setprog, "progress", 0, 1, 0.01);
  }

  setGui();

  // mouse event listener
  let mouse = new THREE.Vector2();
  const mouseEvent = () =>  {
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.pageX/width - 1.1; // 0.5
      mouse.y = -e.pageY/height + 0.6;
    })
  }

  mouseEvent();

  // ortho camera
  const frustumSize = 4;
  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,
    1000
  );
  // const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.PlaneGeometry(5, 5, 1, 1);

  // shader material
  const loader = new THREE.TextureLoader();

  const mat_01 = loader.load("../utils/s3e48/assets/skin_d.png");
  const mat_02 = loader.load("../utils/s3e48/assets/skin_g.png");

  const shdrmat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0.0 },
      matcap: { value: mat_01 },
      matcap1: { value: mat_02 },
      mouse: { value: new THREE.Vector2(0,0) },
      progress: { value: 0.0 },
      resolution: { value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    // wireframe: false,
    // transparent: false,
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
      shdrmat.uniforms.time.value = 3 * time;
      shdrmat.uniforms.progress.value = setprog.progress;
      shdrmat.uniforms.resolution.value.x = width;
      shdrmat.uniforms.resolution.value.y = height;
      if (mouse) {
        shdrmat.uniforms.mouse.value = mouse;
        // console.log(mouse);
      }
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
