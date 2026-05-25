/* =========================================
   HAPA MINI FIGMA - GRID RENDERER
   editor/renderer/GridRenderer.js
========================================= */

export class GridRenderer {

    constructor(options = {}) {

        this.options = {

            size: 20,

            color: "#e5e5e5",

            boldColor: "#cfcfcf",

            boldEvery: 5,

            show: true,

            ...options
        };
    }

    /* =====================================
       MAIN RENDER
    ===================================== */

    render(ctx, editor) {

        if (!ctx || !this.options.show) return;

        const camera = editor.camera || {};

        const size = this.options.size;

        const width = ctx.canvas.width;

        const height = ctx.canvas.height;

        const offsetX = camera.x || 0;

        const offsetY = camera.y || 0;

        const zoom = camera.zoom || 1;

        ctx.save();

        ctx.lineWidth = 1;

        /* =================================
           GRID CALC
        ================================= */

        const scaledSize = size * zoom;

        const startX = (-offsetX % scaledSize);

        const startY = (-offsetY % scaledSize);

        /* =================================
           DRAW GRID LINES
        ================================= */

        for (let x = startX; x < width; x += scaledSize) {

            const index = Math.round((x - startX) / scaledSize);

            ctx.strokeStyle =
                index % this.options.boldEvery === 0
                    ? this.options.boldColor
                    : this.options.color;

            ctx.beginPath();

            ctx.moveTo(x, 0);

            ctx.lineTo(x, height);

            ctx.stroke();
        }

        for (let y = startY; y < height; y += scaledSize) {

            const index = Math.round((y - startY) / scaledSize);

            ctx.strokeStyle =
                index % this.options.boldEvery === 0
                    ? this.options.boldColor
                    : this.options.color;

            ctx.beginPath();

            ctx.moveTo(0, y);

            ctx.lineTo(width, y);

            ctx.stroke();
        }

        ctx.restore();
    }

    /* =====================================
       UPDATE OPTIONS
    ===================================== */

    set(options = {}) {

        Object.assign(this.options, options);
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug() {

        console.log("[GridRenderer]", this.options);
    }
}
