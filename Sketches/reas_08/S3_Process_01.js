/*
 * Circle Intersection by William Ngan
 * modified by Casey Reas
 * ported to canvas-sketch by Yann Depps
 */

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 512, 512 ],
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
  circleA = new Circle(width/2, height/2, 50);
  circleB = new Circle(width/2, height/2, 50);
  noStroke();

  // attach events to window receive them
  window.mouseClicked = () => {
    console.log('mouse clicked');
  };

  // DRAW
  // return a renderer to 'draw the p5.js content'
  return ({ playhead, width, height }) => {
    // clear();
    background(226);
    fill(153, 150);
    ellipse(circleA.x, circleA.y, circleA.r*2, circleA.r*2);
    ellipse(circleB.x, circleB.y, circleB.r*2, circleB.r*2);

    circleB.x = mouseX;
    circleB.y = mouseY;

    intersect(circleA, circleB);
  };
}, settings);

// functions
function Circle(px, py, pr) {
  this.x = px;
  this.y = py;
  this.r = pr;
  this.r2 = this.r * this.r;
}

function intersect(cA, cB) {
  const dx = cA.x - cB.x;
  const dy = cA.y - cB.y;
  const d2 = dx*dx + dy*dy;
  const d = sqrt( d2 );

  if ((d > cA.r+cB.r) || (d < abs(cA.r-cB.r))) {
    return; // no solution
  }

  const a = (cA.r2 - cB.r2 + d2) / (2*d);
  const h = sqrt(cA.r2 - a*a);
  const x2 = cA.x + a*(cB.x - cA.x)/d;
  const y2 = cA.y + a*(cB.y - cA.y)/d;

  noStroke();
  fill(0);
  rect(x2, y2, 5, 5);

  const paX = x2 + h*(cB.y - cA.y)/2;
  const paY = y2 - h*(cB.x - cA.x)/2;
  const pbX = x2 - h*(cB.y - cA.y)/2;
  const pbY = y2 + h*(cB.x - cA.x)/2;

  ellipse(paX, paY, 10, 10);
  ellipse(pbX, pbY, 10, 10);
}
