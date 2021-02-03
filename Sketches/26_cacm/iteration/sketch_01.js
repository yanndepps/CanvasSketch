const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [600, 600],
  animate: true,
  context: '2d',
  prefix: 'iteration_01'
};

canvasSketch(({ width, height }) => {
  // --
  const dim = Math.min(width, height);
  // const r = dim * 0.075;
  // console.log('r:', r);
  // console.log('dim:', dim);
  // --
  // setup
  // --
  // draw
  return () => {
    // --
  }
}, settings);
