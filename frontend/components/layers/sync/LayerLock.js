/* =========================================
   HAPA MINI FIGMA - LAYER LOCK SYNC
   frontend/components/layers/sync/LayerLock.js
========================================= */

import { LayersState } from "../LayersState";

export class LayerLock {
    constructor({ canvas }) {
        this.state = LayersState.getInstance();
        this.canvas = canvas;
    }

    /* =========================
       TOGGLE LOCK
    ========================= */

    toggle(id) {
        const node = this.state.findById(id);
        if (!node) return;

        node.locked = !node.locked;

        // kalau lock aktif → pastikan tidak bisa dipilih
        if (node.locked && node.selected) {
            this.state.setSelected(null);
        }

        // sync ke canvas
        this.syncToCanvas(node);

        this.state.emit?.();
    }

    /* =========================
       LOCK
    ========================= */

    lock(id) {
        const node = this.state.findById(id);
        if (!node) return;

        node.locked = true;

        if (node.selected) {
            this.state.setSelected(null);
        }

        this.syncToCanvas(node);

        this.state.emit?.();
    }

    /* =========================
       UNLOCK
    ========================= */

    unlock(id) {
        const node = this.state.findById(id);
        if (!node) return;

        node.locked = false;

        this.syncToCanvas(node);

        this.state.emit?.();
    }

    /* =========================
       CHECK LOCK STATUS
    ========================= */

    isLocked(id) {
        const node = this.state.findById(id);
        return node ? node.locked : false;
    }

    /* =========================
       CANVAS SYNC
    ========================= */

    syncToCanvas(node) {
        if (!this.canvas) return;

        // disable interaction kalau locked
        if (this.canvas.setLockState) {
            this.canvas.setLockState(node.id, node.locked);
        }

        // optional: prevent dragging
        if (node.locked && this.canvas.disableNode) {
            this.canvas.disableNode(node.id);
        }

        if (!node.locked && this.canvas.enableNode) {
            this.canvas.enableNode(node.id);
        }
    }

    /* =========================
       LOCK ALL
    ========================= */

    lockAll() {
        const nodes = this.state.getAll();

        const apply = (list) => {
            list.forEach((n) => {
                n.locked = true;

                if (this.canvas?.setLockState) {
                    this.canvas.setLockState(n.id, true);
                }

                if (n.children?.length) {
                    apply(n.children);
                }
            });
        };

        apply(nodes);

        this.state.setSelected(null);
        this.state.emit?.();
    }

    /* =========================
       UNLOCK ALL
    ========================= */

    unlockAll() {
        const nodes = this.state.getAll();

        const apply = (list) => {
            list.forEach((n) => {
                n.locked = false;

                if (this.canvas?.setLockState) {
                    this.canvas.setLockState(n.id, false);
                }

                if (n.children?.length) {
                    apply(n.children);
                }
            });
        };

        apply(nodes);

        this.state.emit?.();
    }
}
