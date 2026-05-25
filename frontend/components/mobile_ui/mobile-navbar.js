export function createMobileNavbar() {
    const el = document.createElement("div");
    el.className = "mobile-navbar";

    el.innerHTML = `
        <div class="logo">HAPA</div>
        <div class="title">Editor</div>
        <button class="menu-btn">☰</button>
    `;

    return el;
}
