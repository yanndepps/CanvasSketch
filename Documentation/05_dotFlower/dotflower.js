/**
 * a canvas2D example of a spiraling flower pattern,
 * which is set to the physical size of a typical business
 * card (3.5 x 2 inches with 1/8'' bleed)
 * @mattdesl
*/

const canvasSketch = require('canvas-sketch');

const settings = {
  // 300 PPI for print resolution
  pixelsPerInch: 300,
  // dimensions & rendering units will use inches
  units: 'in',
  // 3.5x2 inches
  dimensions: [ 3.5, 2 ],
  // include 1/8 bleed to the dimension above
  bleed: 1/8
};

const sketch = ({ context }) => {
  return props => {
    const {
      context, exporting, bleed,
      width, height,
      trimWidth, trimHeight
    } = props;

    // clear canvas and fill with a color
    // all units are inches including width & height
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#eff3f4';
    context.fillRect(0, 0, width, height);

    // visualize the trim area with a yellow guide
    // this is ignored on export
    if (!exporting && bleed > 0) {
      context.strokeStyle = 'hsl(0, 80%, 80%)';
      context.lineWidth = 0.0075;
      context.strokeRect(bleed, bleed, trimWidth, trimHeight);
    }

    // use a foreground color for the points
    const color = '#2b82b5';
    context.fillStyle = color;

    // make circles expand to edge of smallest trim (card) edge
    // but with 1/4" padding
    const maxRadius = (Math.min(trimWidth, trimHeight)/2) - (1/4);
    // draw points
    const points = 200;
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      // phi is the golden ratio
      const phi = (Math.sqrt(5)+1)/2;
      // pick our angle based on the golden ratio
      const theta = 2 * Math.PI * i * phi;
      // get back a distance 0..1 based on current step
      const distance = Math.sqrt(t);
      // find the cartesian point on a unit circle
      const x = Math.cos(theta);
      const y = Math.sin(theta);
      // scale this point to our max dimensions
      const r = distance * maxRadius;
      // find the point on the paper in inches
      const cx = width / 2 + x * r;
      const cy = height / 2 + y * r;
      // draw a circle at each point
      // make them smaller when closer to center
      const radius = 0.02 * Math.pow(t, 0.5);
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2, false);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
