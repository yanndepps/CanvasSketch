// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();
const Walker = require('./step_01/Walker');

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
    const amount = 0.0020;
    const thickness = dim * amount;
    // console.log(strDim);
    // stroke(255, 100);
    // strokeWeight(strDim);

    walker.update();
    walker.show(thickness);
  };
};

canvasSketch(sketch, settings);
