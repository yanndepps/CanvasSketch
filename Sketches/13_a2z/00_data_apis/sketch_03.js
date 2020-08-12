// Working with data : JSON part3
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

const sketch = () => {
  // setup
  loadJSON('http://api.open-notify.org/astros.json', gotData);
  
  // attach events to window to receive them
  window.mouseClicked = () => {
    console.log('mouse clicked');
  }
  // draw
  return ({ width, height }) => {
    // const dim = min(width, height);
    // const am = 0.0015;
    // const thick = dim * am;
    // console.log(thick);
    
  };
};

function gotData(data) {
  background('#6d5acf');
  const dim = min(width, height);
  const am = 0.04;
  const thick = dim * am;
  // console.log(thick);
  for (let i = 0; i < data.number; i++) {
    fill('#fffd01');
    noStroke();
    ellipse(random(width)-thick/2, random(height)-thick/2, thick, thick);
  }
}

canvasSketch(sketch, settings);
