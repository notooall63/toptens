/**
 * Top Tens - HTML5 Particle Engine
 * Multi-layer background execution loop creating organic pinpoint sparkles.
 */
class CanvasSparks {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 65;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
      size: Math.random() * 1.8 + 0.4,
      speedY: -(Math.random() * 0.7 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseDir: Math.random() > 0.5 ? 1 : -1
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += p.pulseSpeed * p.pulseDir;
      
      if (p.opacity > 0.85) { p.pulseDir = -1; p.opacity = 0.85; }
      if (p.opacity < 0.15) { p.pulseDir = 1; p.opacity = 0.15; }

      if (p.y < -10 || p.x < -10 || p.x > this.canvas.width + 10) {
        this.particles[i] = this.createParticle(false);
        p = this.particles[i];
      }

      this.ctx.beginPath();
      let gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      gradient.addColorStop(0, `rgba(255, 223, 112, ${p.opacity})`);
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}

window.CanvasSparks = CanvasSparks;