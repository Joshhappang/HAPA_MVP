/* =========================================
   HAPA MINI FIGMA - ZOOM ENGINE CORE
   frontend/components/canvas/ZoomEngine.js
========================================= */

export class ZoomEngine {
    constructor({ camera, renderLoop = null }) {
        this.camera = camera;
        this.renderLoop = renderLoop;

        /* =========================
           ZOOM CONFIG
        ========================= */

        this.zoomSpeed = 0.0015;

        this.minZoom = 0.1;
        this.maxZoom = 10;

        this.smoothFactor = 0.12;

        /* =========================
           SMOOTH STATE
        ========================= */

        this.targetZoom = camera.zoom;

        this.isAnimating = false;
    }

    /* =========================
       WHEEL ZOOM (RAW INPUT)
    ========================= */

    onWheel(e, clientX, clientY) {
        e.preventDefault();

        const delta = -e.deltaY * this.zoomSpeed;

        this.zoomAt(clientX, clientY, delta);
    }

    /* =========================
       CORE ZOOM AT CURSOR (FIGMA STYLE)
    ========================= */

    zoomAt(clientX, clientY, deltaZoom) {
        const cam = this.camera;

        const prevZoom = cam.zoom;

        this.targetZoom = this.clamp(
            this.targetZoom + deltaZoom,
            this.minZoom,
            this.maxZoom
        );

        // convert screen → world anchor
        const scale = this.targetZoom / prevZoom;

        cam.x = clientX - (clientX - cam.x) * scale;
        cam.y = clientY - (clientY - cam.y) * scale;

        this.startSmoothZoom();
    }

    /* =========================
       SMOOTH ZOOM ANIMATION
    ========================= */

    startSmoothZoom() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        const animate = () => {
            const cam = this.camera;

            const diff = this.targetZoom - cam.zoom;

            cam.zoom += diff * this.smoothFactor;

            if (Math.abs(diff) < 0.001) {
                cam.zoom = this.targetZoom;
                this.isAnimating = false;
                return;
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    /* =========================
       DIRECT ZOOM CONTROL
    ========================= */

    setZoom(zoom) {
        this.targetZoom = this.clamp(zoom, this.minZoom, this.maxZoom);
        this.camera.setZoom(this.targetZoom);
    }

    zoomIn(step = 0.2) {
        this.setZoom(this.targetZoom + step);
    }

    zoomOut(step = 0.2) {
        this.setZoom(this.targetZoom - step);
    }

    resetZoom() {
        this.setZoom(1);
    }

    /* =========================
       FIT TO SCREEN (Figma feature)
    ========================= */

    fitToScreen(bounds, viewport) {
        if (!bounds || !viewport) return;

        const scaleX = viewport.width / bounds.width;
        const scaleY = viewport.height / bounds.height;

        const zoom = Math.min(scaleX, scaleY) * 0.9;

        this.setZoom(zoom);

        this.camera.x = viewport.width / 2 - bounds.width * zoom / 2;
        this.camera.y = viewport.height / 2 - bounds.height * zoom / 2;
    }

    /* =========================
       UTIL
    ========================= */

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    getZoom() {
        return this.camera.zoom;
    }
}
