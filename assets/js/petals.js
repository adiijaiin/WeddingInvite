/**
 * Realistic Indian Wedding Floral Petals Particle Engine (Pastel Theme)
 * Simulates fluttering Powder Blue hydrangeas, Dusty Mauve rose petals, and Jasmine blossoms
 */

class PetalEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.petals = [];
        this.maxPetals = 40;
        this.isRunning = false;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Pastel Palette: Powder Blue, Dusty Mauve, Rose Quartz, Jasmine White, Champagne Gold
        // (fallback; the live values come from the --petal-N-* CSS variables so themes can change them)
        this.petalColors = [
            { bg: '#A3C4D7', border: '#7BA5BF', type: 'powder' },
            { bg: '#B8D5E5', border: '#8FAFC3', type: 'powder' },
            { bg: '#C492B1', border: '#A86B90', type: 'mauve' },
            { bg: '#DDB3CC', border: '#B784A7', type: 'mauve' },
            { bg: '#FFF9F0', border: '#EEDFC8', type: 'jasmine' },
            { bg: '#F7EDD7', border: '#D8BC7E', type: 'gold' }
        ];
    }

    // Read the petal colours from the current theme's CSS variables and recolour the petals in flight
    refreshColors() {
        const styles = getComputedStyle(document.documentElement);
        const fromCss = this.petalColors.map((fallback, i) => {
            const bg = styles.getPropertyValue(`--petal-${i + 1}-bg`).trim();
            const border = styles.getPropertyValue(`--petal-${i + 1}-border`).trim();
            return { bg: bg || fallback.bg, border: border || fallback.border, type: fallback.type };
        });
        this.petalColors = fromCss;
        this.petals.forEach(p => {
            const colorSet = fromCss[Math.floor(Math.random() * fromCss.length)];
            p.color = colorSet.bg;
            p.borderColor = colorSet.border;
            p.type = colorSet.type;
        });
    }

    init() {
        this.refreshColors();
        this.canvas = document.getElementById('petalsCanvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'petalsCanvas';
            document.body.appendChild(this.canvas);
        }
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99';
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.maxPetals; i++) {
            this.petals.push(this.createPetal(true));
        }

        this.isRunning = true;
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createPetal(randomY = false) {
        const colorSet = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
        const size = Math.random() * 8 + 8; // 8 - 16px
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : -30 - Math.random() * 50,
            size: size,
            color: colorSet.bg,
            borderColor: colorSet.border,
            type: colorSet.type,
            speedY: Math.random() * 1.3 + 1.0,
            speedX: Math.random() * 1.2 - 0.6,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 1.8 - 0.9,
            sway: Math.random() * 0.035 + 0.015,
            swayOffset: Math.random() * Math.PI * 2,
            flip: Math.random() * Math.PI,
            flipSpeed: Math.random() * 0.025 + 0.015,
            opacity: Math.random() * 0.35 + 0.65
        };
    }

    burst(count = 65) {
        for (let i = 0; i < count; i++) {
            const petal = this.createPetal(false);
            petal.x = this.width * 0.5 + (Math.random() - 0.5) * (this.width * 0.85);
            petal.y = -20 - Math.random() * 80;
            petal.speedY = Math.random() * 3.5 + 2.0;
            petal.speedX = (Math.random() - 0.5) * 4;
            petal.size = Math.random() * 10 + 9;
            this.petals.push(petal);
        }
    }

    drawPetal(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.scale(Math.cos(p.flip), 1);
        this.ctx.globalAlpha = p.opacity;

        this.ctx.beginPath();
        if (p.type === 'powder' || p.type === 'jasmine') {
            // Rounded delicate blossom petal
            this.ctx.moveTo(0, -p.size);
            this.ctx.bezierCurveTo(p.size * 0.85, -p.size * 0.5, p.size * 0.85, p.size * 0.7, 0, p.size);
            this.ctx.bezierCurveTo(-p.size * 0.85, p.size * 0.7, -p.size * 0.85, -p.size * 0.5, 0, -p.size);
        } else {
            // Heart-curved rose/mauve petal
            this.ctx.moveTo(0, -p.size * 0.8);
            this.ctx.bezierCurveTo(p.size * 1.1, -p.size * 0.4, p.size * 0.8, p.size, 0, p.size * 1.05);
            this.ctx.bezierCurveTo(-p.size * 0.8, p.size, -p.size * 1.1, -p.size * 0.4, 0, -p.size * 0.8);
        }
        this.ctx.fillStyle = p.color;
        this.ctx.fill();

        this.ctx.strokeStyle = p.borderColor;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        this.ctx.restore();
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.petals.length - 1; i >= 0; i--) {
            const p = this.petals[i];

            p.y += p.speedY;
            p.swayOffset += p.sway;
            p.x += Math.sin(p.swayOffset) * 1.2 + p.speedX;
            p.rotation += p.rotationSpeed;
            p.flip += p.flipSpeed;

            this.drawPetal(p);

            if (p.y > this.height + 40) {
                if (this.petals.length > this.maxPetals) {
                    this.petals.splice(i, 1);
                } else {
                    this.petals[i] = this.createPetal(false);
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

window.petalEngine = new PetalEngine();
window.showerBlessings = function (count = 70) {
    if (window.petalEngine) {
        window.petalEngine.burst(count);
    }
};
