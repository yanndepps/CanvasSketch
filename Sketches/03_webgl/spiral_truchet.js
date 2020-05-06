global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [ 800, 800 ],
  animate: true,
  duration: 6,
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
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // circle shape
  let num = 1000;
  let dots = [];
  for (let i = 0; i < num; i++) {
    let amount = i/num;
    let angle = -80 + 120 * amount;
    let k = 0.05;

    let x = 0.3*Math.exp(k*angle)*Math.sin(0.25*angle); 
    let y = 0.3*Math.exp(k*angle)*Math.cos(0.25*angle); 

    let z = Math.cos(0);

    dots.push(
      new THREE.Vector3(x,y,z)
    )
  }

  // curve from circle shape
  let curve = new THREE.CatmullRomCurve3(dots);

  const geometry = new THREE.TubeGeometry( curve, 1000, 0.01, 30, false );

  // Shaders
  // vertex shader 
  const vertex = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float playhead;
    uniform vec3 color;

    void main() {
      vUv = uv;
      vec3 newpos = position;

      newpos += 0.276*normal*( 4. * vUv.x - 0.03 );

      vPosition = newpos;
      vNormal = normal;

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

    float Hash21(vec2 p) {
      p = fract(p*vec2(2345.34, 435.345));
      p += dot(p, p+34.23);
      return fract(p.x*p.y);
    }

    void main() {
      float pi = 3.1415926;
      float angle = ( atan(vPosition.y, vPosition.x) + pi )/(2.*pi);
      vec2 nUV = 6. * vec2(7. * angle + 6. * playhead, vUv.y * 5. - 3. * playhead); 
      vec2 guv = fract(nUV) - 0.5;
      vec2 id = mod( floor(nUV), vec2(6., 6.) );
      float n = Hash21(id);
      guv.x *= 2.*step(0.5, n) - 1.;
      float d = abs(abs(guv.x + guv.y) - 0.5);
      float mask = smoothstep(-0.01, 0.01, d - 0.3);
      float diff = clamp( dot(vec3(0.,0.,1.), vNormal), 0.3, 1. );

      if (mask < 0.0001) discard;

      gl_FragColor = vec4(vec3(mask)*diff, mask);

      if (!gl_FrontFacing) {
        gl_FragColor.a *= 0.5;
      }
    }
  `;

  // setup a shader material
  const shdrMaterial = new THREE.ShaderMaterial({
    uniforms: {
      playhead: { value: 0.0 }
    },
    wireframe: false,
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    transparent: true
  });

  // setup a material
  // const material = new THREE.MeshNormalMaterial({
  //   color: 'red',
  //   wireframe: false
  // })

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, shdrMaterial);
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
    render({ time, playhead }) {
      // material.uniforms.time.value = 3 * time;
      controls.update();
      renderer.render(scene, camera);
      shdrMaterial.uniforms.playhead.value = playhead;
      mesh.rotation.z = 2 * Math.PI * playhead;
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
