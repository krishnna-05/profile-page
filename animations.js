/**
 * Scroll Reveal - Works with horizontal scroll by checking panel visibility
 */
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-reveal]');
        this.isMobile = window.innerWidth <= 768;

        if (this.isMobile) {
            // Standard IntersectionObserver for mobile vertical scroll
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });
            this.elements.forEach(el => this.observer.observe(el));
        } else {
            // For horizontal scroll, check on scroll event
            this.checkVisibility = this.checkVisibility.bind(this);
            window.addEventListener('scroll', this.checkVisibility, { passive: true });
            // Initial check
            setTimeout(() => this.checkVisibility(), 300);
        }
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                this.observer.unobserve(entry.target);
            }
        });
    }

    checkVisibility() {
        const scrollY = window.scrollY;
        const viewWidth = window.innerWidth;

        this.elements.forEach(el => {
            if (el.classList.contains('revealed')) return;

            // Find which panel this element is in
            const panel = el.closest('.scroll-panel');
            if (!panel) return;

            const panelIndex = Array.from(document.querySelectorAll('.scroll-panel')).indexOf(panel);
            const panelStart = panelIndex * viewWidth;

            // Reveal when user has scrolled to within 70% of the panel
            if (scrollY >= panelStart - viewWidth * 0.3) {
                el.classList.add('revealed');
            }
        });
    }
}

/**
 * 3D Tilt Effect - Cards that tilt toward cursor
 */
class TiltEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-tilt]');
        this.bindEvents();
    }

    bindEvents() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleTilt(e, el));
            el.addEventListener('mouseleave', () => this.resetTilt(el));
        });
    }

    handleTilt(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.transition = 'transform 0.1s ease';

        // Move glow element if exists
        const glow = el.querySelector('.contact-icon-glow');
        if (glow) {
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        }
    }

    resetTilt(el) {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
    new TiltEffect();
});
