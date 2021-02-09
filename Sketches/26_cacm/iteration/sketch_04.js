/*
 * mini calendar
 */
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [800, 800],
  animate: false,
  context: '2d',
  prefix: 'iteration_02'
};

canvasSketch(({ width, height }) => {
  // --
  // const dim = Math.min(width, height);
  // const r = dim * 0.075;
  // console.log('r:', r);
  // console.log('dim:', dim);
  // --
  // setup
  noLoop();
  // ---
  // draw
  return () => {
    background(0);
    smooth();
    noStroke();
    rectMode(CENTER);
    ellipseMode(CENTER);

    const numberOfDaysInMonth = lengthOfMonth();
    const D = day();
    // console.log('D:', D);
    // console.log('num:', numberOfDaysInMonth);

    // days are usually counted from 1, not 0
    for (let d = 1; d <= numberOfDaysInMonth; d++) {
      let dayX = map(d, 0, numberOfDaysInMonth + 1, 0, width);
      // draws a circle for the current day
      if (d == D) {
        fill(250, 100, 100);
        // ellipse(dayX, height / 2 - 20, 25, 25);

        let dw = 8;
        let dh = 100;
        let dl = dayX - dw;
        let dr = dayX + dw;
        let db = height / 2 + dh;
        let dt = height / 2 - dh;
        triangle(dl, dt, dr, dt, dayX, db);

        // draws a bar representing all the other days
      } else {
        fill(253);

        let dw = 5;
        let dh = 100;
        let dl = dayX - dw;
        let dr = dayX + dw;
        let db = height / 2 + dh / 2;
        let dt = height / 2 - dh / 2;
        triangle(dl, db, dr, db, dayX, dt);
      }
    }

  }
}, settings);

function lengthOfMonth() {
  m = month();
  // tells how many days in a given month
  if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 31) {
    return 31;
  } else if (m == 4 || m == 6 || m == 9 || m == 11) {
    return 30;
  } else {
    if (year() % 4 === 0) {
      return 29; // leapyear
    }
    return 28;
  }
}
