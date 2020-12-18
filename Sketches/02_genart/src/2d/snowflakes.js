const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  prefix: 'snowflake',
  dimensions: [ 21, 21 ],
  units: 'cm',
  pixelsPerInch: 300
};

const sketch = () => {
  // color palettes
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes))
                        .slice(0, colorCount);
  const color1 = random.pick(palette);

  const maxLevel = 6;
  const branches = 3;
  const sides = Math.floor(Math.random() * 17 + 3);
  const spread = Math.random() * 48 + 0.51;
  const angle = Math.PI * 2 * spread;

  return ({ context, width, height }) => {
    const dim = Math.min(width, height) * 0.0025;
    // console.log(dim);
    // background
    context.fillStyle = '#1c1c1c';
    context.fillRect(0, 0, width, height);
    context.translate(width/2, height/2);

    const drawLine = level => {
      if (level > maxLevel) return;

      context.strokeStyle = '#f2f2f2';
      // context.strokeStyle = color1;
      context.lineWidth = dim;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(7, 0);
      context.stroke();

      for (let i = 1; i < branches + 1; i++) {
        context.save();
        context.translate((7 * i) / (branches + 1), 0);
        context.scale(0.5, 0.5);
        context.save();

        context.rotate(angle);
        drawLine(level + 1);
        context.restore();
        context.save();

        context.rotate(-angle);
        drawLine(level + 1);
        context.restore();

        context.restore();
      }
    }

    for (let i = 0; i < sides; i++) {
      drawLine(0);
      context.rotate((Math.PI * 2) / sides);
    }
  };
};

canvasSketch(sketch, settings);
