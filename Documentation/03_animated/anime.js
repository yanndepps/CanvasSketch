const canvasSketch = require('canvas-sketch');

const settings = {
  // enable an animation loop
  animate: true,
  // set loop duration to 3
  duration: 4,
  // use a small size for better GIF file size
  dimensions: [ 256, 256 ],
  // optionally specify a frame rate, defaults to 30
  fps: 30
};

// start the sketch
canvasSketch(() => {
  return ({ context, width, height, playhead }) => {
    // fill the canvas with pink
    context.fillStyle = 'pink';
    context.fillRect(0, 0, width, height);

    // get a seamless 0..1 value for our loop
    const t = Math.sin(playhead * Math.PI);

    // animate the thickness with 'playhead' prop
    const thickness = Math.max(5, Math.pow(t, 0.55) * width * 0.5);

    // rotate with PI to create a seamless animation
    const rotation = playhead * Math.PI;

    // draw a rotating white rectangle around the center
    const cx = width / 2;
    const cy = height / 2;
    const length = height * 0.5;
    context.fillStyle = 'white';
    context.save();
    context.translate(cx, cy);
    context.rotate(rotation);
    context.fillRect(-thickness / 2, -length / 2, thickness, length);
    context.restore();
  };
}, settings);
