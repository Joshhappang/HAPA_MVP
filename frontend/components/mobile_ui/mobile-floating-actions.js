export function createFloatingActions() {
    const el = document.createElement("div");
    el.className = "mobile-fab";

    el.innerHTML = `
        <button class="fab-btn">+</button>
    `;

    return el;
}
