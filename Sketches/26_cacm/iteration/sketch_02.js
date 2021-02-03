/*
 * transitioning rectangles
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
  // sets the number of rectangles being drawn
  const nRectangles = 14;
  // --
  // setup
  noSmooth();
  // --
  // draw
  return () => {
    // --
    background(253);
    strokeWeight(2);
    //
    for (let i = 0; i < nRectangles; i++) {
      // finds the x and y value of current rectangle
      let x0 = 50 + i * 50;
      let y0 = height - 50;
      // rectangles height increases by 25
      let rectH = (i + 1) * 50;
      // creates a color gradient by making color dependent on i
      fill(i * (255.0 / nRectangles));
      // draws the rectangle
      rect(x0, y0, 50, -rectH);
      // logs
      // console.log('rectH: ', rectH);
      // console.log('x0', x0);
      // console.log('y0', y0);
    }
  }
}, settings);
