/* =========================================
   HAPA MINI FIGMA - GRID SYSTEM
   frontend/editor/canvas/GridSystem.js
========================================= */

export class GridSystem {
    constructor(engine) {
        this.engine = engine;

        this.enabled = true;

        this.size = 50; // grid spacing
        this.color = "rgba(255,255,255,0.05)";
        this.boldColor = "rgba(255,255,255,0.1)";

        this.boldInterval = 5; // every 5 lines thicker
    }

    /* =========================
       TOGGLE GRID
    ========================= */

    setEnabled(value) {
        this.enabled = value;
    }

    /* =========================
       MAIN RENDER
    ========================= */

    render(ctx) {
        if (!this.enabled) return;

        const canvas = ctx.canvas;

        const cam = this.engine.camera.getTransform();

        const zoom = cam.zoom;

        const offsetX = cam.x * zoom;
        const offsetY = cam.y * zoom;

        const width = canvas.width;
        const height = canvas.height;

        const gridSize = this.size * zoom;

        ctx.save();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;

        /* =========================
           VERTICAL LINES
        ========================= */

        for (let x = offsetX % gridSize; x < width; x += gridSize) {
            const index = Math.floor((x - offsetX) / gridSize);

            ctx.beginPath();

            ctx.strokeStyle =
                index % this.boldInterval === 0
                    ? this.boldColor
                    : this.color;

            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);

            ctx.stroke();
        }

        /* =========================
           HORIZONTAL LINES
        ========================= */

        for (let y = offsetY % gridSize; y < height; y += gridSize) {
            const index = Math.floor((y - offsetY) / gridSize);

            ctx.beginPath();

            ctx.strokeStyle =
                index % this.boldInterval === 0
                    ? this.boldColor
                    : this.color;

            ctx.moveTo(0, y);
            ctx.lineTo(width, y);

            ctx.stroke();
        }

        ctx.restore();
    }

    /* =========================
       SNAP HELPERS (OPTIONAL)
    ========================= */

    snap(value) {
        return Math.round(value / this.size) * this.size;
    }

    snapPoint(x, y) {
        return {
            x: this.snap(x),
            y: this.snap(y),
        };
    }
}
