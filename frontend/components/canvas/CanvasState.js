/* =========================================
   HAPA MINI FIGMA - CANVAS STATE CORE
   frontend/components/canvas/CanvasState.js
========================================= */

export class CanvasState {
    constructor() {
        /* =========================
           CORE DATA
        ========================= */

        this.nodes = [];
        this.selectedNodes = new Set();

        this.pages = [];
        this.activePage = null;

        /* =========================
           VIEW STATE
        ========================= */

        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;

        /* =========================
           UI STATE
        ========================= */

        this.gridEnabled = true;
        this.snapEnabled = true;

        /* =========================
           DIRTY FLAG (render optimization)
        ========================= */

        this.dirty = true;

        /* =========================
           LISTENERS
        ========================= */

        this.listeners = new Set();
    }

    /* =========================
       STATE UPDATE CORE
    ========================= */

    setState(patch) {
        Object.assign(this, patch);
        this.markDirty();
        this.emit();
    }

    getState() {
        return {
            nodes: this.nodes,
            selectedNodes: Array.from(this.selectedNodes),
            pages: this.pages,
            activePage: this.activePage,
            zoom: this.zoom,
            panX: this.panX,
            panY: this.panY,
            gridEnabled: this.gridEnabled,
            snapEnabled: this.snapEnabled
        };
    }

    /* =========================
       NODE MANAGEMENT
    ========================= */

    setNodes(nodes) {
        this.nodes = nodes;
        this.markDirty();
        this.emit();
    }

    addNode(node) {
        this.nodes.push(node);
        this.markDirty();
        this.emit();
    }

    updateNode(id, patch) {
        const node = this.nodes.find(n => n.id === id);
        if (!node) return;

        Object.assign(node, patch);

        this.markDirty();
        this.emit();
    }

    deleteNode(id) {
        this.nodes = this.nodes.filter(n => n.id !== id);
        this.selectedNodes.delete(id);

        this.markDirty();
        this.emit();
    }

    /* =========================
       SELECTION SYSTEM
    ========================= */

    selectNode(id) {
        this.selectedNodes.add(id);
        this.emit();
    }

    deselectNode(id) {
        this.selectedNodes.delete(id);
        this.emit();
    }

    clearSelection() {
        this.selectedNodes.clear();
        this.emit();
    }

    getSelectedNodes() {
        return Array.from(this.selectedNodes);
    }

    /* =========================
       VIEWPORT SYSTEM
    ========================= */

    setZoom(zoom) {
        this.zoom = Math.max(0.1, Math.min(10, zoom));
        this.markDirty();
        this.emit();
    }

    setPan(x, y) {
        this.panX = x;
        this.panY = y;

        this.markDirty();
        this.emit();
    }

    /* =========================
       PAGE SYSTEM
    ========================= */

    setPages(pages) {
        this.pages = pages;
        this.emit();
    }

    setActivePage(pageId) {
        this.activePage = pageId;
        this.markDirty();
        this.emit();
    }

    /* =========================
       FLAGS
    ========================= */

    markDirty() {
        this.dirty = true;
    }

    clearDirty() {
        this.dirty = false;
    }

    isDirty() {
        return this.dirty;
    }

    /* =========================
       EVENT SYSTEM
    ========================= */

    subscribe(fn) {
        this.listeners.add(fn);

        return () => {
            this.listeners.delete(fn);
        };
    }

    emit() {
        this.listeners.forEach(fn => fn(this.getState()));
    }

    /* =========================
       RESET SYSTEM
    ========================= */

    reset() {
        this.nodes = [];
        this.selectedNodes.clear();

        this.pages = [];
        this.activePage = null;

        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;

        this.markDirty();
        this.emit();
    }
}
