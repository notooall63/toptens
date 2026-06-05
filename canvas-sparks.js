// File: D:/top-tens/frontend/canvas-sparks.js
class GoldVaultCanvas {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sparks = [];
    this.init();
    window.addEventListener('resize', () => this.init());
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createSpark() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2.2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      velocity: (Math.random() - 0.5) * 0.3,
      decay: Math.random() * 0.008 + 0.003
    };
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Flowing Golden Background Gradient Overlay
    let baseGrad = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    const isLight = document.body.classList.contains('light-mode');
    
    if (isLight) {
      baseGrad.addColorStop(0, "rgba(235, 238, 243, 0.85)");
      baseGrad.addColorStop(1, "rgba(215, 210, 195, 0.85)");
    } else {
      baseGrad.addColorStop(0, "rgba(10, 12, 16, 0.92)");
      baseGrad.addColorStop(1, "rgba(22, 18, 12, 0.92)");
    }
    this.ctx.fillStyle = baseGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Particle Handling Loop
    if (this.sparks.length < 75) {
      this.sparks.push(this.createSpark());
    }

    for (let i = 0; i < this.sparks.length; i++) {
      let p = this.sparks[i];
      p.y += p.velocity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.sparks[i] = this.createSpark();
        continue;
      }

      this.ctx.fillStyle = `rgba(224, 185, 87, ${p.alpha})`;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = "#e0b957";
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0; // reset
    requestAnimationFrame(() => this.render());
  }
}

const VaultAesthetic = new GoldVaultCanvas();
VaultAesthetic.render();