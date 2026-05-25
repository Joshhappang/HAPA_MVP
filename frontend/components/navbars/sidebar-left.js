export function createLeftSidebar() {
    const el = document.createElement("div");
    el.className = "sidebar left-sidebar";

    el.innerHTML = `
        <div class="hapa-card">
            <div class="hapa-card-header">Tools</div>

            <div class="hapa-tool-card">🖱 Select</div>
            <div class="hapa-tool-card">✋ Move</div>
            <div class="hapa-tool-card">T Text</div>
            <div class="hapa-tool-card">⬛ Shape</div>
            <div class="hapa-tool-card">✏ Pen</div>
        </div>
    `;

    return el;
}
