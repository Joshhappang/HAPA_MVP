/* =========================================
   HAPA MINI FIGMA - SELECTION RENDERER
   editor/renderer/SelectionRenderer.js
========================================= */

export class SelectionRenderer {

    constructor(options = {}) {

        this.options = {

            stroke: "#4c8dff",

            fill: "rgba(76, 141, 255, 0.08)",

            lineWidth: 1,

            handleSize: 6,

            showBoundingBox: true,

            showHandles: true,

            ...options
        };
    }

    /* =====================================
       MAIN RENDER
    ===================================== */

    render(ctx, selection = []) {

        if (!ctx || !selection.length) return;

        for (const item of selection) {

            this.drawSelection(ctx, item);
        }
    }

    /* =====================================
       DRAW SELECTION BOX
    ===================================== */

    drawSelection(ctx, item) {

        if (!item) return;

        const bounds = this._getBounds(item);

        if (!bounds) return;

        ctx.save();

        /* =================================
           BOX STYLE
        ================================= */

        ctx.strokeStyle = this.options.stroke;

        ctx.fillStyle = this.options.fill;

        ctx.lineWidth = this.options.lineWidth;

        /* =================================
           BOUNDING BOX
        ================================= */

        if (this.options.showBoundingBox) {

            ctx.beginPath();

            ctx.rect(
                bounds.x,
                bounds.y,
                bounds.width,
                bounds.height
            );

            ctx.fill();

            ctx.stroke();
        }

        /* =================================
           HANDLES
        ================================= */

        if (this.options.showHandles) {

            this._drawHandles(ctx, bounds);
        }

        ctx.restore();
    }

    /* =====================================
       DRAW RESIZE HANDLES
    ===================================== */

    _drawHandles(ctx, bounds) {

        const size = this.options.handleSize;

        const half = size / 2;

        const points = [

            { x: bounds.x, y: bounds.y },
            { x: bounds.x + bounds.width, y: bounds.y },
            { x: bounds.x, y: bounds.y + bounds.height },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height }
        ];

        ctx.fillStyle = this.options.stroke;

        for (const p of points) {

            ctx.beginPath();

            ctx.rect(p.x - half, p.y - half, size, size);

            ctx.fill();
        }
    }

    /* =====================================
       GET BOUNDS (SAFE FALLBACK)
    ===================================== */

    _getBounds(item) {

        if (!item) return null;

        // rectangle-like object
        if (item.width != null && item.height != null) {

            return {

                x: item.x || 0,

                y: item.y || 0,

                width: item.width,

                height: item.height
            };
        }

        // vector fallback
        if (item.bounds) return item.bounds;

        return null;
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug(selection) {

        console.log("[SelectionRenderer]", {

            count: selection.length
        });
    }
}
