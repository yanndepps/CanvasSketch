const canvasSketch = require("canvas-sketch");
const rnd = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  animate: false,
  context: "2d",
  // name: 'poster_02',
  prefix: "poster_02",
  pixelsPerInch: 300,
  units: "cm",
  dimensions: [21, 21],
  bleed: 1,
};

let margin = 21;
let count = 10;

const colorCount = rnd.rangeFloor(2, 6);
const palette = rnd.shuffle(rnd.pick(palettes)).slice(0, colorCount);
const bg = palette.shift();

canvasSketch(({ width, height }) => {
  // setup
  // step = (width - margin * 2) / (count - 1);
  // console.log(step);
  // draw
  return () => {
    // background("#333333");
    background(bg);
    const dim = Math.min(width, height) - margin * 2;
    const step = dim / (count - 1);
    // const sz = dim * 0.0435;
    // console.log(sz);

    // fill(255);
    noStroke();
    for (let y = 0; y < count; y++) {
      for (let x = 0; x < count; x++) {
        const radius = Math.abs(rnd.gaussian(0, dim * 0.015));
        const fillCol = rnd.pick(palette);
        fill(fillCol);
        // fill('#f4f4f4');
        ellipse(margin + x * step, margin + y * step, radius, radius);
      }
    }
  };
}, settings);
