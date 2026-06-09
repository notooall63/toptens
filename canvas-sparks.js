/**
 * Matrix Particle Propulsion Canvas Engine
 * Renders diamond-like sparkling anomalies traversing the golden accent background layout layers
 */
(function() {
    const canvas = document.getElementById('spark-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 65;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.baseAlpha = Math.random() * 0.4 + 0.1;
            this.alpha = this.baseAlpha;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = (Math.random() * 0.3 - 0.15);
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulsePhase = Math.random() * Math.PI;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.pulsePhase += this.pulseSpeed;
            // Mathematical pulse fluctuation simulation
            this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.2;
            
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.reset();
                this.y = canvas.height;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = '#ffffff';
            // Render specialized vector diamond pinpoint anomaly geometry
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.lineTo(this.x - this.size, this.y);
            ctx.closePath();
            ctx.fill();
            
            // Add golden bloom aura trace
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
            ctx.globalAlpha = Math.max(0, this.alpha * 0.3);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render secondary underlying smooth background gold glow gradients
        ctx.save();
        let gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height * 0.8, 10,
            canvas.width / 2, canvas.height * 0.8, Math.max(canvas.width, canvas.height)
        );
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            gradient.addColorStop(0, 'rgba(212, 175, 55, 0.03)');
            gradient.addColorStop(1, 'rgba(10, 14, 20, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(212, 175, 55, 0.02)');
            gradient.addColorStop(1, 'rgba(248, 250, 252, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
})();