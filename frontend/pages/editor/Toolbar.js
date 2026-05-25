/* =========================================
   HAPA MINI FIGMA - Toolbar
   frontend/pages/editor/Toolbar.js
========================================= */

/**
 * Toolbar - alat utama editor (Figma-like tools)
 * select, rect, text, pen, hand, zoom, AI
 */

export default function Toolbar({
    uiStore,
    canvasStore,
    aiStore
}) {
    /* =========================
       TOOL SELECTOR
    ========================= */

    function setTool(tool) {
        uiStore?.setTool(tool);
    }

    /* =========================
       AI QUICK ACTION
    ========================= */

    function openAI() {
        uiStore?.openModal?.("ai_command");
        aiStore?.setMode?.("assist");
    }

    /* =========================
       ZOOM CONTROLS
    ========================= */

    function zoomIn() {
        canvasStore.setZoom(
            canvasStore.getZoom() + 0.1
        );
    }

    function zoomOut() {
        canvasStore.setZoom(
            canvasStore.getZoom() - 0.1
        );
    }

    function resetZoom() {
        canvasStore.setZoom(1);
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="toolbar">

    <!-- LEFT TOOL GROUP -->
    <div class="toolbar-group left">

        <button onclick="window.__setTool('select')">
            🖱 Select
        </button>

        <button onclick="window.__setTool('rect')">
            ▭ Rect
        </button>

        <button onclick="window.__setTool('text')">
            T Text
        </button>

        <button onclick="window.__setTool('pen')">
            ✏ Pen
        </button>

    </div>

    <!-- MIDDLE TOOL GROUP -->
    <div class="toolbar-group center">

        <button onclick="window.__zoomOut()">
            -
        </button>

        <button onclick="window.__resetZoom()">
            100%
        </button>

        <button onclick="window.__zoomIn()">
            +
        </button>

    </div>

    <!-- RIGHT TOOL GROUP -->
    <div class="toolbar-group right">

        <button onclick="window.__openAI()">
            🤖 AI
        </button>

        <button>
            🔗 Share
        </button>

        <button>
            💾 Save
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__setTool = null;
window.__openAI = null;
window.__zoomIn = null;
window.__zoomOut = null;
window.__resetZoom = null;
