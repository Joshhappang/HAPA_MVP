/* =========================================
   HAPA MINI FIGMA - SELECTION ENGINE CORE
   frontend/components/canvas/SelectionEngine.js
========================================= */

export class SelectionEngine {
    constructor({ engine, state, camera }) {
        this.engine = engine;
        this.state = state;
        this.camera = camera;

        this.dragStart = null;
        this.isSelecting = false;

        this.selectionBox = null;
    }

    /* =========================
       SINGLE CLICK SELECTION
    ========================= */

    selectNode(nodeId, additive = false) {
        const node = this.engine.getNode?.(nodeId);
        if (!node) return;

        if (!additive) {
            this.state.clearSelection();
        }

        this.state.selectNode(nodeId);
    }

    /* =========================
       DESELECT
    ========================= */

    deselectNode(nodeId) {
        this.state.deselectNode(nodeId);
    }

    clearSelection() {
        this.state.clearSelection();
    }

    /* =========================
       HIT TEST SELECTION
    ========================= */

    hitTest(x, y) {
        const nodes = this.engine.nodes || [];

        // top-most node first (reverse order)
        for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];

            if (this.isPointInsideNode(x, y, n)) {
                return n;
            }
        }

        return null;
    }

    isPointInsideNode(x, y, node) {
        return (
            x >= node.x &&
            x <= node.x + node.width &&
            y >= node.y &&
            y <= node.y + node.height
        );
    }

    /* =========================
       MOUSE DOWN
    ========================= */

    onMouseDown(e, additive = false) {
        const world = this.camera.screenToWorld(e.clientX, e.clientY);

        const hitNode = this.hitTest(world.x, world.y);

        if (hitNode) {
            this.selectNode(hitNode.id, additive);
            this.isSelecting = false;
            return;
        }

        // start box selection
        this.isSelecting = true;

        this.dragStart = {
            x: world.x,
            y: world.y
        };

        this.selectionBox = {
            x: world.x,
            y: world.y,
            width: 0,
            height: 0
        };

        this.clearSelection();
    }

    /* =========================
       MOUSE MOVE (BOX SELECT)
    ========================= */

    onMouseMove(e) {
        if (!this.isSelecting || !this.dragStart) return;

        const world = this.camera.screenToWorld(e.clientX, e.clientY);

        const x = Math.min(this.dragStart.x, world.x);
        const y = Math.min(this.dragStart.y, world.y);

        const width = Math.abs(world.x - this.dragStart.x);
        const height = Math.abs(world.y - this.dragStart.y);

        this.selectionBox = { x, y, width, height };

        this.updateBoxSelection();
    }

    /* =========================
       BOX SELECTION LOGIC
    ========================= */

    updateBoxSelection() {
        const nodes = this.engine.nodes || [];

        const box = this.selectionBox;
        if (!box) return;

        const selected = [];

        for (const node of nodes) {
            if (this.isNodeInsideBox(node, box)) {
                selected.push(node.id);
            }
        }

        this.state.clearSelection();

        for (const id of selected) {
            this.state.selectNode(id);
        }
    }

    isNodeInsideBox(node, box) {
        return !(
            node.x > box.x + box.width ||
            node.x + node.width < box.x ||
            node.y > box.y + box.height ||
            node.y + node.height < box.y
        );
    }

    /* =========================
       MOUSE UP
    ========================= */

    onMouseUp() {
        this.isSelecting = false;
        this.dragStart = null;
        this.selectionBox = null;
    }

    /* =========================
       SHIFT MULTI SELECT
    ========================= */

    toggleNodeSelection(nodeId) {
        const selected = this.state.getSelectedNodes();

        if (selected.includes(nodeId)) {
            this.state.deselectNode(nodeId);
        } else {
            this.state.selectNode(nodeId);
        }
    }

    /* =========================
       GET SELECTION BOX (UI)
    ========================= */

    getSelectionBox() {
        return this.selectionBox;
    }
}
