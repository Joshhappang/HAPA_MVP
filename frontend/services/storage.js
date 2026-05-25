/* =========================================
   HAPA MINI FIGMA - STORAGE SERVICE
   frontend/services/storage.js
========================================= */

class Storage {
    constructor(prefix = "hapa_") {
        this.prefix = prefix;
    }

    /* =========================
       KEY HANDLER
    ========================= */

    _key(key) {
        return this.prefix + key;
    }

    /* =========================
       SAVE / LOAD PROJECT
    ========================= */

    saveProject(data) {
        try {
            const payload = {
                ...data,
                savedAt: Date.now()
            };

            localStorage.setItem(
                this._key("project"),
                JSON.stringify(payload)
            );

            return true;
        } catch (err) {
            console.error("[HAPA STORAGE] saveProject error:", err);
            return false;
        }
    }

    loadProject() {
        try {
            const data = localStorage.getItem(this._key("project"));

            if (!data) return null;

            return JSON.parse(data);
        } catch (err) {
            console.error("[HAPA STORAGE] loadProject error:", err);
            return null;
        }
    }

    /* =========================
       AUTOSAVE (LIGHTWEIGHT)
    ========================= */

    autosave(state) {
        try {
            const payload = {
                ...state,
                autosavedAt: Date.now()
            };

            localStorage.setItem(
                this._key("autosave"),
                JSON.stringify(payload)
            );

            return true;
        } catch (err) {
            console.error("[HAPA STORAGE] autosave error:", err);
            return false;
        }
    }

    loadAutosave() {
        try {
            const data = localStorage.getItem(this._key("autosave"));

            if (!data) return null;

            return JSON.parse(data);
        } catch (err) {
            console.error("[HAPA STORAGE] loadAutosave error:", err);
            return null;
        }
    }

    /* =========================
       CLEAR STORAGE
    ========================= */

    clearProject() {
        localStorage.removeItem(this._key("project"));
    }

    clearAutosave() {
        localStorage.removeItem(this._key("autosave"));
    }

    clearAll() {
        this.clearProject();
        this.clearAutosave();
    }

    /* =========================
       GENERIC STORAGE (FUTURE USE)
    ========================= */

    set(key, value) {
        try {
            localStorage.setItem(
                this._key(key),
                JSON.stringify(value)
            );
        } catch (err) {
            console.error("[HAPA STORAGE] set error:", err);
        }
    }

    get(key) {
        try {
            const data = localStorage.getItem(this._key(key));
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error("[HAPA STORAGE] get error:", err);
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(this._key(key));
    }
}

/* =========================================
   EXPORT GLOBAL
========================================= */

window.Storage = Storage;
