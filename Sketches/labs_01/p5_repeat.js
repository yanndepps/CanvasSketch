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
    strokeCap(ROUND);
    strokeWeight(dim * 0.0075);

    // # of elements to draw
    const count = 5;

    // margin from edge of the screen
    const margin = dim * 0.2;

    // size with margin in consideration
    const innerWidth = (width - margin * 2);
    // compute the diameter of each circle
    const diameter = innerWidth / (count -1);

    // draw each circle
    for (let i = 0; i < count; i++) {
      // get a 0..1 value across our loop
      const t = count <= 1 ? 0.5 : i / (count - 1);

      // the x position is linearly spaced across the inner width
      const x = lerp(margin, width-margin, t);

      // the y position is centred vertically
      const y = height / 2;
      ellipse(x, y, diameter, diameter);
    }
  };
}, settings);