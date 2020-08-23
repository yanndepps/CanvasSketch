// @ts-nocheck
// basic envelope

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

let osc;
let env;
let hasStarted = false;
let isOn = false;
let font;

// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
  font = loadFont("./assets/fonts/thing.otf");
};

let th = 0.2;
let dim;
const fiColor = color("#ED0DD9");
const bgColor = color("#343837");

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.floor(Math.min(width, height) * th);
  // console.log(dim);
  // setup font
  textFont(font);

  // create an env
  env = new Tone.AmplitudeEnvelope({
    attack: 1.5,
    decay: 0.21,
    sustain: 0.5,
    release: 1.2,
  }).toDestination();

  // connect the osc with the env
  osc = new Tone.Oscillator(440, "sawtooth3").connect(env);

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
    hasStarted = true;
    osc.start();
  };

  window.keyPressed = () => {
    if (keyCode === UP_ARROW && hasStarted) {
      env.triggerAttack();
      isOn = !isOn;
    }

    if (keyCode === DOWN_ARROW && hasStarted) {
      env.triggerRelease();
      isOn = !isOn;
    }
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgColor);
    fill(fiColor);
    textSize(dim * 2);
    textAlign(CENTER, CENTER);
    if (isOn && hasStarted) {
      text("ON", width / 2, height / 2);
    } else if (!isOn && hasStarted) {
      text("OFF", width / 2, height / 2);
    } else {
      text("START", width / 2, height / 2);
    }
  };
}, settings);
