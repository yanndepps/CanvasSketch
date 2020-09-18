const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = ({ width, height }) => {
  const createGrid = () => {
    // create a list of points
    const points = [];
    // our grid is 5 x 5 
    const count = 5;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // pixel coordinates for each grid points
        // we use UV space instead of pixel coordinates, which maps values between 0 and 1
        // also make sure we never divide by zero
        const u = count <= 1 ? 0.5 : x / ( count - 1 );
        const v = count <= 1 ? 0.5 : y / ( count - 1 );
        // that gives us a top left at 0,0, and a bottom right of 1,1
        points.push([u, v]);
      }
    }
    // just returns our points
    return points;
  };
  
  // call to our grid function
  const points = createGrid();
  // define a margin
  // const margin = 350;
  const margin = width * 0.171;
  // return an array of arrays from 0 to 1
  // console.log(points);

  // main return
  return ({ context }) => {
    // avoid a transparent PNG
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // loop through each of our points
    // destructured via ES6
    points.forEach(([ u, v ]) => {
      // scale our values back up to pixel space
      // returns the actual position of pixels in our grid
      // next, use lerp to interpolate values and create a bit of margins
      // const x = u * width;
      const x = lerp(margin, width - margin, u); 
      // const y = v * height;
      const y = lerp(margin, height - margin, v); 

      // draw some circles at position
      context.beginPath();
      context.arc(x, y, 100, 0, Math.PI*2, false);
      context.strokeStyle = 'black';
      context.lineWidth = 10;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
