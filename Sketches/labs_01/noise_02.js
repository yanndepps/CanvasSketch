const canvasSketch = require("canvas-sketch");
const Random = require("canvas-sketch-util/random");
const { linspace } = require("canvas-sketch-util/math");

// You can force a specific seed by replacing this with a string value
const defaultSeed = "";

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log("Random Seed:", Random.getSeed());

const settings = {
  hotkeys: true,
  suffix: Random.getSeed(),
  animate: true,
  dimensions: [2048, 2048]
};

const sketch = ({ width, height }) => {
  const pageSize = Math.min(width, height);

  // page settings
  const margin = pageSize * 0;
  const background = "hsl(0, 0%, 5%)";

  // system settings
  const numParticles = 2000;
  const frequency = 0.33;

  // line settings
  const lineWidth = pageSize * 0.00175;
  const foreground = "white";
  const alpha = 0.5;

  // Create some flat data structure worth of points
  const particles = linspace(numParticles, true).map(() => {
    const minSpeed = pageSize * 0.2;
    const baseSpeed = Math.abs(Random.gaussian() * pageSize * 0.2);
    const speed = Math.max(minSpeed, baseSpeed);
    return {
      active: true,
      path: [],
      distance: 0,
      maxDistance: Math.abs(Random.gaussian(pageSize * 0.2, pageSize * 0.05)),
      speed,
      position: [
        Random.range(margin, width - margin),
        Random.range(margin, height - margin)
      ]
    };
  });

  return ({ context, deltaTime }) => {
    // Fill the canvas
    context.fillStyle = background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    // avoid huge steps when browser is lagging
    const dt = Math.min(1 / 16, deltaTime);

    // step particles
    particles.forEach(particle => {
      if (particle.distance > particle.maxDistance) {
        return;
      }
      const u = (particle.position[0] / width) * 2 - 1;
      const v = (particle.position[1] / height) * 2 - 1;
      const angle = Random.noise2D(u, v, frequency, Math.PI * 2);

      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      const [lastX, lastY] = particle.position;

      particle.position[0] += dirX * dt * particle.speed;
      particle.position[1] += dirY * dt * particle.speed;

      const [newX, newY] = particle.position;
      const dx = newX - lastX;
      const dy = newY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      particle.distance += dist;

      particle.path.push(particle.position.slice());
    });

    // draw particles
    particles.forEach(particle => {
      context.beginPath();
      particle.path.forEach(([x, y]) => context.lineTo(x, y));
      context.lineWidth = lineWidth;
      context.globalAlpha = alpha;
      context.strokeStyle = foreground;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
