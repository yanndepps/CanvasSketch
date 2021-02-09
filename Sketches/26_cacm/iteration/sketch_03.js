/*
 * string art challenge
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
  smooth();
  // ---
  // draw
  return () => {
    background(0);
    stroke(253);
    strokeWeight(1);
    strokeCap(SQUARE);
    // sets amount of lines being drawn
    const nLines = 35;
    // sets margin
    const margin = 100;

    for (let i = 0; i <= nLines; i++) {
      // line always start with the same x value
      let x0 = margin;
      // line always ends with the same y value
      let y0 = map(i, 0, nLines, margin, height - margin);
      // makes the lines starting y values equidistant
      let y1 = height - margin;
      let x1 = y0;
      line(x0, y0, x1, y1);
    }
  }
}, settings);
