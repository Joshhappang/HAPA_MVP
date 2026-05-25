/* =========================================
   HAPA MINI FIGMA - CAMERA RENDERER
   editor/renderer/CameraRenderer.js
========================================= */

export class CameraRenderer {

    constructor(options = {}) {

        this.options = {

            smooth: false,

            smoothingFactor: 0.1,

            ...options
        };
    }

    /* =====================================
       APPLY CAMERA TRANSFORM
    ===================================== */

    apply(ctx, camera = {}) {

        if (!ctx) return;

        const x = camera.x || 0;

        const y = camera.y || 0;

        const zoom = camera.zoom ?? 1;

        /* =================================
           RESET TRANSFORM FIRST
        ================================= */

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        /* =================================
           APPLY CAMERA
        ================================= */

        ctx.translate(-x, -y);

        ctx.scale(zoom, zoom);
    }

    /* =====================================
       RESET CAMERA
    ===================================== */

    reset(ctx) {

        if (!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* =====================================
       SCREEN → WORLD
    ===================================== */

    screenToWorld(x, y, camera = {}) {

        const zoom = camera.zoom ?? 1;

        return {

            x: x / zoom + (camera.x || 0),

            y: y / zoom + (camera.y || 0)
        };
    }

    /* =====================================
       WORLD → SCREEN
    ===================================== */

    worldToScreen(x, y, camera = {}) {

        const zoom = camera.zoom ?? 1;

        return {

            x: (x - (camera.x || 0)) * zoom,

            y: (y - (camera.y || 0)) * zoom
        };
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug(camera) {

        console.log("[CameraRenderer]", camera);
    }
}
