/* =========================================
   HAPA MINI FIGMA - API SERVICE
   frontend/services/api.js
========================================= */

class APIClient {
    constructor(baseURL = "") {
        this.baseURL = baseURL;

        this.defaultHeaders = {
            "Content-Type": "application/json"
        };
    }

    /* =========================
       CORE REQUEST HANDLER
    ========================= */

    async request(endpoint, method = "GET", data = null) {
        const url = this.baseURL + endpoint;

        const options = {
            method,
            headers: this.defaultHeaders
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const res = await fetch(url, options);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            return await res.json();

        } catch (err) {
            console.error("[HAPA API ERROR]", err);
            return {
                success: false,
                error: err.message
            };
        }
    }

    /* =========================
       PROJECT API
    ========================= */

    saveProject(projectData) {
        return this.request("/api/project/save", "POST", projectData);
    }

    loadProject(projectId) {
        return this.request(`/api/project/load/${projectId}`, "GET");
    }

    listProjects() {
        return this.request("/api/project/list", "GET");
    }

    deleteProject(projectId) {
        return this.request(`/api/project/delete/${projectId}`, "DELETE");
    }

    /* =========================
       AI API
    ========================= */

    generateLayout(prompt) {
        return this.request("/api/ai/generate-layout", "POST", {
            prompt
        });
    }

    enhanceDesign(data) {
        return this.request("/api/ai/enhance", "POST", data);
    }

    /* =========================
       CANVAS API (future sync)
    ========================= */

    syncCanvas(state) {
        return this.request("/api/canvas/sync", "POST", state);
    }

    /* =========================
       HEALTH CHECK
    ========================= */

    ping() {
        return this.request("/api/health", "GET");
    }
}

/* =========================================
   EXPORT GLOBAL (for HAPA app.js usage)
========================================= */

window.APIClient = APIClient;
