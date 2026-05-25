/* =========================================
   HAPA MINI FIGMA - TOOL SELECTOR CORE
   frontend/components/toolbar/ToolSelector.js
========================================= */

export class ToolSelector {
    constructor(editor) {
        this.editor = editor;

        /* =========================
           ACTIVE TOOL STATE
        ========================= */

        this.activeTool = "select";

        /* =========================
           TOOL REGISTRY (EXTENSIBLE)
        ========================= */

        this.tools = {
            select: this.activateSelect.bind(this),
            move: this.activateMove.bind(this),
            frame: this.activateFrame.bind(this),
            text: this.activateText.bind(this),
            hand: this.activateHand.bind(this)
        };
    }

    /* =========================
       SET ACTIVE TOOL
    ========================= */

    setTool(toolName) {
        if (!this.tools[toolName]) {
            console.warn(`[ToolSelector] Unknown tool: ${toolName}`);
            return;
        }

        this.activeTool = toolName;

        // execute tool behavior
        this.tools[toolName]();

        // sync to editor core
        if (this.editor?.setTool) {
            this.editor.setTool(toolName);
        }
    }

    /* =========================
       GET ACTIVE TOOL
    ========================= */

    getTool() {
        return this.activeTool;
    }

    /* =========================
       SELECT TOOL MODE
    ========================= */

    activateSelect() {
        this.editor.mode = "select";
        this.editor.interactionMode = "default";
    }

    /* =========================
       MOVE TOOL MODE
    ========================= */

    activateMove() {
        this.editor.mode = "move";
        this.editor.interactionMode = "drag";
    }

    /* =========================
       FRAME TOOL MODE
    ========================= */

    activateFrame() {
        this.editor.mode = "frame";
        this.editor.interactionMode = "create-frame";
    }

    /* =========================
       TEXT TOOL MODE
    ========================= */

    activateText() {
        this.editor.mode = "text";
        this.editor.interactionMode = "text-input";
    }

    /* =========================
       HAND TOOL MODE (PAN CAMERA)
    ========================= */

    activateHand() {
        this.editor.mode = "hand";
        this.editor.interactionMode = "pan";
    }

    /* =========================
       RESET TOOL
    ========================= */

    reset() {
        this.setTool("select");
    }
}
