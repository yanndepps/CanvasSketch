// @ts-nocheck
/*
 * Animating grid of line segments with sin()
 */

const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');
new p5();

const defaultSeed = 'animated_grid_062821';
Random.setSeed(defaultSeed || Random.getRandomSeed());
console.log('Random Seed:', Random.getSeed());

const settings = {
  p5: true,
  hotkeys: true,
  suffix: Random.getSeed(),
  dimensions: [512, 512],
  animate: true,
  loop: true,
  fps: 24,
  context: '2d'
};

canvasSketch(() => {
  // SETUP
  // ...
  // DRAW
  return ({ time, width, height }) => {
    // black background
    background(0);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);
    // stroke only with a specific join style and thickness
    noFill();
    stroke(255);
    strokeCap(ROUND);
    strokeWeight(dim * 0.015);

    const gridSize = 10;
    const margin = dim * 0.1;
    const innerWidth = width - margin * 2;
    const cellSize = innerWidth / gridSize;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

        const px = lerp(margin, width - margin, u);
        const py = lerp(margin, height - margin, v);

        const rotation = sin(time + u * PI * 0.25) * PI;
        const lineSize = sin(time + v * PI) * 0.5 + 0.5;
        segment(px, py, cellSize * lineSize, rotation);
      }
    }
  };
}, settings);

// draw a line segment centred at the given point
function segment(x, y, length, angle = 0) {
  const r = length / 2;
  const u = Math.cos(angle);
  const v = Math.sin(angle);
  line(x - u * r, y - v * r, x + u * r, y + v * r);
}
