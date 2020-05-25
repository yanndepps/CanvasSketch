// paused 11.15
global.THREE = require("three");

let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let geo = new THREE.BoxBufferGeometry(1, 1, 1);

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

export function getBrick(index, number) {
  let detail = 100;
  let angle = 0;
  let angle1 = 2 * Math.PI / 10;
  let r1 = 1;
  let r2 = 0.5

  for (let i = 0; i < detail; i++) {

  }

  let shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.lineTo(1, 0);
  shape.lineTo(2, 1);
  shape.lineTo(0, 1);
  shape.lineTo(0, 0);

  let geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth: 0.5,
    bevelEnabled: false
  });

  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}