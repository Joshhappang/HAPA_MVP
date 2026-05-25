/* =========================================
   HAPA MINI FIGMA - INSPECTOR CORE
   frontend/components/inspector/Inspector.js
========================================= */

export class Inspector {
    constructor({ state, engine }) {
        this.state = state;
        this.engine = engine;

        this.activeNode = null;

        this.listeners = new Set();

        this.init();
    }

    /* =========================
       INIT SYNC
    ========================= */

    init() {
        // listen selection changes
        this.state.subscribe(() => {
            this.syncWithSelection();
        });

        this.syncWithSelection();
    }

    /* =========================
       SYNC SELECTION → INSPECTOR
    ========================= */

    syncWithSelection() {
        const selected = this.state.getSelectedNodes();

        if (!selected || selected.length === 0) {
            this.activeNode = null;
            this.emit();
            return;
        }

        // only single selection for now (Figma-style inspector)
        const nodeId = selected[0];

        this.activeNode = this.engine.getNode?.(nodeId) || null;

        this.emit();
    }

    /* =========================
       GET ACTIVE NODE
    ========================= */

    getActiveNode() {
        return this.activeNode;
    }

    /* =========================
       UPDATE NODE PROPERTIES
    ========================= */

    updateProperty(path, value) {
        if (!this.activeNode) return;

        // support nested property update (style.fill, etc)
        const keys = path.split(".");

        let target = this.activeNode;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]]) return;
            target = target[keys[i]];
        }

        const lastKey = keys[keys.length - 1];

        target[lastKey] = value;

        // sync to engine
        this.engine.updateNode?.(this.activeNode.id, this.activeNode);

        this.emit();
    }

    /* =========================
       TRANSFORM HELPERS
    ========================= */

    updateTransform({ x, y, width, height, rotation }) {
        if (!this.activeNode) return;

        const patch = {};

        if (x !== undefined) patch.x = x;
        if (y !== undefined) patch.y = y;
        if (width !== undefined) patch.width = width;
        if (height !== undefined) patch.height = height;
        if (rotation !== undefined) patch.rotation = rotation;

        this.engine.updateNode?.(this.activeNode.id, patch);

        this.syncWithSelection();
    }

    /* =========================
       STYLE HELPERS
    ========================= */

    updateStyle(key, value) {
        if (!this.activeNode) return;

        const style = this.activeNode.style || {};

        style[key] = value;

        this.engine.updateNode?.(this.activeNode.id, {
            style
        });

        this.syncWithSelection();
    }

    /* =========================
       TEXT UPDATE
    ========================= */

    updateText(text) {
        if (!this.activeNode) return;

        this.engine.updateNode?.(this.activeNode.id, {
            text
        });

        this.syncWithSelection();
    }

    /* =========================
       IMAGE UPDATE
    ========================= */

    updateImage(src) {
        if (!this.activeNode) return;

        this.engine.updateNode?.(this.activeNode.id, {
            src
        });

        this.syncWithSelection();
    }

    /* =========================
       VALIDATION
    ========================= */

    hasSelection() {
        return this.activeNode !== null;
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
        const payload = {
            activeNode: this.activeNode,
            hasSelection: this.hasSelection()
        };

        this.listeners.forEach(fn => fn(payload));
    }

    /* =========================
       RESET
    ========================= */

    clear() {
        this.activeNode = null;
        this.emit();
    }
}
