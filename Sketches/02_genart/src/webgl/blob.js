// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');
const glslify = require('glslify');
global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

const settings = {
  dimensions: [512, 512],
  animate: true,
  context: 'webgl',
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 15%)', 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, 4);
  camera.lookAt(new THREE.Vector3());
  const controls = new THREE.OrbitControls(camera);

  const scene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const meshes = [];
  const palette = random.pick(palettes);

  const fragmentShader = glslify(/* glsl */`
    varying vec2 vUv;
    uniform vec3 color;
    uniform float time;
    #pragma glslify: noise = require('glsl-noise/simplex/3d');

    void main() {
      float offset = 0.06 * noise(vec3(vUv.xy * 8.0, time));
      gl_FragColor = vec4(vec3(color * vUv.y + offset), 1.0);
    }
`);

  const vertexShader = glslify(/* glsl */ `
    varying vec2 vUv;
    uniform float time;
    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main() {
      vUv = uv;
      vec3 pos = position.xyz;
      vec3 transformed = position.xyz;
      float offset = 0.0;
      offset += 0.05 * noise(vec4(pos.xyz * 10.0, 0.0));
      offset += 0.15 * noise(vec4(pos.xyz * 5.5, time * 0.5));
      offset += 0.25 * noise(vec4(pos.xyz * 100.0, 0.0));
      transformed += normal * offset;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`);

  for (let i = 0; i < 1; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.ShaderMaterial({
        flatShading: true,
        side: THREE.DoubleSide,
        fragmentShader,
        vertexShader,
        uniforms: {
          color: { value: new THREE.Color(random.pick(palette)) },
          time: { value: 0 }
        }
      })
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
    meshes.push(mesh);
  }

  // lights
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 40%)'));
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 4, 2);
  scene.add(light);

  // bezier easing function
  const easeFn = BezierEasing(0, 0, 1, 1);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      const t = Math.sin(time * Math.PI);
      // scene.rotation.x = easeFn(t); 
      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time;
      });
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
