/**
 * draw the color spectrum by moving the mouse
 *
 * MOUSE
 * position x/y        : resolution
 *
 */

// @ts-nocheck

"use stritct";
const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [800, 400],
  context: "2d",
  animate: true,
};

let stepX;
let stepY;

window.preload = () => {
  // Preload sounds/images/etc...
};

canvasSketch(() => {
  // setup
  colorMode(HSB, width, height, 100);
  noStroke();

  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log("Mouse clicked");
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ time, width, height }) => {
    stepX = mouseX + 2;
    stepY = mouseY + 2;

    for (let gridY = 0; gridY < height; gridY += stepY) {
      for (let gridX = 0; gridX < width; gridX += stepX) {
        fill(gridX, height - gridY, 100);
        rect(gridX, gridY, stepX, stepY);
      }
    }
  };
}, settings);
