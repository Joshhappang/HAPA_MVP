/* =========================================
   HAPA MINI FIGMA - TOOL STATE CORE
   frontend/components/toolbar/ToolState.js
========================================= */

class ToolStateManager {
    constructor() {
        this.activeTool = "select";

        /* =========================
           LISTENERS (REACTIVE SYSTEM)
        ========================= */

        this.listeners = new Set();

        /* =========================
           TOOL HISTORY (OPTIONAL UX)
        ========================= */

        this.previousTool = null;
    }

    /* =========================
       SET ACTIVE TOOL
    ========================= */

    setActiveTool(tool) {
        if (!tool) return;

        this.previousTool = this.activeTool;
        this.activeTool = tool;

        this.emit();
    }

    /* =========================
       GET ACTIVE TOOL
    ========================= */

    getActiveTool() {
        return this.activeTool;
    }

    /* =========================
       GET PREVIOUS TOOL
    ========================= */

    getPreviousTool() {
        return this.previousTool;
    }

    /* =========================
       RESET TOOL
    ========================= */

    reset() {
        this.setActiveTool("select");
    }

    /* =========================
       SUBSCRIBE (REACTIVE SYSTEM)
    ========================= */

    subscribe(callback) {
        this.listeners.add(callback);

        // return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    /* =========================
       EMIT CHANGES
    ========================= */

    emit() {
        this.listeners.forEach(cb => {
            try {
                cb(this.activeTool);
            } catch (err) {
                console.error("[ToolState] Listener error:", err);
            }
        });
    }

    /* =========================
       DEBUG STATE
    ========================= */

    debug() {
        return {
            activeTool: this.activeTool,
            previousTool: this.previousTool,
            listeners: this.listeners.size
        };
    }
}

/* =========================
   SINGLETON EXPORT (GLOBAL STATE)
========================= */

export const ToolState = new ToolStateManager();
