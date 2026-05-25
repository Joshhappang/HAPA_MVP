export function createMobileSheet(content = "") {
    const el = document.createElement("div");
    el.className = "mobile-sheet";

    el.innerHTML = `
        <div class="sheet-handle"></div>
        <div class="sheet-content">${content}</div>
    `;

    return el;
}
