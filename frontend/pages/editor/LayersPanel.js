/* =========================================
   HAPA MINI FIGMA - LayersPanel
   frontend/pages/editor/LayersPanel.js
========================================= */

/**
 * LayersPanel - daftar layer object canvas
 * seperti Figma Layers sidebar
 */

export default function LayersPanel({
    canvasStore,
    selectionStore
}) {
    /* =========================
       GET OBJECTS
    ========================= */

    function getObjects() {
        return (
            canvasStore?.getState?.()
                ?.objects || []
        );
    }

    /* =========================
       SELECT LAYER
    ========================= */

    function selectLayer(id) {
        selectionStore.setSelection([id]);
    }

    /* =========================
       TOGGLE VISIBILITY
    ========================= */

    function toggleVisibility(id, e) {
        e.stopPropagation();

        const obj =
            canvasStore.getObject(id);

        if (!obj) return;

        canvasStore.updateObject(id, {
            hidden: !obj.hidden
        });
    }

    /* =========================
       DELETE LAYER
    ========================= */

    function deleteLayer(id, e) {
        e.stopPropagation();

        canvasStore.removeObject(id);

        const selected =
            selectionStore.getState()
                .selectedIds;

        if (selected.includes(id)) {
            selectionStore.clearSelection();
        }
    }

    /* =========================
       RENDER
    ========================= */

    const objects = getObjects();

    return `
<div class="layers-panel">

    <div class="panel-title">
        📚 Layers
    </div>

    <div class="layers-list">

        ${
            objects.length === 0
                ? `
            <div class="empty-state">
                No layers yet
            </div>
        `
                : objects
                      .map(
                          obj => `
            <div class="layer-item"
                 onclick="window.__selectLayer('${obj.id}')">

                <!-- ICON -->
                <div class="layer-icon">
                    ${getIcon(obj.type)}
                </div>

                <!-- NAME -->
                <div class="layer-name">
                    ${obj.name ||
                        obj.type}
                </div>

                <!-- ACTIONS -->
                <div class="layer-actions">

                    <button onclick="window.__toggleLayer('${obj.id}', event)">
                        👁
                    </button>

                    <button onclick="window.__deleteLayer('${obj.id}', event)">
                        🗑
                    </button>

                </div>

            </div>
        `
                      )
                      .join("")
        }

    </div>

</div>
    `;
}

/* =========================
   ICON HELPER
========================= */

function getIcon(type) {
    switch (type) {
        case "rect":
            return "▭";
        case "text":
            return "T";
        case "circle":
            return "◯";
        default:
            return "•";
    }
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__selectLayer = null;
window.__toggleLayer = null;
window.__deleteLayer = null;
