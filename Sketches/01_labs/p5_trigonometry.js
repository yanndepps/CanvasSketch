/*
  Using trigonometry to create radial motion
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

canvasSketch(() => {
  // like the 'setup' function here
  // ...
  // 
  // return a renderer, which is like p5 'draw' function
  return ({ time, width, height }) => {
    // a trick to create motion blur :
    // instead of clearing each frame with pure black,
    // we use black with (N/255)% opacity
    background(0, 0, 0, 20);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);

    // stroke with a specific join style and thickness
    noFill();
    stroke(255);
    strokeWeight(dim * 0.015);

    // the equation for an arc : (x, y) + (sin(angle), cos(angle))*radius
    // how fast we spin around
    const speed = 0.25;

    // scale by 2PI : a full arc/circle
    const angle = time * PI * 2.0 * speed;

    // the center of the screen
    const cx = width / 2;
    const cy = height / 2;

    // get the XY pos on a unit arc using trigonometry
    const u = cos(angle);
    const v = sin(angle);

    // choose the size of the arc
    const radius = dim * 0.25;

    // get the final position
    const px = cx + u * radius;
    const py = cy + v * radius;

    // the radius for the actual shape/ellipse we draw
    const r = dim * 0.1;
    ellipse(px, py, r, r);
  };
}, settings);
