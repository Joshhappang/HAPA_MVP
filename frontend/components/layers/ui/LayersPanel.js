/* =========================================
   HAPA MINI FIGMA - LAYERS PANEL CORE
   frontend/components/layers/ui/LayersPanel.js
========================================= */

import { LayersState } from "../core/LayersState";
import { LayersItem } from "./LayersItem";

export class LayersPanel {
    constructor({ root, canvas, onSelect }) {
        this.root = root;
        this.canvas = canvas;
        this.onSelect = onSelect;

        this.container = document.createElement("div");
        this.container.className = "hapa-layers-panel";

        this.state = LayersState.getInstance();

        this.render();
    }

    /* =========================
       RENDER PANEL
    ========================= */

    render() {
        this.container.innerHTML = "";

        const title = document.createElement("div");
        title.className = "layers-title";
        title.textContent = "Layers";

        this.container.appendChild(title);

        const list = document.createElement("div");
        list.className = "layers-list";

        const nodes = this.state.getAll();

        if (!nodes || nodes.length === 0) {
            const empty = document.createElement("div");
            empty.className = "layers-empty";
            empty.textContent = "No layers yet";
            list.appendChild(empty);
        } else {
            nodes.forEach((node) => {
                const item = new LayersItem({
                    node,
                    onSelect: (n) => this.handleSelect(n),
                    onToggleVisibility: (n) => this.toggleVisibility(n),
                    onToggleLock: (n) => this.toggleLock(n),
                });

                list.appendChild(item.render());
            });
        }

        this.container.appendChild(list);

        if (this.root && !this.container.parentNode) {
            this.root.appendChild(this.container);
        }
    }

    /* =========================
       SELECT LAYER
    ========================= */

    handleSelect(node) {
        this.state.setSelected(node.id);

        if (this.onSelect) {
            this.onSelect(node);
        }

        this.render();
    }

    /* =========================
       TOGGLE VISIBILITY
    ========================= */

    toggleVisibility(node) {
        this.state.toggleVisibility(node.id);
        this.render();
    }

    /* =========================
       TOGGLE LOCK
    ========================= */

    toggleLock(node) {
        this.state.toggleLock(node.id);
        this.render();
    }

    /* =========================
       FORCE UPDATE
    ========================= */

    update() {
        this.render();
    }
}
