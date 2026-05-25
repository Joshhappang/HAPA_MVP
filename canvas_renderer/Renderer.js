/* =========================================
   HAPA MINI FIGMA - CORE RENDERER
   editor/renderer/Renderer.js
========================================= */

import { CanvasRenderer } from "./CanvasRenderer.js";
import { LayerRenderer } from "./LayerRenderer.js";
import { VectorRenderer } from "./VectorRenderer.js";
import { GridRenderer } from "./GridRenderer.js";
import { SelectionRenderer } from "./SelectionRenderer.js";
import { CameraRenderer } from "./CameraRenderer.js";

export class Renderer {

    constructor(options = {}) {

        this.options = {

            fps: 60,

            clearColor: "#ffffff",

            enableGrid: true,

            enableSelection: true,

            ...options
        };

        /* =================================
           CORE CANVAS
        ================================= */

        this.canvasRenderer = new CanvasRenderer(options.canvas || {});

        this.ctx = this.canvasRenderer.getContext();

        /* =================================
           SUB RENDERERS
        ================================= */

        this.layerRenderer = new LayerRenderer();

        this.vectorRenderer = new VectorRenderer();

        this.gridRenderer = new GridRenderer();

        this.selectionRenderer = new SelectionRenderer();

        this.cameraRenderer = new CameraRenderer();

        /* =================================
           STATE
        ================================= */

        this.editor = null;

        this.running = false;

        this.lastTime = 0;

        this.frameId = null;
    }

    /* =====================================
       ATTACH EDITOR
    ===================================== */

    attach(editor) {

        this.editor = editor;

        return this;
    }

    /* =====================================
       START RENDER LOOP
    ===================================== */

    start() {

        if (this.running) return;

        this.running = true;

        this.lastTime = performance.now();

        this._loop();
    }

    /* =====================================
       STOP RENDER LOOP
    ===================================== */

    stop() {

        this.running = false;

        cancelAnimationFrame(this.frameId);
    }

    /* =====================================
       MAIN LOOP
    ===================================== */

    _loop = (time = performance.now()) => {

        if (!this.running) return;

        const deltaTime = time - this.lastTime;

        this.lastTime = time;

        this.render(deltaTime);

        this.frameId =
            requestAnimationFrame(this._loop);
    };

    /* =====================================
       RENDER FRAME
    ===================================== */

    render(deltaTime = 16.67) {

        if (!this.editor) return;

        const ctx = this.ctx;

        const canvas = this.canvasRenderer.canvas;

        /* =================================
           CLEAR CANVAS
        ================================= */

        ctx.fillStyle = this.options.clearColor;

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* =================================
           CAMERA TRANSFORM
        ================================= */

        this.cameraRenderer.apply(ctx, this.editor.camera);

        /* =================================
           GRID
        ================================= */

        if (this.options.enableGrid) {

            this.gridRenderer.render(
                ctx,
                this.editor
            );
        }

        /* =================================
           LAYERS
        ================================= */

        this.layerRenderer.render(
            ctx,
            this.editor.layers || [],
            this.vectorRenderer
        );

        /* =================================
           SELECTION
        ================================= */

        if (this.options.enableSelection) {

            this.selectionRenderer.render(
                ctx,
                this.editor.selection || []
            );
        }

        /* =================================
           CUSTOM HOOK
        ================================= */

        if (typeof this.editor.onRender === "function") {

            this.editor.onRender(ctx, deltaTime);
        }
    }

    /* =====================================
       RESIZE
    ===================================== */

    resize(width, height) {

        this.canvasRenderer.resize(width, height);
    }

    /* =====================================
       DESTROY
    ===================================== */

    destroy() {

        this.stop();

        this.editor = null;
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug() {

        console.log("[Renderer]", {

            running: this.running,

            fps: this.options.fps
        });
    }
}
