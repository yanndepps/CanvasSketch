/*
  Using transforms & blen modes
*/

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');
new p5();

const defaultSeed = 'modes_062821';
Random.setSeed(defaultSeed || Random.getRandomSeed());
console.log('Random Seed:', Random.getSeed());

const settings = {
  p5: true,
  hotkeys: true,
  suffix: Random.getSeed(),
  dimensions: [ 512, 512 ],
  animate: false,
  context: '2d'
};

canvasSketch(() => {
  // like the 'setup' function here
  // ...
  // 
  // return a renderer, which is like p5 'draw' function
  return ({ time, width, height }) => {
    // set the default blend mode
    blendMode(BLEND);
    background(0);
    fill(255);
    // set x-or / difference blend mode
    blendMode(DIFFERENCE);
    noStroke();
    // center of screen
    const x = width / 2;
    const y = height / 2;
    // fraction of screen dim
    const dim = Math.min(width, height);
    const size = dim * 0.5;
    // a rectangle centred on the screen
    rectMode(CENTER);
    rect(x, y, size, size);
    // create a circle slightly offset down and right
    push();
    translate(size / 4, size / 4);
    ellipse(x, y, size, size);
    pop();
    // create a triangle slightly offset up and left
    push();
    translate(-size / 4, -size / 4);
    triangle(
      x, y - size / 2,
      x + size / 2, y + size / 2,
      x - size / 2, y + size / 2
    );
    pop();
  };
}, settings);
