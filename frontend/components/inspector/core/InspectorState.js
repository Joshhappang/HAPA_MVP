/* =========================================
   HAPA MINI FIGMA - INSPECTOR STATE CORE
   frontend/components/inspector/InspectorState.js
========================================= */

export class InspectorState {
    constructor() {
        this.activeNodeId = null;
        this.activeNode = null;

        this.listeners = new Set();
    }

    /* =========================
       SET ACTIVE NODE
    ========================= */

    setActiveNode(node) {
        if (!node) {
            this.activeNodeId = null;
            this.activeNode = null;
        } else {
            this.activeNodeId = node.id;
            this.activeNode = node;
        }

        this.emit();
    }

    /* =========================
       CLEAR STATE
    ========================= */

    clear() {
        this.activeNodeId = null;
        this.activeNode = null;

        this.emit();
    }

    /* =========================
       GETTERS
    ========================= */

    getActiveNode() {
        return this.activeNode;
    }

    getActiveNodeId() {
        return this.activeNodeId;
    }

    hasSelection() {
        return this.activeNode !== null;
    }

    /* =========================
       UPDATE NODE PARTIAL
    ========================= */

    updateActiveNode(patch) {
        if (!this.activeNode) return;

        this.activeNode = {
            ...this.activeNode,
            ...patch
        };

        this.emit();
    }

    /* =========================
       SYNC FROM CANVAS SELECTION
    ========================= */

    syncFromSelection(selectedNodes, engine) {
        if (!selectedNodes || selectedNodes.length === 0) {
            this.clear();
            return;
        }

        const node = engine.getNode?.(selectedNodes[0]);

        if (!node) {
            this.clear();
            return;
        }

        this.setActiveNode(node);
    }

    /* =========================
       SUBSCRIPTION SYSTEM
    ========================= */

    subscribe(fn) {
        this.listeners.add(fn);

        return () => {
            this.listeners.delete(fn);
        };
    }

    emit() {
        const payload = {
            activeNode: this.activeNode,
            activeNodeId: this.activeNodeId,
            hasSelection: this.hasSelection()
        };

        for (const fn of this.listeners) {
            fn(payload);
        }
    }

    /* =========================
       FORCE REFRESH
    ========================= */

    refresh(node) {
        if (node) {
            this.setActiveNode(node);
        } else {
            this.emit();
        }
    }
}
