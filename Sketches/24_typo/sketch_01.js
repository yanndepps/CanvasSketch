// 36 Days of Type x p5.js

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()

const settings = {
  p5: true,
  dimensions: [ 800, 800 ],
  animate: true
};

let pg;
let font;
const loopDuration = 3 * 180;

window.preload = () => {
  // Preload sounds/images/etc...
  font = loadFont("./data/sans.otf");
};

canvasSketch(({ width, height }) => {
  // Inside this is a bit like p5.js 'setup' function
  // ...
  background('#1c1c1c');
  // offscreen graphics buffer
  pg = createGraphics(width, height);
  // type setup offscreen buffer
  pg.textFont(font);
  pg.textAlign(CENTER, CENTER);
  pg.blendMode(SCREEN);
  pg.textSize(700);
  pg.fill('rgba(255, 0, 0, 0.9)');
  pg.text('a', width/2, height/3);
  pg.textSize(650);
  pg.fill('rgba(0, 255, 0, 0.9)');
  pg.text('a', width/1.95, height/2.95);
  pg.textSize(600);
  pg.fill('rgba(0, 0, 255, 0.9)');
  pg.text('a', width/2.05, height/3.05);


  // Attach events to window to receive them
  window.mouseClicked = () => {
    // console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return () => {
    // Draw with p5.js things
    let currentFrame = frameCount % loopDuration;
    let t = currentFrame / loopDuration;
    let u = map(t, 0, 1, 0, 2 * PI);

    background('#1c1c1c');

    const tiles = 24;
    const tileSize = width / tiles;

    // loop over each tile
    for (let x = 0; x < tiles; x++) {
      for (let y = 0; y < tiles; y++) {
        const distX = cos(u + x * 0.5) * 30;
        const distY = sin(u + y * 0.5) * 30;
        // apply the grid to the source in the graphic buffer
        const sx = x * tileSize + distX;
        const sy = y * tileSize + distX;
        const sw = tileSize + distX;
        const sh = tileSize + distY;
        // apply the grid to the destination on the canvas
        const dx = x * tileSize;
        const dy = y * tileSize;
        const dw = tileSize;
        const dh = tileSize;
        // gridded image from buffer into main canvas
        image(pg, dx, dy, dw, dh, sx, sy, sw, sh);
      }
    }


  };
}, settings);
