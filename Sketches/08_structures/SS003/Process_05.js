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
let circleA, circleB;

// canvas-sketch
canvasSketch(() => {
  // SETUP
  circleA = new Circle(width / 2, height / 2, 60);
  circleB = new Circle(width / 2, height / 2, 90);
  noStroke();
  background(204);

  // attach events to window
  window.mouseClicked = () => {
    // console.log('mouse clicked');
  };

  // DRAW
  // return a renderer to 'draw the p5.js content'
  return ({ playhead, width, height }) => {
    circleA.update();
    circleB.update();
    intersect(circleA, circleB);
  };
}, settings);

// functions
class Circle {
  constructor(px, py, pr) {
    this.x = px;
    this.y = py;
    this.r = pr;
    this.r2 = this.r * this.r;
    this.xspeed = random(-2, 2);
    this.yspeed = random(-2, 2);
    this.xdir = 1;
    this.ydir = -1;

    this.update = function() {
      this.x += this.xspeed * this.xdir;
      if (this.x > width - this.r || this.x < this.r) {
        this.xdir = this.xdir * -1;
      }

      this.y += this.yspeed * this.ydir;
      if (this.y > width - this.r || this.y < this.r) {
        this.ydir = this.ydir * -1;
      }
    };
  }
}

function intersect(cA, cB) {
  const dx = cA.x - cB.x;
  const dy = cA.y - cB.y;
  const d2 = dx * dx + dy * dy;
  const d = sqrt(d2);

  if (d > cA.r + cB.r || d < abs(cA.r - cB.r)) {
    return; // no solution
  }

  const a = (cA.r2 - cB.r2 + d2) / (2 * d);
  const h = sqrt(cA.r2 - a * a);
  const x2 = cA.x + (a * (cB.x - cA.x)) / d;
  const y2 = cA.y + (a * (cB.y - cA.y)) / d;

  const paX = x2 + (h * (cB.y - cA.y)) / d;
  const paY = y2 - (h * (cB.x - cA.x)) / d;
  const pbX = x2 - (h * (cB.y - cA.y)) / d;
  const pbY = y2 + (h * (cB.x - cA.x)) / d;

  stroke(0, 26);
  line(paX, paY, pbX, pbY);
}
