/**
 * Top Tens - Fluid Metallic Gold Flow Animation and Diamond Sparkle Engine
 */
(function() {
    const canvas = document.getElementById('sparklesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particlesArray = [];
    const maximumSparklesCount = 65;

    // Monitor resize loops dynamically to reset dimensional constraints
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class SparkleParticleNode {
        constructor() {
            this.resetState();
        }

        resetState() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
            this.sparkleVelocity = Math.random() * 0.02 + 0.005;
            this.glowFactor = Math.random() > 0.85; // High luminescence flags
        }

        updateCalculatedVectors() {
            // Apply slight ambient drift mimicking fluid gold rivers currents
            this.y -= Math.random() * 0.2 + 0.05;
            this.x += Math.sin(this.y * 0.01) * 0.1;
            
            // Loop shimmer alphas
            this.alpha += this.sparkleVelocity;
            if (this.alpha > 0.95 || this.alpha < 0.05) {
                this.sparkleVelocity = -this.sparkleVelocity;
            }

            // Recycle off-screen items
            if (this.y < 0) this.resetState();
        }

        drawFrameContext(context) {
            context.save();
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            if (this.glowFactor) {
                context.shadowBlur = 10;
                context.shadowColor = "#fcf6ba";
                context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            } else {
                // Production-grade deep gold solid metallic parameters mapping
                context.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            }
            
            context.fill();
            context.restore();
        }
    }

    // Initialize tracking arrays
    for (let i = 0; i < maximumSparklesCount; i++) {
        particlesArray.push(new SparkleParticleNode());
    }

    function runAnimationPipelineLoop() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw ambient background metallic gold flow stream vector
        const isLightModeActive = document.body.classList.contains('light-mode');
        const coreGradient = ctx.createLinearGradient(0, 0, width, height);
        
        if (isLightModeActive) {
            coreGradient.addColorStop(0, 'rgba(244, 245, 247, 1)');
            coreGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.02)');
            coreGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        } else {
            coreGradient.addColorStop(0, 'rgba(10, 11, 13, 1)');
            coreGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.035)');
            coreGradient.addColorStop(1, 'rgba(20, 22, 26, 1)');
        }
        
        ctx.fillStyle = coreGradient;
        ctx.fillRect(0, 0, width, height);

        // Map and step across sparkle vector sets
        particlesArray.forEach(p => {
            p.updateCalculatedVectors();
            p.drawFrameContext(ctx);
        });

        requestAnimationFrame(runAnimationPipelineLoop);
    }

    runAnimationPipelineLoop();
})();