/**
 * Custom Cursor - Smooth following cursor with interactive states
 */
class CustomCursor {
    constructor() {
        this.dot = document.getElementById('cursor-dot');
        this.ring = document.getElementById('cursor-ring');
        this.mouse = { x: 0, y: 0 };
        this.dotPos = { x: 0, y: 0 };
        this.ringPos = { x: 0, y: 0 };
        this.isTouch = 'ontouchstart' in window;

        if (this.isTouch) {
            this.dot.style.display = 'none';
            this.ring.style.display = 'none';
            return;
        }

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mousedown', () => {
            this.dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
            this.ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
            this.ring.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    render() {
        // Dot follows closely
        this.dotPos.x = this.lerp(this.dotPos.x, this.mouse.x, 0.2);
        this.dotPos.y = this.lerp(this.dotPos.y, this.mouse.y, 0.2);
        this.dot.style.left = this.dotPos.x + 'px';
        this.dot.style.top = this.dotPos.y + 'px';

        // Ring follows with more delay (trailing effect)
        this.ringPos.x = this.lerp(this.ringPos.x, this.mouse.x, 0.08);
        this.ringPos.y = this.lerp(this.ringPos.y, this.mouse.y, 0.08);
        this.ring.style.left = this.ringPos.x + 'px';
        this.ring.style.top = this.ringPos.y + 'px';

        requestAnimationFrame(() => this.render());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});
