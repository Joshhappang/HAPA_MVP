/* =========================================
   HAPA MINI FIGMA - LAYERS ITEM
   frontend/components/layers/ui/LayersItem.js
========================================= */

export class LayersItem {
    constructor({ node, onSelect, onToggleVisibility, onToggleLock }) {
        this.node = node;

        this.onSelect = onSelect;
        this.onToggleVisibility = onToggleVisibility;
        this.onToggleLock = onToggleLock;

        this.el = document.createElement("div");
        this.el.className = "hapa-layer-item";

        this.render();
    }

    /* =========================
       MAIN RENDER
    ========================= */

    render() {
        this.el.innerHTML = "";

        const row = document.createElement("div");
        row.className = "layer-row";

        /* =========================
           ICON
        ========================= */

        const icon = document.createElement("div");
        icon.className = "layer-icon";

        icon.textContent = this.getIcon(this.node.type);
        row.appendChild(icon);

        /* =========================
           NAME
        ========================= */

        const name = document.createElement("div");
        name.className = "layer-name";
        name.textContent = this.node.name || this.node.type || "Layer";

        row.appendChild(name);

        /* =========================
           ACTIONS
        ========================= */

        const actions = document.createElement("div");
        actions.className = "layer-actions";

        /* VISIBILITY */
        const visBtn = document.createElement("button");
        visBtn.className = "layer-btn";
        visBtn.textContent = this.node.visible === false ? "🙈" : "👁";

        visBtn.onclick = (e) => {
            e.stopPropagation();
            this.onToggleVisibility?.(this.node);
        };

        actions.appendChild(visBtn);

        /* LOCK */
        const lockBtn = document.createElement("button");
        lockBtn.className = "layer-btn";
        lockBtn.textContent = this.node.locked ? "🔒" : "🔓";

        lockBtn.onclick = (e) => {
            e.stopPropagation();
            this.onToggleLock?.(this.node);
        };

        actions.appendChild(lockBtn);

        row.appendChild(actions);

        /* =========================
           CLICK SELECT
        ========================= */

        this.el.onclick = () => {
            this.onSelect?.(this.node);
        };

        /* =========================
           ACTIVE STATE
        ========================= */

        if (this.node.selected) {
            this.el.classList.add("active");
        }

        this.el.appendChild(row);

        return this.el;
    }

    /* =========================
       ICON MAPPING
    ========================= */

    getIcon(type) {
        switch (type) {
            case "text":
                return "T";
            case "image":
                return "🖼";
            case "frame":
                return "⬛";
            case "shape":
                return "⬡";
            default:
                return "•";
        }
    }

    /* =========================
       UPDATE (optional re-render)
    ========================= */

    update(node) {
        this.node = node;
        this.render();
    }
}
