/*
* Recreating Sol Lewitt wall drawing #130
*/

const canvasSketch = require('canvas-sketch');
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

canvasSketch(() => {
  // SETUP
  // ...
  // DRAW
  return ({ time, width, height }) => {
    // black background
    background(0);
    // use some relative units
    const minRadius = min(width, height);
    const maxRadius = max(width, height);

    // choose a line thickness for all lines
    const thickness = minRadius * 0.005;

    // choose a spacing for the grid
    const spacing = minRadius * 0.125;

    // compute the # of lines needed to fill the space
    const lineCount = floor(maxRadius / (thickness + spacing));

    // compute the size of each square in the grid
    const squareSize = width / (lineCount - 1);

    // stroke only with a specific join style and thickness
    noFill();
    stroke(255);
    strokeWeight(thickness);

    // draw the grid first
    for (let i = 0; i < lineCount; i++) {
      // get a 't' value to map the value from one range to another
      const t = lineCount <= 1 ? 0.5 : i / (lineCount - 1);

      // map it to pixels but keep the line thickness in mind
      // so that it fits entirely within the canvas
      const y = lerp(thickness / 2, height - thickness / 2, t);
      const x = lerp(thickness / 2, width - thickness / 2, t);
      line(0, y, width, y);
      line(x, 0, x, height);
    }

    // which corners to use for arcs
    const corners = [
      // top left
      [ 0, 0 ],
      // bottom right
      [ width, height ],
      // top right
      [ width, 0 ],
      // bottom left
      [ 0, height ],
      // can also emit arcs from center
      [ width / 2, height / 2 ]
    ];

    // draw arcs from each corner
    corners.forEach(corner => {
      const [ cx, cy ] = corner;
      // draw the arcs
      for (let i = 0; i < lineCount; i++) {
        // choose how many rings will fit in each square
        const ringsPerSquare = 2;
        // get the radius of each circle
        // avoid i=0 as it would not draw anything
        const r = (i + 1) * (squareSize / ringsPerSquare);
        
        // scale radius by 2 to get diameter, and draw circle
        circle(cx, cy, r * 2);
      }
    });
  };
}, settings);