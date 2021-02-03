/*
 * simple iteration
 * seven circles
 */
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [800, 800],
  animate: false,
  context: '2d',
  prefix: 'iteration_01'
};

canvasSketch(({ width, height }) => {
  // --
  // const dim = Math.min(width, height);
  // const r = dim * 0.075;
  // console.log('r:', r);
  // console.log('dim:', dim);
  // --
  // setup
  background(253);
  fill(229);
  strokeWeight(8);
  const y = height * (1.0 - 0.61803398875);
  // draw 7 circles
  for (let i = 0; i < 7; i++) {
    // sets space between circle centers to 50
    let x = 100 + i * 100;
    // draws circles of radius 30
    ellipse(x, y, 60, 60);
  }
  // --
  // draw
  return () => {
    // --
  }
}, settings);
