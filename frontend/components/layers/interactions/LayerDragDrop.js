/* =========================================
   HAPA MINI FIGMA - LAYER DRAG & DROP
   frontend/components/layers/interactions/LayerDragDrop.js
========================================= */

import { LayersState } from "../LayersState";

export class LayerDragDrop {
    constructor({ container, canvas }) {
        this.state = LayersState.getInstance();
        this.container = container;
        this.canvas = canvas;

        this.draggedId = null;
        this.dragOverId = null;

        this.init();
    }

    /* =========================
       INIT EVENTS
    ========================= */

    init() {
        this.container.addEventListener("dragstart", (e) => this.onDragStart(e));
        this.container.addEventListener("dragover", (e) => this.onDragOver(e));
        this.container.addEventListener("drop", (e) => this.onDrop(e));
        this.container.addEventListener("dragend", (e) => this.onDragEnd(e));
    }

    /* =========================
       DRAG START
    ========================= */

    onDragStart(e) {
        const item = e.target.closest(".hapa-layer-item");
        if (!item) return;

        const id = item.dataset.id;
        if (!id) return;

        this.draggedId = id;

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
    }

    /* =========================
       DRAG OVER
    ========================= */

    onDragOver(e) {
        e.preventDefault();

        const item = e.target.closest(".hapa-layer-item");
        if (!item) return;

        this.dragOverId = item.dataset.id;
    }

    /* =========================
       DROP
    ========================= */

    onDrop(e) {
        e.preventDefault();

        const targetItem = e.target.closest(".hapa-layer-item");
        if (!targetItem) return;

        const targetId = targetItem.dataset.id;
        const draggedId = this.draggedId;

        if (!draggedId || !targetId || draggedId === targetId) return;

        this.moveLayer(draggedId, targetId);

        this.draggedId = null;
        this.dragOverId = null;

        this.state.emit?.();
    }

    /* =========================
       MOVE LOGIC
    ========================= */

    moveLayer(draggedId, targetId) {
        const dragged = this.state.findById(draggedId);
        const target = this.state.findById(targetId);

        if (!dragged || !target) return;

        // remove from old parent
        this.state.removeNode(draggedId);

        // set new parent = target parent
        dragged.parentId = target.parentId;

        // insert after target (simple reorder logic)
        const parent = this.state.findById(target.parentId) || { children: this.state.nodes };

        parent.children = parent.children || [];

        const index = parent.children.findIndex((n) => n.id === targetId);

        if (index >= 0) {
            parent.children.splice(index + 1, 0, dragged);
        } else {
            parent.children.push(dragged);
        }

        // sync canvas (optional)
        if (this.canvas?.reorderNode) {
            this.canvas.reorderNode(draggedId, targetId);
        }
    }

    /* =========================
       DRAG END
    ========================= */

    onDragEnd() {
        this.draggedId = null;
        this.dragOverId = null;
    }
}
