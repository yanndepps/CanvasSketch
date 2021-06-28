/*
* Creating a pattern with randomly placed rectangles
*/

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random')
const p5 = require('p5');
new p5();

const defaultSeed = 'rects_062821';
Random.setSeed(defaultSeed || Random.getRandomSeed());
console.log('Random Seed:', Random.getSeed());

const settings = {
  p5: true,
  hotkeys: true,
  suffix: Random.getSeed(),
  dimensions: [ 512, 512 ],
  animate: false,
  loop: false,
  fps: 24,
  context: '2d',
  duration: 4
};

const rectangles = [];

canvasSketch(() => {
  // SETUP 
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

    rectangles.push({
      position,
      size
    });
  }
  // DRAW
  return ({ width, height }) => {
    // black background
    background(0);
    
    // get the min edge
    const minDim = min(width, height);

    // setup drawing style
    strokeJoin(MITER);
    rectMode(CENTER);
    noFill();
    // fill(200);
    stroke(255);

    // draw each rect
    rectangles.forEach(rectangle => {
      const {
        position,
        size
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

      // draw the rectangle
      rect(x, y, w, h);

      // and restore the transform for the next rectangle
      pop();
    });
  };
}, settings);
