// Working with data : JSON part4
// loading JSON data from an url (asynchronous callback)

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 512, 512 ],
  animate: true,
  context: '2d'
};


// preload before the sketch
window.preload = () => {
  //--- 
}

let x = 0;
let spaceData;

const sketch = () => {
  // setup
  loadJSON('http://api.open-notify.org/astros.json', gotData);
  
  // attach events to window to receive them
  window.mouseClicked = () => {
    console.log('mouse clicked');
  }
  // draw
  return ({ width, height }) => {
    const dim = min(width, height);
    const radAm = 0.02;
    const strAm = 0.0015;
    const rad = Math.floor(dim * radAm);
    const thick = Math.ceil(dim * strAm);
    //---
    background('#1c1c1c');
    stroke('#fffd01');
    strokeWeight(thick);
    line(x, 0, x, height);
    x = x+1;
    if (x > width) {
      x = 0;
    }
    //---
    if (spaceData) {
      randomSeed(5);
      for (let i = 0; i < spaceData.number; i++) {
        fill('#fffd01');
        noStroke();
        ellipse(random(width), random(height), rad*2, rad*2);
      }
    }
  };
};

function gotData(data) {
  spaceData = data;
}

canvasSketch(sketch, settings);
