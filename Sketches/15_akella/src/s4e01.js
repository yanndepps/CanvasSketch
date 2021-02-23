/*
 * s4e01
 * hyperbolic helicoid
 */
/* eslint-disable no-undef */
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const fragment = require("../utils/s4e01/shaders/fragment.glsl");
const vertex = require("../utils/s4e01/shaders/vertex.glsl");
const canvasSketch = require("canvas-sketch");
const { Uniform } = require("three");

const settings = {
  dimensions: [800, 800],
  animate: true,
  duration: 4,
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a parametric geometry
  let geometry = new THREE.IcosahedronBufferGeometry(1, 5);

  function Helicoid(u, v, target) {
    let alpha = Math.PI * 2 * (u - 0.5);
    let theta = Math.PI * 2 * (v - 0.5);
    let t = 4;
    let bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);

    let x = Math.sinh(alpha) * Math.cos(t * theta) / bottom;
    let z = Math.sinh(alpha) * Math.sin(t * theta) / bottom;
    let y = 1.5 * Math.cosh(alpha) * Math.sinh(theta) / bottom;
    target.set(x, y, z);
  }

  geometry = new THREE.ParametricGeometry(Helicoid, 100, 100);

  // Setup a material
  function getMaterial() {
    let material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0,
      metalness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.4,
      side: THREE.DoubleSide,
      wireframe: false
    });
    material.onBeforeCompile = function(shader) {
      // console.log(shader, 'hello');
      shader.uniforms.playhead = { value: 0 };
      shader.fragmentShader = `uniform float playhead;\n` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <logdepthbuf_fragment>",
        `
        float diff = dot(vec3(1.), vNormal);

        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.00, 0.10, 0.20);
        vec3 cc = a + b * cos(2. * 3.141592 * (c * diff + d + playhead * 0.));

        diffuseColor.rgb = vec3(diff,0.,0.);
        diffuseColor.rgb = cc;
        ` + '#include <logdepthbuf_fragment>'
      );
      material.userData.shader = shader;
    }
    return material;
  }

  let material = getMaterial();

  // Setup a shader material
  // shader material
  // const shdrmat = new THREE.ShaderMaterial({
  //   extensions: {
  //     derivatives: "#extension GL_OES_standard_derivatives : enable",
  //   },
  //   side: THREE.DoubleSide,
  //   uniforms: {
  //     playhead: { type: "f", value: 0.0 },
  //     time: { type: "f", value: 0.0 },
  //     resolution: { type: "v4", value: new THREE.Vector4() },
  //     // colors: { type: "fv1", value: colors },
  //     uvRate1: {
  //       value: new THREE.Vector2(1, 1),
  //     },
  //   },
  //   wireframe: true,
  //   transparent: false,
  //   vertexShader: vertex,
  //   fragmentShader: fragment,
  // });

  // Setup a mesh with geometry + material

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.castShadow = mesh.receiveShadow = true;

  // first ball geo
  let geom = new THREE.IcosahedronBufferGeometry(0.26, 5);
  let ball_1 = new THREE.Mesh(geom, getMaterial());
  let ball_2 = new THREE.Mesh(geom, getMaterial());
  ball_1.castShadow = ball_1.receiveShadow = true;
  ball_2.castShadow = ball_2.receiveShadow = true;
  scene.add(ball_1);
  scene.add(ball_2);

  // add ambient light
  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  // add directional light
  let light = new THREE.DirectionalLight(0xffffff, 1.);
  light.position.x = 1;
  light.position.y = 1;
  light.position.z = 1;
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.right = 2;
  light.shadow.camera.left = -2;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  // light.shadow.bias = 0.000001;
  scene.add(light);



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
      if (material.userData.shader) {
        // console.log(material.userData.shader.uniforms.playhead);
        material.userData.shader.uniforms.playhead.value = playhead;
      }
      if (ball_1 && ball_2) {
        let theta = playhead * 2 * Math.PI;
        let theta_1 = playhead * 2 * Math.PI + Math.PI;
        ball_1.position.x = 0.5 * Math.sin(theta);
        ball_1.position.z = 0.5 * Math.cos(theta);
        ball_2.position.x = 0.5 * Math.sin(theta_1);
        ball_2.position.z = 0.5 * Math.cos(theta_1);
      }
      mesh.rotation.y = playhead * Math.PI * 2;
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
