/*
* Animating from a line to a circle using a poygon function
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
  // SETUP 
  // DRAW
  return ({ time, width, height }) => {
    // black background
    background(0, 0, 0, 20);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);
    // stroke only with a specific join style and thickness
    noFill();
    stroke(255);
    strokeJoin(BEVEL);
    strokeWeight(dim * 0.003);

    // get a value that ping-pongs from 0..1
    const pingPong = sin(time * 0.75 - PI / 2) * 0.5 + 0.5;

    // get a number of points, using pow() to skew to one end
    const points = lerp(2, 100, pow(pingPong, 2.5));

    // size of shapes
    const radius = dim / 3;

    // draw shape with an angle offset
    const angle = pingPong * PI * 2;
    polygon(width / 2, height / 2, radius, points, angle);
  };
}, settings);

// draw a basic polygon, handles triangles, squares, pentagons, etc
function polygon(x, y, radius, sides = 3, angle = 0) {
  beginShape()
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
