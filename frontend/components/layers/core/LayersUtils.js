/* =========================================
   HAPA MINI FIGMA - LAYERS UTILS
   CORE HELPER FUNCTIONS
   frontend/components/layers/core/LayersUtils.js
========================================= */

export class LayersUtils {
    /* =========================
       FIND NODE RECURSIVE
    ========================= */

    static findById(id, nodes) {
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
       FLATTEN TREE → ARRAY
    ========================= */

    static flatten(nodes, result = []) {
        for (let node of nodes) {
            result.push(node);

            if (node.children && node.children.length > 0) {
                this.flatten(node.children, result);
            }
        }
        return result;
    }

    /* =========================
       GET ROOT LAYERS
    ========================= */

    static getRoots(nodes) {
        return nodes.filter((n) => !n.parentId);
    }

    /* =========================
       SORT BY Z-INDEX (basic)
    ========================= */

    static sortByZIndex(nodes) {
        return [...nodes].sort((a, b) => {
            const az = a.zIndex || 0;
            const bz = b.zIndex || 0;
            return az - bz;
        });
    }

    /* =========================
       GET CHILDREN
    ========================= */

    static getChildren(node, nodes) {
        return nodes.filter((n) => n.parentId === node.id);
    }

    /* =========================
       CHECK RELATIONSHIP
    ========================= */

    static isChildOf(child, parent) {
        return child.parentId === parent.id;
    }

    static isRoot(node) {
        return !node.parentId;
    }

    /* =========================
       CLONE NODE (deep copy safe)
    ========================= */

    static clone(node) {
        return JSON.parse(JSON.stringify(node));
    }

    /* =========================
       GENERATE SAFE ID
    ========================= */

    static generateId(prefix = "layer") {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /* =========================
       UPDATE NODE IMMUTABLE
    ========================= */

    static updateNode(nodes, id, updates) {
        return nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    ...updates,
                };
            }

            if (node.children) {
                return {
                    ...node,
                    children: this.updateNode(node.children, id, updates),
                };
            }

            return node;
        });
    }

    /* =========================
       REMOVE NODE IMMUTABLE
    ========================= */

    static removeNode(nodes, id) {
        return nodes
            .filter((node) => node.id !== id)
            .map((node) => ({
                ...node,
                children: node.children
                    ? this.removeNode(node.children, id)
                    : [],
            }));
    }
}
