const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

// optional preloader
const preload = p5 => {
  // p5.loadImage() and so forth
};

const settings = {
  // use p5 in instance mode, passing the preloader
  p5: { p5, preload },
  dimensions: [ 512, 512 ],
  animate: true,
  context: 'webgl',
  duration: 6,
  attributes: {
    antialias: true
  }
};

canvasSketch(() => {
  // return a renderer, which is like p5 'draw' function
  return ({ p5, time, width, height }) => {
    // draw with p5
    p5.background(0);
    p5.fill(255);
    p5.noStroke();

    const anim = p5.sin(time - p5.PI / 2) * 0.5 + 0.5;
    p5.rect(0, 0, width * anim, height);
  };
}, settings);
