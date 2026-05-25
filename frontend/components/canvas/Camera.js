/* =========================================
   HAPA MINI FIGMA - CAMERA CORE ENGINE
   frontend/components/canvas/Camera.js
========================================= */

export class Camera {
    constructor() {
        /* =========================
           POSITION STATE
        ========================= */

        this.x = 0;
        this.y = 0;

        /* =========================
           ZOOM STATE
        ========================= */

        this.zoom = 1;

        /* =========================
           LIMITS
        ========================= */

        this.minZoom = 0.1;
        this.maxZoom = 10;

        /* =========================
           INTERNAL STATE
        ========================= */

        this.listeners = new Set();
    }

    /* =========================
       PAN SYSTEM
    ========================= */

    pan(dx, dy) {
        this.x += dx;
        this.y += dy;

        this.emit();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.emit();
    }

    /* =========================
       ZOOM SYSTEM
    ========================= */

    setZoom(zoom) {
        this.zoom = this.clamp(zoom, this.minZoom, this.maxZoom);
        this.emit();
    }

    zoomBy(delta) {
        this.setZoom(this.zoom + delta);
    }

    /* =========================
       ZOOM AT CURSOR (Figma-like)
    ========================= */

    zoomAt(clientX, clientY, delta) {
        const prevZoom = this.zoom;

        const newZoom = this.clamp(
            this.zoom + delta,
            this.minZoom,
            this.maxZoom
        );

        // Convert screen → world
        const scale = newZoom / prevZoom;

        this.x = clientX - (clientX - this.x) * scale;
        this.y = clientY - (clientY - this.y) * scale;

        this.zoom = newZoom;

        this.emit();
    }

    /* =========================
       RESET VIEW
    ========================= */

    reset() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;

        this.emit();
    }

    /* =========================
       UTILITIES
    ========================= */

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /* =========================
       WORLD TRANSFORM HELPERS
    ========================= */

    worldToScreen(x, y) {
        return {
            x: x * this.zoom + this.x,
            y: y * this.zoom + this.y
        };
    }

    screenToWorld(x, y) {
        return {
            x: (x - this.x) / this.zoom,
            y: (y - this.y) / this.zoom
        };
    }

    /* =========================
       EVENT SYSTEM
    ========================= */

    subscribe(fn) {
        this.listeners.add(fn);

        return () => {
            this.listeners.delete(fn);
        };
    }

    emit() {
        const state = {
            x: this.x,
            y: this.y,
            zoom: this.zoom
        };

        this.listeners.forEach(fn => fn(state));
    }
}
