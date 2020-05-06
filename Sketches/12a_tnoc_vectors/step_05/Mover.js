// @ts-nocheck
const p5 = require('p5');

module.exports = class Mover {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(3));
  }
  update() {
    // calculate the acceleration
    let mouse = createVector(mouseX, mouseY);
    this.acc = p5.Vector.sub(mouse, this.pos);
    this.acc.setMag(1);
    // apply the acceleration to the velocity
    this.vel.add(this.acc);
    // limit the velocity
    this.vel.limit(5);
    // apply the velocity to the position
    this.pos.add(this.vel);
  }
  show(rad) {
    fill(255, 100);
    ellipse(this.pos.x, this.pos.y, rad);
  }
}