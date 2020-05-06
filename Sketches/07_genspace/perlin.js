// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: 'letter',
  orientation: 'landscape',
  pixelsPerInch: 300,
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
  pos.x = mod(pos.x + vel.x, width);
  pos.y = mod(pos.y + vel.y, height);

  let r = p5.Vector.fromAngle(noise(seed, t) * TWO_PI);
  vel.x = r.x;
  vel.y = r.y;

  vel.add(flow(pos).mult(3));
}

function flow(pos) {
  let r = noise(pos.x / 600, pos.y / 300) * TWO_PI;
  return p5.Vector.fromAngle(r).mult(2);
}

function mod(x, n) {
  return ((x % n) + n) % n;
}

// ---
let t = 0;
let n = 30000; // 800
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
  return ({ width, height }) => {
    const dim = Math.min(width, height);
    //console.log(dim);
    strokeWeight(dim * 0.00175);
    particles.forEach(function(prtcl) {
      display(prtcl.pos, prtcl.vel);
      update(t, prtcl.pos, prtcl.vel, prtcl.seed);
    });
    t += 0.002;
  };
}, settings);
