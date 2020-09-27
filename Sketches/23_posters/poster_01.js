const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()

let font;
let img;
let img2;
let pg;
let pg2;
let buffer;
let i1;
let i2;

const settings = {
  p5: true,
  context: '2d',
  dimensions: [ 800, 800 ],
  animate: true,
};

window.preload = () => {
  font = loadFont("./data/sans.otf");
  img = loadImage("./data/a.jpg");
  img2 = loadImage("./data/n.jpg");
};


canvasSketch(({  width, height }) => {
  // setup
  frameRate(30);
  pg = createGraphics(486, 710);
  pg2 = createGraphics(486, 710);
  buffer = createGraphics(486, 710);
  i2 = createImage(486, 710);
  i1 = createImage(486, 710);

  // Attach events to window to receive them
  window.mouseClicked = () => {
    console.log('Mouse clicked');
  };

drawPg = () => {
  pg.background('#f1f1f1');
  pg.imageMode(CENTER);
  pg.push();
  pg.translate(pg.width/2, pg.height/2);
  const wave1 = map(sin(radians(frameCount)), -1, 1, 3, 1.6, true);
  pg.scale(wave1);
  pg.image(img, 0, 0);
  pg.pop();
  // define style
  pg.fill('#f1f1f1');
  pg.textFont(font);
  pg.textSize(800);
  pg.textAlign(CENTER, CENTER);
  const txt = 'LOST';
  const wave2 = map(tan(radians(frameCount)), -1, 1, -100, 100);
  //
  pg.push();
  pg.translate(pg.width/2+wave2, pg.height/2-80);
  pg.text(txt, 0, 0);
  pg.pop();
}

drawPg2 = () => {
  pg2.background('#1c1c1c');
  pg2.imageMode(CENTER);
  pg2.push();
  pg2.translate(pg2.width/2, pg2.height/2);
  const wave1 = map(sin(radians(frameCount)), -1, 1, 1.3, 2.4, true);
  pg2.scale(wave1);
  pg2.image(img2, 0, 0);
  pg2.pop();
  pg2.fill('#1c1c1c');
  pg2.textFont(font);
  pg2.textSize(800);
  pg2.textAlign(CENTER, CENTER);
  const txt = 'WORLD';
  const wave2 = map(tan(radians(frameCount)), -1, 1, -100, 100);
  pg2.push();
  pg2.translate(pg2.width/2 - wave2, pg2.height/2-80);
  pg2.text(txt, 0, 0);
  pg2.pop();
}

  // Return a renderer to 'draw' the p5.js content
  return () => {
    // Draw
    background('#1c1c1c');
    const dim = Math.min(width, height);
    const size = dim * 0.5;

    drawPg();
    drawPg2();

    buffer.background('#1c1c1c');
    buffer.noStroke();
    buffer.rectMode(CORNER);

    i1 = pg.get();
    i2 = pg2.get();

    const tilesX = pg.width/6;
    const tilesY = pg.height/6;
    const tileW = pg.width/tilesX;
    const tileH = pg.height/tilesY;

    // loop through our pixels
    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const c1 = i1.get(int(x * tileW), int(y * tileH));
        const c2 = i2.get(int(x * tileW), int(y * tileH));
        const ca = color(c1);
        const cb = color(c2);
        const wave = map(sin(radians(frameCount * 3 + x * 0.3 + y * 0.3)), -1, 1, 0, 1);
        const c3 = lerpColor(ca, cb, wave);
        const bri = brightness(c3);
        const sizeW = map(bri, 0, 255, tileW, 0);
        const sizeH = map(bri, 0, 255, tileH, 0);
        buffer.fill('#305dbf');
        buffer.rect(x * tileW, y * tileW, sizeW * 1.2, sizeH * 1.2);
      }
    }


    imageMode(CENTER);
    image(buffer, width/2, height/2);
  };
}, settings);
