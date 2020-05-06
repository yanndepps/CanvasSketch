/**
* an exemple of a Sol LeWitt inspired "wall drawing" using a simple
* generative algorithm.
*
* instruction for this mural
*
* - using a 6x6 grid of evenly spaced points
* - connect two random points on the grid forming a trapezoid with two parallel sides extending down
* - fill the trapezoid with a color, then stroke with the background color
* - find another two random points and repeat, continue until all grid points are exhausted
* - layer the shape by the average y position of their two grid points
 */

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json');

const settings = {
  dimensions: [ 2048, 1024 ]
};

const sketch = ({ width, height }) => {
  // get a random palette of 1 - 5 colors
  const nColors = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, nColors);
  const background = 'white';

  // padding around edges
  const margin = width * 0.05;

  // create a grid of points (in pixel space) within the margin bounds
  const createGrid = () => {
    const xCount = 6;
    const yCount = 6;
    const points = [];
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        const u = x / (xCount-1);
        const v = y / (yCount-1);
        const px = lerp(margin, width - margin, u);
        const py = lerp(margin, height - margin, v);
        points.push([ px, py]);
      }
    }
    return points;
  };

  // create the grid
  let grid = createGrid();

  // create the shapes
  let shapes = [];

  // as long as we still have two grid points left
  while (grid.length > 2) {
    // select two random points from the grid
    const pointsToRemove = random.shuffle(grid).slice(0, 2);
    // not enough points left, break out
    if (pointsToRemove.length < 2) {
      break;
    }

    // the color of this trapezoid
    const color = random.pick(palette);

    // filter these points out of the grid
    grid = grid.filter(p => !pointsToRemove.includes(p));

    // now form the trapezoid from points A to B
    const [ a, b] = pointsToRemove;

    shapes.push({
      color,
      // the path goes from the bottom of the page up to the first point,
      // through the second point and then back down to the bottom of the page
      path: [
        [ a[0], height - margin ],
        a,
        b,
        [b[0], height - margin]
      ],
      // the average y position of both grid points, used for layering
      y: (a[1] + b[1]) / 2
    });
  }

  // sort/layer the shapes according to their average y position
  shapes.sort((a, b) => a.y - b.y);


  // render
  return ({ context, width, height }) => {
    // make sure alpha is back to 1.0 before we draw the background color
    context.globalAlpha = 1;
    context.fillStyle = background; 
    context.fillRect(0, 0, width, height);

    shapes.forEach(({ lineWidth, path, color }) => {
      context.beginPath();
      path.forEach(([ x, y]) => {
        context.lineTo(x, y);
      });
      context.closePath();

      // draw the trapezoid with a specific color
      context.lineWidth = 3;
      context.globalAlpha = 0.85;
      context.fillStyle = color;
      context.fill();

      // outline at full opacity
      context.lineJoin = context.lineCap = 'round';
      context.strokeStyle = background;
      context.globalAlpha = 1;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
