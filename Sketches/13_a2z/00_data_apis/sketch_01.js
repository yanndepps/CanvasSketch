// Working with data : JSON part1 
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  // optional loop duration
  // duration: 6,
  context: '2d'
};

let flower;

// preload before the sketch
window.preload = () => {
  flower = loadJSON('../data/flower.json');
}

const sketch = () => {
  // setup
  // 
  // attach events to window to receive them
  window.mouseClicked = () => {
    console.log('mouse clicked');
  }
  // draw
  return ({ width, height }) => {
    const dim = min(width, height);
    const amount = 0.0015;
    const thickness = dim * amount;
    // console.log(thickness);
    background('#1c1c1c');
    fill(flower.r, flower.g, flower.b);
    text(flower.name, 10, 50);
  };
};

canvasSketch(sketch, settings);
