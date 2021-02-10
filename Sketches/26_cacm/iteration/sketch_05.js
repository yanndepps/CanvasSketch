/*
 * receding landscapes
 */
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [800, 800],
  animate: false,
  context: '2d',
  prefix: 'iteration_02'
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
  strokeWeight(5);
  stroke(0);
  smooth();

  // iteratively draws lines, changing the angle and startpoint, but keeping the endpoint
  // this creates a perspective that recedes into the distance
  for (let i = 0 - 100; i <= width + 100; i = i + 1) {
    let xTop = width / 2 + i * 15;
    let xBot = width / 2 + i * 90;
    line(xTop, -1, xBot, height);
  }
  // draw
  return () => {
    // ---
  }
}, settings);
