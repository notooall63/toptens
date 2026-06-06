// File: D:/top-tens/frontend/canvas-sparks.js

(function () {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class ShimmerParticle {
        constructor() {
            this.init(true);
        }

        init(isInitialStartup = false) {
            this.x = Math.random() * canvas.width;
            // Distribute initialization across vertical viewport surface plane maps smoothly
            this.y = isInitialStartup ? Math.random() * canvas.height : canvas.height + Math.random() * 30;
            this.radius = Math.random() * 1.8 + 0.4;
            this.verticalVelocity = -(Math.random() * 0.6 + 0.15);
            this.horizontalWobbleVelocity = (Math.random() - 0.5) * 0.25;
            this.theta = Math.random() * Math.PI * 2;
            this.oscillationFrequency = Math.random() * 0.015 + 0.003;
            this.baseOpacity = Math.random() * 0.4 + 0.15;
            this.currentOpacity = this.baseOpacity;
        }

        update() {
            this.y += this.verticalVelocity;
            this.x += this.horizontalWobbleVelocity;
            this.theta += this.oscillationFrequency;
            
            // Build absolute sine wave tracking shimmer intensity profile loops
            this.currentOpacity = this.baseOpacity + Math.sin(this.theta) * 0.12;

            // Recycling boundary threshold detection
            if (this.y < -15 || this.currentOpacity <= 0 || this.x < -10 || this.x > canvas.width + 10) {
                this.init(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, Math.min(1, this.currentOpacity))})`;
            ctx.shadowBlur = this.radius * 3;
            ctx.shadowColor = '#d4af37';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset acceleration footprint immediately
        }
    }

    function setupPool() {
        resizeCanvas();
        particles = [];
        // Scale capacity ceiling index based dynamically against system dimension properties
        const quota = Math.min(75, Math.floor(canvas.width / 18));
        for (let i = 0; i < quota; i++) {
            particles.push(new ShimmerParticle());
        }
    }

    function paintLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(paintLoop);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    setupPool();
    paintLoop();
})();