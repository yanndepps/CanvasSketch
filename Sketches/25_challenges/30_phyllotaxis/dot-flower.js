/**
 * A Canvas2D example of a spiraling flower pattern,
 * which is set to the physical size of a typical business
 * card (3.5 x 2 inches with 1/8" bleed).
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require('canvas-sketch');

const settings = {
  name: 'dot_flower',
  // 300 ppi for print resolution
  pixelsPerInch: 72,
  // use inches for dimensions and rendering
  units: 'cm',
  dimensions: [ 21, 21 ],
  // 1/8 inch 'bleed' to the dimensions above
  // bleed: 1
};

const sketch = () => props => {
    const {
        context, exporting, bleed,
        width, height,
        trimWidth, trimHeight
    } = props;

    // clear canvas and fill with a color
    // all units are inches including 'width' and 'height'
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#1c1c1c';
    context.fillRect(0, 0, width, height);

    // visualize the trim area with a yellow guide
    // this is ignored at export by using the 'exporting' prop
    if (bleed > 0) {
        context.strokeStyle = 'hsl(0, 80%, 80%)';
        context.lineWidth = 0.075;
        context.strokeRect(bleed, bleed, trimWidth, trimHeight);
    }

    // use a foreground color for the points
    const color = '#f4f4f4';
    context.fillStyle = color;

    // make circles expand to edge of smallest trim ( card ) edge,
    // but with a 1/4" padding
    const maxRadius = (Math.min(trimWidth, trimHeight) / 2) - 2;

    // draw points
    const points = 800;
    for (let i = 1; i <= points; i++) {
        const t = i / points;
        // here phi is the golden ratio
        const phi = (Math.sqrt(5) + 1) / 2;
        // console.log(phi);
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
        // now draw a circle at each point
        // make them smaller when closer to centre
        const radius = 0.2 * Math.pow(t, 0.5);
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2, false);
        context.fill();
    }
};

canvasSketch(sketch, settings);
