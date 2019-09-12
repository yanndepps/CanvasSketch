const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  // choose a random palette and a random number of colors from 1 to 5
  // const colorCount = 3;
  // const palette = random.pick(palettes).slice(0, colorCount);

  const colorCount = random.rangeFloor(2, 4);
  const palette = random.shuffle(random.pick(palettes))
                        .slice(0, colorCount);
// characters
  const characters = '→←↑↓AB'.split('');
  
  const createGrid = () => {
    // create a list of points
    const points = [];
    const count = 30; 
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / ( count - 1 );
        const v = count <= 1 ? 0.5 : y / ( count - 1 );
        // const radius = Math.abs( random.noise2D(u, v) ) * 0.1;
        const character = random.pick(characters);
        const r = /[AB]/i.test(character) ? 25 : 50;
        const e = /[AB]/i.test(character) ? 10 : 20;
        points.push({
          color: random.pick(palette), 
          radius: Math.abs(r + e * random.gaussian()), 
          // rotation: random.noise2D(u, v),
          position: [u, v],
          character
        });
      }
    }
    // just returns our points
    return points;
  };
  
  // random.setSeed(303);
  const points = createGrid().filter(() => random.chance(0.5));
  const margin = 400;
  const fontUrl = './assets/fonts/SpaceGrotesk-Medium.woff';
  const font = new window.FontFace(
    'SpaceGrotesk-Medium',
    `url(${fontUrl})`
  );

  // await font.load();

  document.fonts.add(font);

  // main return / render function 
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      // destructure data into radius and position
      const {
        color,
        position,
        radius,
        character
      } = data;

      const [u, v] = position;
      
      const x = lerp(margin, width - margin, u); 
      const y = lerp(margin, height - margin, v); 

      // draw text items 
      context.fillStyle = color;
      context.font = `${radius * width}px "SpaceGrotesk-Medium"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(character, x, y);
    });
  };
};

canvasSketch(sketch, settings);
