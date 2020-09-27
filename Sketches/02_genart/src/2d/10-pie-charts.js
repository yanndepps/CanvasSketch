const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');
const { range } = require('canvas-sketch-util/random');



const settings = {
  // dimensions: [ 2048, 2048 ],
  dimensions: [ 21, 21 ],
  units: 'cm',
  pixelsPerInch: 300,
  scaleToView: true
};

const sketch = () => {
  const colorCount = random.rangeFloor(2,6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  const background = palette.shift();
  const count = random.rangeFloor(4,10);

  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);

        const corner = random.pick([ 0, 0.5, 1, 1.5 ]);
        const arcStart = Math.PI * corner;
        const arcEnd = arcStart + Math.PI * 1.5;

        points.push({
          position: [ u, v ],
          arcStart,
          arcEnd,
          color: random.pick(palette)
        });
      }
    }
    return points;
  }

  // const points = createGrid().filter(() => random.value() > 0.25);
  const points = createGrid();


  return ({ context, width, height }) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        arcStart,
        arcEnd,
        color
      } = data;

      const [ u, v ] = position;
      const margin = width * 0.2;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      const dim = Math.min(width, height) - margin * 2;
      const radius = dim / (count - 1) * 0.35;
      context.beginPath();
      context.arc(x, y, radius, arcStart, arcEnd, false);
      context.fillStyle = 'black';
      // context.fillStyle = color;
      context.lineTo(x, y);
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
