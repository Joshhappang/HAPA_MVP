/* =========================================
   HAPA MINI FIGMA - CANVAS RENDERER CORE
   frontend/components/canvas/CanvasRenderer.js
========================================= */

export class CanvasRenderer {
    constructor({ engine, camera, canvas }) {
        this.engine = engine;
        this.camera = camera;
        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        this.dpr = window.devicePixelRatio || 1;

        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    /* =========================
       RESIZE HANDLER
    ========================= */

    resize() {
        if (!this.canvas) return;

        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;

        this.ctx.scale(this.dpr, this.dpr);
    }

    /* =========================
       CLEAR CANVAS
    ========================= */

    clear() {
        const ctx = this.ctx;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();
    }

    /* =========================
       MAIN RENDER ENTRY
    ========================= */

    render() {
        if (!this.engine) return;

        const nodes = this.engine.getNodes?.() || [];

        this.applyCamera();

        for (const node of nodes) {
            this.drawNode(node);
        }

        this.ctx.restore();
    }

    /* =========================
       CAMERA TRANSFORM
    ========================= */

    applyCamera() {
        const ctx = this.ctx;
        const cam = this.camera;

        if (!cam) return;

        ctx.save();

        ctx.translate(cam.x, cam.y);
        ctx.scale(cam.zoom, cam.zoom);
    }

    /* =========================
       NODE ROUTER
    ========================= */

    drawNode(node) {
        switch (node.type) {
            case "rect":
                this.drawRect(node);
                break;

            case "text":
                this.drawText(node);
                break;

            case "image":
                this.drawImage(node);
                break;

            case "frame":
                this.drawFrame(node);
                break;

            case "button":
                this.drawButton(node);
                break;

            default:
                this.drawRect(node);
        }
    }

    /* =========================
       RECTANGLE NODE
    ========================= */

    drawRect(node) {
        const ctx = this.ctx;

        ctx.fillStyle = node.fill || "#ffffff";

        ctx.fillRect(
            node.x,
            node.y,
            node.width,
            node.height
        );

        if (node.stroke) {
            ctx.strokeStyle = node.stroke;
            ctx.strokeRect(
                node.x,
                node.y,
                node.width,
                node.height
            );
        }
    }

    /* =========================
       TEXT NODE
    ========================= */

    drawText(node) {
        const ctx = this.ctx;

        ctx.fillStyle = node.color || "#ffffff";
        ctx.font = `${node.fontSize || 14}px sans-serif`;

        ctx.fillText(
            node.text || "Text",
            node.x,
            node.y + 14
        );
    }

    /* =========================
       IMAGE NODE
    ========================= */

    drawImage(node) {
        if (!node.src) return;

        const img = new Image();
        img.src = node.src;

        const ctx = this.ctx;

        img.onload = () => {
            ctx.drawImage(
                img,
                node.x,
                node.y,
                node.width,
                node.height
            );
        };
    }

    /* =========================
       FRAME NODE
    ========================= */

    drawFrame(node) {
        const ctx = this.ctx;

        ctx.strokeStyle = "#444";
        ctx.setLineDash([4, 4]);

        ctx.strokeRect(
            node.x,
            node.y,
            node.width,
            node.height
        );

        ctx.setLineDash([]);
    }

    /* =========================
       BUTTON NODE (UI STYLE)
    ========================= */

    drawButton(node) {
        const ctx = this.ctx;

        // background
        ctx.fillStyle = node.fill || "#007aff";
        ctx.fillRect(
            node.x,
            node.y,
            node.width,
            node.height
        );

        // text
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(
            node.text || "Button",
            node.x + node.width / 2,
            node.y + node.height / 2 + 4
        );

        ctx.textAlign = "left";
    }
}
