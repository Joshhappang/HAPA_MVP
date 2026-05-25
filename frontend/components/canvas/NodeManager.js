/* =========================================
   HAPA MINI FIGMA - NODE MANAGER CORE
   frontend/components/canvas/NodeManager.js
========================================= */

export class NodeManager {
    constructor(engine) {
        this.engine = engine;
    }

    /* =========================
       CREATE NODE FACTORY
    ========================= */

    createNode(type, props = {}) {
        const baseNode = {
            id: this.generateId(),
            type,

            x: props.x ?? 100,
            y: props.y ?? 100,

            width: props.width ?? 100,
            height: props.height ?? 100,

            rotation: props.rotation ?? 0,

            opacity: props.opacity ?? 1,

            parentId: props.parentId || null,

            children: [],

            style: {
                fill: props.fill || "#ffffff",
                stroke: props.stroke || null,
                radius: props.radius || 0
            },

            text: props.text || "",
            src: props.src || null,

            locked: false,
            visible: true,

            pageId: props.pageId || this.engine?.activePage
        };

        return baseNode;
    }

    /* =========================
       ADD NODE TO ENGINE
    ========================= */

    addNode(type, props) {
        const node = this.createNode(type, props);

        this.engine.nodes.push(node);
        this.engine.emit?.();

        return node;
    }

    /* =========================
       UPDATE NODE
    ========================= */

    updateNode(id, patch) {
        const node = this.engine.nodes.find(n => n.id === id);
        if (!node) return null;

        Object.assign(node, patch);

        this.engine.emit?.();

        return node;
    }

    /* =========================
       DELETE NODE
    ========================= */

    deleteNode(id) {
        const nodes = this.engine.nodes;

        // remove from parent if exists
        const node = nodes.find(n => n.id === id);

        if (node?.parentId) {
            const parent = nodes.find(n => n.id === node.parentId);
            if (parent) {
                parent.children = parent.children.filter(c => c !== id);
            }
        }

        this.engine.nodes = nodes.filter(n => n.id !== id);

        this.engine.emit?.();
    }

    /* =========================
       HIERARCHY SYSTEM
    ========================= */

    setParent(childId, parentId) {
        const nodes = this.engine.nodes;

        const child = nodes.find(n => n.id === childId);
        const parent = nodes.find(n => n.id === parentId);

        if (!child || !parent) return;

        // remove from old parent
        if (child.parentId) {
            const oldParent = nodes.find(n => n.id === child.parentId);
            if (oldParent) {
                oldParent.children = oldParent.children.filter(c => c !== childId);
            }
        }

        child.parentId = parentId;
        parent.children.push(childId);

        this.engine.emit?.();
    }

    /* =========================
       GET NODE HELPERS
    ========================= */

    getNode(id) {
        return this.engine.nodes.find(n => n.id === id);
    }

    getNodesByType(type) {
        return this.engine.nodes.filter(n => n.type === type);
    }

    getNodesByPage(pageId) {
        return this.engine.nodes.filter(n => n.pageId === pageId);
    }

    /* =========================
       TRANSFORM HELPERS
    ========================= */

    moveNode(id, x, y) {
        const node = this.getNode(id);
        if (!node) return;

        node.x = x;
        node.y = y;

        this.engine.emit?.();
    }

    resizeNode(id, width, height) {
        const node = this.getNode(id);
        if (!node) return;

        node.width = width;
        node.height = height;

        this.engine.emit?.();
    }

    rotateNode(id, rotation) {
        const node = this.getNode(id);
        if (!node) return;

        node.rotation = rotation;

        this.engine.emit?.();
    }

    /* =========================
       VALIDATION SYSTEM
    ========================= */

    validateNode(node) {
        return (
            node &&
            typeof node.id === "string" &&
            typeof node.x === "number" &&
            typeof node.y === "number" &&
            typeof node.width === "number" &&
            typeof node.height === "number"
        );
    }

    /* =========================
       ID GENERATOR
    ========================= */

    generateId() {
        return "node_" + Math.random().toString(36).substr(2, 9);
    }
}
