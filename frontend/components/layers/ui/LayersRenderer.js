/* =========================================
   HAPA MINI FIGMA - LAYERS RENDERER
   frontend/components/layers/ui/LayersRenderer.js
========================================= */

import { LayersTree } from "./LayersTree";

export class LayersRenderer {
    constructor({ root, state, onSelect }) {
        this.root = root;
        this.state = state;
        this.onSelect = onSelect;

        this.container = document.createElement("div");
        this.container.className = "hapa-layers-renderer";

        this.tree = new LayersTree({
            container: this.container,
            state: this.state,
            onSelect: this.onSelect,
        });

        this.init();
    }

    /* =========================
       INIT RENDERER
    ========================= */

    init() {
        if (this.root && !this.container.parentNode) {
            this.root.appendChild(this.container);
        }

        this.render();
    }

    /* =========================
       MAIN RENDER
    ========================= */

    render() {
        this.container.innerHTML = "";

        const treeEl = this.tree.render();
        this.container.appendChild(treeEl);
    }

    /* =========================
       FORCE UPDATE
       (dipakai saat state berubah)
    ========================= */

    update() {
        this.render();
    }

    /* =========================
       DESTROY (optional cleanup)
    ========================= */

    destroy() {
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
