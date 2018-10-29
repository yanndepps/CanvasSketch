// Creative Coding in Canvas & WebGL : Part I
// pause at : 1:42:49

const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/1000.json');

let palette = random.pick(palettes);
palette = random.shuffle(palette);
palette = palette.slice(0, random.rangeFloor(2, palette.length+1));
console.log(palette.length);

const background = palette.shift();

const settings = {
  dimensions: [ 2048, 2048 ]
};

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const sketch = () => {
  // random.setSeed(7);
  // const colorCount = random.rangeFloor(1, 6);
  // const palette = random.shuffle(random.pick(palettes))
                        // .slice(0, colorCount);
  
  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / ( count-1 );
        const v = count <= 1 ? 0.5 : y / ( count-1 );
        const radius = Math.abs(random.noise2D(u, v)) * 0.2;
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v) * 0.4, 
          position: [ u, v ]
        });
      }
    }
    return points;
  };
  
  // random.setSeed(404);
  let points = createGrid().filter(() => random.value() > 0.5);
  
  // render function
  return ({ context, width, height }) => {
    const margin = width * 0.175;

    context.fillStyle = background; 
    context.fillRect(0, 0, width, height);
    
    points.forEach(data => {
      const {
        color,
        radius,
        rotation,
        position
      } = data;
     
      const [ u, v ] = position;
      
      const x = lerp(margin, width-margin, u); 
      const y = lerp(margin, height-margin, v);
     
      // context.beginPath();
      // context.arc(x, y, radius*width, 0, Math.PI*2, false);
      // context.fillStyle = color; 
      // context.fill();
      
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Hack"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('-', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
