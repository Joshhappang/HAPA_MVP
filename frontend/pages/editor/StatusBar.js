/* =========================================
   HAPA MINI FIGMA - StatusBar
   frontend/pages/editor/StatusBar.js
========================================= */

/**
 * StatusBar - info bar bawah editor
 * seperti Figma status bar (zoom, coords, selection, etc)
 */

export default function StatusBar({
    canvasStore,
    selectionStore,
    collaboration
}) {
    /* =========================
       GET STATE INFO
    ========================= */

    function getZoom() {
        return (
            canvasStore?.getZoom?.() || 1
        );
    }

    function getSelectionCount() {
        return (
            selectionStore?.getState()
                ?.selectedIds?.length || 0
        );
    }

    function getCursorPosition() {
        const state =
            canvasStore?.getState?.();

        return state?.cursor || {
            x: 0,
            y: 0
        };
    }

    function getOnlineUsers() {
        return (
            collaboration?.getUsers?.()
                ?.length || 1
        );
    }

    /* =========================
       FORMAT HELPERS
    ========================= */

    function formatZoom() {
        return (
            Math.round(getZoom() * 100) +
            "%"
        );
    }

    function formatCursor() {
        const pos = getCursorPosition();

        return `X: ${Math.round(
            pos.x
        )} Y: ${Math.round(pos.y)}`;
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="status-bar">

    <!-- LEFT -->
    <div class="status-left">

        <span class="status-item">
            🔍 ${formatZoom()}
        </span>

        <span class="status-item">
            📦 ${getSelectionCount()} selected
        </span>

    </div>

    <!-- CENTER -->
    <div class="status-center">

        <span class="status-item">
            ${formatCursor()}
        </span>

    </div>

    <!-- RIGHT -->
    <div class="status-right">

        <span class="status-item">
            👥 ${getOnlineUsers()} online
        </span>

        <span class="status-item">
            💾 Saved
        </span>

    </div>

</div>
    `;
}
