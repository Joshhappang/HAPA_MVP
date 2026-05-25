/* =========================================
   HAPA MINI FIGMA - CANVAS EVENTS CORE
   frontend/components/canvas/CanvasEvents.js
========================================= */

export class CanvasEvents {
    constructor({
        canvas,
        selectionEngine,
        dragEngine,
        zoomEngine,
        camera,
        state
    }) {
        this.canvas = canvas;

        this.selectionEngine = selectionEngine;
        this.dragEngine = dragEngine;
        this.zoomEngine = zoomEngine;

        this.camera = camera;
        this.state = state;

        this.isSpacePressed = false;
        this.isPanning = false;

        this.lastPan = { x: 0, y: 0 };

        this.init();
    }

    /* =========================
       INIT LISTENERS
    ========================= */

    init() {
        /* MOUSE */
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("wheel", this.onWheel.bind(this), {
            passive: false
        });

        /* KEYBOARD */
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    /* =========================
       MOUSE DOWN
    ========================= */

    onMouseDown(e) {
        const isLeftClick = e.button === 0;
        const isRightClick = e.button === 2;

        if (isRightClick || this.isSpacePressed) {
            this.startPan(e);
            return;
        }

        const additive = e.shiftKey;

        this.selectionEngine.onMouseDown(e, additive);

        this.dragEngine.onMouseDown(e);
    }

    /* =========================
       MOUSE MOVE
    ========================= */

    onMouseMove(e) {
        if (this.isPanning) {
            this.handlePan(e);
            return;
        }

        this.selectionEngine.onMouseMove(e);
        this.dragEngine.onMouseMove(e);
    }

    /* =========================
       MOUSE UP
    ========================= */

    onMouseUp() {
        this.selectionEngine.onMouseUp();
        this.dragEngine.onMouseUp();

        this.stopPan();
    }

    /* =========================
       WHEEL (ZOOM)
    ========================= */

    onWheel(e) {
        const rect = this.canvas.getBoundingClientRect();

        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        this.zoomEngine.onWheel(e, clientX, clientY);
    }

    /* =========================
       PAN SYSTEM (SPACE / RIGHT CLICK)
    ========================= */

    startPan(e) {
        this.isPanning = true;

        this.lastPan = {
            x: e.clientX,
            y: e.clientY
        };

        this.canvas.style.cursor = "grab";
    }

    handlePan(e) {
        const dx = e.clientX - this.lastPan.x;
        const dy = e.clientY - this.lastPan.y;

        this.camera.pan(dx, dy);

        this.lastPan = {
            x: e.clientX,
            y: e.clientY
        };
    }

    stopPan() {
        this.isPanning = false;
        this.canvas.style.cursor = "default";
    }

    /* =========================
       KEYBOARD INPUT
    ========================= */

    onKeyDown(e) {
        switch (e.code) {
            case "Space":
                this.isSpacePressed = true;
                this.canvas.style.cursor = "grab";
                break;

            case "Escape":
                this.selectionEngine.clearSelection();
                break;

            case "KeyZ":
                if (e.ctrlKey || e.metaKey) {
                    console.log("Undo (hook to history engine)");
                }
                break;

            default:
                break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case "Space":
                this.isSpacePressed = false;
                this.canvas.style.cursor = "default";
                break;
        }
    }

    /* =========================
       DESTROY CLEANUP
    ========================= */

    destroy() {
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("wheel", this.onWheel);

        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }
}
