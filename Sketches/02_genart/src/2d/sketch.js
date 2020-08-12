const canvasSketch = require('canvas-sketch');

const settings = {
  // dimensions: [ 2048, 2048 ]
  dimensions: 'A4',
  // orientation: 'landscape',
  orientation: 'portrait',
  units: 'cm',
  pixelsPerInch: 300
};

const sketch = () => {
  return ({ context, width, height }) => {
    // console.log(width, height);
    context.fillStyle = 'orange';
    context.fillRect(0, 0, width, height);
    // draw a circle
    context.beginPath();
    context.arc(width/2, height * 0.5, 2, 0, Math.PI*2, false);
    // fill the circle
    context.fillStyle = 'red';
    context.fill();
    // give it a stroke with thickness and color
    context.strokeStyle = 'black';
    context.lineWidth = width * 0.02;
    context.stroke();
  };
};

canvasSketch(sketch, settings);
