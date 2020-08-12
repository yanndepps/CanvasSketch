const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  context: 'webgl', // 2d
  duration: 6,
  attributes: {
    antialias: true,
  },
};

// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  // ...

  // Attach events to window to receive them
  window.mouseClicked = () => {
    console.log('Mouse clicked');
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    clear();
    background('#1c1c1c');
    normalMaterial();
    rotateX(playhead * 2 * PI);
    rotateZ(playhead * 2 * PI);
    cylinder(20, 50);
  };
}, settings);
