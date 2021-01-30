/*
 * packt_23
 * @redFrick
 */

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()

const settings = {
  p5: true,
  animate: true,
  context: '2d',
  prefix: 'packt_23',
  dimensions: [600, 600]
};


canvasSketch(({ width, height }) => {
  // --
  const dim = Math.min(width, height);
  // const r = dim * 0.075;
  // console.log('r:', r);
  // console.log('dim:', dim);
  // --
  let index;
  let n;
  // --
  // setup
  // --
  noStroke();
  background(175);
  index = 0;
  n = 250;
  // draw
  return () => {
    // --
    let rx = sin(index * 0.0024);
    let ry = sin(index * 0.0022 + 1);
    let tx = sin(index * 0.0016 + 2) + rx;
    let ty = sin(index * 0.0018 + 3) + ry;

    noStroke();
    fill(color(255, 255, 255, 5));
    rect(0, 0, width, height);

    let x = 0.5 * width, y = 0.5 * height;
    for (let i = 50; i < n; i++) {
      let t = i / n;
      if (i == 50) {
        x = (cos(t * TWO_PI * rx * tx) * 0.495 * t + 0.5) * width;
        y = (sin(t * TWO_PI * ry * ty) * 0.495 * t + 0.5) * height;
      } else {
        let c = map(sin(t * TWO_PI), -1, 1, 0, 255);
        stroke(c, 0, 0, c);
        let xx = (sin(t * TWO_PI * rx * tx) * 0.495 * t + 0.5) * width;
        let yy = (cos(t * TWO_PI * ry * ty) * 0.495 * t + 0.5) * height;
        let xxx = (cos(t * TWO_PI * rx * tx) * 0.495 * t + 0.5) * width;
        let yyy = (sin(t * TWO_PI * ry * ty) * 0.495 * t + 0.5) * height;
        line(x, y, xx, yy);
        line(xx, yy, xxx, yyy);
        x = xxx;
        y = yyy;
      }
    }
    index++;
  }
}, settings);
