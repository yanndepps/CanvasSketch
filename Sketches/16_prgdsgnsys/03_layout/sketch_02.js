const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  name: 'layout_02',
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
const col1 = color('#ED0DD9');
const col2 = color('#C1C6FC');
const col3 = color('#BE03FD');
const numImg = 3; // number of elements
const numMrg = numImg - 1; // number of margins ( num elements - 1 )

canvasSketch(() => {
  // setup
  const margin = height * 0.05; // -> height / 20
  const allHeight = height - (numMrg * margin);
  const imgHeight = allHeight / numImg;
  // console.log(margin);

  background(bgcol);
  noStroke();
  // top
  fill(col1);
  rect(0, 0, width, imgHeight);
  // middle
  fill(col2);
  rect(0, imgHeight + margin, width, imgHeight);
  // bottom
  fill(col3);
  rect(0, 2 * ( imgHeight + margin ), width, imgHeight);

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
