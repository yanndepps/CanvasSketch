const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()

const settings = {
  p5: true,
  dimensions: [ 800, 800 ],
  name: '30_phyllotaxis',
  animate: true,
  context: '2d',
};

window.preload = () => {
  // Preload sounds/images/etc...
};

let dim;
let n = 1000;
const th = 0.007;
const bgcol = color('#343837');

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  // ...
  background(bgcol);
  angleMode(DEGREES);
  colorMode(HSB);
  dim = Math.ceil( Math.min(width, height) * th ); // -> 1

  // Attach events to window to receive them
  window.mouseClicked = () => {
    console.log(dim);
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ width, height }) => {
    // Draw with p5.js things
    for (let i = 0; i < n; i++) {
      const c = 8; // scaling factor
      const a = i * 137.5;
      const r = c * sqrt(i);
      const x = r * cos(a) + width / 2;
      const y = r * sin(a) + height / 2;
      fill((a - r) % 255, 255, 255);
      noStroke();
      ellipse(x, y, dim, dim);
    }
  };
}, settings);
