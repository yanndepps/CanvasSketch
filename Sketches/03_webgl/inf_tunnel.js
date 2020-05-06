// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],   // 1000/1920
  animate: true,
  duration: 10,
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
  renderer.setClearColor("#1c1c1c", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -1);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup a scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16);
  // const geometry = new THREE.CylinderGeometry(1, 1, 19, 8);

  // Extruded Shape
  let n = 1000;
  const shape = new THREE.Shape();
  shape.moveTo(0.0, 0.2);
  // shape.lineTo(0.5, -0.5);
  // shape.lineTo(-0.5, -0.5);
  // shape.lineTo(-0.5, 0.5);
  // shape.lineTo(0.5, 0.5);

  for (let i = 0; i <= n; i++) {
    let theta = 2 * Math.PI * i / n;
    let r = 0.2 + 0.2 * Math.sin(2 * theta) ** 2;
    // let r = 0.2 + 0.2 * Math.sin(2 * theta * 2) ** 2;
    // let r = 0.2 + 0.2 * Math.sin(2 * theta / 2) ** 2;
    let x = r * Math.sin(theta);
    let y = r * Math.cos(theta);
    shape.lineTo(x, y);
  }

  const extrudeSettings = {
    steps: 150,
    depth: 40,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

  // Shaders
  // vertex shader 
  const vertex = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float playhead;
    uniform vec3 color;

    vec2 rotate(vec2 v, float a) {
      float s = sin(a);
      float c = cos(a);
      mat2 m = mat2(c, -s, s, c);
      return m * v;
    }

    void main() {
      vUv = uv;
      vPosition = position;
      vec3 newpos = position;
      newpos.xy = rotate(newpos.xy, position.z/2.);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
    }
  `;

  // fragment shader 
  const fragment = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float playhead;
    uniform vec3 color;

    void main() {
      vec3 color1 = vec3(0.531, 0.800, 0.742);
      vec3 color2 = vec3(0.198, 0.256, 0.606);
      float pi = 3.1415926;
      float fline = sin(vUv.y*6.*pi);
      float fline_a = abs(fline);
      float threshold = 0.005;
      float k = 0.;
      float sk = 0.;

      if (fline < 0.) {
        k = -1.;
      } else {
        k = 1.;
      }

      if (fline_a < threshold) {
        sk = (threshold - fline_a)/threshold;
        k = k*(1. - sk) + fline_a * sk;
      }

      k = (k + 1.)/2.;

      float fade = 12.;
      float fog = 1. - clamp((vPosition.z - 2. - playhead*6.)/fade, 0., 1.);
      vec3 finalColor = mix(color1, color2, k);
      finalColor = mix(vec3(0.), finalColor, fog);

      gl_FragColor = vec4(finalColor, 1.);
    }
  `;

  // setup a shader material
  const shdrmaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      playhead: { value: 0 }
      // color: { value: new THREE.Color("tomato") }
    },
    wireframe: false,
    side: THREE.DoubleSide,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  // setup a normal material 
  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, shdrmaterial);
  scene.add(mesh);
  // mesh.rotation.x = Math.PI / 2;
  mesh.position.z = -1;

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
      // mesh.rotation.y = time * (10 * Math.PI / 100);
      mesh.position.z = -1 - playhead * 6;
      mesh.material.uniforms.playhead.value = playhead;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
