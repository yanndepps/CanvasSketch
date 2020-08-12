// @ts-nocheck
module.exports = class Walker {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, -1);
  }
  update() {
    this.pos.add(this.vel);
    // this.pos.x = this.pos.x + random(-1, 1);
    // this.pos.y = this.pos.y + random(-1, 1);
  }
  show(dim) {
    fill(255, 100);
    ellipse(this.pos.x, this.pos.y, dim);
  }
}