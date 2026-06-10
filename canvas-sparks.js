// ==========================================================================
// D:/top-tens/frontend/canvas-sparks.js
// DYNAMIC VISUAL EFFECTS MATRIX LAYER (FLOWING GOLD WITH DIAMOND SPARKS)
// ==========================================================================

(function () {
    const canvas = document.getElementById("spark-particle-canvas");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class SparkParticleNode {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.7 + 0.2);
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.2;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.sparkleMode = Math.random() > 0.85; // 15% are diamond white flash nodes
            this.sparkleSpeed = Math.random() * 0.05 + 0.02;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.sparkleMode) {
                this.alpha += this.sparkleSpeed;
                if (this.alpha > 0.9 || this.alpha < 0.2) {
                    this.sparkleSpeed = -this.sparkleSpeed;
                }
            }

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            if (this.sparkleMode) {
                // Diamond Pinpoint Core Flash Vector
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.arc(this.x, this.y, this.size * 1.4, 0, Math.PI * 2);
            } else {
                // Flowing Gold Vector
                ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.restore();
        }
    }

    function initMatrixPool() {
        particles = [];
        for (let i = 0; i < 110; i++) {
            particles.push(new SparkParticleNode());
        }
    }

    function renderEngineLoop() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(renderEngineLoop);
    }

    initMatrixPool();
    renderEngineLoop();
})();