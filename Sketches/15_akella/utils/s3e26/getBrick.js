global.THREE = require("three");

const material = new THREE.MeshLambertMaterial();
const geo = new THREE.BoxBufferGeometry(1, 1, 1);

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

export function getBrick(index, number, space, depth) {
  let detail = 100;
  let angle = (index * 2 * Math.PI) / number + space;
  let angle1 = ((index + 1) * 2 * Math.PI) / number - space;
  let r1 = 1;
  let r2 = 1 - depth;
  let dots = [];

  const shape = new THREE.Shape();

  for (let i = 0; i <= detail; i++) {
    dots.push([
      r2 * Math.sin(lerp(angle, angle1, i / detail)),
      r2 * Math.cos(lerp(angle, angle1, i / detail)),
    ]);
  }

  for (let i = 0; i <= detail; i++) {
    dots.push([
      r1 * Math.sin(lerp(angle1, angle, i / detail)),
      r1 * Math.cos(lerp(angle1, angle, i / detail)),
    ]);
  }

  shape.moveTo(dots[0][0], dots[0][1]);
  dots.forEach((dot) => {
    shape.lineTo(dot[0], dot[1]);
  });

  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth: depth,
    bevelEnabled: false,
  });

  geometry.rotateX(Math.PI / 2);

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
