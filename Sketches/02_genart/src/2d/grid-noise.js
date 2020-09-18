const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  // dimensions: [ 2048, 2048 ]
  dimensions: [ 21, 21 ],
  // dimensions: 'A4',
  // orientation: 'portrait',
  units: 'cm',
  pixelsPerInch: 300
};

random.setSeed(71);

const sketch = ({ width, height }) => {
  // choose a random palette and a random number of colors from 1 to 5
  // const colorCount = 3;
  // const palette = random.pick(palettes).slice(0, colorCount);

  // more color choices and randomness 
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes))
                        .slice(0, colorCount);

  const createGrid = () => {
    // create a list of points
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // pixel coordinates for each grid points
        const u = count <= 1 ? 0.5 : x / ( count - 1 );
        const v = count <= 1 ? 0.5 : y / ( count - 1 );
        // create radius and pass in our u, v coordinates (those are already between 0 and 1)
        // radius can't hold negative values : wrap in abs
        // multiply by a small amount, we want to stay in very small numbers
        const mul = 0.025;
        const radius = Math.abs( random.noise2D(u, v) ) * mul;
        points.push({
          // pick a random color from our single palette
          color: random.pick(palette), 
          radius, 
          position: [u, v]
        });
      }
    }
    // just returns our points
    return points;
  };
  
  // remove for different results each time
  // random.setSeed(303);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = width * 0.143;

  // main return / render function 
  return ({ context }) => {
    // context.fillStyle = 'white';
    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      // destructure data into radius and position
      const {
        color,
        position,
        radius
      } = data;

      const [u, v] = position;
      
      const x = lerp(margin, width - margin, u); 
      const y = lerp(margin, height - margin, v); 

      // draw some circles at position
      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI*2, false);
      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
