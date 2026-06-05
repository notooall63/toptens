// File: D:/top-tens/frontend/canvas-sparks.js
(function () {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let sparks = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Spark {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.velocity = Math.random() * 0.3 + 0.1;
            this.fadeRate = Math.random() * 0.005 + 0.002;
        }
        update() {
            this.y -= this.velocity;
            this.alpha -= this.fadeRate;
            if (this.alpha <= 0 || this.y < 0) {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 20;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.size = Math.random() * 2 + 0.5;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#f3e5ab';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d4af37';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        sparks = [];
        const quantity = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < quantity; i++) {
            sparks.push(new Spark());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fluid Ambient Background Gold Flow Glow
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(7, 9, 14, 0.2)');
        gradient.addColorStop(0.5, 'rgba(20, 16, 5, 0.08)');
        gradient.addColorStop(1, 'rgba(7, 9, 14, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < sparks.length; i++) {
            sparks[i].update();
            sparks[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener('resize', init);
})();