const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()

const settings = {
  p5: true,
  dimensions: [ 800, 800 ], 
  // dimensions: 'A5',
  // orientation: 'landscape',
  // pixelsPerInch: 300,
  animate: true,
  duration: 8,
  context: '2d'
};

let offset = 100;
let flow_cell_size = 5;
let noise_size = 0.0045;
let noise_radius = 0.0045;
let th = 0.00250;
let flow_width;
let flow_height;
let noise_grid = [];
let flow_grid = [];
let number_of_particles = 3000;
let particles = [];
let col1, col2;
let tick = 0;
let dim;

canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  // ...
  col1 = color(random(255), random(255), random(255), 13);
  col2 = color(random(255), random(255), random(255), 13);
  dim = Math.min(width, height) * th;
  flow_width = (width + offset * 2) / flow_cell_size;
  flow_height = (height + offset * 2) / flow_cell_size;
  flow_width = (width + offset * 2) / flow_cell_size;
  flow_height = (height + offset * 2) / flow_cell_size;
  init_particles();
  init_flow();
  smooth();
  background(10);
  strokeWeight(dim);
  console.log(dim);
  // console.log(width);
  // ---
  // Attach events to window to receive them
  window.mouseClicked = () => {
    console.log('Mouse clicked');
  };
  // ---

  // Return a renderer to 'draw' the p5.js content
  return ({ playhead, time, width, height }) => {
    // Draw with p5.js things
    translate(-offset, -offset);
    //display_flow();
    update_particles();
    if (tick > 0.1) display_particles();
    tick += 0.002;
  };

  // ---
  function init_particles() {
    for (var i = 0; i < number_of_particles; i++) {
      let r = random(width + 2 * offset);
      let q = random(height + 2 * offset);
      particles.push({
        prev: createVector(r, q),
        pos: createVector(r, q),
        vel: createVector(0, 0),
        acc: createVector(0, 0),
        col: (noise(124 + r / 80, 355 + q / 80) * 280 + 30) % 360,
        col2: lerpColor(col1, col2, noise(124 + r / 200, 355 + q / 200)),

        col3: lerpColor(col1, col2, noise(r * noise_size, q * noise_size)),
        seed: i
      });
    }
  }
  
  function update_particles() {
    for (var i = 0; i < number_of_particles; i++) {
      let prt = particles[i];
      let flow = get_flow(prt.pos.x, prt.pos.y);

      prt.prev.x = prt.pos.x;
      prt.prev.y = prt.pos.y;

      prt.pos.x = mod(prt.pos.x + prt.vel.x, width + 2 * offset);
      prt.pos.y = mod(prt.pos.y + prt.vel.y, height + 2 * offset);

      prt.vel
        .add(prt.acc)
        .normalize()
        .mult(1.5);

      //prt.acc = p5.Vector.fromAngle(p.noise(prt.seed * 10, tick) * p.TAU).mult(0.01);
      prt.acc = createVector(0, 0);
      prt.acc.add(flow).mult(10);
    }
  }

  function init_flow() {
    for (let i = 0; i < flow_height; i++) {
      let row = [];
      for (let j = 0; j < flow_width; j++) {
        row.push(calculate_flow(j * noise_size, i * noise_size, noise_radius));
      }
      flow_grid.push(row);
    }
  }

  function calculate_flow(x, y, r) {
    let high_val = 0;
    let low_val = 1;
    let high_pos = createVector(0, 0);
    let low_pos = createVector(0, 0);

    for (var i = 0; i < 200; i++) {
      let angle = i / 200 * TAU;
      let pos = createVector(x + cos(angle) * r, y + sin(angle) * r);
      let val = noise(pos.x, pos.y);

      if (val > high_val) {
        high_val = val;
        high_pos.x = pos.x;
        high_pos.y = pos.y;
      }
      if (val < low_val) {
        low_val = val;
        low_pos.x = pos.x;
        low_pos.y = pos.y;
      }
    }

    let flow_angle = createVector(x - high_pos.x, y - high_pos.y);
    flow_angle
      .normalize()
      .mult(20)
      .mult(high_val - low_val)
      .rotate(HALF_PI);

    return flow_angle;
  }

  function calculate_flow2(x, y, r) {
    let diff = 0;
    let max_diff = 0;
    let low_pos = createVector(0, 0);
    let high_pos = createVector(0, 0);

    for (var i = 0; i < 30; i++) {
      let angle = random(TAU);
      let pos1 = createVector(x + cos(angle) * r, y + sin(angle) * r);
      let pos2 = createVector(x + cos(angle + PI) * r, y + sin(angle + PI) * r);

      let val1 = noise(pos1.x, pos1.y);
      let val2 = noise(pos2.x, pos2.y);

      diff = abs(val2 - val1);

      if (diff > max_diff) {
        max_diff = diff;
        if (val1 < val2) {
          low_pos.x = pos1.x;
          low_pos.y = pos1.y;
          high_pos.x = pos2.x;
          high_pos.y = pos2.y;
        } else {
          low_pos.x = pos2.x;
          low_pos.y = pos2.y;
          high_pos.x = pos1.x;
          high_pos.y = pos1.y;
        }
      }
    }

    let flow_angle = createVector(low_pos.x - high_pos.x, low_pos.y - high_pos.y);
    flow_angle.normalize().rotate(HALF_PI);
    return flow_angle;
  }

  function calculate_flow3(x, y, r) {
    let diff = 100;
    let min_diff = 100;
    let low_pos = createVector(0, 0);
    let high_pos = createVector(0, 0);

    for (var i = 0; i < 50; i++) {
      let angle1 = i / 50 * PI;
      //let angle2 = angle1 + p.PI;
      let pos1 = createVector(x + cos(angle1) * r, y + sin(angle1) * r);
      //let pos2 = p.createVector(x + p.cos(angle2) * r, y + p.sin(angle2) * r);

      let valc = noise(x, y);
      let valr = noise(pos1.x, pos1.y);

      diff = abs(valr - valc);

      if (diff <= min_diff) {
        min_diff = diff;
        high_pos.x = pos1.x;
        high_pos.y = pos1.y;
      }
      //console.log(angle1, angle2);
    }

    //console.log(low_pos, high_pos);
    let flow_angle = createVector(x - high_pos.x, y - high_pos.y);
    flow_angle.normalize().rotate(HALF_PI);
    return flow_angle;
  }

  function get_flow(xpos, ypos) {
    xpos = constrain(xpos, 0, width + offset * 2);
    ypos = constrain(ypos, 0, height + offset * 2);
    return flow_grid[floor(ypos / flow_cell_size)][floor(xpos / flow_cell_size)];
  }

  function display_particles() {
    for (let i = 0; i < particles.length; i++) {
      stroke(particles[i].col2);
      //p.point(particles[i].pos.x, particles[i].pos.y);
      if (p5.Vector.dist(particles[i].prev, particles[i].pos) < 10)
        line(particles[i].prev.x, particles[i].prev.y, particles[i].pos.x, particles[i].pos.y);
    }
  }

  function display_flow() {
    for (let i = 0; i < flow_grid.length; i++) {
      for (let j = 0; j < flow_grid[i].length; j++) {
        strokeWeight(dim*0.5);
        stroke(255, 0, 0);
        noFill();
        ellipse(j * flow_cell_size, i * flow_cell_size, 7, 7);
        line(
          j * flow_cell_size,
          i * flow_cell_size,
          j * flow_cell_size + flow_grid[i][j].x * 5,
          i * flow_cell_size + flow_grid[i][j].y * 5
        );
      }
    }
  }

  function mod(x, n) {
    return (x % n + n) % n;
  }

}, settings);
