// @ts-nocheck
// basic shapes

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

let th = 0.00196;
let dim;
const bgColor = color("#343837");
const fiColor = color("#FFC513");
const stColor = color("#FFC513");

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  background(bgColor);
  // stroke('#03719C');
  fill(fiColor);
  dim = Math.min(width, height) * th;
  // console.log(dim);

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // ---
    // by default rect() starts drawing from the top left corner,
    // you can change this with rectMode():
    // https://p5js.org/reference/#/p5/rectMode
    // rect(posX, posY, width, height)
    // ---
    noStroke();
    rect(40, 120, 120, 40);

    // ---
    // by default ellipse() starts drawing from the center
    // you can change this with ellipseMode():
    // https://p5js.org/reference/#/p5/ellipseMode
    // ellipse(centerX, centerY, width, height)
    // ---
    ellipse(80, 200, 30, 30);

    // ---
    // arc(xCoord, yCoord, width, height, angle to start in radians, angle to stop in radians)
    // ---
    arc(120, 55, 50, 50, 0, HALF_PI);

    // ---
    // line(x1, y1, x2, y2); - coords for two points
    // ---
    stroke(stColor);
    strokeWeight(dim);
    line(160, 20, 85, 75);

    // ---
    // triangle(x1, y1, x2, y2, x3, y3) - coords for all three points
    // ---
    noStroke();
    triangle(240, 200, 150, 230, 260, 160);

    // ---
    // quad(x1, y1, x2, y2, x3, y3, x4, y4) - coords for all four points
    // ---
    quad(38, 31, 86, 20, 69, 63, 30, 76);
  };
}, settings);
