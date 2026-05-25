/* =========================================
   HAPA MINI FIGMA - LAYER CONTEXT MENU
   frontend/components/layers/interactions/LayerContextMenu.js
========================================= */

import { LayersManager } from "../core/LayersManager";
import { LayersState } from "../LayersState";

export class LayerContextMenu {
    constructor({ container }) {
        this.container = container;

        this.state = LayersState.getInstance();
        this.manager = new LayersManager();

        this.menu = document.createElement("div");
        this.menu.className = "hapa-layer-context-menu";

        this.menu.style.position = "absolute";
        this.menu.style.display = "none";
        this.menu.style.zIndex = "9999";

        document.body.appendChild(this.menu);

        this.init();
    }

    /* =========================
       INIT EVENTS
    ========================= */

    init() {
        this.container.addEventListener("contextmenu", (e) => {
            this.onRightClick(e);
        });

        document.addEventListener("click", () => {
            this.hide();
        });
    }

    /* =========================
       RIGHT CLICK HANDLER
    ========================= */

    onRightClick(e) {
        const item = e.target.closest(".hapa-layer-item");
        if (!item) return;

        e.preventDefault();

        const id = item.dataset.id;
        const node = this.state.findById(id);

        if (!node) return;

        this.show(e.pageX, e.pageY, node);
    }

    /* =========================
       SHOW MENU
    ========================= */

    show(x, y, node) {
        this.menu.innerHTML = "";

        const actions = [
            {
                label: "Rename",
                action: () => this.rename(node),
            },
            {
                label: node.locked ? "Unlock" : "Lock",
                action: () => this.toggleLock(node),
            },
            {
                label: node.visible ? "Hide" : "Show",
                action: () => this.toggleVisibility(node),
            },
            {
                label: "Duplicate",
                action: () => this.duplicate(node),
            },
            {
                label: "Delete",
                action: () => this.delete(node),
                danger: true,
            },
        ];

        actions.forEach((a) => {
            const item = document.createElement("div");
            item.className = "context-item";
            item.textContent = a.label;

            if (a.danger) {
                item.style.color = "#ff4d4d";
            }

            item.onclick = () => {
                a.action();
                this.hide();
            };

            this.menu.appendChild(item);
        });

        this.menu.style.left = x + "px";
        this.menu.style.top = y + "px";
        this.menu.style.display = "block";
    }

    /* =========================
       ACTIONS
    ========================= */

    rename(node) {
        const newName = prompt("Rename layer:", node.name);
        if (!newName) return;

        this.state.updateNode(node.id, {
            name: newName,
        });
    }

    toggleLock(node) {
        node.locked = !node.locked;
        this.state.emit?.();
    }

    toggleVisibility(node) {
        node.visible = !node.visible;
        this.state.emit?.();
    }

    duplicate(node) {
        this.manager.duplicateLayer(node.id);
    }

    delete(node) {
        this.manager.deleteLayer(node.id);
    }

    /* =========================
       HIDE MENU
    ========================= */

    hide() {
        this.menu.style.display = "none";
    }
}
