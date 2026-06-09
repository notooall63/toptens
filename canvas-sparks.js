(function() {
  const canvas = document.getElementById("sparkCanvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class SparkleParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4;
      this.sparkleVelocity = Math.random() * 0.02 + 0.005;
      this.glowPhase = Math.random() * Math.PI;
    }
    update() {
      this.glowPhase += this.sparkleVelocity;
      this.alpha = (Math.sin(this.glowPhase) + 1) * 0.4;
      if (this.glowPhase > Math.PI * 2) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = "#ffffff";
      // Render starburst cross hairs for diamonds
      ctx.fillRect(this.x, this.y, this.size, this.size);
      if (this.alpha > 0.6) {
        ctx.fillStyle = "#f3d078";
        ctx.fillRect(this.x - 2, this.y + 1, this.size + 4, 1);
        ctx.fillRect(this.x + 1, this.y - 2, 1, this.size + 4);
      }
      ctx.restore();
    }
  }

  const particlePool = Array.from({ length: 85 }, () => new SparkleParticle());

  // Gold Flow Vector Configuration Background Variables
  let ambientTime = 0;

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    // Render underlying flowing ambient liquid gold gradient
    ambientTime += 0.002;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const flowOffset = (Math.sin(ambientTime) + 1) * 10;
    
    // Check if the light variant theme modifier is deployed to adjust gradient calculations
    const lightActive = document.body.classList.contains("light-variant");
    if (lightActive) {
      gradient.addColorStop(0, "rgba(241,243,245,1)");
      gradient.addColorStop(0.5, "rgba(233,236,239,1)");
      gradient.addColorStop(1, "rgba(222,226,230,1)");
    } else {
      gradient.addColorStop(0, "rgba(10,13,20,1)");
      gradient.addColorStop(0.5, `rgba(${14 + flowOffset},${18 + flowOffset},30,1)`);
      gradient.addColorStop(1, "rgba(6,8,12,1)");
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Apply diamond sparkling particles overlay
    particlePool.forEach(spark => {
      spark.update();
      spark.draw();
    });

    requestAnimationFrame(renderLoop);
  }

  renderLoop();
})();