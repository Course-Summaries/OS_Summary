document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const status = document.getElementById("formStatus");

    if (!form || !status) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                status.textContent = "✅ Thanks for your suggestion!";
                form.reset();
            } else {
                status.textContent = "⚠️ Something went wrong. Try again later.";
            }
        } catch (error) {
            status.textContent = "⚠️ Network error. Please try again.";
        }
    });
});
