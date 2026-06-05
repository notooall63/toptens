// File: D:/top-tens/frontend/canvas-sparks.js
class CanvasSparks {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.animate();
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.particles.length < 60) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        alpha: Math.random(),
        size: Math.random() * 2
      });
    }
    this.particles.forEach((p, i) => {
      p.alpha -= 0.005;
      if(p.alpha <= 0) this.particles.splice(i, 1);
      this.ctx.fillStyle = `rgba(224, 185, 87, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.animate());
  }
}
new CanvasSparks('bg-canvas');