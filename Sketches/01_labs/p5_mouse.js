/*
* Spring interpolation with mouse movement
*/

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 512, 512 ],
  animate: true,
  loop: true,
  fps: 24,
  context: '2d',
  duration: 4,
  attributes: {
    antialias: true
  }
};

// current position of circle
let px;
let py;

canvasSketch(() => {
  // like the 'setup' function here
  // initial object position
  px = width / 2;
  py = height / 2;
  
  // also use this as the initial mouse position
  // i.e. before the mouse has interacted with the canvas
  mouseX = width / 2;
  mouseY = height / 2;
  
  // return a renderer, which is like p5 'draw' function
  return ({ time, width, height }) => {
    // for consistent sizing regardless of portrait/landscape
    const dim = min(width, height);
    
    // black background
    background(0);

    // get delta time in seconds
    const dt = deltaTime / 1000;

    // spring toward mouse position
    const power = 2;
    px = spring(px, mouseX, power, dt);
    py = spring(py, mouseY, power, dt);

    // draw the circle
    fill(255);
    const r0 = dim * 0.1;
    ellipse(px, py, r0, r0);

    // draw the mouse as a circle
    noFill();
    stroke(255);
    strokeWeight(dim * 0.015);
    const r1 = r0 * 2;
    ellipse(mouseX, mouseY, r1, r1);

  };
}, settings);

// springs A toward B with a power, accepting deltaTime
function spring(a, b, power, dt){
  return lerp(a, b, 1 - Math.exp(-power * dt));
} 
