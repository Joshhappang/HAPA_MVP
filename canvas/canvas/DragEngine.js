/* =========================================
   HAPA MINI FIGMA - DRAG ENGINE
   frontend/editor/canvas/DragEngine.js
========================================= */

export class DragEngine {
    constructor(engine) {
        this.engine = engine;

        this.isDragging = false;

        this.startX = 0;
        this.startY = 0;

        this.targetId = null;

        this.offsetX = 0;
        this.offsetY = 0;
    }

    /* =========================
       MOUSE DOWN
    ========================= */

    onMouseDown(e) {
        const hit = this.engine.selection?.hitTest?.(e);

        if (!hit) return;

        this.isDragging = true;
        this.targetId = hit.id;

        const node = this.engine.getNode(hit.id);
        if (!node) return;

        const cam = this.engine.camera.getTransform();

        // convert screen → world
        const world = this.engine.camera.screenToWorld(
            e.clientX,
            e.clientY
        );

        this.startX = world.x;
        this.startY = world.y;

        this.offsetX = world.x - (node.x || 0);
        this.offsetY = world.y - (node.y || 0);

        this.engine.state.setDragging(true);
    }

    /* =========================
       MOUSE MOVE
    ========================= */

    onMouseMove(e) {
        if (!this.isDragging || !this.targetId) return;

        const world = this.engine.camera.screenToWorld(
            e.clientX,
            e.clientY
        );

        const newX = world.x - this.offsetX;
        const newY = world.y - this.offsetY;

        this.engine.updateNode(this.targetId, {
            x: newX,
            y: newY,
        });
    }

    /* =========================
       MOUSE UP
    ========================= */

    onMouseUp() {
        this.isDragging = false;
        this.targetId = null;

        this.engine.state.setDragging(false);
    }

    /* =========================
       CHECK IF DRAG ACTIVE
    ========================= */

    isActive() {
        return this.isDragging;
    }
}
