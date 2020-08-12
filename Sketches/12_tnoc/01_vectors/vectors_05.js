// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();
const Mover = require('../utils/01_vectors/step_05/Mover');

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  context: '2d',
  attributes: {
    antialias: true,
  },
};

const sketch = () => {
  // Setup
  let mover;
  mover = new Mover(width / 2, height / 2);
  // Draw
  return ({ width, height }) => {
    const dim = min(width, height);
    const amount = 0.04;
    const thickness = dim * amount;
    // console.log(thickness);

    background('#1c1c1c');
  };
};

canvasSketch(sketch, settings);
