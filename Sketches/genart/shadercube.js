// Creative Coding in Canvas & WebGL : Part II

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/1000.json');
const eases = require('eases');
const BezierEasing = require('bezier-easing');
const glslify = require('glslify');

// Assign THREE to global for the examples/
global.THREE = require('three');

// Include any additional ThreeJS utilities
require('three/examples/js/controls/OrbitControls');

// Parameters for the sketch
const settings = {
  dimensions: [ 512, 512],
  fps: 24,
  duration: 8,
  animate: true, // Ensure we get an animation loop
  context: 'webgl', // Setup WebGL instead of 2D canvas
  attributes: { antialias: true } // Turn on MSAA
};

const sketch = ({ context }) => {
  // create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });
  


  // Setup a 3D ortho camera
  const camera = new THREE.OrthographicCamera();

  const scene = new THREE.Scene();
  
  // const palette = random.pick(palettes);
  let palette = random.pick(palettes);
  palette = random.shuffle(palette);
  palette = palette.slice(0, random.rangeFloor(2, palette.length+1));
  const background = palette.shift(); 
  console.log(palette);

  // WebGL background color

  // renderer.setClearColor('hsl(0, 0%, 85%)', 1);
  renderer.setClearColor(background);

  const fragmentShader = glslify(`
    varying vec2 vUv;
    uniform vec3 color;
    // uniform float playhead;

    // #pragma glslify: noise = require('glsl-noise/simplex/3d');

    void main () {
      // float offset = 0.2*noise(vec3(vUv.xy*7.0, playhead));
      gl_FragColor = vec4(vec3(color * vUv.y), 1.0);     
    }
 `);
  
  const vertexShader = glslify(`
    varying vec2 vUv;
    // uniform float time;
    uniform float playhead;
 
    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main () {
     vUv = uv;
     vec3 pos = position.xyz;
     pos += 0.05 * normal * noise(vec4(pos.xyz * 10.0, 0.0));
     pos += 0.25 * normal * noise(vec4(pos.xyz * 1.0, playhead));
     pos += 0.05 * normal * noise(vec4(pos.xyz * 100.0, 0.0));
     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
    }
 `);

  // Add basic ThreeJS mesh
  const box = new THREE.SphereGeometry(3, 64, 64);
  const meshes = [];
  
  for (let i = 0; i < 30; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
          color: { value: new THREE.Color(random.pick(palette)) },
          time: { value: 0 },
          playhead: { value: 0 }
        }
      })
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.80);
    scene.add(mesh);
    meshes.push(mesh);
  }
  
  // specify an ambient/unlit color
  scene.add(new THREE.AmbientLight('#ef00ef'));
  
  // add some light
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 0, 4).multiplyScalar(1.5);
  scene.add(light);

  // bezier-easing function from cubic-bezier.com
  // const easeFn = BezierEasing(0,-0.15,1,-0.36);
  
  // return and render
  return {
    // Handle window resize events
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      // Isometric ThreeJS Camera
      const aspect = viewportWidth / viewportHeight;
      // Ortho zoom
      const zoom = 2.0;
      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      // Near/Far
      camera.near = -100;
      camera.far = 100;
      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      // Update the camera
      camera.updateProjectionMatrix();
    },

    // Render each frame
    render ({ playhead, time }) {
      const t = Math.sin(playhead * Math.PI);
      // scene.rotation.z = eases.expoInOut(t); 
      
      meshes.forEach(mesh => {
        mesh.material.uniforms.playhead.value = playhead*eases.circInOut(t);
        mesh.rotation.z = eases.expoInOut(t);
      });

      renderer.render(scene, camera);
    },

    // dispose of events & renderer for clean and fast reloads
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
