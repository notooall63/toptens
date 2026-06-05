// File: D:/top-tens/frontend/canvas-sparks.js
class CanvasSparks {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 65;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.7 + 0.1,
      speedY: -(Math.random() * 0.3 + 0.1),
      fadeSpeed: Math.random() * 0.006 + 0.002
    };
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    while(this.particles.length < this.maxParticles) {
      this.particles.push(this.createParticle());
    }
    
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.y += p.speedY;
      p.alpha -= p.fadeSpeed;
      
      if (p.alpha <= 0 || p.y < 0) {
        this.particles[i] = this.createParticle();
        continue;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(224, 185, 87, ${p.alpha})`;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#f3e5ab';
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CanvasSparks('bg-canvas');
});