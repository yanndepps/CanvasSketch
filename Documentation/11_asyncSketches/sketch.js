/**
 * A Canvas2D example of async loading and image processing.
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require('canvas-sketch');
const load = require('load-asset');

canvasSketch(async ({ update }) => {
  const image = await load('assets/baboon.jpg');

  // update sketch with new settings
  update({
    dimensions: [ image.width, image.height ]
  });

  // render sketch
  return ({ context, width, height }) => {
    // render to canvas
    context.drawImage(image, 0, 0, width, height);

    // extract bitmap pixel data
    const pixels = context.getImageData(0, 0, width, height);

    // Manipulate pixels
    const data = pixels.data;
    let len = width;
    while (len) {
      const newX = Math.floor(Math.random() * len--);
      const oldX = len;

      // leave row intact sometimes
      if (Math.random() > 0.85) continue;

      for (let y = 0; y < height; y++) {
        // leave column intact sometimes
        if (Math.random() > 0.925) continue;
        // copy new random column into old column
        const newIndex = newX + y * width;
        const oldIndex = oldX + y * width;
        // make 'grayscale' by just copying blue channel
        data[oldIndex * 4 + 0] = data[newIndex * 4 + 2];
        data[oldIndex * 4 + 1] = data[newIndex * 4 + 2];
        data[oldIndex * 4 + 2] = data[newIndex * 4 + 2];
      }
    }
    // put new pixels back into canvas
    context.putImageData(pixels, 0, 0);
  };
});
