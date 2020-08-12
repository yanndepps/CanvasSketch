"use stritct";
const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [720, 720],
  context: "2d",
  animate: true,
  duration: 6
};

// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  // ...
  noCursor();
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);
  noStroke();

  // Attach events to window to receive them
  window.mouseClicked = () => {
    console.log("Mouse clicked");
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(mouseY / 2, 100, 100);
    fill(360 - mouseY / 2, 100, 100);
    rect(360, 360, mouseX + 1, mouseX + 1);
  };
}, settings);
