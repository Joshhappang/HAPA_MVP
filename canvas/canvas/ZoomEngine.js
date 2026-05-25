/* =========================================
   HAPA MINI FIGMA - ZOOM ENGINE
   frontend/editor/canvas/ZoomEngine.js
========================================= */

export class ZoomEngine {
    constructor(engine) {
        this.engine = engine;

        this.minZoom = 0.1;
        this.maxZoom = 5;

        this.zoomSpeed = 0.0012;
    }

    /* =========================
       WHEEL ZOOM (PRIMARY)
    ========================= */

    onWheel(e) {
        const camera = this.engine.camera;

        const delta = e.deltaY * this.zoomSpeed;

        const zoomFactor = 1 - delta;

        this.zoomAt(
            zoomFactor,
            e.clientX,
            e.clientY
        );
    }

    /* =========================
       ZOOM AT CURSOR (FIGMA STYLE)
    ========================= */

    zoomAt(scaleFactor, clientX, clientY) {
        const camera = this.engine.camera;

        const oldZoom = camera.zoom || 1;

        let newZoom = oldZoom * scaleFactor;

        // clamp zoom
        newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));

        const rect = this.engine.container.getBoundingClientRect();

        // mouse position in screen space
        const mx = clientX - rect.left;
        const my = clientY - rect.top;

        // convert screen → world before zoom
        const worldBefore = this.screenToWorld(mx, my, camera);

        // apply zoom
        camera.zoom = newZoom;

        // convert screen → world after zoom
        const worldAfter = this.screenToWorld(mx, my, camera);

        // adjust camera position so zoom happens at cursor point
        camera.x += (worldAfter.x - worldBefore.x);
        camera.y += (worldAfter.y - worldBefore.y);

        this.engine.state?.bump?.();
    }

    /* =========================
       SCREEN → WORLD CONVERSION
    ========================= */

    screenToWorld(x, y, camera) {
        const zoom = camera.zoom || 1;

        return {
            x: x / zoom - camera.x,
            y: y / zoom - camera.y,
        };
    }

    /* =========================
       WORLD → SCREEN
    ========================= */

    worldToScreen(x, y, camera) {
        const zoom = camera.zoom || 1;

        return {
            x: (x + camera.x) * zoom,
            y: (y + camera.y) * zoom,
        };
    }

    /* =========================
       SIMPLE ZOOM IN
    ========================= */

    zoomIn(step = 0.1, cx = 0, cy = 0) {
        this.zoomAt(1 + step, cx, cy);
    }

    /* =========================
       SIMPLE ZOOM OUT
    ========================= */

    zoomOut(step = 0.1, cx = 0, cy = 0) {
        this.zoomAt(1 - step, cx, cy);
    }

    /* =========================
       RESET ZOOM
    ========================= */

    reset() {
        const camera = this.engine.camera;

        camera.zoom = 1;
        camera.x = 0;
        camera.y = 0;

        this.engine.state?.bump?.();
    }
}
