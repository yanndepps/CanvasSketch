/* eslint-disable no-undef */
// @ts-nocheck
// basic template

const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [512, 521],
  context: "2d",
  animate: true,
};

// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
};

let th = 0.00115;
let dim;

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.min(width, height) * th;
  // console.log(dim);

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    // clear();
    background("#343837");
    fill("#0F9B8E");
    noStroke();
    ellipse(width / 2, height / 2, width / 4, height / 4);
  };
}, settings);
