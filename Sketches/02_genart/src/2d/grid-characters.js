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

random.setSeed(34);

const sketch = async ({ width, height }) => {
  // choose a random palette and a random number of colors from 1 to 5
  // const colorCount = 3;
  // const palette = random.pick(palettes).slice(0, colorCount);

  // more color choices and randomness 
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes))
                        .slice(0, colorCount);

  // const characters = '←↑→↓YP'.split('');
  const characters = 'f|o|r|m'.split('');
  // const background = ['hsl(0, 0%, 96%)'];

  const createGrid = () => {
    // create a list of points
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // pixel coordinates for each grid points
        const u = count <= 1 ? 0.5 : x / ( count - 1 );
        const v = count <= 1 ? 0.5 : y / ( count - 1 );
        const character = random.pick(characters);
        const r = /[f|o|r|m]/i.test(character) ? 25 : 50;
        const e = /[f|o|r|m]/i.test(character) ? 10 : 20;
        // const radius = Math.abs( random.noise2D(u, v) ) * 0.25;
        points.push({
          // pick a random color from our single palette
          color: random.pick(palette), 
          radius: Math.abs(r + e * random.gaussian()),
          // radius,
          position: [u, v],
          // rotation: random.noise2D(u, v),
          rotation: 45 * Math.PI/180,
          character
        });
      }
    }
    // just returns our points
    return points;
  };
  
  // remove for different results each time
  // random.setSeed(303);
  const points = createGrid().filter(() => random.value() > 0.5);

  // load fonts using browser's "FontFace" API to load fonts from javascript
  // this ensures the font is renderable before first drawing to the canvas
  const fontUrl = './assets/fonts/SpaceGrotesk-Medium.woff';
  const font = new window.FontFace(
    'SpaceGrotesk-Medium',
    `url(${fontUrl})`
  );

  // async/await : wait for the font to load
  await font.load();
  // add the loaded font to the document
  document.fonts.add(font);

  const margin = width * 0.143;
  // main return / render function 
  return ({ context }) => {

    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      // destructure data into radius and position
      const {
        color,
        position,
        radius,
        rotation,
        character
      } = data;

      const [u, v] = position;
      
      const x = lerp(margin, width - margin, u); 
      const y = lerp(margin, height - margin, v); 

      // draw text items or unicodes 
      context.save();
      context.fillStyle = color;
      context.font = `${radius*0.20}px "SpaceGrotesk-Medium"`;
      // context.translate(width/32, height/32);
      // context.rotate(rotation);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(character, x, y);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
