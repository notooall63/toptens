// D:/top-tens/frontend/canvas-sparks.js

(function() {
    const canvas = document.getElementById('spark-matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class GoldStream {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 200;
            this.speed = 0.4 + Math.random() * 0.8;
            this.amplitude = 30 + Math.random() * 60;
            this.frequency = 0.002 + Math.random() * 0.003;
            this.thickness = 1 + Math.random() * 3;
            this.alpha = 0.05 + Math.random() * 0.12;
            this.seed = Math.random() * 1000;
        }
        update() {
            this.y -= this.speed;
            this.x += Math.sin(this.y * this.frequency + this.seed) * 0.3;
            if (this.y < -100) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.thickness, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            ctx.fill();
        }
    }

    class MicroSpark {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5;
            this.maxAlpha = 0.2 + Math.random() * 0.6;
            this.alpha = 0;
            this.phase = Math.random() * Math.PI;
            this.speed = 0.01 + Math.random() * 0.02;
        }
        update() {
            this.phase += this.speed;
            this.alpha = Math.sin(this.phase) * this.maxAlpha;
            if (this.phase > Math.PI) this.reset();
        }
        draw() {
            if (this.alpha <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 229, 127, ${this.alpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#d4af37';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset canvas state optimization execution map
        }
    }

    const streams = Array.from({ length: 40 }, () => new GoldStream());
    const sparks = Array.from({ length: 65 }, () => new MicroSpark());

    function renderLoop() {
        // Evaluate theme context state directly off body element handle
        if (document.body.classList.contains('light-mode')) {
            ctx.clearRect(0, 0, width, height);
        } else {
            ctx.fillStyle = 'rgba(10, 12, 16, 0.12)';
            ctx.fillRect(0, 0, width, height);
        }

        // Project centered application structural logo background configuration matrix 
        ctx.save();
        ctx.globalAlpha = document.body.classList.contains('light-mode') ? 0.025 : 0.045;
        const img = new Image();
        img.src = 'AppIconTopTens.png';
        if (img.complete && img.width > 0) {
            const size = Math.min(width, height) * 0.65;
            ctx.drawImage(img, width/2 - size/2, height/2 - size/2, size, size);
        }
        ctx.restore();

        streams.forEach(s => { s.update(); s.draw(); });
        sparks.forEach(s => { s.update(); s.draw(); });

        requestAnimationFrame(renderLoop);
    }
    
    renderLoop();
})();