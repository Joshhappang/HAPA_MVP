export function createSidebarDrawer() {
    const el = document.createElement("div");
    el.className = "mobile-drawer hidden";

    el.innerHTML = `
        <div class="drawer-item">Projects</div>
        <div class="drawer-item">Settings</div>
        <div class="drawer-item">Export</div>
    `;

    return el;
}
