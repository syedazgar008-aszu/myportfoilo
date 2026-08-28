/* =========================================================
   ASZU.SITE — SCROLL + PARTICLE ANIMATIONS
========================================================= */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".section-heading, .skill-card, .project-card, .stat-card, .timeline-item, .idea-box, .contact-box");

if (!reducedMotion && "IntersectionObserver" in window) {
    revealElements.forEach(element => element.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle("revealed", entry.isIntersecting);
        });
    }, { threshold: .12 });
    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("revealed"));
}

/* ---------- Particle network ---------- */
const canvas = document.getElementById("particleCanvas");
if (canvas && !reducedMotion && window.matchMedia("(pointer:fine)").matches) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const mouse = { x: null, y: null, radius: 140 };

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Particle {
        constructor() {
            this.x = Math.random() * innerWidth;
            this.y = Math.random() * innerHeight;
            this.size = Math.random() * 1.8 + .45;
            this.vx = (Math.random() - .5) * .32;
            this.vy = (Math.random() - .5) * .32;
            this.alpha = Math.random() * .45 + .15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -5) this.x = innerWidth + 5;
            if (this.x > innerWidth + 5) this.x = -5;
            if (this.y < -5) this.y = innerHeight + 5;
            if (this.y > innerHeight + 5) this.y = -5;

            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance > 0 && distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * .75;
                    this.y += (dy / distance) * force * .75;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124,92,255,${this.alpha})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = innerWidth < 600 ? 34 : 80;
        particles = Array.from({ length: count }, () => new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                if (distance < 105) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124,92,255,${(1 - distance / 105) * .12})`;
                    ctx.lineWidth = .6;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
    }

    resizeCanvas();
    createParticles();
    window.addEventListener("resize", () => { resizeCanvas(); createParticles(); });
    window.addEventListener("pointermove", event => { mouse.x = event.clientX; mouse.y = event.clientY; });
    window.addEventListener("pointerleave", () => { mouse.x = null; mouse.y = null; });

    function animate() {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}
