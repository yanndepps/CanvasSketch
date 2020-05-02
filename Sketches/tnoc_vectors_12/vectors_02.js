// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();
const Walker = require('./step_02/Walker');

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
  let walker;
  walker = new Walker(width / 2, height / 2);
  // Draw
  return ({ playhead, width, height }) => {
    const dim = min(width, height);
    const amount = 0.040;
    const thickness = dim * amount;
    // console.log(thickness);

    walker.update();
    walker.show(thickness);
  };
};

canvasSketch(sketch, settings);
