/**
 * Top Tens - Dynamic Background Spark Engine (Fluid Physics Simulation Layer)
 * Directory: D:/top-tens/frontend/canvas-sparks.js
 */

const canvas = document.getElementById("ambient-spark-engine-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = (canvas.width = window.innerWidth);
  height = (canvas.height = window.innerHeight);
});

class FluidGoldWave {
  constructor() {
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.002 + Math.random() * 0.003;
    this.amplitude = 40 + Math.random() * 60;
    this.frequency = 0.001 + Math.random() * 0.002;
    this.yAnchor = height * 0.5 + (Math.random() - 0.5) * (height * 0.3);
  }

  render() {
    this.phase += this.speed;
    ctx.beginPath();
    ctx.moveTo(0, this.yAnchor);

    for (let x = 0; x < width; x += 10) {
      const y = this.yAnchor + Math.sin(x * this.frequency + this.phase) * this.amplitude;
      ctx.lineTo(x, y);
    }

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(170, 124, 17, 0.0)");
    gradient.addColorStop(0.5, "rgba(212, 175, 55, 0.06)");
    gradient.addColorStop(1, "rgba(243, 229, 171, 0.0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

class DiamondSparkle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 1 + Math.random() * 2;
    this.opacity = 0;
    this.fadeSpeed = 0.005 + Math.random() * 0.015;
    this.growing = true;
    this.maxOpacity = 0.3 + Math.random() * 0.5;
  }

  update() {
    if (this.growing) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= this.maxOpacity) this.growing = false;
    } else {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) this.reset();
    }
  }

  render() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    
    // Renders a precise mathematical diamond geometric coordinate profile
    ctx.moveTo(0, -this.size * 2);
    ctx.lineTo(this.size, 0);
    ctx.lineTo(0, this.size * 2);
    ctx.lineTo(-this.size, 0);
    
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

const wavePool = Array.from({ length: 5 }, () => new FluidGoldWave());
const diamondPool = Array.from({ length: 45 }, () => new DiamondSparkle());

function executionAnimationLoop() {
  ctx.clearRect(0, 0, width, height);
  
  // Render golden flow
  wavePool.forEach(wave => wave.render());
  
  // Render diamond sparkles
  diamondPool.forEach(spark => {
    spark.update();
    spark.render();
  });

  requestAnimationFrame(executionAnimationLoop);
}

executionAnimationLoop();