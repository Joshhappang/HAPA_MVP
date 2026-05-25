export function createGestureLayer() {
    const el = document.createElement("div");
    el.className = "gesture-layer";

    let startX = 0;
    let startY = 0;

    el.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
    });

    el.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        // gesture hook (future canvas control)
        el.dataset.dx = dx;
        el.dataset.dy = dy;
    });

    return el;
}
