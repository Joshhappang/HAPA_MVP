export function createStatusBar() {
    const el = document.createElement("div");
    el.className = "hapa-statusbar";

    el.innerHTML = `
        <div>Zoom: 100%</div>
        <div>Coords: 0,0</div>
        <div>Status: Ready</div>
    `;

    return el;
}
