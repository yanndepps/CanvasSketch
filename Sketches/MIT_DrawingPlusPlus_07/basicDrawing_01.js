// @ts-nocheck
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

let diameter = 20;

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  loop: false,
  //fps: 24,
  context: '2d',
  attributes: {
    antialias: true
  }
};

canvasSketch(() => {
  // SETUP
  background(0);
  noStroke();

  // DRAW
  return ({ time, width, height }) => {
    mouseDragged();
  };
}, settings);

function mouseDragged() {
  ellipse(mouseX, mouseY, diameter, diameter);
}
