/*
  Creating a seamless loop with a fixed duration
*/

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');
new p5();

const defaultSeed = 'loop_062821';
Random.setSeed(defaultSeed || Random.getRandomSeed());
console.log('Random Seed:', Random.getSeed());

const settings = {
  p5: true,
  hotkeys: true,
  suffix: Random.getSeed(),
  dimensions: [ 512, 512 ],
  animate: true,
  loop: true,
  fps: 24,
  context: '2d',
  duration: 2
};

canvasSketch(() => {
  // like the 'setup' function here
  // ...
  // 
  // return a renderer, which is like p5 'draw' function
  return ({ playhead, width, height }) => {
    background(0);
    // center of screen
    const px = width / 2;
    const py = height / 2;

    // scale to the minimum edge of the canvas
    const minDim = min(width, height);
    // size is a fraction of the screen
    const size = minDim * 0.5;
    // get time in seconds
    // const time = millis() / 1000;
    // how long do we loop (of one full cycle)
    // const duration = 5;
    // get a 'playhead' from 0..1
    // use modulo to keep it within 0..1
    // const playhead = time / duration % 1;
    // get an animated value from 0..1
    // use playhead * 2PI to get a full rotation
    const anim = sin(playhead * PI * 2) * 0.5 + 0.5;
    // create an animated thickness for the stroke
    const thickness = minDim * 0.1 * anim;
    // no fill
    noFill();
    // white stroke
    stroke(255);
    // apply thickness
    strokeWeight(thickness);
    // draw a circle centred at (px, py)
    ellipse(px, py, size, size);
  };
}, settings);
