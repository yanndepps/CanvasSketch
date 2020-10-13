// @ts-nocheck
/* eslint-disable no-undef */
// @ts-ignore
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const fragment = require("./utils/s3e37/shaders/fragment.glsl");
const fragment1 = require("./utils/s3e37/shaders/fragment1.glsl");
const vertex = require("./utils/s3e37/shaders/vertex.glsl");
const vertex1 = require("./utils/s3e37/shaders/vertex1.glsl");
const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [640, 640],
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

  // Ortho Cam
  const frustumSize = 0.9;
  const aspect = 1;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,
    1000
  );
  camera.position.set(0, 0, 2);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // object count
  let gridSize = 1;
  let size = 80;
  let cellSize = gridSize / size;

  // Setup a geometry
  const geometry = new THREE.PlaneBufferGeometry(cellSize, cellSize);
  const geo1 = new THREE.PlaneBufferGeometry(1, 1);

  // setup a texture
  const loader = new THREE.TextureLoader();
  const chars = loader.load("./utils/s3e37/assets/chars.png");

  // shader material
  const shdrmat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    // side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      // chars: { type: "t", value: new THREE.TextureLoader().load('./utils/s3e37/assets/chars.png') },
      chars: { type: "t", value: chars },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    wireframe: false,
    transparent: false,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  const shdrmat1 = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    // side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0.0 },
      time: { type: "f", value: 0.0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      canvas: { type: "t", value: null },
      chars: { type: "t", value: chars },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    wireframe: false,
    transparent: false,
    vertexShader: vertex1,
    fragmentShader: fragment1,
  });

  // Setup a mesh with geometry + material
  const plane = new THREE.InstancedMesh(geometry, shdrmat, size ** 2);
  let scales = new Float32Array(size ** 2);
  const mesh1 = new THREE.Mesh(geo1, shdrmat1);

  // dummy
  let dummy = new THREE.Object3D();
  let count = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      dummy.position.set(j * cellSize - 0.5, -i * cellSize + 0.5);
      dummy.updateMatrix();
      scales.set([Math.random()], count);
      plane.setMatrixAt(count++, dummy.matrix);
    }
  }

  plane.instanceMatrix.needsUpdate = true;
  plane.geometry.setAttribute(
    "instanceScale",
    new THREE.InstancedBufferAttribute(scales, 1)
  );

  scene.add(plane);
  scene.add(mesh1);

  const video = document.createElement("video");
  const canvas2d = document.createElement("canvas");
  const canvas2d2 = document.createElement("canvas");
  const ctx = canvas2d.getContext("2d");
  const ctx2 = canvas2d2.getContext("2d");
  let mv = new THREE.CanvasTexture(canvas2d2);
  shdrmat1.uniforms.canvas.value = mv;

  const initVideo = () => {
    video.setAttribute("id", "video");
    video.setAttribute("src", "./utils/s3e37/assets/build_01.mp4");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");

    canvas2d.width = size;
    canvas2d.height = size;
    canvas2d2.width = width / 2;
    canvas2d2.height = height;

    // document.body.appendChild(canvas2d);
    // document.body.appendChild(canvas2d2);

    video.addEventListener(
      "play",
      () => {
        timerCallback();
      },
      false
    );
  };

  const timerCallback = () => {
    console.log('timer callback')
    if (video.paused || video.ended) {
      return;
    }
    computeFrame();
    setTimeout(function () {
      timerCallback();
    }, 0);
  };

  const computeFrame = () => {
    let scales = new Float32Array(size ** 2);
    ctx.drawImage(video, 0, 0, size, size);
    ctx2.drawImage(video, 0, 0, width / 2, height);
    let imageData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      scales.set([1 - imageData.data[i] / 255], i / 4);
      // scales.set([imageData.data[i] / 255], i / 4);
    }
    plane.geometry.attributes.instanceScale.array = scales;
    plane.geometry.attributes.instanceScale.needsUpdate = true;
    mv.needsUpdate = true;
  };

  initVideo();

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      // @ts-ignore
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
