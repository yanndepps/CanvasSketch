// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [900, 900],
  animate: true,
  context: '2d',
  attributes: {
    antialias: true
  }
};

// --- ui ---
function display(pos, vel) {
  point(pos.x, pos.y);
}

function update(t, pos, vel, seed) {
  // const w = width;
  // const h = height;

  pos.x = mod(pos.x + vel.x, width);
  pos.y = mod(pos.y + vel.y, height);

  let r = p5.Vector.fromAngle(noise(seed, t) * TWO_PI);
  vel.x = r.x;
  vel.y = r.y;

  vel.add(flow(pos).mult(3));
}

function flow(pos) {
  let r = noise(pos.x / 100, pos.y / 100) * TWO_PI;
  return p5.Vector.fromAngle(r).mult(2);
}

function mod(x, n) {
  return ((x % n) + n) % n;
}

// ---
// const w = width;
// const h = height;
let t = 0;
let n = 3200; // 800
let particles = [];

canvasSketch(() => {
  // SETUP
  background(200);
  stroke(0, 10);

  for (let i = 0; i < n; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      seed: i
    });
  }

  // DRAW
  return () => {
    particles.forEach(function(prtcl) {
      display(prtcl.pos, prtcl.vel);
      update(t, prtcl.pos, prtcl.vel, prtcl.seed);
    });
    t += 0.002;
  };
}, settings);
