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
  dimensions: 'letter',
  orientation: 'landscape',
  pixelPerInch: 300,
  animate: true,
  context: '2d'
};

// optionally preload before loading the sketch
window.preload = () => {
  // preload sounds / images / etc ...
};

// globals
const numCircle = 10; // 100
const circles = [];

// canvas-sketch
canvasSketch(() => {
  // SETUP
  for (let i = 0; i < numCircle; i++) {
    const x = random(width);
    const y = random(height);
    const r = random(50, 200); // 10 -> 60
    //const r = i % 2 === 0 ? 0.5 : 0.25;
    const xspeed = random(-0.25, 0.25);
    const yspeed = random(-0.25, 0.25);
    circles[i] = new Circle(x, y, r, xspeed, yspeed, i);
  }
  // background(255);
  background('#1c1c1c');

  // attach events to window
  window.mouseClicked = () => {
    console.log('mouse clicked');
  };

  // DRAW
  // return a renderer to 'draw the p5.js content'
  return ({ playhead, width, height }) => {
    const dim = Math.min(width, height);
    strokeWeight(dim * 0.00175);
    for (let i = 0; i < circles.length; i++) {
      circles[i].update();
    }
    for (let j = 0; j < circles.length; j++) {
      circles[j].move();
    }
  };
}, settings);

// functions
class Circle {
  constructor(px, py, pr, psp, pysp, pid) {
    this.x = px;
    this.y = py;
    this.r = pr;
    this.r2 = this.r * this.r;
    this.sp = psp;
    this.ysp = pysp;
    this.id = pid;

    this.update = function () {
      for (let i = this.id + 1; i < numCircle; i++) {
        intersect(circles[this.id], circles[i]);
      }
    };

    this.move = function () {
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

  // stroke(0, 5); // 10
  stroke(255, 5); // 10
  // strokeWeight(sDim);
  line(paX, paY, pbX, pbY);
}
