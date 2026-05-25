/* =========================================
   HAPA MINI FIGMA - AI SERVICE
   frontend/services/aiService.js
========================================= */

class AIService {
    constructor(apiClient, eventBus) {
        this.api = apiClient;
        this.eventBus = eventBus;

        this.isLoading = false;
    }

    /* =========================
       CORE AI REQUEST HANDLER
    ========================= */

    async _requestAI(endpoint, payload = {}) {
        this.isLoading = true;

        this.eventBus?.emit("ai:loading", true);

        try {
            const res = await this.api.request(endpoint, "POST", payload);

            this.eventBus?.emit("ai:response", res);

            return res;

        } catch (err) {
            console.error("[HAPA AI ERROR]", err);

            this.eventBus?.emit("ai:error", err);

            return {
                success: false,
                error: err.message
            };

        } finally {
            this.isLoading = false;
            this.eventBus?.emit("ai:loading", false);
        }
    }

    /* =========================
       GENERATE LAYOUT FROM PROMPT
    ========================= */

    async generateLayout(prompt) {
        return this._requestAI("/api/ai/generate-layout", {
            prompt
        });
    }

    /* =========================
       DESIGN ENHANCEMENT
    ========================= */

    async enhanceDesign(selectionData) {
        return this._requestAI("/api/ai/enhance", {
            data: selectionData
        });
    }

    /* =========================
       AI ASSIST (GENERAL CHAT STYLE)
    ========================= */

    async askAI(message, context = {}) {
        return this._requestAI("/api/ai/ask", {
            message,
            context
        });
    }

    /* =========================
       SMART SUGGESTIONS
    ========================= */

    async suggestLayout(canvasState) {
        return this._requestAI("/api/ai/suggest", {
            state: canvasState
        });
    }

    /* =========================
       AUTO ARRANGE
    ========================= */

    async autoArrange(objects) {
        return this._requestAI("/api/ai/auto-arrange", {
            objects
        });
    }

    /* =========================
       STATUS CHECK
    ========================= */

    isBusy() {
        return this.isLoading;
    }
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.AIService = AIService;
