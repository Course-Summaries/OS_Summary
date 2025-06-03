document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    const status = document.getElementById("formStatus");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = document.getElementById("message").value.trim();

        if (!message) {
            status.textContent = "Please enter a suggestion.";
            return;
        }

        const formData = new FormData();
        formData.append("message", message);

        try {
            const response = await fetch("https://formspree.io/f/xzzgbold", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.textContent = "✅ Thanks for your suggestion!";
                form.reset();
            } else {
                status.textContent = "⚠️ Something went wrong. Try again later.";
            }
        } catch (err) {
            status.textContent = "⚠️ Network error. Please check your connection.";
        }
    });
});
