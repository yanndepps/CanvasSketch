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
  // units: 'cm',
  // dimensions: [ 21, 21 ],
  dimensions: [ 400, 400 ],
};

const colorCount = rnd.rangeFloor(2,6);
const palette = rnd.shuffle(rnd.pick(palettes)).slice(0, colorCount);
const bg = palette.shift();
// ---

canvasSketch(({ width, height }) => {
  // --
  const dim = Math.min(width, height);
  const r = dim * 0.075;
  console.log('r:', r);
  // console.log('dim:', dim);
  // --
  let arr = [];
  let margin = dim * 0.1; // 40
  let col = dim * 0.08; // 32
  let gapX = dim * 0.02; // 8
  let gapY = dim * 0.0125; // 5
  let minH = dim * 0.0125; // 5
  let maxH = dim * 0.075; // 30
  let rectWidth;
  let yLimit;
  // --
  // setup
  yLimit = height - margin;
  rectWidth = ((width - margin * 2) - (gapX * (col - 1))) / col;
  for (let i = 0; i < col; i++) {
    arr.push([]);
  }
  // draw
  return () => {
    background('#333333');
    noStroke();
    fill('#f4f4f4');

    for (let i = 0; i < col; i++) {
      let loop = true;
      let count = 0;
      while (loop) {
        let rH = random(minH, maxH);
        arr[i].push(rH);
        let controlSum = (arr[i].reduce((a, b) => a + b) + margin + count * gapY);
        count++;
        if (controlSum > yLimit) {
          loop = false;
          if (rH >= gapY) {
            arr[i].pop();
            arr[i][arr[i].length - 1] += rH + gapY;
          }
          arr[i][arr[i].length - 1] = arr[i][arr[i].length - 1] - controlSum + yLimit;
        }
      }
    }
   for (let _col = 0; _col < col; _col++) {
     let sumRects = 0;
     for (let _row = 0; _row < arr[_col].length; _row++) {
      rect((margin + _col * (rectWidth + gapX)), margin + sumRects + _row * gapY, rectWidth, arr[_col][_row]);
       sumRects += arr[_col][_row];
     }
   }
  }
} ,settings);
