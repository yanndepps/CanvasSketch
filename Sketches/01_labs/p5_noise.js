/*
* Using simplex noise to create undalating lines, and handling mouse input
*/

const canvasSketch = require('canvas-sketch');
const rndm = require('canvas-sketch-util/random')
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 512, 512 ],
  animate: true,
  loop: true,
  fps: 24,
  context: '2d',
  // duration: 4,
  attributes: {
    antialias: true
  }
};

let dragging = false;
let minFrequency = 0.5;
let maxFrequency = 2;
let minAmplitude = 0.05;
let maxAmplitude = 0.5;

canvasSketch(() => {
  // SETUP
  mouseX = width / 2;
  mouseY = height / 2;

  // DRAW
  return ({ time, width, height }) => {
    // black background
    background(0);
    // consistent sizing regardless of portrait/landscape
    const dim = min(width, height);
    // stroke only with a specific join style and thickness
    noFill();
    stroke(255);
    strokeWeight(dim * 0.008);

    const frequency = lerp(minFrequency, maxFrequency, mouseX / width);
    const amplitude = lerp(minAmplitude, maxAmplitude, mouseY / height);

    const rows = 10;

    // draw each line
    for (let y = 0; y < rows; y ++) {
      // determine the Y position of the line
      const v = rows <= 1 ? 0.5 : y / (rows - 1);
      const py = v * height;
      drawNoiseLine({
        v,
        start: [ 0, py ],
        end: [ width, py ],
        amplitude: amplitude * height,
        time: time * 0.5,
        steps: 150
      });
    }
  };
}, settings);

function drawNoiseLine(opt = {}) {
  const {
    v,
    start,
    end,
    steps = 10,
    frequency = 1,
    time = 0,
    amplitude = 1
  } = opt;

  const [ xStart, yStart, ] = start;
  const [ xEnd, yEnd ] = end;

  // create a line by walking N steps and interpolating
  // from start to end point at each interval
  beginShape();
  for(let i = 0; i < steps; i++) {
    // get interpolation factor between 0..1
    const t = steps <= 1 ? 0.5 : i / (steps -1);

    // interpolate X position
    const x = lerp(xStart, xEnd, t);

    // interpolate Y position
    let y = lerp(yStart, yEnd, t);

    // offset Y position by noise
    y += rndm.noise3D(t * frequency + time, v * frequency, time) * amplitude;

    // place vertex
    vertex(x, y);
  }
  endShape();
}
