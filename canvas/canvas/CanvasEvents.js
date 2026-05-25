/* =========================================
   HAPA MINI FIGMA - CANVAS EVENTS SYSTEM
   frontend/editor/canvas/CanvasEvents.js
========================================= */

export class CanvasEvents {
    constructor(engine) {
        this.engine = engine;
        this.container = engine.container;

        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
    }

    /* =========================
       INIT EVENTS
    ========================= */

    init() {
        this.container.addEventListener("mousedown", (e) => this.onMouseDown(e));
        this.container.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.container.addEventListener("mouseup", (e) => this.onMouseUp(e));
        this.container.addEventListener("wheel", (e) => this.onWheel(e), {
            passive: false,
        });

        window.addEventListener("keydown", (e) => this.onKeyDown(e));
    }

    /* =========================
       MOUSE DOWN
    ========================= */

    onMouseDown(e) {
        this.isDragging = true;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        this.engine.onMouseDown?.(e);
    }

    /* =========================
       MOUSE MOVE
    ========================= */

    onMouseMove(e) {
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        if (this.isDragging) {
            // default behavior: pan canvas
            if (e.buttons === 1) {
                this.engine.pan(dx, dy);
            }
        }

        this.engine.onMouseMove?.(e);
    }

    /* =========================
       MOUSE UP
    ========================= */

    onMouseUp(e) {
        this.isDragging = false;
        this.engine.onMouseUp?.(e);
    }

    /* =========================
       WHEEL (ZOOM)
    ========================= */

    onWheel(e) {
        e.preventDefault();

        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

        this.engine.zoomAt(
            zoomFactor,
            e.clientX,
            e.clientY
        );

        this.engine.onWheel?.(e);
    }

    /* =========================
       KEYBOARD (basic hooks)
    ========================= */

    onKeyDown(e) {
        // ESC = clear selection
        if (e.key === "Escape") {
            this.engine.clearSelection?.();
        }

        // DELETE = delete selected node
        if (e.key === "Delete") {
            const selected = this.engine.selection?.getSelected?.();
            if (selected) {
                this.engine.deleteNode(selected.id);
            }
        }
    }

    /* =========================
       DESTROY
    ========================= */

    destroy() {
        this.container.removeEventListener("mousedown", this.onMouseDown);
        this.container.removeEventListener("mousemove", this.onMouseMove);
        this.container.removeEventListener("mouseup", this.onMouseUp);
        this.container.removeEventListener("wheel", this.onWheel);
    }
}
