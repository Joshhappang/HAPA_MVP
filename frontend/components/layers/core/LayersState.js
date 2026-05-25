/* =========================================
   HAPA MINI FIGMA - LAYERS STATE
   CORE SINGLE SOURCE OF TRUTH
   frontend/components/layers/LayersState.js
========================================= */

export class LayersState {
    static instance = null;

    static getInstance() {
        if (!LayersState.instance) {
            LayersState.instance = new LayersState();
        }
        return LayersState.instance;
    }

    constructor() {
        this.nodes = this.createInitialNodes();

        this.selectedId = null;

        this.listeners = [];
    }

    /* =========================
       INITIAL DATA
    ========================= */

    createInitialNodes() {
        return [
            {
                id: "frame_1",
                name: "Frame 1",
                type: "frame",
                parentId: null,

                x: 100,
                y: 100,
                width: 400,
                height: 300,

                visible: true,
                locked: false,
                selected: false,

                children: [
                    {
                        id: "text_1",
                        name: "Hello Text",
                        type: "text",
                        parentId: "frame_1",

                        x: 120,
                        y: 140,
                        width: 200,
                        height: 40,

                        visible: true,
                        locked: false,
                        selected: false,

                        children: []
                    }
                ]
            }
        ];
    }

    /* =========================
       GETTERS
    ========================= */

    getAll() {
        return this.nodes;
    }

    getSelected() {
        return this.findById(this.selectedId);
    }

    findById(id, nodes = this.nodes) {
        for (let node of nodes) {
            if (node.id === id) return node;

            if (node.children && node.children.length > 0) {
                const found = this.findById(id, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    /* =========================
       SELECTION SYSTEM
    ========================= */

    setSelected(id) {
        this.clearSelection(this.nodes);

        const node = this.findById(id);
        if (node) {
            node.selected = true;
            this.selectedId = id;
        }

        this.emit();
    }

    clearSelection(nodes = this.nodes) {
        for (let node of nodes) {
            node.selected = false;

            if (node.children) {
                this.clearSelection(node.children);
            }
        }
    }

    /* =========================
       VISIBILITY
    ========================= */

    toggleVisibility(id) {
        const node = this.findById(id);
        if (node) {
            node.visible = !node.visible;
            this.emit();
        }
    }

    /* =========================
       LOCK SYSTEM
    ========================= */

    toggleLock(id) {
        const node = this.findById(id);
        if (node) {
            node.locked = !node.locked;
            this.emit();
        }
    }

    /* =========================
       UPDATE NODE PROPERTIES
    ========================= */

    updateNode(id, props) {
        const node = this.findById(id);
        if (!node) return;

        Object.assign(node, props);

        this.emit();
    }

    /* =========================
       ADD / REMOVE NODE
    ========================= */

    addNode(parentId, newNode) {
        if (!parentId) {
            this.nodes.push(newNode);
            this.emit();
            return;
        }

        const parent = this.findById(parentId);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(newNode);
            this.emit();
        }
    }

    removeNode(id, nodes = this.nodes) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                nodes.splice(i, 1);
                this.emit();
                return;
            }

            if (nodes[i].children) {
                this.removeNode(id, nodes[i].children);
            }
        }
    }

    /* =========================
       LISTENERS (REACTIVE SYSTEM)
    ========================= */

    subscribe(fn) {
        this.listeners.push(fn);
    }

    unsubscribe(fn) {
        this.listeners = this.listeners.filter((l) => l !== fn);
    }

    emit() {
        for (let fn of this.listeners) {
            fn(this.nodes, this.selectedId);
        }
    }
}
