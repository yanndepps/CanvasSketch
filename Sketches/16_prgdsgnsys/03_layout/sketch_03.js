const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  name: 'layout_03',
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
const bgcol = color('#343837');
const col1 = color('#03719C');
const col2 = color('#0F9B8E');

canvasSketch(() => {
  // setup
  const margin = height * 0.05;
  const allHeight = height - 4 * margin;
  const imgHeight = allHeight / 3;
  const imgWidth = width - 2 * margin;
  // console.log(margin);

  background(bgcol);
  noStroke();
  // top
  fill(col1);
  rect(margin, margin, imgWidth, imgHeight, 20);
  // middle
  fill(col1);
  rect(margin, margin + imgHeight + margin, imgWidth, imgHeight, 20);
  // bottom
  fill(col1);
  rect(margin, margin + 2 * ( imgHeight + margin ), imgWidth, imgHeight, 20);

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return ({  width, height }) => {
    // Draw with p5.js things
    dim = Math.ceil( Math.min(width, height) * th ); // -> 1
    // console.log(dim);
  };
}, settings);
