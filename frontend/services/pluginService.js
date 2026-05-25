/* =========================================
   HAPA MINI FIGMA - PLUGIN SERVICE
   frontend/services/pluginService.js
========================================= */

class PluginService {
    constructor(eventBus, apiClient) {
        this.eventBus = eventBus;
        this.api = apiClient;

        this.plugins = new Map();
        this.hooks = {};
    }

    /* =========================
       REGISTER PLUGIN
    ========================= */

    register(plugin) {
        if (!plugin || !plugin.name) {
            console.warn("[HAPA PLUGIN] Invalid plugin");
            return false;
        }

        this.plugins.set(plugin.name, plugin);

        // init plugin if exists
        if (typeof plugin.init === "function") {
            plugin.init({
                eventBus: this.eventBus,
                api: this.api,
                registerHook: this.registerHook.bind(this)
            });
        }

        this.eventBus?.emit("plugin:registered", {
            name: plugin.name
        });

        console.log(`[HAPA PLUGIN] Registered: ${plugin.name}`);

        return true;
    }

    /* =========================
       UNREGISTER PLUGIN
    ========================= */

    unregister(name) {
        if (!this.plugins.has(name)) return false;

        const plugin = this.plugins.get(name);

        if (plugin && typeof plugin.destroy === "function") {
            plugin.destroy();
        }

        this.plugins.delete(name);

        this.eventBus?.emit("plugin:unregistered", {
            name
        });

        console.log(`[HAPA PLUGIN] Unregistered: ${name}`);

        return true;
    }

    /* =========================
       LIST PLUGINS
    ========================= */

    list() {
        return Array.from(this.plugins.keys());
    }

    /* =========================
       HOOK SYSTEM
    ========================= */

    registerHook(eventName, callback) {
        if (!this.hooks[eventName]) {
            this.hooks[eventName] = [];
        }

        this.hooks[eventName].push(callback);
    }

    runHook(eventName, data) {
        if (!this.hooks[eventName]) return data;

        let modified = data;

        this.hooks[eventName].forEach(cb => {
            try {
                modified = cb(modified);
            } catch (err) {
                console.error(`[HAPA PLUGIN HOOK ERROR] ${eventName}`, err);
            }
        });

        return modified;
    }

    /* =========================
       EXECUTE PLUGIN ACTION
    ========================= */

    execute(name, action, payload) {
        const plugin = this.plugins.get(name);

        if (!plugin) {
            console.warn(`[HAPA PLUGIN] Not found: ${name}`);
            return null;
        }

        if (typeof plugin[action] === "function") {
            return plugin[action](payload);
        }

        console.warn(`[HAPA PLUGIN] Action not found: ${action}`);
        return null;
    }

    /* =========================
       BROADCAST EVENT TO PLUGINS
    ========================= */

    broadcast(eventName, data) {
        this.plugins.forEach(plugin => {
            if (typeof plugin.onEvent === "function") {
                try {
                    plugin.onEvent(eventName, data);
                } catch (err) {
                    console.error("[HAPA PLUGIN EVENT ERROR]", err);
                }
            }
        });
    }
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.PluginService = PluginService;
