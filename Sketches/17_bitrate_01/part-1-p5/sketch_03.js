/* eslint-disable no-undef */
// @ts-nocheck
// text

const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [512, 521],
  context: "2d",
  animate: true,
};

// let th = 0.00196;
let th = 0.25;
let dim;
let myFont;
const bgColor = color("#343837");
const fiColor = color("#FFC513");
const stColor = color("#FFC513");

window.preload = () => {
  // Preload sounds/images/etc...
  // myFont = loadFont('./assets/Ephemera.otf');
  myFont = loadFont("./assets/fonts/thing.otf");
  // myFont = loadFont('assets/SourceCodePro-Regular.ttf');
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.min(width, height) * th;
  console.log(dim);
  // setup our fonts
  textFont(myFont);
  textSize(dim);
  textAlign(CENTER, CENTER);

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgColor);
    fill(fiColor);
    text("thi.ng", width / 2, height / 2);
  };
}, settings);
