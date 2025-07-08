document.addEventListener("DOMContentLoaded", () => {
    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    // Check if cursor elements exist to avoid errors on touch devices where they are hidden
    if (cursor && cursorDot) {
        const hoverables = document.querySelectorAll('a, button, .material-card');

        document.addEventListener('mousemove', e => {
            cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px;`);
            cursorDot.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px;`);
        });

        hoverables.forEach(el => {
            el.addEventListener('mouseover', () => cursor.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggle && mainNav) {
        const navLinks = document.querySelectorAll('.nav-link');
        const icon = menuToggle.querySelector('i');

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        const closeMenu = () => {
            mainNav.classList.remove('is-open');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        navLinks.forEach(link => link.addEventListener('click', closeMenu));
    }


    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('.content-section');
    if (sections.length > 0) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    document.querySelector('.main-nav a.active')?.classList.remove('active');
                    document.querySelector(`.main-nav a[href="#${id}"]`)?.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- Fade-in Sections on Scroll ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInSections.forEach(section => fadeInObserver.observe(section));
    }

    // --- Modal Logic (Original, adapted for new buttons) ---
    const pdfModal = document.getElementById("pdfModal");
    if (pdfModal) {
        const modalTitle = document.getElementById("modalTitle");
        const modalDownload = document.getElementById("modalDownload");
        const modalClose = document.getElementById("modalClose");
        const pdfFrame = document.getElementById("pdfFrame");
        const fallbackLink = document.getElementById("fallbackLink");
        const openButtons = document.querySelectorAll(".material-card"); // Changed to card for full click area

        const openModal = (card) => {
            const title = card.dataset.pdfTitle;
            const url = card.dataset.pdfUrl;
            const gviewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

            modalTitle.textContent = title;
            pdfFrame.src = gviewUrl;
            modalDownload.href = url;
            fallbackLink.href = url;

            document.body.style.overflow = 'hidden';
            pdfModal.classList.add("is-visible");
        };

        openButtons.forEach(card => {
            card.addEventListener("click", () => {
                openModal(card);
            });
        });

        const closeModal = () => {
            pdfModal.classList.remove("is-visible");
            pdfFrame.src = ""; // Stop loading the PDF to save resources
            document.body.style.overflow = 'auto';
        };

        modalClose.addEventListener("click", closeModal);
        pdfModal.addEventListener("click", (e) => {
            if (e.target === pdfModal) closeModal();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && pdfModal.classList.contains("is-visible")) closeModal();
        });
    }

    // --- Formspree Form Logic (Original) ---
    const form = document.getElementById("feedbackForm");
    const status = document.getElementById("formStatus");

    if (form && status) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(form);
            status.textContent = "Submitting...";
            status.style.color = "var(--text-secondary)";

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { Accept: "application/json" },
                });

                if (response.ok) {
                    status.textContent = "✅ Thanks for your suggestion!";
                    status.style.color = "#33ff99";
                    form.reset();
                } else {
                    status.textContent = "⚠️ Something went wrong. Try again.";
                    status.style.color = "#ff6666";
                }
            } catch (error) {
                status.textContent = "⚠️ Network error. Please check connection.";
                status.style.color = "#ff6666";
            }
            setTimeout(() => { status.textContent = "" }, 5000);
        });
    }
});
