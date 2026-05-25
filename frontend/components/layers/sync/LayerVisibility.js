/* =========================================
   HAPA MINI FIGMA - LAYER VISIBILITY SYNC
   frontend/components/layers/sync/LayerVisibility.js
========================================= */

import { LayersState } from "../LayersState";

export class LayerVisibility {
    constructor({ canvas }) {
        this.state = LayersState.getInstance();
        this.canvas = canvas;
    }

    /* =========================
       TOGGLE VISIBILITY
    ========================= */

    toggle(id) {
        const node = this.state.findById(id);
        if (!node) return;

        node.visible = !node.visible;

        // sync ke canvas
        if (this.canvas) {
            if (node.visible) {
                this.showOnCanvas(id);
            } else {
                this.hideOnCanvas(id);
            }
        }

        this.state.emit?.();
    }

    /* =========================
       SHOW
    ========================= */

    show(id) {
        const node = this.state.findById(id);
        if (!node) return;

        node.visible = true;

        this.showOnCanvas(id);

        this.state.emit?.();
    }

    /* =========================
       HIDE
    ========================= */

    hide(id) {
        const node = this.state.findById(id);
        if (!node) return;

        node.visible = false;

        this.hideOnCanvas(id);

        this.state.emit?.();
    }

    /* =========================
       CANVAS SYNC ACTIONS
    ========================= */

    showOnCanvas(id) {
        if (this.canvas && this.canvas.setVisibility) {
            this.canvas.setVisibility(id, true);
        }
    }

    hideOnCanvas(id) {
        if (this.canvas && this.canvas.setVisibility) {
            this.canvas.setVisibility(id, false);
        }
    }

    /* =========================
       CHECK STATUS
    ========================= */

    isVisible(id) {
        const node = this.state.findById(id);
        return node ? node.visible : false;
    }

    /* =========================
       TOGGLE ALL (OPTIONAL)
    ========================= */

    toggleAll(value) {
        const nodes = this.state.getAll();

        const apply = (list) => {
            list.forEach((n) => {
                n.visible = value;

                if (n.children && n.children.length) {
                    apply(n.children);
                }

                if (this.canvas) {
                    this.canvas.setVisibility?.(n.id, value);
                }
            });
        };

        apply(nodes);

        this.state.emit?.();
    }
}
