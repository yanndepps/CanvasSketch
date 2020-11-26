const canvasSketch = require('canvas-sketch');
const rnd = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const p5 = require('p5');
new p5()

const settings = {
  p5: true,
  animate: false,
  context: '2d',
  prefix: 'poster_04',
  pixelsPerInch: 300,
  units: 'cm',
  dimensions: [ 21, 21 ],
};

let count = 1000;
let offset = 0;

const colorCount = rnd.rangeFloor(2,6);
const palette = rnd.shuffle(rnd.pick(palettes)).slice(0, colorCount);
const bg = palette.shift();


canvasSketch(({ width, height }) => {
  // setup
  // draw
  return () => {
    background('#333333');
    const dim = Math.min(width, height);
    const r = dim * 0.05;
    // console.log('r:', r);
    // console.log('dim:', dim);
    stroke('#f4f4f4');
    fill('#333333');
    for (let i = 0; i < count; i++) {
      let x = random(offset, width - offset);
      let y = random(offset, height - offset);
      let d = dist(width / 2, height / 2, x, y);
      let decay = exp(-pow(d / dim, 2)) / sin(d);
      strokeWeight(0.05 * decay);
      ellipse(x, y, decay * .25);
    }
  }
} ,settings);
