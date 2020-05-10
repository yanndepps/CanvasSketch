// Working with data : JSON part2
// object nested within objects
// JSON array

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 512, 800 ],
  animate: true,
  context: '2d'
};

let data;

// preload before the sketch
window.preload = () => {
  data = loadJSON('./data/data_02.json');
}

const sketch = () => {
  // setup
  noCanvas();
  let birds = data.birds;
  for (let i = 0; i < birds.length; i++) {
    // family
    createElement('h1', birds[i].family)
    // members
    let members = birds[i].members;
    for (let j = 0; j < members.length; j++ ) {
      createDiv(members[j]);
    }
  }
  // attach events to window to receive them
  window.mouseClicked = () => {
    console.log('mouse clicked');
  }
  // draw
  return ({ width, height }) => {
    //---
  };
};

canvasSketch(sketch, settings);
