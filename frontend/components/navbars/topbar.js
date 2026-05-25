export function createTopbar() {
    const bar = document.createElement("div");
    bar.className = "hapa-topbar";

    bar.innerHTML = `
        <div class="hapa-topbar-left">
            <button class="hapa-btn hapa-btn-ghost">File</button>
            <button class="hapa-btn hapa-btn-ghost">Edit</button>
            <button class="hapa-btn hapa-btn-ghost">View</button>
        </div>

        <div class="hapa-topbar-center">
            <span class="hapa-title">HAPA Mini Figma</span>
        </div>

        <div class="hapa-topbar-right">
            <button class="hapa-btn hapa-btn-primary">Export</button>
        </div>
    `;

    return bar;
}
