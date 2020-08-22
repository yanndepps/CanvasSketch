/* eslint-disable no-undef */
// @ts-nocheck
// basic painter

const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [512, 521],
  context: "2d",
  animate: true,
};

let myFont;
let th = 0.06;
let dim;
let slider;
let colorPicker;
const bgColor = color("#343837");
const fiColor = color("#FFC513");
const stColor = color("#730039");

window.preload = () => {
  // Preload sounds/images/etc...
  myFont = loadFont("./assets/fonts/thing.otf");
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  background(bgColor);
  dim = Math.floor(Math.min(width, height) * th);
  // console.log(dim);

  // setup font ---------------------
  textFont(myFont);
  textSize(dim);
  textAlign(LEFT, CENTER);

  // setup sliders ------------------
  slider = createSlider(0, 100, 20);
  slider.position(200, 80);
  slider.style("width", "80px");

  // setup colorPicker --------------
  colorPicker = createColorPicker("#730039");
  colorPicker.position(200, 40);

  // Attach events to window to receive them
  window.mouseDragged = () => {
    fill(colorPicker.color());
    ellipse(mouseX, mouseY, slider.value(), slider.value());
  };

  window.keyPressed = () => {
    keyCode === LEFT_ARROW ? background(fiColor) : background(bgColor);
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    noStroke();
    fill(bgColor);
    rect(0, 0, width, 80);
    // text -------------------------
    fill(255);
    text("brush size (" + slider.value() + ")", 40, 30);
    // text('color ('+ colorPicker.color() +')', 200, 30);
    // text('press left arrow key to clear', 280, 30);
  };
}, settings);
