// Creative Coding in Canvas & WebGL : Part I
// pause at : 1:51:07

const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/1000.json');

random.setSeed(random.getRandomSeed());
// random.setSeed(96262);
console.log(random.getSeed());

let palette = random.pick(palettes);
palette = random.shuffle(palette);
palette = palette.slice(0, random.rangeFloor(2, palette.length+1));
const background = palette.shift();

const settings = {
  suffix: random.getSeed(), 
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / ( count-1 );
        const v = count <= 1 ? 0.5 : y / ( count-1 );
        const radius = Math.abs(random.noise2D(u, v)) * 0.15;
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v) * 0.3, 
          position: [ u, v ]
        });
      }
    }
    return points;
  };
  
  let points = createGrid().filter(() => random.value() > 0.65);
  
  // render function
  return ({ context, width, height }) => {
    const margin = width * 0.175;

    context.fillStyle = background; 
    context.globalAlpha = 1;
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
      // context.globalAlpha = 0.85;
      context.font = `${radius * width}px "Hack"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('.|', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
