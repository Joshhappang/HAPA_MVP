/* =========================================
   HAPA MINI FIGMA - GRID SYSTEM CORE
   frontend/components/canvas/GridSystem.js
========================================= */

export class GridSystem {
    constructor(options = {}) {
        /* =========================
           GRID CONFIG
        ========================= */

        this.size = options.size || 20;
        this.color = options.color || "rgba(255,255,255,0.04)";
        this.boldColor = options.boldColor || "rgba(255,255,255,0.08)";

        this.boldEvery = options.boldEvery || 5;

        this.enabled = true;
    }

    /* =========================
       TOGGLE GRID
    ========================= */

    toggle() {
        this.enabled = !this.enabled;
    }

    setEnabled(value) {
        this.enabled = value;
    }

    /* =========================
       DRAW GRID
       (called from CanvasRenderer)
    ========================= */

    draw(ctx, camera, width, height) {
        if (!this.enabled) return;

        ctx.save();

        // apply camera transform
        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.zoom, camera.zoom);

        const startX = -camera.x / camera.zoom;
        const startY = -camera.y / camera.zoom;

        const endX = startX + width / camera.zoom;
        const endY = startY + height / camera.zoom;

        const size = this.size;

        const offsetX = startX % size;
        const offsetY = startY % size;

        /* =========================
           DRAW VERTICAL LINES
        ========================= */

        for (let x = startX - offsetX; x < endX; x += size) {
            const isBold = Math.round(x / size) % this.boldEvery === 0;

            ctx.beginPath();
            ctx.strokeStyle = isBold ? this.boldColor : this.color;
            ctx.lineWidth = 1 / camera.zoom;

            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }

        /* =========================
           DRAW HORIZONTAL LINES
        ========================= */

        for (let y = startY - offsetY; y < endY; y += size) {
            const isBold = Math.round(y / size) % this.boldEvery === 0;

            ctx.beginPath();
            ctx.strokeStyle = isBold ? this.boldColor : this.color;
            ctx.lineWidth = 1 / camera.zoom;

            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    /* =========================
       SNAP HELPER (optional future use)
    ========================= */

    snap(value) {
        return Math.round(value / this.size) * this.size;
    }

    snapPoint(x, y) {
        return {
            x: this.snap(x),
            y: this.snap(y)
        };
    }
}
