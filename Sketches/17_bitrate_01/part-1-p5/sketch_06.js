// @ts-nocheck
// basic tweakpane ui

const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");
const p5 = require("p5");
new p5();

const settings = {
  p5: true,
  dimensions: [512, 521],
  context: "2d",
  animate: true,
};

let th = 0.5;
let dim = 0;

// tweakpane's parameter object
const PARAMS = {
  diameter: dim,
  fiTint: "#ffc513",
  bgTint: "#343837",
};

const pane = new Tweakpane({
  title: "Parameters",
});

// add folder one
const f1 = pane.addFolder({
  expanded: false,
  title: "Size",
});

// add folder two
const f2 = pane.addFolder({
  expanded: false,
  title: "Colors",
});

// store the current state as JSON
let preset;

window.preload = () => {
  // Preload sounds/images/etc...
};

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  dim = Math.floor(Math.min(width, height) * th);
  // console.log(dim);
  // pass the object and its key to pane
  f1.addInput(PARAMS, "diameter", {
    min: 0,
    max: dim,
  });

  f2.addInput(PARAMS, "fiTint");
  f2.addInput(PARAMS, "bgTint");

  // handle global events for all components
  pane.on("change", (value) => {
    console.log("changed: " + String(value));
  });

  // export state
  preset = pane.exportPreset();

  // Attach events to window to receive them
  window.keyPressed = () => {
    // x key will export JSON preset
    keyCode === 88 ? console.log(preset) : 0;
  };

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, width, height }) => {
    // Draw with p5.js things
    background(PARAMS.bgTint);
    noStroke();
    fill(PARAMS.fiTint);
    ellipse(width / 2, height / 2, PARAMS.diameter, PARAMS.diameter);
  };
}, settings);
