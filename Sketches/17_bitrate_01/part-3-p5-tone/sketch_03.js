// @ts-nocheck
// fft

const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();
const Tone = require("tone");

const settings = {
  p5: true,
  dimensions: [512, 512],
  context: "2d",
  animate: true,
};

let th = 0.25;
let dim;
let synth;
let bgCol;
let fiCol;
let stCol;
let size;
let fft;
let font;
const AOctaves = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];


// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
  font = loadFont("./assets/fonts/thing.otf");
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.floor(Math.min(width, height) * th);
  // console.log(dim);
  bgCol = color('#59656D');
  fiCol = color('#FF964F');
  stCol = color('#D46A7E');
  textSize(dim);
  textFont(font);
  textAlign(CENTER,CENTER);
  // power of 32, in the range [32, 32768]
  size = 1024;
  // size = 16384;
  synth = new Tone.Synth();
  fft = new Tone.FFT(size).toDestination();
  synth.connect(fft);
  strokeWeight(th*2);

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
    // hasStarted = true;
    Tone.start();
  };

  window.keyPressed = () => {
    switch (key) {
      case ('a'):
        synth.triggerAttackRelease(AOctaves[0], '16n');
        break;
      case ('s'):
        synth.triggerAttackRelease(AOctaves[1], '16n');
        break;
      case ('c'):
        synth.triggerAttackRelease(AOctaves[2], '16n');
        break;
      case ('d'):
        synth.triggerAttackRelease(AOctaves[3], '16n');
        break;
      case ('e'):
        synth.triggerAttackRelease(AOctaves[4], '16n');
        break;
      case ('f'):
        synth.triggerAttackRelease(AOctaves[5], '16n');
        break;
      case ('g'):
        synth.triggerAttackRelease(AOctaves[6], '16n');
        break;
    }
  }

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgCol);
    fill(fiCol);
    text('a.s.c.d.e.f.g', width/2, height/4);
    // draw the wave
    const waveArray = fft.getValue();
    // noStroke();
    beginShape();
    for (let i = 0; i < waveArray.length; i++) {
      curveVertex(map(log(i), 0, log(waveArray.length), 0, width), map(waveArray[i], -height/2, 0, height, 0));
    }
    endShape();

  };
}, settings);
