export function createMobileCanvas() {
    const el = document.createElement("div");
    el.className = "mobile-canvas";

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    el.appendChild(canvas);

    return el;
}
