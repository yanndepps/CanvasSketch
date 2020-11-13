const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()

const settings = {
    p5: true,
    animate: false,
    context: '2d',
    name: 'poster_02',
    pixelsPerInch: 300,
    units: 'cm',
    dimensions: [ 21, 21 ],
    bleed: 1
};

let margin = 20;
let itter = 10;
let radius;
let step;



canvasSketch(({ width, height }) => {
    // setup
    step = (width - margin * 2) / (itter - 1);
    console.log(step);
    // draw
    return () => {
        background('#333333');
        const dim = Math.min(width, height);
        const sz = dim * 0.0435;
        console.log(sz);

        fill(255);
        noStroke();
        for (let y = 0; y < itter; y++) {
            for (let x = 0; x < itter; x++) {
                radius = random(0, sz);
                ellipse(margin + x * step, margin + y * step, radius, radius);
            }
        }
    }
} ,settings);
