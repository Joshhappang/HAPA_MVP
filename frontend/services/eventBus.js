/* =========================================
   HAPA MINI FIGMA - EVENT BUS SYSTEM
   frontend/services/eventBus.js
========================================= */

class EventBus {
    constructor() {
        this.events = {};
    }

    /* =========================
       SUBSCRIBE (LISTENER)
    ========================= */

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    /* =========================
       UNSUBSCRIBE
    ========================= */

    off(eventName, callback) {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(
            cb => cb !== callback
        );
    }

    /* =========================
       EMIT EVENT
    ========================= */

    emit(eventName, data = null) {
        if (!this.events[eventName]) return;

        this.events[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (err) {
                console.error(`[HAPA EVENT ERROR] ${eventName}`, err);
            }
        });
    }

    /* =========================
       CLEAR EVENT
    ========================= */

    clear(eventName) {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }

    /* =========================
       DEBUG HELPERS
    ========================= */

    listEvents() {
        return Object.keys(this.events);
    }
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.EventBus = EventBus;
