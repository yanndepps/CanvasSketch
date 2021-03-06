/*
  Using linear interpolation (lerp) for animation
*/

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');
new p5();

const defaultSeed = 'lerp_062821';
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
  duration: 4
};

canvasSketch(() => {
  // like the 'setup' function here
  // ...
  // 
  // return a renderer, which is like p5 'draw' function
  return ({ playhead, width, height }) => {
    background(0);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);

    // stroke with a specific join style and thickness
    noFill();
    stroke(255);
    strokeWeight(dim * 0.015);

    // a 'start' position as XY coordinate
    const start = [ width * 0.25, height / 2];
    // an 'end' position as XY coordinate
    const end = [ width * 0.75, height / 2];

    // get a value that goes from -1..1 based on playhead
    // use of 2PI to create a seamless loop
    let t0 = sin(playhead * PI * 2);

    // now map the -1..1 to 0..1 values
    t0 = t0 * 0.5 + 0.5;

    // interpolate X and Y positions separately from 'start' to 'end' coordinates
    const x = lerp(start[0], end[0], t0);
    const y = lerp(start[1], end[1], t0);

    // try animating the circle radius and stroke weight
    const r = dim * 0.3;
    ellipse(x, y, r, r);
  };
}, settings);
