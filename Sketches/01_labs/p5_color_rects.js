/*
* Creating a pattern with randomly placed rectangles
*/

const canvasSketch = require('canvas-sketch');
const palettes = require('nice-color-palettes/1000.json');
const rndm = require('canvas-sketch-util/random');
const p5 = require('p5');
new p5();

const defaultSeed = 'rect_pattern_071421';
rndm.setSeed(defaultSeed || rndm.getRandomSeed());
console.log('Random Seed:', rndm.getSeed());

const settings = {
  p5: true,
  hotkeys: true,
  suffix: rndm.getSeed(),
  dimensions: [ 512, 512 ],
  animate: false,
  context: '2d',
};

const rectangles = [];

canvasSketch(() => {
  // SETUP 
  // get a random palette of 1..5 colors
  const nColors = rndm.rangeFloor(1, 6);
  const palette = rndm.shuffle(rndm.pick(palettes)).slice(0, nColors);

  // create some random rectangles
  const rectangleCount = 15;
  for (let i = 0; i < rectangleCount; i++) {
    // randomly place some rectangles within -1..1 space
    const shrink = 0.5;
    const position = [
      random(-1, 1) * shrink,
      random(-1, 1) * shrink
    ];

    // create a random 0..1 scale for the rectangles
    const scale = random(0.5, 1);
    const size = [
      random(0, 1) * scale,
      random(0, 1) * scale
    ];

    // get a random color palette
    const color = rndm.pick(palette);

    rectangles.push({
      position,
      size,
      color
    });
  }
  // DRAW
  return ({ context, width, height }) => {
    // make sure alpha is back to 1.0 before we draw the background color
    context.globalAlpha = 1;
    // black background
    background(0);
    
    // get the min edge
    const minDim = min(width, height);

    // setup drawing style
    strokeJoin(MITER);
    rectMode(CENTER);
    noStroke();

    // draw each rect
    rectangles.forEach(rectangle => {
      const {
        position,
        size,
        color
      } = rectangle;

      // the position and size in -1..1 normalized space
      let [ x, y ] = position;
      let [ w, h ] = size;

      // map -1..1 to screen pixels
      // first we 'push' to save transformation state
      push();
      
      // then translate to the center
      translate(width / 2, height / 2);

      // and scale the context by half the size of the screen
      // use a square ratio so that the lines have even thickness
      scale(minDim / 2, minDim / 2);

      // the stroke weight is specified in 0..1 normalized space
      // it will be multiplied by the scale above
      strokeWeight(0.012);
      // add a global transparency to the shapes
      context.globalAlpha = 0.85;
      fill(color);

      // draw the rectangle
      rect(x, y, w, h);

      // and restore the transform for the next rectangle
      pop();
    });
  };
}, settings);
