/* =========================================
   HAPA MINI FIGMA - LAYERS MANAGER
   CORE LOGIC LAYER ENGINE
   frontend/components/layers/core/LayersManager.js
========================================= */

import { LayersState } from "../LayersState";

export class LayersManager {
    constructor() {
        this.state = LayersState.getInstance();
    }

    /* =========================
       CREATE LAYER
    ========================= */

    createLayer({
        type = "rect",
        name = "Layer",
        parentId = null,
        x = 0,
        y = 0,
        width = 100,
        height = 100,
    }) {
        const newNode = {
            id: this.generateId(),
            name,
            type,
            parentId,

            x,
            y,
            width,
            height,

            visible: true,
            locked: false,
            selected: false,

            children: [],
        };

        this.state.addNode(parentId, newNode);

        return newNode;
    }

    /* =========================
       DELETE LAYER
    ========================= */

    deleteLayer(id) {
        this.state.removeNode(id);
    }

    /* =========================
       UPDATE LAYER
    ========================= */

    updateLayer(id, props) {
        this.state.updateNode(id, props);
    }

    /* =========================
       MOVE LAYER (basic parent change)
    ========================= */

    moveLayer(id, newParentId) {
        const node = this.state.findById(id);
        if (!node) return;

        // remove from old position
        this.state.removeNode(id);

        // update parent
        node.parentId = newParentId;

        // re-add
        this.state.addNode(newParentId, node);
    }

    /* =========================
       DUPLICATE LAYER
    ========================= */

    duplicateLayer(id) {
        const node = this.state.findById(id);
        if (!node) return null;

        const copy = this.deepClone(node);
        copy.id = this.generateId();
        copy.name = node.name + " copy";

        this.state.addNode(node.parentId, copy);

        return copy;
    }

    /* =========================
       GET LAYER
    ========================= */

    getLayer(id) {
        return this.state.findById(id);
    }

    getAllLayers() {
        return this.state.getAll();
    }

    getSelectedLayer() {
        return this.state.getSelected();
    }

    /* =========================
       UTILS
    ========================= */

    generateId() {
        return "layer_" + Math.random().toString(36).substr(2, 9);
    }

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
