/**
 * Diamond Particle Ray Trace Animation Engine
 * Triggers random ambient bursts behind UI components.
 */

(function() {
    const canvas = document.getElementById("spark-matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class DiamondSparkle {
        constructor() {
            this.reset();
            // Stagger start lines randomly across height grids
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 3 + 2;
            this.speedY = -(Math.random() * 0.7 + 0.3);
            this.alpha = 0;
            this.maxAlpha = Math.random() * 0.5 + 0.3;
            this.fadeSpeed = Math.random() * 0.01 + 0.005;
            this.phase = Math.random() * Math.PI;
        }
        update() {
            this.y += this.speedY;
            this.phase += 0.02;
            
            // Simulates smooth horizontal atmospheric drift shifts
            this.x += Math.sin(this.phase) * 0.2;

            if (this.alpha < this.maxAlpha) {
                this.alpha += this.fadeSpeed;
            }
            if (this.y < -10) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.6, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size * 0.6, 0);
            ctx.closePath();
            
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#d4af37";
            
            // Cleaned up the redundant assignment line to save animation processor overhead
            ctx.fillStyle = "#f3e5ab";
            ctx.fill();
            ctx.restore();
        }
    }

    const poolSize = 45;
    for(let i=0; i<poolSize; i++) {
        particles.push(new DiamondSparkle());
    }

    function renderLoopFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0; i<particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(renderLoopFrame);
    }
    renderLoopFrame();
})();