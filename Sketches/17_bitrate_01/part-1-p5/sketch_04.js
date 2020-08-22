// @ts-nocheck
// basic interactivity

const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [512, 521],
  context: "2d",
  animate: true,
};

let th = 0.00195;
let dim;
let diameter;
let r, g, b;
const bgColor = color("#343837");

window.preload = () => {
  // Preload sounds/images/etc...
};

function pickRandColor() {
  r = random(255);
  g = random(255);
  b = random(255);
}

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.min(width, height) * th;
  console.log(dim);
  diameter = ceil(dim * 40);
  console.log(diameter);
  pickRandColor();

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  window.mousePressed = () => {
    diameter = floor(random(dim * 40, dim * 180));
    pickRandColor();
    console.log(diameter);
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgColor);
    noStroke();
    fill(r, g, b);
    ellipse(mouseX, mouseY, diameter, diameter);
  };
}, settings);
