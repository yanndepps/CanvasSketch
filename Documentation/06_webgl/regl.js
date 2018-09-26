const canvasSketch = require('canvas-sketch');
const createRegl = require('regl');

const settings = {
  // use a webgl context instead of 2d canvas
  context: 'webgl',
  // enable MSAA in webgl
  attributes: {
    antialias: true
  }
};

canvasSketch(({ gl }) => {
  // setup REGL with our canvas context
  const regl = createRegl({ gl });

  // create your GL draw commands
  // ...

  // return the renderer function
  return () => {
    // update regl sizes
    regl.poll();

    // clear back buffer with red
    regl.clear({
      color: [ 1, 0, 0, 1 ]
    });

    // draw your meshes
    // ...
  };
}, settings);
