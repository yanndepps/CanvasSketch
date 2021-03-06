// @ts-nocheck
// waveform

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
let size;
let waveform;
let font;
const AMinorScale = ['A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3'];


// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
  font = loadFont("./assets/fonts/thing.otf");
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.floor(Math.min(width, height) * th);
  // console.log(dim);
  bgCol = color('#9DBCD4');
  fiCol = color('#FFFD01');
  textSize(dim);
  textFont(font);
  textAlign(CENTER,CENTER);
  // power of 32, in the range [32, 32768]
  size = 1024;
  // size = 16384;
  synth = new Tone.Synth();
  waveform = new Tone.Waveform(size).toDestination();
  synth.connect(waveform);
  // strokeWeight(th*2);

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
    hasStarted = true;
    Tone.start();
  };

  window.keyPressed = () => {
    switch (key) {
      case ('a'):
        synth.triggerAttackRelease(AMinorScale[0], '16n');
        break;
      case ('s'):
        synth.triggerAttackRelease(AMinorScale[1], '16n');
        break;
      case ('c'):
        synth.triggerAttackRelease(AMinorScale[2], '16n');
        break;
      case ('d'):
        synth.triggerAttackRelease(AMinorScale[3], '16n');
        break;
      case ('e'):
        synth.triggerAttackRelease(AMinorScale[4], '16n');
        break;
      case ('f'):
        synth.triggerAttackRelease(AMinorScale[5], '16n');
        break;
      case ('g'):
        synth.triggerAttackRelease(AMinorScale[6], '16n');
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
    const waveArray = waveform.getValue();
    const bandSize = width / size;
    noStroke();
    beginShape();
    for (let i = 0; i < waveArray.length; i++) {
      curveVertex(bandSize * i, map(waveArray[i], -1, 1, height, height/4));
    }
    endShape();

  };
}, settings);
