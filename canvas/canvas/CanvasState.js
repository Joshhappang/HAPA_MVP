/* =========================================
   HAPA MINI FIGMA - CANVAS STATE STORE
   frontend/editor/canvas/CanvasState.js
========================================= */

export class CanvasState {
    constructor() {
        this.state = {
            nodes: [],

            // selection
            selectedIds: new Set(),

            // UI mode
            mode: "select", // select | drag | text | shape

            // canvas flags
            isDragging: false,
            isPanning: false,

            // viewport cache
            viewport: {
                width: 0,
                height: 0,
            },

            // history snapshot (optional hook)
            version: 0,
        };

        this.listeners = new Set();
    }

    /* =========================
       GET STATE
    ========================= */

    get() {
        return this.state;
    }

    /* =========================
       NODE MANAGEMENT
    ========================= */

    setNodes(nodes) {
        this.state.nodes = nodes;
        this.emit();
    }

    getNodes() {
        return this.state.nodes;
    }

    addNode(node) {
        this.state.nodes.push(node);
        this.bump();
    }

    updateNode(id, props) {
        const node = this.findNode(id);
        if (!node) return;

        Object.assign(node, props);
        this.bump();
    }

    deleteNode(id) {
        this.state.nodes = this.state.nodes.filter(n => n.id !== id);
        this.state.selectedIds.delete(id);
        this.bump();
    }

    findNode(id, list = this.state.nodes) {
        for (const node of list) {
            if (node.id === id) return node;

            if (node.children?.length) {
                const found = this.findNode(id, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    /* =========================
       SELECTION
    ========================= */

    select(id) {
        this.state.selectedIds.add(id);
        this.emit();
    }

    deselect(id) {
        this.state.selectedIds.delete(id);
        this.emit();
    }

    clearSelection() {
        this.state.selectedIds.clear();
        this.emit();
    }

    getSelected() {
        return Array.from(this.state.selectedIds);
    }

    isSelected(id) {
        return this.state.selectedIds.has(id);
    }

    /* =========================
       MODE CONTROL
    ========================= */

    setMode(mode) {
        this.state.mode = mode;
        this.emit();
    }

    getMode() {
        return this.state.mode;
    }

    /* =========================
       VIEWPORT
    ========================= */

    setViewport(width, height) {
        this.state.viewport = { width, height };
        this.emit();
    }

    getViewport() {
        return this.state.viewport;
    }

    /* =========================
       DRAG STATE
    ========================= */

    setDragging(value) {
        this.state.isDragging = value;
        this.emit();
    }

    setPanning(value) {
        this.state.isPanning = value;
        this.emit();
    }

    /* =========================
       VERSION CONTROL
    ========================= */

    bump() {
        this.state.version++;
        this.emit();
    }

    /* =========================
       SUBSCRIBE SYSTEM
    ========================= */

    subscribe(fn) {
        this.listeners.add(fn);

        return () => {
            this.listeners.delete(fn);
        };
    }

    emit() {
        for (const fn of this.listeners) {
            fn(this.state);
        }
    }

    /* =========================
       RESET
    ========================= */

    reset() {
        this.state.nodes = [];
        this.state.selectedIds.clear();
        this.state.version++;
        this.emit();
    }
}
