// @ts-nocheck
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true,
  },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereBufferGeometry(1, 462, 462);

  // Setup a material
  // particle shaders
  const vertexParticles = /* glsl */ `
    uniform float time;
    varying vec2 vUv;
    varying vec4 vPosition;

    void main() {
      vUv = uv;
      vec3 p = position;

      p.y += 0.1 * (sin(p.y * 5. + time) * 0.5 + 0.5);
      p.z += 0.05 * (sin(p.y * 10. + time) * 0.5 + 0.5);

      vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
      gl_PointSize = 5. * (1. / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition; 
    }
  `;

  const fragmentParticles = /* glsl */ `
    uniform float time; 

    void main() {
      gl_FragColor = vec4(0.826, 0.999, 0.999, 0.4);
    }
  `;

  // vertex shader
  const vertexShader = /* glsl */ `
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vColor;
    varying vec3 vNormal;
    uniform float time;

    //	Simplex 3D Noise 
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

// Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
}
    // convert hsl to rgb space
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // main 
    void main() {
      float noise = snoise(position*7.0 + time/20.0);
      vec3 newposition = position*( noise+0.5 );
      vColor = hsv2rgb(vec3(noise*0.1+0.03, 0.8, 0.8)); 
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    varying vec3 vPosition;
    varying vec2 vUv;
    // uniform vec3 color;
    // uniform vec3 pointColor;
    varying vec3 vColor;
    varying vec3 vNormal;
    uniform float time;

    void main() {
      vec3 light = vec3(0.);
      vec3 ligthDirection = normalize( vec3(0., -1., 1.) );
      vec3 skyColor = vec3(1.000, 1.000, 0.547);
      vec3 groundColor = vec3(0.562, 0.275, 0.111);

      light += dot(ligthDirection, vNormal);
      light = mix(skyColor, groundColor, dot(ligthDirection, vNormal));

      gl_FragColor = vec4(vColor, 1.0);
      gl_FragColor = vec4(light*vColor, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    wireframe: false,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  // points material
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    transparent: true,
    vertexShader: vertexParticles,
    fragmentShader: fragmentParticles,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // uniform distribution of points on the sphere, using golden ratio
  let N = 60000;
  let positions = new Float32Array(N * 3);
  const particleGeo = new THREE.BufferGeometry();

  let inc = Math.PI * (3 - Math.sqrt(5));
  let offset = 2 / N;
  let rad = 1.7;

  for (let i = 0; i < N; i++) {
    let y = i * offset - 1 + offset / 2;
    let r = Math.sqrt(1 - y * y);
    let phi = i * inc;

    positions[3 * i] = rad * Math.cos(phi) * r;
    positions[3 * i + 1] = rad * y;
    positions[3 * i + 2] = rad * Math.sin(phi) * r;
  }

  // setup points mesh
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // const particleGeo = new THREE.SphereBufferGeometry(1.5, 163, 162);
  const points = new THREE.Points(particleGeo, particleMat);
  scene.add(points);

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
      // time += 0.05;
      material.uniforms.time.value = time;
      particleMat.uniforms.time.value = time;
      points.rotation.y = time / 10;
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
