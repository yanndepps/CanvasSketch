const canvasSketch = require('canvas-sketch');
const rnd = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const p5 = require('p5');
new p5()

const settings = {
  p5: true,
  animate: false,
  context: '2d',
  prefix: 'poster_03',
  pixelsPerInch: 72,
  units: 'cm',
  dimensions: [ 21, 21 ],
};

let count = 1;

const colorCount = rnd.rangeFloor(2,6);
const palette = rnd.shuffle(rnd.pick(palettes)).slice(0, colorCount);
const bg = palette.shift();


canvasSketch(({ width, height }) => {
  // setup
  // draw
  return () => {
    background('#333333');
    const dim = Math.min(width, height);
    const step = dim * 0.005;
    const r = dim * 0.9;
    console.log(step);
    stroke('#cccccc');
    noFill();
    for (let i = 0; i < count; i += step) {
      let decay = exp(-pow(i, 2));
      strokeWeight(0.2 * decay);
      let radius = r * decay;
      ellipse(width / 2, height / 2, radius, radius);
    }
  }
} ,settings);
