const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  // choose a random palette and a random number of colors from 1 to 5
  const colorCount = 3;
  const palette = random.pick(palettes).slice(0, colorCount);

  // more color choices and randomness 
  // const colorCount = random.rangeFloor(1, 6);
  // const palette = random.shuffle(random.pick(palettes))
                        // .slice(0, colorCount);
  console.log(palette);

  const createGrid = () => {
    // create a list of points
    const points = [];
    // our grid is 5 x 5 
    const count = 20; //40
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // pixel coordinates for each grid points
        const u = count <= 1 ? 0.5 : x / ( count - 1 );
        const v = count <= 1 ? 0.5 : y / ( count - 1 );
        points.push({
          // pick a random color from our single palette
          color: random.pick(palette), 
          radius: Math.abs( 0.01 + random.gaussian() * 0.01 ),
          position: [u, v]
        });
      }
    }
    // just returns our points
    return points;
  };
  
  random.setSeed(5);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 350;

  // main return / render function 
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
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
