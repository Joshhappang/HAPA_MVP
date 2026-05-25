export function createBottomNav() {
    const el = document.createElement("div");
    el.className = "mobile-bottom-nav";

    el.innerHTML = `
        <button>Home</button>
        <button>Canvas</button>
        <button>Assets</button>
        <button>AI</button>
        <button>Profile</button>
    `;

    return el;
}
