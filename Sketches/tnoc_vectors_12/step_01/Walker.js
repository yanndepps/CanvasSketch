// @ts-nocheck
module.exports = class Walker {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }
  update() {
    this.pos.x = this.pos.x + random(-1, 1);
    this.pos.y = this.pos.y + random(-1, 1);
  }
  show(dim) {
    stroke(255, 100);
    strokeWeight(dim);
    point(this.pos.x, this.pos.y);
  }
}