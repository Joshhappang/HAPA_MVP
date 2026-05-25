/* =========================================
   HAPA MINI FIGMA - VECTOR RENDERER
   editor/renderer/VectorRenderer.js
========================================= */

export class VectorRenderer {

    constructor(options = {}) {

        this.options = {

            strokeColor: "#000000",

            fillColor: "transparent",

            lineWidth: 1,

            ...options
        };
    }

    /* =====================================
       RENDER VECTOR LIST
    ===================================== */

    render(ctx, vectors = []) {

        if (!ctx || !vectors.length) return;

        for (const v of vectors) {

            this.drawPath(ctx, v);
        }
    }

    /* =====================================
       DRAW SINGLE VECTOR PATH
    ===================================== */

    drawPath(ctx, vector) {

        if (!vector) return;

        const path = vector.path || vector.d;

        if (!path) return;

        ctx.save();

        /* =================================
           STYLE
        ================================= */

        ctx.strokeStyle = vector.stroke || this.options.strokeColor;

        ctx.fillStyle = vector.fill || this.options.fillColor;

        ctx.lineWidth = vector.strokeWidth || this.options.lineWidth;

        /* =================================
           PATH DRAW (simple SVG-like)
        ================================= */

        ctx.beginPath();

        this._parsePath(ctx, path);

        /* =================================
           FILL / STROKE
        ================================= */

        if (vector.fill && vector.fill !== "none") {

            ctx.fill();
        }

        if (vector.stroke) {

            ctx.stroke();
        }

        ctx.restore();
    }

    /* =====================================
       SIMPLE PATH PARSER (MINI SVG)
    ===================================== */

    _parsePath(ctx, path) {

        // NOTE: simplified SVG parser (M, L only)

        const commands = path.match(/[a-zA-Z][^a-zA-Z]*/g);

        if (!commands) return;

        for (const cmd of commands) {

            const type = cmd[0];

            const args = cmd
                .slice(1)
                .trim()
                .split(/[\s,]+/)
                .map(Number);

            switch (type) {

                case "M":
                    ctx.moveTo(args[0], args[1]);
                    break;

                case "L":
                    ctx.lineTo(args[0], args[1]);
                    break;

                case "H":
                    ctx.lineTo(args[0], ctx.currentY || 0);
                    break;

                case "V":
                    ctx.lineTo(ctx.currentX || 0, args[0]);
                    break;

                case "Z":
                case "z":
                    ctx.closePath();
                    break;
            }
        }
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug(vector) {

        console.log("[VectorRenderer]", vector);
    }
}
