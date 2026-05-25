/* =========================================
   HAPA MINI FIGMA - NODE MANAGER
   frontend/editor/canvas/NodeManager.js
========================================= */

export class NodeManager {
    constructor(engine) {
        this.engine = engine;

        // local cache reference dari state
        this.state = engine.state;
    }

    /* =========================
       GET ALL NODES
    ========================= */

    getAll() {
        return this.state.getNodes();
    }

    /* =========================
       GET SINGLE NODE
    ========================= */

    getNode(id, list = null) {
        return this.state.findNode(id, list || this.getAll());
    }

    /* =========================
       ADD NODE
    ========================= */

    addNode(node) {
        const safeNode = {
            id: node.id || this.generateId(),
            type: node.type || "rect",

            x: node.x || 0,
            y: node.y || 0,
            width: node.width || 100,
            height: node.height || 100,

            parentId: node.parentId || null,
            children: node.children || [],

            style: node.style || {},
            visible: node.visible ?? true,

            ...node,
        };

        this.state.addNode(safeNode);

        return safeNode;
    }

    /* =========================
       UPDATE NODE
    ========================= */

    updateNode(id, props) {
        const node = this.getNode(id);
        if (!node) return null;

        Object.assign(node, props);

        this.state.bump?.();

        return node;
    }

    /* =========================
       DELETE NODE
    ========================= */

    deleteNode(id, list = null) {
        const nodes = list || this.getAll();

        const index = nodes.findIndex(n => n.id === id);

        if (index !== -1) {
            nodes.splice(index, 1);
            this.state.bump?.();
            return true;
        }

        // recursive delete in children
        for (const node of nodes) {
            if (node.children?.length) {
                this.deleteNode(id, node.children);
            }
        }

        this.state.bump?.();
        return false;
    }

    /* =========================
       REORDER NODE (LAYER ORDER)
    ========================= */

    reorder(draggedId, targetId) {
        const nodes = this.getAll();

        const draggedIndex = nodes.findIndex(n => n.id === draggedId);
        const targetIndex = nodes.findIndex(n => n.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const [dragged] = nodes.splice(draggedIndex, 1);

        nodes.splice(targetIndex, 0, dragged);

        this.state.bump?.();
    }

    /* =========================
       PARENT-CHILD RELATION
    ========================= */

    setParent(childId, parentId) {
        const child = this.getNode(childId);
        if (!child) return;

        child.parentId = parentId;

        const parent = this.getNode(parentId);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(child);
        }

        this.state.bump?.();
    }

    /* =========================
       CREATE DEFAULT NODES
    ========================= */

    createFrame(x = 0, y = 0) {
        return this.addNode({
            type: "frame",
            x,
            y,
            width: 400,
            height: 300,
            background: "#2b2b2b",
        });
    }

    createText(x = 0, y = 0, text = "Text") {
        return this.addNode({
            type: "text",
            x,
            y,
            text,
            fontSize: 16,
            color: "#ffffff",
        });
    }

    createRect(x = 0, y = 0) {
        return this.addNode({
            type: "rect",
            x,
            y,
            width: 120,
            height: 120,
            fill: "#4a90e2",
        });
    }

    /* =========================
       UTILITY
    ========================= */

    generateId() {
        return "node_" + Math.random().toString(36).substr(2, 9);
    }
}
