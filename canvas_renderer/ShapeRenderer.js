/* =========================================
   HAPA MINI FIGMA - SHAPE RENDERER
   editor/renderer/ShapeRenderer.js
========================================= */

export class ShapeRenderer {

    constructor(options = {}) {

        this.options = {

            fill: "#000000",

            stroke: "#000000",

            lineWidth: 1,

            ...options
        };
    }

    /* =====================================
       MAIN RENDER ENTRY
    ===================================== */

    render(ctx, shapes = []) {

        if (!ctx || !shapes.length) return;

        for (const shape of shapes) {

            this.drawShape(ctx, shape);
        }
    }

    /* =====================================
       DRAW SHAPE DISPATCHER
    ===================================== */

    drawShape(ctx, shape) {

        if (!shape) return;

        ctx.save();

        ctx.fillStyle = shape.fill || this.options.fill;

        ctx.strokeStyle = shape.stroke || this.options.stroke;

        ctx.lineWidth = shape.lineWidth || this.options.lineWidth;

        switch (shape.type) {

            case "rect":
                this._rect(ctx, shape);
                break;

            case "circle":
                this._circle(ctx, shape);
                break;

            case "line":
                this._line(ctx, shape);
                break;

            case "polygon":
                this._polygon(ctx, shape);
                break;

            default:
                break;
        }

        ctx.restore();
    }

    /* =====================================
       RECTANGLE
    ===================================== */

    _rect(ctx, shape) {

        const { x = 0, y = 0, width = 0, height = 0 } = shape;

        ctx.beginPath();

        ctx.rect(x, y, width, height);

        this._applyFillStroke(ctx, shape);
    }

    /* =====================================
       CIRCLE
    ===================================== */

    _circle(ctx, shape) {

        const { x = 0, y = 0, radius = 0 } = shape;

        ctx.beginPath();

        ctx.arc(x, y, radius, 0, Math.PI * 2);

        this._applyFillStroke(ctx, shape);
    }

    /* =====================================
       LINE
    ===================================== */

    _line(ctx, shape) {

        const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = shape;

        ctx.beginPath();

        ctx.moveTo(x1, y1);

        ctx.lineTo(x2, y2);

        ctx.stroke();
    }

    /* =====================================
       POLYGON
    ===================================== */

    _polygon(ctx, shape) {

        const points = shape.points || [];

        if (!points.length) return;

        ctx.beginPath();

        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {

            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.closePath();

        this._applyFillStroke(ctx, shape);
    }

    /* =====================================
       FILL / STROKE APPLY
    ===================================== */

    _applyFillStroke(ctx, shape) {

        const fill = shape.fill ?? this.options.fill;

        const stroke = shape.stroke ?? this.options.stroke;

        if (fill && fill !== "none") {

            ctx.fill();
        }

        if (stroke && shape.strokeWidth !== 0) {

            ctx.stroke();
        }
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug(shape) {

        console.log("[ShapeRenderer]", shape);
    }
}
