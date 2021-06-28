/*
* Using the arc() function to build concentric rings
*/

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random')
const p5 = require('p5');
new p5();

const defaultSeed = 'rings_062821';
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

const rings = [];

canvasSketch(() => {
  // SETUP
  // ...
  const count = floor(random(10, 20));

  for (let i = 0; i < count; i++) {
    const diameter = ((i + 1) / count);
    const arcLength = random(PI * 0.05, PI * 2);
    const arcAngle = random(-PI * 2, PI * 2);
    const spinSpeed = random(-1, 1);
    rings.push({
      spinSpeed,
      diameter,
      arcLength,
      arcAngle
    });
  }
  
  // DRAW
  return ({  width, height }) => {
    // black background
    background(0);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);
    // stroke only with a specific join style and thickness
    noFill();
    stroke(255);
    strokeCap(ROUND);
    strokeWeight(dim * 0.015);

    let d = dim;
    d -= d * 0.25;

    for (let i = 0; i < rings.length; i++) {
      const {
        diameter,
        arcLength,
        arcAngle,
        spinSpeed
      } = rings[i];

      const spin = millis() / 1000 * spinSpeed;
      arc(
        width / 2,
        height / 2,
        diameter * d,
        diameter * d,
        spin + arcAngle,
        spin + arcAngle + Math.PI * arcLength
      );
    }
    
  };
}, settings);
