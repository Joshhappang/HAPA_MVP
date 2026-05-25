/* =========================================
   HAPA MINI FIGMA - CANVAS RENDERER
   frontend/editor/canvas/CanvasRenderer.js
========================================= */

export class CanvasRenderer {
    constructor(engine) {
        this.engine = engine;
        this.camera = engine.camera;
        this.state = engine.state;
    }

    /* =========================
       MAIN RENDER ENTRY
    ========================= */

    render(ctx) {
        if (!ctx) return;

        // clear canvas
        this.clear(ctx);

        // apply camera transform
        this.applyCamera(ctx);

        // draw grid first (background layer)
        this.engine.grid?.render?.(ctx);

        // render nodes
        const nodes = this.engine.nodeManager?.getAll?.() || [];

        this.renderNodes(ctx, nodes);

        // render selection overlay
        this.engine.selection?.render?.(ctx);

        // reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* =========================
       CLEAR CANVAS
    ========================= */

    clear(ctx) {
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /* =========================
       CAMERA TRANSFORM
    ========================= */

    applyCamera(ctx) {
        const cam = this.camera.getTransform();

        ctx.setTransform(
            cam.zoom, 0,
            0, cam.zoom,
            cam.x * cam.zoom,
            cam.y * cam.zoom
        );
    }

    /* =========================
       RENDER ALL NODES
    ========================= */

    renderNodes(ctx, nodes) {
        if (!nodes) return;

        const renderRecursive = (list) => {
            for (const node of list) {
                this.renderNode(ctx, node);

                if (node.children?.length) {
                    renderRecursive(node.children);
                }
            }
        };

        renderRecursive(nodes);
    }

    /* =========================
       RENDER SINGLE NODE
    ========================= */

    renderNode(ctx, node) {
        if (!node) return;

        // skip invisible nodes
        if (node.visible === false) return;

        ctx.save();

        switch (node.type) {
            case "frame":
                this.drawFrame(ctx, node);
                break;

            case "text":
                this.drawText(ctx, node);
                break;

            case "image":
                this.drawImage(ctx, node);
                break;

            case "rect":
                this.drawRect(ctx, node);
                break;

            case "circle":
                this.drawCircle(ctx, node);
                break;

            default:
                this.drawDefault(ctx, node);
                break;
        }

        ctx.restore();
    }

    /* =========================
       DRAW FRAME
    ========================= */

    drawFrame(ctx, node) {
        ctx.fillStyle = node.background || "#2b2b2b";

        ctx.fillRect(
            node.x || 0,
            node.y || 0,
            node.width || 100,
            node.height || 100
        );

        if (node.stroke) {
            ctx.strokeStyle = node.stroke;
            ctx.strokeRect(
                node.x || 0,
                node.y || 0,
                node.width || 100,
                node.height || 100
            );
        }
    }

    /* =========================
       DRAW TEXT
    ========================= */

    drawText(ctx, node) {
        ctx.fillStyle = node.color || "#ffffff";
        ctx.font = `${node.fontSize || 14}px sans-serif`;

        ctx.fillText(
            node.text || "",
            node.x || 0,
            node.y || 0
        );
    }

    /* =========================
       DRAW IMAGE
    ========================= */

    drawImage(ctx, node) {
        if (!node.image) return;

        const img = new Image();
        img.src = node.image;

        ctx.drawImage(
            img,
            node.x || 0,
            node.y || 0,
            node.width || 100,
            node.height || 100
        );
    }

    /* =========================
       DRAW RECT
    ========================= */

    drawRect(ctx, node) {
        ctx.fillStyle = node.fill || "#4a90e2";

        ctx.fillRect(
            node.x || 0,
            node.y || 0,
            node.width || 100,
            node.height || 100
        );
    }

    /* =========================
       DRAW CIRCLE
    ========================= */

    drawCircle(ctx, node) {
        ctx.beginPath();

        const x = node.x || 0;
        const y = node.y || 0;
        const r = node.radius || 50;

        ctx.arc(x, y, r, 0, Math.PI * 2);

        ctx.fillStyle = node.fill || "#ffcc00";
        ctx.fill();
    }

    /* =========================
       DEFAULT RENDER
    ========================= */

    drawDefault(ctx, node) {
        ctx.fillStyle = "#888";
        ctx.fillRect(node.x || 0, node.y || 0, 50, 50);
    }
}
