// @ts-nocheck
// basic synth

const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();
const Tone = require("tone");

const settings = {
  p5: true,
  dimensions: [512, 521],
  context: "2d",
  animate: true,
};

let font;
let synth;

// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
  font = loadFont("./assets/fonts/thing.otf");
};

let th = 0.03;
let dim;
const fiColor = color("#ED0DD9");
const bgColor = color("#343837");

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  noStroke();
  dim = Math.floor(Math.min(width, height) * th);
  console.log(dim);
  // setup font
  textFont(font);

  // attach a basic synth
  // +--------------+   +------------+
  // |OmniOscillator+>->|AmplitudeEnv+>->out
  // +--------------+   +------------+

  synth = new Tone.Synth().toDestination();

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
    synth.triggerAttackRelease("C2", "8n");
  };

  window.keyPressed = () => {
    // ---
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgColor);
    if (mouseIsPressed) {
      fill(fiColor);
      ellipse(mouseX, mouseY, dim, dim);
    }
  };
}, settings);
