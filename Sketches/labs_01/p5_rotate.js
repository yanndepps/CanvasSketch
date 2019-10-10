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
  duration: 7,
  attributes: {
    antialias: true
  }
};

canvasSketch(() => {
  // like the 'setup' function here
  // ...
  // 
  // return a renderer, which is like p5 'draw' function
  return ({ playhead, width, height }) => {
    background(0);
    // use the min screen size for relative rendering
    const dim = min(width, height);

    // setup stroke, disable fill
    strokeJoin(ROUND);
    strokeWeight(dim * 0.015);
    stroke(255);
    noFill();
    
    // get the rotation of a full circle
    const rotation = playhead * PI * 2;

    // center of the screen
    const x = width / 2;
    const y = height / 2;

    // size of rectangle, relative to screen size
    const size = dim * 0.5;

    // save transforms
    push();
    
    // to rotate around the center,
    // we have to first translate to center
    translate(x, y);

    // then we can rotate around the center
    rotate(rotation);  

    // now we can draw at (0,0) because we are still translated
    rectMode(CENTER);
    rect(0, 0, size, size);

    // restore transforms
    pop();
  };
}, settings);