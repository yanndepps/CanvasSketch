// @ts-nocheck
// basic player

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

let player;
let isPlaying = false;
let font;
let th = 0.25;
let dim;
const fiColor = color("#ED0DD9");
const bgColor = color("#343837");
const myText = "snd";

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

  // setup a player with an audio file
  player = new Tone.Player("./assets/snds/snd_01.wav").toDestination();
  player.loop = true;
  player.autostart = false;

  // Attach events to window to receive them
  window.mousePressed = () => {
    // console.log('Mouse clicked');
  };

  window.keyPressed = () => {
    //---
    if (player && player.loaded) {
      console.log("loaded");
      if (isPlaying) {
        isPlaying = !isPlaying;
        player.stop();
      } else {
        isPlaying = !isPlaying;
        player.start();
      }
    }
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(bgColor);
    if (isPlaying) {
      fill(fiColor);
      text(myText, width / 2, height / 2);
    }
  };
}, settings);
