/* =========================================
   HAPA MINI FIGMA - CAMERA SYSTEM
   frontend/editor/canvas/Camera.js
========================================= */

export class Camera {
    constructor() {
        // posisi kamera (pan)
        this.x = 0;
        this.y = 0;

        // zoom level
        this.zoom = 1;

        // batas zoom
        this.minZoom = 0.1;
        this.maxZoom = 5;

        // target (optional smooth animation)
        this.targetX = 0;
        this.targetY = 0;
        this.targetZoom = 1;

        this.smooth = 0.15; // smoothing factor
    }

    /* =========================
       PAN CAMERA
    ========================= */

    pan(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /* =========================
       ZOOM CAMERA
    ========================= */

    setZoom(zoom) {
        this.zoom = this.clamp(zoom, this.minZoom, this.maxZoom);
    }

    zoomAt(factor, centerX = 0, centerY = 0) {
        const newZoom = this.zoom * factor;

        const clampedZoom = this.clamp(newZoom, this.minZoom, this.maxZoom);

        // adjust position so zoom happens at cursor point
        const scale = clampedZoom / this.zoom;

        this.x = centerX - (centerX - this.x) * scale;
        this.y = centerY - (centerY - this.y) * scale;

        this.zoom = clampedZoom;
    }

    /* =========================
       WORLD ↔ SCREEN TRANSFORM
    ========================= */

    worldToScreen(x, y) {
        return {
            x: (x + this.x) * this.zoom,
            y: (y + this.y) * this.zoom,
        };
    }

    screenToWorld(x, y) {
        return {
            x: x / this.zoom - this.x,
            y: y / this.zoom - this.y,
        };
    }

    /* =========================
       SMOOTH ANIMATION UPDATE
    ========================= */

    update() {
        this.x += (this.targetX - this.x) * this.smooth;
        this.y += (this.targetY - this.y) * this.smooth;
        this.zoom += (this.targetZoom - this.zoom) * this.smooth;
    }

    /* =========================
       CENTER VIEW
    ========================= */

    centerOn(x, y, canvasWidth = 0, canvasHeight = 0) {
        this.x = -x + canvasWidth / (2 * this.zoom);
        this.y = -y + canvasHeight / (2 * this.zoom);
    }

    /* =========================
       RESET CAMERA
    ========================= */

    reset() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }

    /* =========================
       GET VIEW MATRIX (FOR RENDERER)
    ========================= */

    getTransform() {
        return {
            x: this.x,
            y: this.y,
            zoom: this.zoom,
        };
    }

    /* =========================
       UTILS
    ========================= */

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
}
