/* =========================================
   HAPA MINI FIGMA - EditorPage
   frontend/pages/editor/EditorPage.js
========================================= */

/**
 * EditorPage - inti aplikasi HAPA (Figma engine)
 * menggabungkan canvas + tools + AI + stores
 */

export default function EditorPage({
    router,
    canvasStore,
    selectionStore,
    historyStore,
    uiStore,
    aiStore,
    collaboration,
    hooks
}) {
    /* =========================
       INIT HOOKS
    ========================= */

    const mouse = hooks?.useMouse?.({
        canvasStore,
        selectionStore,
        uiStore
    });

    const keyboard = hooks?.useKeyboard?.({
        selectionStore,
        historyStore,
        canvasStore,
        uiStore,
        aiStore
    });

    const shortcut = hooks?.useShortcut?.({
        keyboard,
        uiStore,
        canvasStore,
        selectionStore,
        historyStore,
        aiStore
    });

    const ui = hooks?.useUI?.(uiStore);

    const collab = hooks?.useCollaboration?.(
        collaboration,
        uiStore?.socket
    );

    /* =========================
       INIT SYSTEM
    ========================= */

    function init() {
        mouse?.init?.();
        keyboard?.init?.();
        shortcut?.init?.();
        collab?.init?.();
    }

    /* =========================
       TOOL HANDLERS
    ========================= */

    function setTool(tool) {
        uiStore.setTool(tool);
    }

    function undo() {
        historyStore.undo();
    }

    function redo() {
        historyStore.redo();
    }

    function deleteSelected() {
        const selected =
            selectionStore.getState()
                .selectedIds;

        selected.forEach(id => {
            canvasStore.removeObject(id);
        });

        selectionStore.clearSelection();
    }

    /* =========================
       AI COMMAND
    ========================= */

    function runAI(prompt) {
        aiStore.setLoading(true);

        aiStore
            .generate(prompt, {
                canvas: canvasStore.getState()
            })
            .then(result => {
                canvasStore.applyAI(result);
            })
            .finally(() => {
                aiStore.setLoading(false);
            });
    }

    /* =========================
       CANVAS ACTIONS
    ========================= */

    function onCanvasClick(e) {
        selectionStore.clearSelection();
    }

    function onCanvasMove(pos) {
        collab?.sendCursor?.(
            pos.x,
            pos.y
        );
    }

    /* =========================
       GLOBAL BRIDGE (UI HOOKS)
    ========================= */

    window.__setTool = setTool;
    window.__undo = undo;
    window.__redo = redo;
    window.__delete = deleteSelected;
    window.__runAI = runAI;

    /* =========================
       INIT CALL
    ========================= */

    init();

    /* =========================
       RENDER
    ========================= */

    return `
<div class="editor-app">

    <!-- TOP TOOLBAR -->
    <div class="editor-toolbar">
        <button onclick="window.__setTool('select')">Select</button>
        <button onclick="window.__setTool('rect')">Rect</button>
        <button onclick="window.__setTool('text')">Text</button>
        <button onclick="window.__setTool('pen')">Pen</button>

        <div class="spacer"></div>

        <button onclick="window.__undo()">Undo</button>
        <button onclick="window.__redo()">Redo</button>
        <button onclick="window.__delete()">Delete</button>
    </div>

    <!-- MAIN EDITOR -->
    <div class="editor-body">

        <!-- LEFT: LAYERS -->
        <div class="editor-left">
            Layers Panel
        </div>

        <!-- CENTER: CANVAS -->
        <div class="editor-canvas"
             onclick="window.__onCanvasClick?.(event)"
             onmousemove="window.__onCanvasMove?.(event)">

            <canvas id="hapa-canvas"></canvas>

        </div>

        <!-- RIGHT: PROPERTIES -->
        <div class="editor-right">
            Properties Panel
        </div>

    </div>

    <!-- AI BAR -->
    <div class="editor-ai-bar">
        <input type="text"
               placeholder="Ask AI to edit design..."
               onkeydown="if(event.key==='Enter') window.__runAI(event.target.value)" />
    </div>

</div>
    `;
}

/* =========================
   GLOBAL CANVAS EVENTS
========================= */

window.__onCanvasClick = null;
window.__onCanvasMove = null;
