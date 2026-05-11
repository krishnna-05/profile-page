/**
 * Main Application Controller — Horizontal Scroll Edition
 */
document.addEventListener('DOMContentLoaded', () => {
    // Page load animation
    setTimeout(() => document.body.classList.add('loaded'), 100);

    const navbar = document.getElementById('navbar');
    const wrapper = document.getElementById('horizontal-scroll');
    const panels = document.querySelectorAll('.scroll-panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const isMobile = window.innerWidth <= 768;

    // =========================================
    // HORIZONTAL SCROLL SYSTEM (Desktop only)
    // =========================================
    if (!isMobile && panels.length > 0) {
        // Calculate total scroll width
        const totalWidth = panels.length * window.innerWidth;
        // Set body height to create scroll room
        document.body.style.height = totalWidth + 'px';

        // Create scroll progress dots
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        panels.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-progress-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                const targetScroll = i * window.innerWidth;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            });
            progressContainer.appendChild(dot);
        });
        document.body.appendChild(progressContainer);

        // Pin the wrapper and translate on scroll
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.height = '100vh';

        let currentPanel = 0;

        function updateHorizontalScroll() {
            const scrollY = window.scrollY;
            const maxScroll = totalWidth - window.innerWidth;
            const translateX = Math.min(scrollY, maxScroll);

            wrapper.style.transform = `translateX(-${translateX}px)`;

            // Update progress dots and active nav
            const newPanel = Math.round(scrollY / window.innerWidth);
            if (newPanel !== currentPanel && newPanel >= 0 && newPanel < panels.length) {
                currentPanel = newPanel;
                updateActiveStates(currentPanel);
            }

            // Navbar style
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        function updateActiveStates(index) {
            // Progress dots
            document.querySelectorAll('.scroll-progress-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            // Nav links (skip hero, offset by 1: about=0, skills=1, projects=2, contact=3)
            navLinks.forEach(link => {
                const sectionIdx = parseInt(link.dataset.section);
                link.classList.toggle('active', sectionIdx === index - 1);
            });
        }

        window.addEventListener('scroll', updateHorizontalScroll, { passive: true });

        // Handle nav link clicks — scroll to the right panel
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionIdx = parseInt(link.dataset.section);
                // Sections are offset by 1 (hero is panel 0)
                const targetScroll = (sectionIdx + 1) * window.innerWidth;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            });
        });

        // Handle logo click — scroll to hero
        document.querySelector('.nav-logo').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Handle CTA button clicks within panels
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    // Find which panel this section is in
                    const panelIndex = Array.from(panels).indexOf(targetEl);
                    if (panelIndex >= 0) {
                        const targetScroll = panelIndex * window.innerWidth;
                        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                }
            });
        });

        // Initial call
        updateHorizontalScroll();

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                location.reload(); // Switch to mobile layout
            }
            const newTotalWidth = panels.length * window.innerWidth;
            document.body.style.height = newTotalWidth + 'px';
        });

    } else {
        // =========================================
        // MOBILE: Standard vertical scroll
        // =========================================
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // =========================================
    // Resume download button
    // =========================================
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const link = document.createElement('a');
            link.href = 'assets/resume.pdf';
            link.download = 'Krishna_Prasath_AI_Resume.pdf';
            link.click();
        });
    }

    // =========================================
    // Parallax effect on hero elements
    // =========================================
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (heroContent && window.scrollY < window.innerHeight) {
            heroContent.style.transform = `translate(${x * 10}px, ${y * 5}px)`;
        }
    });

    // =========================================
    // Magnetic effect for buttons
    // =========================================
    document.querySelectorAll('.btn, .nav-resume-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // =========================================
    // Text scramble effect on project titles
    // =========================================
    const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';

    function scrambleText(el) {
        const originalText = el.textContent;
        let iteration = 0;

        const interval = setInterval(() => {
            el.textContent = originalText.split('')
                .map((char, index) => {
                    if (index < iteration) return originalText[index];
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }
            iteration += 1 / 2;
        }, 30);
    }

    document.querySelectorAll('.project-title').forEach(title => {
        const card = title.closest('.project-card');
        if (card) {
            card.addEventListener('mouseenter', () => {
                scrambleText(title);
            });
        }
    });

    // =========================================
    // Skill tag micro-animation
    // =========================================
    document.querySelectorAll('.skill-tag').forEach((tag) => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = `translateY(-3px) rotate(${(Math.random() - 0.5) * 4}deg)`;
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) rotate(0)';
        });
    });

    console.log('%c👋 Hello there! Thanks for checking out my portfolio.', 'font-size: 16px; color: #7c5cfc;');
    console.log('%c🛠️ Built with vanilla HTML, CSS & JavaScript', 'font-size: 12px; color: #00d4aa;');
});
