/**
 * Dot Grid - Hidden dots that reveal when cursor is nearby
 */
class DotGrid {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mouse = { x: -9999, y: -9999 };
        this.revealRadius = 250; // large radius for reveal
        this.spacing = 35; // gap between dots
        this.dotRadius = 1.8;

        this.resize();
        this.createDots();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDots() {
        this.dots = [];
        const cols = Math.ceil(this.canvas.width / this.spacing) + 2;
        const rows = Math.ceil(this.canvas.height / this.spacing) + 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.dots.push({
                    x: c * this.spacing,
                    y: r * this.spacing,
                    baseRadius: this.dotRadius,
                    currentOpacity: 0,
                    currentRadius: this.dotRadius,
                    hue: 260 + Math.random() * 40 // purple-ish variation
                });
            }
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createDots();
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -9999;
            this.mouse.y = -9999;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const dot of this.dots) {
            const dx = this.mouse.x - dot.x;
            const dy = this.mouse.y - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Target opacity based on distance from cursor
            let targetOpacity = 0;
            let targetRadius = dot.baseRadius;

            if (dist < this.revealRadius) {
                const proximity = 1 - (dist / this.revealRadius);
                targetOpacity = proximity * 0.8;
                targetRadius = dot.baseRadius + proximity * 2.5;
            }

            // Smooth interpolation
            dot.currentOpacity += (targetOpacity - dot.currentOpacity) * 0.08;
            dot.currentRadius += (targetRadius - dot.currentRadius) * 0.1;

            // Only draw if visible enough
            if (dot.currentOpacity > 0.005) {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);

                // Inner dots glow more - use accent colors
                const innerProximity = dist < this.revealRadius * 0.4 ? 1 : 0;
                const saturation = 70 + innerProximity * 10;
                const lightness = 60 + (1 - dist / this.revealRadius) * 20;

                this.ctx.fillStyle = `hsla(${dot.hue}, ${saturation}%, ${lightness}%, ${dot.currentOpacity})`;
                this.ctx.fill();
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
window.dotGrid = null;
document.addEventListener('DOMContentLoaded', () => {
    window.dotGrid = new DotGrid('particle-canvas');
});
