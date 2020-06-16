// blending colors

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");
//---
// import fragment from './shaders/fragment_01.glsl';
// import vertex from './shaders/vertex_01.glsl';
//---
const fragment = require("../utils/shaders/S_02/glsl_05/fragment.glsl");
const vertex = require("../utils/shaders/S_02/glsl_05/vertex.glsl");

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
// 1. gl_FragCoord is a vec4 type which provides the coordinates of 
//    the current pixel.
// 2. it has x, y, z and w values.
// 3. remember that u_resolution provides the pixels of the window.
// ------------------------------------------------------------------------- //
// 1. the mix method :
// 2. takes 3 parameters : mix(x, y, a)
// 3. mix(x, y, 0.0) = x
// 4. mix(x, y, 1.0) = y
// 5. x * (1-a) + y * a -> linear interpolation
// 6. x and y can be floats, vec2, vec3 or vec4 values but :
// 7. x, y and return type must be the same.
// ------------------------------------------------------------------------- //
// 1. mix(x, y, a)
// 2. x = vec3(1.0, 0.0, 0.0) -> red 
// 3. y = vec3(0.0, 0.0, 1.0) -> blue
// 4. a = uv.y -> value between 0.0 and 1.0 
// ------------------------------------------------------------------------- //
// 1. Suppose a with a value of 0.25 :
// 2. mix(x,y,a) = x * (1-a) + y * a
// 3. x * (1.0 - 0.25) + y * 0.25 = x * 0.75 + y * 0.25
// 4. vec3(1.0, 0.0, 0.0) * 0.75 + vec3(0.0, 0.0, 1.0) * 0.25
// 5. vec3(0.75, 0.0, 0.0) + vec3(0.0, 0.0, 0.25) = vec3(0.75, 0.0, 0.25)
// ------------------------------------------------------------------------- //
