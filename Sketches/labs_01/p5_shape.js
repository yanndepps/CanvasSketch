const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 512, 512 ],
  animate: false,
  context: '2d',
  // duration: 6,
  attributes: {
    antialias: true
  }
};

// optionally preload before loading the sketch
window.preload = () => {
  // preload sounds/images/etc...
};

canvasSketch(() => {
  // like the 'setup' function here
  // ...

  // attach events to window to receive them
  window.mouseClicked = () => {
    console.log('mouse clicked');
  };
  
  // return a renderer, which is like p5 'draw' function
  return ({ time, width, height }) => {
    // draw with p5
    background(0);
    noFill();
    // set the 'join style' of lines to be round
    strokeJoin(ROUND);
    stroke(255);
    // get the minimum edge of the canvas
    const dim = Math.min(width, height);
    // and use that edge to make the stroke thickness relative
    const str = dim * 0.015;
    strokeWeight(str);
    // console.log(str);

    // center of the screen
    const x = width / 2;
    const y = height / 2;

    // fraction of screen dim
    const size = dim * 0.5;
    // make a rectangle centered on the screen
    rectMode(CENTER);
    rect(x, y, size, size);

    // create a circle slightly offset down and right
    ellipse(x, y, size, size);

    // create a triangle slightly offset up and left
    triangle(
      x, y - size / 2,
      x + size / 2, y + size / 2,
      x - size / 2, y + size / 2
    );
  };
}, settings);
