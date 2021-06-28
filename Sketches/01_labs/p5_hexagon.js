/*
* Repeating shapes to make a looping hexagonal design
*/

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');
new p5();

const defaultSeed = 'hexagon_062821';
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
  // SETUP
  // ...
  // DRAW
  return ({ time, playhead, width, height }) => {
    // black background
    background(0, 0, 0, 20);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);
    // stroke only with a specific join style and thickness
    noFill();
    stroke(255);
    strokeJoin(BEVEL);

    const rings = 10;
    const sides = 6;
    const maxRadius = dim * 0.4;
    for (let i = 0; i < rings; i++) {
      // get a normalized 't' value that isn't 0
      const t = (i + 1) / rings;

      // scale it by max radius
      const radius = t * maxRadius;

      // min and max line thickness
      const maxThickness = maxRadius / rings * 0.5;
      const minThickness = maxRadius / rings * 0.001;

      // get a value that ping-pongs between 0..1
      // offset by t*N to give it some variety
      // const pingPong = sin(t * 3.0 * time) * 0.5 + 0.5;
      const pingPong = sin( playhead * Math.PI * t);

      // compute the actual thickness
      const thickness = lerp(minThickness, maxThickness, pingPong);

      // draw the line
      strokeWeight(thickness);
      polygon(width/2, height/2, radius, sides, PI/2);
    }

  };
}, settings);

// draw a basic polygon, handles triangles, squares, pentagons, etc
function polygon(x, y, radius, sides = 3, angle = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
