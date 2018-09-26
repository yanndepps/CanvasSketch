import canvasSketch from 'canvas-sketch';
// const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 256, 256]
};

const sketch = () => {
  return (props) => {
    // Destructure what we need from props
    const { context, width, height } = props;

    // Fill the canvas with pink
    context.fillStyle = 'plum';
    context.fillRect(0, 0, width, height);

    // Draw a white rectangle in the center
    context.strokeStyle = 'white';
    context.lineWidth = 4;
    context.strokeRect(width/4, height/4, width/2, height/2);
  };
};

canvasSketch(sketch, settings);