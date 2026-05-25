/* =========================================
   HAPA MINI FIGMA - EditorLayout
   frontend/pages/editor/EditorLayout.js
========================================= */

/**
 * EditorLayout - struktur layout utama editor
 * (Layers | Canvas | Properties)
 */

export default function EditorLayout({
    sidebar,
    canvas,
    properties,
    toolbar,
    aiBar
}) {
    return `
<div class="editor-layout">

    <!-- =========================
         TOP TOOLBAR
    ========================== -->
    <header class="editor-topbar">
        ${toolbar || `
            <div class="toolbar-left">
                <button>Select</button>
                <button>Rect</button>
                <button>Text</button>
                <button>Pen</button>
            </div>

            <div class="toolbar-center">
                <span>HAPA Editor</span>
            </div>

            <div class="toolbar-right">
                <button>Undo</button>
                <button>Redo</button>
                <button>Share</button>
            </div>
        `}
    </header>

    <!-- =========================
         MAIN EDITOR AREA
    ========================== -->
    <div class="editor-body">

        <!-- LEFT PANEL: LAYERS -->
        <aside class="editor-sidebar">
            ${sidebar || `
                <div class="panel-title">
                    📚 Layers
                </div>

                <div class="panel-content">
                    No layers yet
                </div>
            `}
        </aside>

        <!-- CENTER: CANVAS -->
        <main class="editor-canvas-area">
            ${canvas || `
                <div class="canvas-placeholder">
                    Canvas Area
                </div>
            `}
        </main>

        <!-- RIGHT PANEL: PROPERTIES -->
        <aside class="editor-properties">
            ${properties || `
                <div class="panel-title">
                    ⚙️ Properties
                </div>

                <div class="panel-content">
                    Select an object
                </div>
            `}
        </aside>

    </div>

    <!-- =========================
         AI COMMAND BAR
    ========================== -->
    <footer class="editor-ai-bar">
        ${aiBar || `
            <input type="text"
                   placeholder="Ask AI to edit design..."
                   />
            <button>Run AI</button>
        `}
    </footer>

</div>
    `;
}
