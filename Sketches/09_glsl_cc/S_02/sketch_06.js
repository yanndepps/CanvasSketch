// uniforms and varyings

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");
//---
// import fragment from './shaders/fragment_01.glsl';
// import vertex from './shaders/vertex_01.glsl';
//---
const fragment = require("../utils/shaders/S_02/glsl_06/fragment.glsl");
const vertex = require("../utils/shaders/S_02/glsl_06/vertex.glsl");

const settings = {
  dimensions: [800, 800],
  animate: true,
  // duration: 2,
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

  // mouse event listener
  function move(evt){
    uniforms.u_mouse.value.x = (evt.touches) ? evt.touches[0].clientX : evt.clientX;
    uniforms.u_mouse.value.y = (evt.touches) ? evt.touches[0].clientY : evt.clientY;
  }

  window.addEventListener('mousemove', move);

  // WebGL background color
  renderer.setClearColor("#1c1c1c", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.PlaneGeometry(2, 2);

  // Uniforms
  const uniforms = { 
    time: { value: 0.0 },
    playhead: { value: 0.0 },
    u_color: { value: new THREE.Color(0xfffd01) },
    u_resolution: { value: { x: 0.0, y: 0.0 } },
    u_mouse: { value: {x: 0.0, y: 0.0} }
  }

  // setup a shader material
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms, 
    vertexShader: vertex,
    fragmentShader: fragment,
    wireframe: false,
    side: THREE.DoubleSide
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
    render({ time, playhead, width, height }) {
      // mesh.rotation.y = time * (10 * Math.PI / 100);
      // mesh.rotation.y = playhead * Math.PI*2;
      // mesh.material.uniforms.playhead.value = playhead;
      // mesh.material.uniforms.time.value = time * (10 * Math.PI /100);
      uniforms.u_resolution.value.x = width;
      uniforms.u_resolution.value.y = height;
      // uniforms.time.value = time;
      // ---
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
      window.removeEventListener('mousemove', move);
    }
  };
};

canvasSketch(sketch, settings);

// ---------------------------- NOTES -------------------------------------- //
// 1. pass values into the shaders using uniforms.
// 2. thos values can be integers, floats, vectors or images.
// 3. it must be delared : name and type + the keyword uniform.
// ------------------------------------------------------------------------- //
// 1. a varying is a variable that we pass from the vertex to 
//    the fragment shader.
// 2. how can we get the uv in a fragment shader ?
// 3. we use varying value.
// 4. varying vec2 v_uv
// ------------------------------------------------------------------------- //