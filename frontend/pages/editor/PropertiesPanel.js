/* =========================================
   HAPA MINI FIGMA - PropertiesPanel
   frontend/pages/editor/PropertiesPanel.js
========================================= */

/**
 * PropertiesPanel - inspector object terpilih
 * seperti Figma right sidebar properties
 */

export default function PropertiesPanel({
    canvasStore,
    selectionStore
}) {
    /* =========================
       GET SELECTED OBJECT
    ========================= */

    function getSelectedObject() {
        const selected =
            selectionStore?.getState()
                ?.selectedIds || [];

        if (selected.length === 0)
            return null;

        return canvasStore.getObject(
            selected[0]
        );
    }

    /* =========================
       UPDATE OBJECT
    ========================= */

    function update(prop, value) {
        const obj = getSelectedObject();

        if (!obj) return;

        canvasStore.updateObject(obj.id, {
            [prop]: value
        });
    }

    /* =========================
       RENDER INPUT FIELD
    ========================= */

    function renderInput(label, prop, value) {
        return `
        <div class="prop-group">

            <label>${label}</label>

            <input type="text"
                value="${value || ""}"
                oninput="window.__updateProp('${prop}', this.value)"
            />

        </div>
        `;
    }

    /* =========================
       RENDER
    ========================= */

    const obj = getSelectedObject();

    return `
<div class="properties-panel">

    <div class="panel-title">
        ⚙️ Properties
    </div>

    ${
        !obj
            ? `
        <div class="empty-state">
            Select an object
        </div>
    `
            : `
        <div class="properties-content">

            <!-- ID -->
            ${renderInput(
                "ID",
                "id",
                obj.id
            )}

            <!-- NAME -->
            ${renderInput(
                "Name",
                "name",
                obj.name
            )}

            <!-- POSITION X -->
            ${renderInput(
                "X",
                "x",
                obj.x
            )}

            <!-- POSITION Y -->
            ${renderInput(
                "Y",
                "y",
                obj.y
            )}

            <!-- WIDTH -->
            ${renderInput(
                "Width",
                "width",
                obj.width
            )}

            <!-- HEIGHT -->
            ${renderInput(
                "Height",
                "height",
                obj.height
            )}

            <!-- COLOR -->
            ${renderInput(
                "Color",
                "fill",
                obj.fill
            )}

            <!-- TEXT -->
            ${
                obj.type === "text"
                    ? renderInput(
                          "Text",
                          "text",
                          obj.text
                      )
                    : ""
            }

        </div>
    `
    }

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTION
========================= */

window.__updateProp = null;
