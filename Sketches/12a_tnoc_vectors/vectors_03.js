// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  context: '2d',
  attributes: {
    antialias: true
  }
};

const sketch = () => {
  // Setup 
  background('#1c1c1c');
  // Draw
  return ({ width, height }) => {
    const dim = min(width, height);
    const amount = 0.0040;
    const thickness = dim * amount;

    translate(width / 2, height / 2);
    let v = p5.Vector.random2D();
    // console.log('v: ' + ' ' + v);
    v.mult(random(width / 8, width / 4));

    strokeWeight(thickness);
    stroke(255, 100);
    line(0, 0, v.x, v.y);
  };
};

canvasSketch(sketch, settings);
