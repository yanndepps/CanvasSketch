// @ts-nocheck
// basic synth + keys

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
let th = 0.25;
let dim;
let fiColor;
let bgCol1;
let bgCol2 = color("#BE03FD");
let bgColor;
const AMinorScale = ["A3", "B3", "C4", "D4", "E4", "F4", "G4"];
const myText = "A.S.C.D.E.F.G.";

// Optionally preload before you load the sketch
window.preload = () => {
  // Preload sounds/images/etc...
  font = loadFont("./assets/fonts/thing.otf");
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.floor(Math.min(width, height) * th);
  // console.log(dim);
  // setup font
  textFont(font);
  textSize(dim);
  textAlign(CENTER, CENTER);

  fiColor = color("#ED0DD9");
  bgColor = color("#343837");
  bgCol1 = color("#C1C6FC");
  // background(bgColor);

  synth = new Tone.Synth().toDestination();

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
  };

  window.keyPressed = () => {
    switch (key) {
      case "a":
        synth.triggerAttackRelease(AMinorScale[0], "16n");
        break;
      case "s":
        synth.triggerAttackRelease(AMinorScale[1], "16n");
        break;
      case "c":
        synth.triggerAttackRelease(AMinorScale[2], "16n");
        break;
      case "d":
        synth.triggerAttackRelease(AMinorScale[3], "16n");
        break;
      case "e":
        synth.triggerAttackRelease(AMinorScale[4], "16n");
        break;
      case "f":
        synth.triggerAttackRelease(AMinorScale[5], "16n");
        break;
      case "g":
        synth.triggerAttackRelease(AMinorScale[6], "16n");
        break;
    }
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgColor);
    fill(fiColor);
    text(myText, width / 2, height / 2);
  };
}, settings);
