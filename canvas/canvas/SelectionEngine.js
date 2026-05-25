/* =========================================
   HAPA MINI FIGMA - SELECTION ENGINE
   frontend/editor/canvas/SelectionEngine.js
========================================= */

export class SelectionEngine {
    constructor(engine) {
        this.engine = engine;

        this.selectedId = null;

        this.hoverId = null;
    }

    /* =========================
       CLICK SELECTION
    ========================= */

    select(id) {
        if (!id) return;

        this.selectedId = id;

        this.engine.state.clearSelection();
        this.engine.state.select(id);
    }

    clear() {
        this.selectedId = null;

        this.engine.state.clearSelection();
    }

    /* =========================
       GET CURRENT SELECTION
    ========================= */

    getSelected() {
        return this.selectedId;
    }

    /* =========================
       HIT TEST (CORE LOGIC)
    ========================= */

    hitTest(e) {
        const rect = this.engine.container.getBoundingClientRect();

        const cam = this.engine.camera.getTransform();

        // convert screen → world
        const x = (e.clientX - rect.left) / cam.zoom - cam.x;
        const y = (e.clientY - rect.top) / cam.zoom - cam.y;

        const nodes = this.engine.nodeManager.getAll();

        // traverse from top (last rendered = top layer)
        const hit = this.findTopNode(nodes, x, y);

        return hit;
    }

    /* =========================
       FIND TOP NODE UNDER CURSOR
    ========================= */

    findTopNode(nodes, x, y) {
        let result = null;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            const hit = this.isInside(node, x, y);

            if (hit) {
                result = node;
            }

            // recursive children
            if (node.children?.length) {
                const childHit = this.findTopNode(node.children, x, y);
                if (childHit) {
                    result = childHit;
                }
            }
        }

        return result;
    }

    /* =========================
       CHECK BOUNDARY HIT
    ========================= */

    isInside(node, x, y) {
        const nx = node.x || 0;
        const ny = node.y || 0;

        const w = node.width || 0;
        const h = node.height || 0;

        return (
            x >= nx &&
            x <= nx + w &&
            y >= ny &&
            y <= ny + h
        );
    }

    /* =========================
       MOUSE DOWN EVENT
    ========================= */

    onMouseDown(e) {
        const hit = this.hitTest(e);

        if (!hit) {
            this.clear();
            return;
        }

        this.select(hit.id);
    }

    /* =========================
       RENDER SELECTION BOX
    ========================= */

    render(ctx) {
        if (!this.selectedId) return;

        const node = this.engine.nodeManager.getNode(this.selectedId);

        if (!node) return;

        ctx.save();

        ctx.strokeStyle = "#4aa3ff";
        ctx.lineWidth = 2;

        ctx.setLineDash([6, 4]);

        ctx.strokeRect(
            node.x,
            node.y,
            node.width || 100,
            node.height || 100
        );

        ctx.restore();
    }
}
