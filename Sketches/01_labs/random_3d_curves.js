// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  loop: false,
  fps: 24,
  context: 'webgl',
  attributes: {
    antialias: true
  }
};

let seed = 0;

function newSeed() {
  seed++;
}

canvasSketch(() => {
  // SETUP
  setInterval(newSeed, 1500);

  // DRAW
  return ({ time, width, height }) => {
    background(0);
    rotateY(time * 0.25);
    noFill();
    stroke(255);
    randomSeed(seed);
    const size = min(width, height);
    const count = floor(random(10, 20));
    beginShape();
    for (let i = 0; i < count; i++) {
      const x = random(-size, size) / 4;
      const y = random(-size, size) / 4;
      const z = random(-size, size) / 4;
      curveVertex(x, y, z);
    }
    endShape();
  };
}, settings);
