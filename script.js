/* ─── PRELOADER ──────────────────────────────────────────────
   KEY FIX: Don't wait for window.onload (CDN scripts can stall it).
   Use a fixed timeout matching the CSS animation duration instead.
──────────────────────────────────────────────────────────────── */
const PRELOAD_DURATION = 1900; // matches CSS animation total

setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hide');
    preloader.addEventListener('animationend', () => {
        preloader.style.display = 'none';
    }, { once: true });

    // Kick off counter animations after preloader clears
    runCounters();
}, PRELOAD_DURATION);

/* ─── STAT COUNTERS ──────────────────────────────────────────── */
function runCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.decimal === 'true';
        let current = 0;
        const steps = 35;
        const increment = target / steps;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = isDecimal ? target.toFixed(2) : target;
                clearInterval(timer);
            } else {
                el.textContent = isDecimal
                    ? current.toFixed(2)
                    : Math.floor(current);
            }
        }, 38);
    });
}

/* ─── CURSOR ─────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
});

(function lerpRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
})();

document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .skill-card, .project-row, .contact-btn, .resume-download-btn, .nav-resume-btn')) {
        document.body.classList.add('cursor-hover');
    }
});
document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .skill-card, .project-row, .contact-btn, .resume-download-btn, .nav-resume-btn')) {
        document.body.classList.remove('cursor-hover');
    }
});

/* ─── NAV SCROLL ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── INTERSECTION OBSERVER ──────────────────────────────────── */
// Used for: section titles, contact headings, reveal-up elements
const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.js-reveal-title, .js-reveal-up, .contact-big').forEach(el => io.observe(el));

/* ─── GSAP (runs after short delay to ensure library loaded) ─── */
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(initGSAP, 100);
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Parallax hero on scroll
    gsap.to('.hero-content', {
        y: -70, ease: 'none',
        scrollTrigger: {
            trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2
        }
    });

    // Section headers slide in from left
    gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
            x: -50, opacity: 0, duration: .8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
    });

    // Skill cards stagger in
    gsap.fromTo('.skill-card',
        { y: 45, opacity: 0 },
        {
            y: 0, opacity: 1, stagger: .055, duration: .6, ease: 'power3.out',
            scrollTrigger: { trigger: '.skills-grid', start: 'top 82%', once: true }
        }
    );

    // Project rows slide in
    gsap.fromTo('.project-row',
        { x: -45, opacity: 0 },
        {
            x: 0, opacity: 1, stagger: .1, duration: .7, ease: 'power3.out',
            scrollTrigger: { trigger: '.projects-list', start: 'top 82%', once: true }
        }
    );

    // Resume block pop in
    gsap.fromTo('.resume-block',
        { scale: .95, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: .7, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '.resume-block', start: 'top 88%', once: true }
        }
    );
}

initGSAP();

/* ─── NAV LINK SCRAMBLE ───────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        const text = link.dataset.text;
        let frame = 0;
        clearInterval(link._sc);
        link._sc = setInterval(() => {
            link.textContent = text.split('').map((ch, i) =>
                i < Math.floor(frame / 2.5) ? text[i] : CHARS[Math.floor(Math.random() * 26)]
            ).join('');
            if (++frame > text.length * 2.5) {
                clearInterval(link._sc);
                link.textContent = text;
            }
        }, 28);
    });
    link.addEventListener('mouseleave', () => {
        clearInterval(link._sc);
        link.textContent = link.dataset.text;
    });
});