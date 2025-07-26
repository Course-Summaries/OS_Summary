document.addEventListener("DOMContentLoaded", () => {

    // --- High-Performance Custom Cursor ---
    const initCursor = () => {
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const hoverables = document.querySelectorAll('a, button, .material-card, input[type="range"]');

        // Don't run on touch devices
        if (!cursor || !cursorDot || window.matchMedia("(pointer: coarse)").matches) {
            if (cursor) cursor.style.display = 'none';
            if (cursorDot) cursorDot.style.display = 'none';
            return;
        }

        // Update cursor position instantly on mouse move
        window.addEventListener('mousemove', e => {
            const { clientX, clientY } = e;
            cursor.style.left = `${clientX}px`;
            cursor.style.top = `${clientY}px`;
            cursorDot.style.left = `${clientX}px`;
            cursorDot.style.top = `${clientY}px`;
        });

        // Handle hover states
        hoverables.forEach(el => {
            el.addEventListener('mouseover', () => cursor.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
        });

        // Handle visibility when mouse leaves/enters the window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-visible');
            cursorDot.classList.remove('is-visible');
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.add('is-visible');
            cursorDot.classList.add('is-visible');
        });
    };
    initCursor();


    // --- Three.js Animated Background ---
    const initAnimatedBg = () => {
        if (typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg-canvas'),
            alpha: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);

        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.1
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            stars.rotation.y = elapsedTime * 0.02;
            stars.rotation.x = elapsedTime * 0.01;

            camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    };
    initAnimatedBg();


    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
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
            icon?.classList.toggle('fa-bars');
            icon?.classList.toggle('fa-times');
        });
        const closeMenu = () => {
            mainNav.classList.remove('is-open');
            icon?.classList.remove('fa-times');
            icon?.classList.add('fa-bars');
        };
        navLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('.content-section');
    if (sections.length > 0) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
        const sectionObserver = new IntersectionObserver((entries) => {
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

    // --- Fade-in & Staggered Sections on Scroll ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const childrenToStagger = entry.target.querySelectorAll('.material-card, .audio-player-container');
                    childrenToStagger.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 150}ms`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeInSections.forEach(section => fadeInObserver.observe(section));
    }

    // --- 3D Card Tilt Effect ---
    const cards = document.querySelectorAll('.material-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -15;
            const rotateY = (x / width - 0.5) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Modal Logic ---
    const pdfModal = document.getElementById("pdfModal");
    if (pdfModal) {
        const modalTitle = document.getElementById("modalTitle");
        const modalDownload = document.getElementById("modalDownload");
        const modalClose = document.getElementById("modalClose");
        const pdfFrame = document.getElementById("pdfFrame");
        const fallbackLink = document.getElementById("fallbackLink");
        const openCards = document.querySelectorAll(".material-card");

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

        openCards.forEach(card => {
            card.addEventListener("click", () => openModal(card));
        });

        const closeModal = () => {
            pdfModal.classList.remove("is-visible");
            pdfFrame.src = "";
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

    // --- Audio Player Logic (Updated for multiple players) ---
    const allPlayerContainers = document.querySelectorAll('.audio-player-container');

    allPlayerContainers.forEach(playerContainer => {
        const audioPlayer = playerContainer.querySelector('.audio-player');
        const playPauseBtn = playerContainer.querySelector('.play-pause-btn');
        const playPauseIcon = playPauseBtn.querySelector('i');
        const seekSlider = playerContainer.querySelector('.seek-slider');
        const volumeSlider = playerContainer.querySelector('.volume-slider');
        const muteBtn = playerContainer.querySelector('.mute-btn');
        const muteIcon = muteBtn.querySelector('i');
        const currentTimeEl = playerContainer.querySelector('.current-time');
        const durationEl = playerContainer.querySelector('.duration');
        const speedBtns = playerContainer.querySelectorAll('.speed-btn');

        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                // Pause all other audio players
                document.querySelectorAll('.audio-player').forEach(p => {
                    if (p !== audioPlayer) {
                        p.pause();
                    }
                });
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        });

        audioPlayer.addEventListener('play', () => {
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        });

        audioPlayer.addEventListener('pause', () => {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audioPlayer.duration);
            seekSlider.max = audioPlayer.duration;
        });

        audioPlayer.addEventListener('timeupdate', () => {
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            seekSlider.value = audioPlayer.currentTime;
        });

        seekSlider.addEventListener('input', () => {
            audioPlayer.currentTime = seekSlider.value;
        });

        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value;
            audioPlayer.muted = e.target.value == 0;
        });

        audioPlayer.addEventListener('volumechange', () => {
            volumeSlider.value = audioPlayer.volume;
            if (audioPlayer.muted || audioPlayer.volume === 0) {
                muteIcon.classList.remove('fa-volume-high');
                muteIcon.classList.add('fa-volume-xmark');
            } else {
                muteIcon.classList.remove('fa-volume-xmark');
                muteIcon.classList.add('fa-volume-high');
            }
        });

        muteBtn.addEventListener('click', () => {
            audioPlayer.muted = !audioPlayer.muted;
        });

        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from buttons in the same player
                playerContainer.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                audioPlayer.playbackRate = btn.dataset.speed;
            });
        });
        // Set initial active speed button for this player
        playerContainer.querySelector('.speed-btn[data-speed="1"]').classList.add('active');
    });


    // --- Formspree Form Logic ---
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
