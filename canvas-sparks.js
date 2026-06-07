(function () {
    const canvas = document.getElementById('sparksCanvas');
    const ctx = canvas.getContext('2d');

    let sparks = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class GoldSparkle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = -Math.random() * 0.8 - 0.2;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.fadeSpeed = Math.random() * 0.006 + 0.002;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.fadeSpeed;

            if (this.opacity <= 0 || this.y < 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d4af37';
            ctx.fillStyle = 'rgba(243, 224, 170, 1)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initPool() {
        for (let i = 0; i < 75; i++) {
            sparks.push(new GoldSparkle());
        }
    }

    function renderLoop() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < sparks.length; i++) {
            sparks[i].update();
            sparks[i].draw();
        }
        requestAnimationFrame(renderLoop);
    }

    initPool();
    renderLoop();
})();