const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 3;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.particles = [];
        this.alive = true;
        this.colors = [
            '#ff6b6b', // coral
            '#ffd93d', // gold
            '#6c5ce7', // purple
            '#a8e6cf', // mint
            '#ffffff'  // white
        ];
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
            this.explode();
            this.alive = false;
        }
    }

    explode() {
        const particleCount = 150;
        const angleIncrement = (Math.PI * 2) / particleCount;
        const colors = this.colors;

        for (let i = 0; i < particleCount; i++) {
            const angle = angleIncrement * i;
            const velocity = 2 + Math.random() * 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                color: color,
                size: Math.random() * 2 + 1
            });
        }
    }

    draw() {
        if (this.alive) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.03;
            particle.alpha -= 0.01;

            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
            ctx.fill();
        });
    }
}

let fireworks = [];

function createFirework() {
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = canvas.height * 0.2 + Math.random() * (canvas.height * 0.5);
    
    fireworks.push(new Firework(startX, startY, targetX, targetY));
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        createFirework();
    }

    fireworks = fireworks.filter(firework => {
        firework.update();
        firework.draw();
        return firework.alive || firework.particles.length > 0;
    });

    requestAnimationFrame(animate);
}

animate();
