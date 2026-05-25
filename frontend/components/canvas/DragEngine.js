/* =========================================
   HAPA MINI FIGMA - DRAG ENGINE CORE
   frontend/components/canvas/DragEngine.js
========================================= */

export class DragEngine {
    constructor({ engine, state, camera, snapEngine = null }) {
        this.engine = engine;
        this.state = state;
        this.camera = camera;
        this.snapEngine = snapEngine;

        this.isDragging = false;

        this.startMouse = null;
        this.startNodes = new Map(); // nodeId → {x,y}

        this.dragOffset = { x: 0, y: 0 };
    }

    /* =========================
       DRAG START
    ========================= */

    onMouseDown(e) {
        const selected = this.state.getSelectedNodes();
        if (!selected.length) return;

        const world = this.camera.screenToWorld(e.clientX, e.clientY);

        this.isDragging = true;

        this.startMouse = {
            x: world.x,
            y: world.y
        };

        this.startNodes.clear();

        for (const id of selected) {
            const node = this.engine.getNode?.(id);
            if (!node) continue;

            this.startNodes.set(id, {
                x: node.x,
                y: node.y
            });
        }
    }

    /* =========================
       DRAG MOVE
    ========================= */

    onMouseMove(e) {
        if (!this.isDragging) return;

        const world = this.camera.screenToWorld(e.clientX, e.clientY);

        const dx = world.x - this.startMouse.x;
        const dy = world.y - this.startMouse.y;

        this.dragOffset = { x: dx, y: dy };

        this.applyDrag(dx, dy);
    }

    /* =========================
       APPLY DRAG TRANSFORM
    ========================= */

    applyDrag(dx, dy) {
        const selected = this.state.getSelectedNodes();

        for (const id of selected) {
            const start = this.startNodes.get(id);
            if (!start) continue;

            let newX = start.x + dx;
            let newY = start.y + dy;

            /* =========================
               SNAP HOOK (optional)
            ========================= */

            if (this.snapEngine) {
                const snapped = this.snapEngine.snapPoint(newX, newY);
                newX = snapped.x;
                newY = snapped.y;
            }

            this.engine.updateNode?.(id, {
                x: newX,
                y: newY
            });
        }
    }

    /* =========================
       DRAG END
    ========================= */

    onMouseUp() {
        this.isDragging = false;
        this.startMouse = null;
        this.startNodes.clear();
        this.dragOffset = { x: 0, y: 0 };
    }

    /* =========================
       MULTI NODE DRAG SUPPORT
    ========================= */

    isActive() {
        return this.isDragging;
    }

    getDragOffset() {
        return this.dragOffset;
    }
}
