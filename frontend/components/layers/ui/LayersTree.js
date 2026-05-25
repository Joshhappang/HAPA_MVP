/* =========================================
   HAPA MINI FIGMA - LAYERS TREE
   frontend/components/layers/ui/LayersTree.js
========================================= */

import { LayersItem } from "./LayersItem";

export class LayersTree {
    constructor({ container, state, onSelect }) {
        this.container = container;
        this.state = state;
        this.onSelect = onSelect;

        this.el = document.createElement("div");
        this.el.className = "hapa-layers-tree";
    }

    /* =========================
       RENDER TREE ROOT
    ========================= */

    render() {
        this.el.innerHTML = "";

        const nodes = this.state.getAll();

        if (!nodes || nodes.length === 0) {
            const empty = document.createElement("div");
            empty.className = "layers-empty";
            empty.textContent = "No layers";
            this.el.appendChild(empty);
            return this.el;
        }

        const tree = this.buildTree(nodes);
        this.renderNodes(tree, this.el, 0);

        return this.el;
    }

    /* =========================
       BUILD TREE STRUCTURE
       flat → hierarchical
    ========================= */

    buildTree(nodes) {
        const map = new Map();
        const roots = [];

        // create map
        nodes.forEach((n) => {
            map.set(n.id, { ...n, children: [] });
        });

        // assign children
        nodes.forEach((n) => {
            if (n.parentId && map.has(n.parentId)) {
                map.get(n.parentId).children.push(map.get(n.id));
            } else {
                roots.push(map.get(n.id));
            }
        });

        return roots;
    }

    /* =========================
       RENDER NODES RECURSIVE
    ========================= */

    renderNodes(nodes, parentEl, depth = 0) {
        nodes.forEach((node) => {
            const wrapper = document.createElement("div");
            wrapper.className = "layer-tree-node";
            wrapper.style.paddingLeft = `${depth * 12}px`;

            const item = new LayersItem({
                node,
                onSelect: this.onSelect,
                onToggleVisibility: (n) => this.state.toggleVisibility(n.id),
                onToggleLock: (n) => this.state.toggleLock(n.id),
            });

            wrapper.appendChild(item.render());

            parentEl.appendChild(wrapper);

            // render children recursively
            if (node.children && node.children.length > 0) {
                this.renderNodes(node.children, parentEl, depth + 1);
            }
        });
    }
}
