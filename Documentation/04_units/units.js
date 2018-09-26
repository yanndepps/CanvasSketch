// Developing with physical units

const canvasSketch = require('canvas-sketch');

const settings = {
  // measurements of artwork
  dimensions: [ 3.5, 2 ],
  // use a higher density for print resolution
  // (this default to 72, which is good for web)
  pixelsPerInch: 300,
  // all our units are inches
  units: 'in'
};

const sketch = () => {
  // utility to draw a circle
  const circle = (context, x, y, radius, fill) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fill) context.fill();
    context.stroke();
  };

  return ({ context, width, height }) => {
    // here the width and height are in inches
    // fill the whole card with black
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    // now draw some circles with alternating radii
    // between 0.5 and 0.25 inches
    context.strokeStyle = '#fff';
    context.fillStyle = '#fff';
    context.lineWidth = 0.01;
    for (let i = 0; i < 5; i++) {
      const x = i / 4 * width;
      const y = height / 2;
      const radius = i % 2 === 0 ? 0.5 : 0.25;
      const fill = i % 4 === 0;
      circle(context, x, y, radius, fill);
    }
  };
};

canvasSketch(sketch, settings);
