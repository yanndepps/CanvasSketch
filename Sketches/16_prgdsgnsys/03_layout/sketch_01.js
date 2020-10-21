const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  name: 'layout_01',
  // dimensions: [ 800, 800 ],
  dimensions: 'A4',
  orientation: 'portrait',
  units: 'cm',
  pixelsPerInch: 300,
  animate: false,
  context: '2d',
};

window.preload = () => {
  // Preload sounds/images/etc...
};

let dim;
const th = 0.0012;
const bgcol = color('#1c1c1c');
const col1 = color('#9DBCD4');
const col2 = color('#FFFD01');
const col3 = color('#6D5ACF');

canvasSketch(() => {
  // setup
  const imgHeight = height / 3;
  // console.log(width);
  background(bgcol);
  noStroke();
  // top
  fill(col1);
  rect(0, 0, width, imgHeight);
  // middle
  fill(col2);
  rect(0, imgHeight, width, imgHeight);
  // bottom
  fill(col3);
  rect(0, 2 * imgHeight, width, imgHeight);

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return ({  width, height }) => {
    // Draw with p5.js things
    dim = Math.ceil( Math.min(width, height) * th );
    // console.log(dim);
  };
}, settings);
