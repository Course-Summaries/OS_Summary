document.addEventListener("DOMContentLoaded", () => {
    // --- Modal Logic ---
    const pdfModal = document.getElementById("pdfModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDownload = document.getElementById("modalDownload");
    const modalClose = document.getElementById("modalClose");
    const pdfFrame = document.getElementById("pdfFrame");
    const fallbackLink = document.getElementById("fallbackLink");
    const openButtons = document.querySelectorAll(".card .button");

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".card");
            const title = card.dataset.pdfTitle;
            const url = card.dataset.pdfUrl;
            const gviewUrl = `https://docs.google.com/gview?url=${url}&embedded=true`;

            modalTitle.textContent = title;
            pdfFrame.src = gviewUrl;
            modalDownload.href = url;
            fallbackLink.href = url;

            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            pdfModal.classList.add("is-visible");
        });
    });

    const closeModal = () => {
        pdfModal.classList.remove("is-visible");
        pdfFrame.src = ""; // Stop loading the PDF to save resources
        document.body.style.overflow = 'auto';
    };

    modalClose.addEventListener("click", closeModal);

    // Close modal if user clicks outside the content area
    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) {
            closeModal();
        }
    });

    // Close modal with the Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && pdfModal.classList.contains("is-visible")) {
            closeModal();
        }
    });

    // --- Formspree Form Logic ---
    const form = document.getElementById("feedbackForm");
    const status = document.getElementById("formStatus");

    if (form && status) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(form);

            status.textContent = "Submitting...";
            status.style.color = "var(--muted-text-color)";

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
                status.textContent = "⚠️ Network error. Please check your connection.";
                status.style.color = "#ff6666";
            }
        });
    }
});