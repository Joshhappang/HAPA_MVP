/* =========================================
   HAPA MINI FIGMA - CANVAS ENGINE CORE
   frontend/components/canvas/CanvasEngine.js
========================================= */

export class CanvasEngine {
    constructor(editor) {
        this.editor = editor;

        this.nodes = [];
        this.pages = [];
        this.activePage = null;

        this.camera = null;

        this.listeners = new Set();
    }

    /* =========================
       EDITOR BINDING
    ========================= */

    setEditor(editor) {
        this.editor = editor;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    /* =========================
       NODE SYSTEM
    ========================= */

    getNodes() {
        if (!this.activePage) return [];
        return this.nodes.filter(n => n.pageId === this.activePage);
    }

    createNode(node) {
        const newNode = {
            id: "node_" + Date.now(),
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            fill: "#ffffff",
            type: "rect",
            pageId: this.activePage,
            ...node
        };

        this.nodes.push(newNode);
        this.emit();

        return newNode;
    }

    updateNode(id, patch) {
        const node = this.nodes.find(n => n.id === id);
        if (!node) return;

        Object.assign(node, patch);
        this.emit();

        return node;
    }

    deleteNode(id) {
        this.nodes = this.nodes.filter(n => n.id !== id);
        this.emit();
    }

    reorderNodes(draggedId, targetId) {
        const dragged = this.nodes.find(n => n.id === draggedId);
        const target = this.nodes.find(n => n.id === targetId);

        if (!dragged || !target) return;

        const draggedIndex = this.nodes.indexOf(dragged);
        const targetIndex = this.nodes.indexOf(target);

        this.nodes.splice(draggedIndex, 1);
        this.nodes.splice(targetIndex, 0, dragged);

        this.emit();
    }

    /* =========================
       SELECTION SYSTEM
    ========================= */

    selectNode(id) {
        if (!this.editor) return;

        this.editor.setSelectedNode?.(
            this.nodes.find(n => n.id === id)
        );
    }

    /* =========================
       PAGE SYSTEM
    ========================= */

    getPages() {
        return this.pages;
    }

    getActivePage() {
        return this.activePage;
    }

    createPage({ name }) {
        const page = {
            id: "page_" + Date.now(),
            name: name || "Untitled Page"
        };

        this.pages.push(page);

        if (!this.activePage) {
            this.activePage = page.id;
        }

        this.emit();

        return page;
    }

    setActivePage(pageId) {
        this.activePage = pageId;
        this.emit();
    }

    /* =========================
       ASSETS SYSTEM
    ========================= */

    getAssets() {
        return this.editor?.assets || [];
    }

    insertAsset(asset) {
        const node = {
            id: "node_" + Date.now(),
            type: asset.type || "image",
            x: 150,
            y: 150,
            width: 120,
            height: 120,
            fill: "#fff",
            src: asset.src,
            pageId: this.activePage
        };

        this.nodes.push(node);
        this.emit();

        return node;
    }

    /* =========================
       GLOBAL UPDATE SYSTEM
    ========================= */

    emit() {
        this.listeners.forEach(fn => fn(this.nodes));
    }

    subscribe(fn) {
        this.listeners.add(fn);

        return () => {
            this.listeners.delete(fn);
        };
    }

    /* =========================
       BULK SYNC (OPTIONAL)
    ========================= */

    load(data) {
        if (data.nodes) this.nodes = data.nodes;
        if (data.pages) this.pages = data.pages;
        if (data.activePage) this.activePage = data.activePage;

        this.emit();
    }

    export() {
        return {
            nodes: this.nodes,
            pages: this.pages,
            activePage: this.activePage
        };
    }
}
