/* =========================================================
   ASZU.SITE — INTERACTIONS
========================================================= */

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-links a");

/* ---------- Theme ---------- */
function setTheme(theme, save = true) {
    root.dataset.theme = theme;
    if (save) localStorage.setItem("aszu-theme", theme);

    const isLight = theme === "light";
    if (themeIcon) themeIcon.textContent = isLight ? "☾" : "☀";
    if (themeToggle) {
        const label = isLight ? "Switch to dark mode" : "Switch to light mode";
        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
    }
}

const savedTheme = localStorage.getItem("aszu-theme");
const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
setTheme(savedTheme || (systemLight ? "light" : "dark"), false);

themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
});

/* ---------- Mobile menu ---------- */
menuToggle?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("show");
    menuToggle.textContent = open ? "✕" : "☰";
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("show");
        if (menuToggle) {
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-label", "Open menu");
        }
    });
});

/* ---------- Active nav ---------- */
const sections = document.querySelectorAll("main section[id]");
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
sections.forEach(section => navObserver.observe(section));

/* ---------- Smooth hero card tilt ---------- */
const card = document.querySelector(".profile-card");
const visual = document.querySelector(".hero-visual");
if (card && visual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(pointer:fine)").matches) {
    visual.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateZ(0)`;
    });
    visual.addEventListener("pointerleave", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
}

/* ---------- Typing headline ---------- */
const typingText = document.querySelector(".typing-text");
if (typingText) {
    const textItems = ["Full Stack Developer", "Web Developer", "Creative Builder", "Tech Explorer"];
    let wordIndex = 0, charIndex = 0, deleting = false;

    function runTyping() {
        const current = textItems[wordIndex];
        typingText.textContent = current.slice(0, deleting ? charIndex - 1 : charIndex + 1);
        charIndex += deleting ? -1 : 1;

        if (!deleting && charIndex === current.length) {
            deleting = true;
            setTimeout(runTyping, 1300);
            return;
        }
        if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % textItems.length;
        }
        setTimeout(runTyping, deleting ? 42 : 78);
    }
    runTyping();
}
