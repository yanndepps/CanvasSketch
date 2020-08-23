// @ts-nocheck
// waveform

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

let th = 0.125;
let dim;
let synth;
let bgR, bgG, bgB;
let randNote;
let xPos;
let yPos;
let xSpeed = 2;
let ySpeed = 3;
let radius;
let hasStarted = false;
const AMinorScale = ['A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3'];


// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
};


// collision
function handleCollision() {
  // random bg colors
  bgR = random(255);
  bgG = random(255);
  bgB = random(255);

  // random note from scale
  randNote = int(random(0, AMinorScale.length));

  // play that note
  synth.triggerAttackRelease(AMinorScale[randNote], '16n');

}

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  noStroke();
  dim = Math.floor(Math.min(width, height) * th);
  radius = dim/2;
  // console.log(radius);

  // synth setup
  synth = new Tone.Synth().toDestination();

  // some backgroung colors
  bgR = random(255);
  bgG = random(255);
  bgB = random(255);

  xPos = random(width);
  yPos = random(height);

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
    hasStarted = true;
    Tone.start();
  };


  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgR, bgG, bgB);

    fill(255);
    ellipse(xPos, yPos, radius*2, radius*2);

    // update ball location
    if (hasStarted) {
      xPos += xSpeed;
      yPos += ySpeed;
    }

    // check borders
    if (xPos > width - radius || xPos < radius) {
      handleCollision();
      xSpeed = -xSpeed;
    }

    if (yPos > height - radius || yPos < radius) {
      handleCollision();
      ySpeed = -ySpeed;
    }
  };
}, settings);
