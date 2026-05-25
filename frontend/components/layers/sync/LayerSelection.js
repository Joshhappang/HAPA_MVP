/* =========================================
   HAPA MINI FIGMA - LAYER SELECTION SYNC
   frontend/components/layers/sync/LayerSelection.js
========================================= */

import { LayersState } from "../LayersState";

export class LayerSelection {
    constructor({ canvas }) {
        this.state = LayersState.getInstance();
        this.canvas = canvas;

        this.selectedId = null;

        this.listeners = [];

        this.init();
    }

    /* =========================
       INIT SYNC
    ========================= */

    init() {
        // listen to global state changes
        this.state.subscribe(() => {
            this.syncFromState();
        });
    }

    /* =========================
       SELECT FROM CANVAS → LAYERS
    ========================= */

    selectFromCanvas(nodeId) {
        if (!nodeId) return;

        this.selectedId = nodeId;

        this.state.setSelected(nodeId);

        this.emit({
            source: "canvas",
            selectedId: nodeId,
        });
    }

    /* =========================
       SELECT FROM LAYERS → CANVAS
    ========================= */

    selectFromLayers(nodeId) {
        if (!nodeId) return;

        this.selectedId = nodeId;

        this.state.setSelected(nodeId);

        if (this.canvas && this.canvas.selectNode) {
            this.canvas.selectNode(nodeId);
        }

        this.emit({
            source: "layers",
            selectedId: nodeId,
        });
    }

    /* =========================
       SYNC FROM STATE
    ========================= */

    syncFromState() {
        const selected = this.state.getSelected();

        if (!selected) return;

        this.selectedId = selected.id;

        if (this.canvas && this.canvas.highlightNode) {
            this.canvas.highlightNode(selected.id);
        }
    }

    /* =========================
       CLEAR SELECTION
    ========================= */

    clearSelection() {
        this.selectedId = null;

        this.state.setSelected(null);

        if (this.canvas && this.canvas.clearSelection) {
            this.canvas.clearSelection();
        }

        this.emit({
            source: "system",
            selectedId: null,
        });
    }

    /* =========================
       GET CURRENT SELECTION
    ========================= */

    getSelectedId() {
        return this.selectedId;
    }

    getSelectedNode() {
        return this.state.getSelected();
    }

    /* =========================
       EVENT SYSTEM
    ========================= */

    subscribe(fn) {
        this.listeners.push(fn);
    }

    unsubscribe(fn) {
        this.listeners = this.listeners.filter((l) => l !== fn);
    }

    emit(payload) {
        for (let fn of this.listeners) {
            fn(payload);
        }
    }
}
