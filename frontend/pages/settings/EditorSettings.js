/* =========================================
   HAPA MINI FIGMA - EditorSettings
   frontend/pages/settings/EditorSettings.js
========================================= */

/**
 * EditorSettings - konfigurasi behavior editor
 * grid, snap, zoom, performance, shortcuts
 */

export default function EditorSettings({
    settingsStore,
    uiStore
}) {
    /* =========================
       GET EDITOR SETTINGS
    ========================= */

    function getEditorSettings() {
        return (
            settingsStore?.getState?.()
                ?.editor || {
                grid: true,
                snap: true,
                snapDistance: 10,
                zoomSpeed: 1,
                showRulers: false,
                performanceMode: "medium",
                showGridSize: 20
            }
        );
    }

    /* =========================
       UPDATE SETTING
    ========================= */

    function update(field, value) {
        const editor = getEditorSettings();

        settingsStore.setState({
            editor: {
                ...editor,
                [field]: value
            }
        });
    }

    /* =========================
       SAVE SETTINGS
    ========================= */

    function save() {
        settingsStore?.save?.();

        uiStore?.notify?.(
            "Editor settings saved",
            "success"
        );
    }

    /* =========================
       RENDER TOGGLE
    ========================= */

    function renderToggle(label, field, value) {
        return `
        <div class="setting-group">

            <label>
                <input type="checkbox"
                    ${value ? "checked" : ""}
                    onchange="window.__updateEditor('${field}', this.checked)"
                />
                ${label}
            </label>

        </div>
        `;
    }

    /* =========================
       RENDER INPUT
    ========================= */

    function renderInput(label, field, value) {
        return `
        <div class="setting-group">

            <label>${label}</label>

            <input type="number"
                value="${value}"
                oninput="window.__updateEditor('${field}', this.value)"
            />

        </div>
        `;
    }

    /* =========================
       RENDER SELECT
    ========================= */

    function renderSelect(label, field, value, options) {
        return `
        <div class="setting-group">

            <label>${label}</label>

            <select onchange="window.__updateEditor('${field}', this.value)">

                ${options
                    .map(
                        opt => `
                    <option value="${opt.value}"
                        ${opt.value === value ? "selected" : ""}>
                        ${opt.label}
                    </option>
                `
                    )
                    .join("")}

            </select>

        </div>
        `;
    }

    /* =========================
       RENDER
    ========================= */

    const editor = getEditorSettings();

    return `
<div class="editor-settings">

    <div class="settings-title">
        🎨 Editor Settings
    </div>

    <!-- GRID -->
    ${renderToggle(
        "Show Grid",
        "grid",
        editor.grid
    )}

    ${renderInput(
        "Grid Size",
        "showGridSize",
        editor.showGridSize
    )}

    <!-- SNAP -->
    ${renderToggle(
        "Snap to Grid",
        "snap",
        editor.snap
    )}

    ${renderInput(
        "Snap Distance",
        "snapDistance",
        editor.snapDistance
    )}

    <!-- ZOOM -->
    ${renderInput(
        "Zoom Speed",
        "zoomSpeed",
        editor.zoomSpeed
    )}

    <!-- RULERS -->
    ${renderToggle(
        "Show Rulers",
        "showRulers",
        editor.showRulers
    )}

    <!-- PERFORMANCE -->
    ${renderSelect(
        "Performance Mode",
        "performanceMode",
        editor.performanceMode,
        [
            { value: "low", label: "Low (Battery Save)" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High (Smooth)" }
        ]
    )}

    <!-- SAVE -->
    <div class="settings-actions">

        <button onclick="window.__saveEditor()">
            Save Settings
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__updateEditor = null;
window.__saveEditor = null;
