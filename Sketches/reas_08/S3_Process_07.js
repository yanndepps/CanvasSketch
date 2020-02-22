// @ts-nocheck
/*
 * Structure 3
 *
 * A surface filled with one hundred medium to small sized circles.
 * Each circle has a different size and direction, but moves at the same slow rate.
 * Display:
 * A. The instantaneous intersection of the circles
 * B. The aggregate intersections of the circles
 *
 * Circle Intersection by William Ngan
 * Implemented by Casey Reas
 * Ported to canvas-sketch by Yann Depps
 *
 */

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [512, 512],
  animate: true,
  context: '2d',
  duration: 6,
  attributes: {
    antialias: true
  }
};

// optionally preload before loading the sketch
window.preload = () => {
  // preload sounds / images / etc ...
};

// globals
const numCircle = 100;
const circles = [];

// canvas-sketch
canvasSketch(() => {
  // SETUP
  for (let i = 0; i < numCircle; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(20, 60);
    let xspeed = random(-2, 2);
    let yspeed = random(-2, 2);
    circles[i] = new Circle(x, y, r, xspeed, yspeed);
  }

  // attach events to window
  window.mouseClicked = () => {
    console.log('mouse clicked');
  };

  // DRAW
  // return a renderer to 'draw the p5.js content'
  return ({ playhead, width, height }) => {
    background(255);
    stroke(0, 10);
    for (let i = 0; i < circles.length; i++) {
      circles[i].move();
    }
  };
}, settings);

// functions
class Circle {
  constructor(px, py, pr, psp, pysp) {
    this.x = px;
    this.y = py;
    this.r = pr;
    this.sp = psp;
    this.ysp = pysp;

    this.move = function() {
      this.x += this.sp;
      this.y += this.ysp;
      if (this.sp > 0) {
        if (this.x > width + this.r) {
          this.x = -this.r;
        }
      } else {
        if (this.x < -this.r) {
          this.x = width + this.r;
        }
      }
      if (this.ysp > 0) {
        if (this.y > height + this.r) {
          this.y = -this.r;
        }
      } else {
        if (this.y < -this.r) {
          this.y = height + this.r;
        }
      }

      noFill();
      stroke(0);
      ellipse(this.x, this.y, this.r, this.r);
    };
  }
}
