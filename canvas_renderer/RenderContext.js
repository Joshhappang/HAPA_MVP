/* =========================================
   HAPA MINI FIGMA - RENDER CONTEXT
   editor/renderer/RenderContext.js
========================================= */

export class RenderContext {

    constructor(options = {}) {

        this.options = {

            pixelRatio: window.devicePixelRatio || 1,

            background: "#ffffff",

            enableAntialias: true,

            ...options
        };

        /* =================================
           STATE
        ================================= */

        this.ctx = null;

        this.canvas = null;

        this.camera = {

            x: 0,

            y: 0,

            zoom: 1
        };

        this.dirty = true;

        this.time = 0;
    }

    /* =====================================
       ATTACH CANVAS CONTEXT
    ===================================== */

    attach(canvas, ctx) {

        this.canvas = canvas;

        this.ctx = ctx;

        return this;
    }

    /* =====================================
       UPDATE CAMERA
    ===================================== */

    setCamera(camera = {}) {

        this.camera.x = camera.x ?? this.camera.x;

        this.camera.y = camera.y ?? this.camera.y;

        this.camera.zoom = camera.zoom ?? this.camera.zoom;

        this.dirty = true;
    }

    /* =====================================
       CLEAR FRAME
    ===================================== */

    clear() {

        if (!this.ctx || !this.canvas) return;

        const ctx = this.ctx;

        const canvas = this.canvas;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.options.background) {

            ctx.fillStyle = this.options.background;

            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    /* =====================================
       APPLY CAMERA TRANSFORM
    ===================================== */

    applyTransform() {

        if (!this.ctx) return;

        const ctx = this.ctx;

        const c = this.camera;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.translate(-c.x, -c.y);

        ctx.scale(c.zoom, c.zoom);
    }

    /* =====================================
       RESIZE
    ===================================== */

    resize(width, height) {

        if (!this.canvas) return;

        const ratio = this.options.pixelRatio;

        this.canvas.width = width * ratio;

        this.canvas.height = height * ratio;

        this.canvas.style.width = width + "px";

        this.canvas.style.height = height + "px";

        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    /* =====================================
       WORLD TO SCREEN
    ===================================== */

    worldToScreen(x, y) {

        const c = this.camera;

        return {

            x: (x - c.x) * c.zoom,

            y: (y - c.y) * c.zoom
        };
    }

    /* =====================================
       SCREEN TO WORLD
    ===================================== */

    screenToWorld(x, y) {

        const c = this.camera;

        return {

            x: x / c.zoom + c.x,

            y: y / c.zoom + c.y
        };
    }

    /* =====================================
       FRAME UPDATE
    ===================================== */

    update(deltaTime) {

        this.time += deltaTime;

        this.dirty = true;
    }

    /* =====================================
       DESTROY
    ===================================== */

    destroy() {

        this.ctx = null;

        this.canvas = null;
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug() {

        console.log("[RenderContext]", {

            camera: this.camera,

            dirty: this.dirty,

            time: this.time
        });
    }
}
