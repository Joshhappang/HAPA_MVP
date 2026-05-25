/* =========================================
   HAPA MINI FIGMA - CANVAS RENDERER
   editor/renderer/CanvasRenderer.js
========================================= */

export class CanvasRenderer {

    constructor(options = {}) {

        this.options = {

            width: 1920,

            height: 1080,

            pixelRatio: window.devicePixelRatio || 1,

            autoResize: true,

            ...options
        };

        /* =================================
           CREATE CANVAS
        ================================= */

        this.canvas = document.createElement("canvas");

        this.ctx = this.canvas.getContext("2d");

        /* =================================
           INIT SIZE
        ================================= */

        this.resize(
            this.options.width,
            this.options.height
        );

        /* =================================
           AUTO RESIZE
        ================================= */

        if (this.options.autoResize) {

            window.addEventListener(
                "resize",
                () => this._handleResize()
            );
        }
    }

    /* =====================================
       GET CONTEXT
    ===================================== */

    getContext() {

        return this.ctx;
    }

    /* =====================================
       RESIZE CANVAS
    ===================================== */

    resize(width, height) {

        const ratio = this.options.pixelRatio;

        this.canvas.width = width * ratio;

        this.canvas.height = height * ratio;

        this.canvas.style.width = width + "px";

        this.canvas.style.height = height + "px";

        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    /* =====================================
       HANDLE WINDOW RESIZE
    ===================================== */

    _handleResize() {

        if (!this.options.autoResize) return;

        const width = window.innerWidth;

        const height = window.innerHeight;

        this.resize(width, height);
    }

    /* =====================================
       CLEAR CANVAS
    ===================================== */

    clear(color = "transparent") {

        const ctx = this.ctx;

        if (color === "transparent") {

            ctx.clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            return;
        }

        ctx.fillStyle = color;

        ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    /* =====================================
       ATTACH TO DOM
    ===================================== */

    mount(container) {

        if (!container) return;

        container.appendChild(this.canvas);
    }

    /* =====================================
       GET SIZE
    ===================================== */

    getSize() {

        return {

            width: this.canvas.width / this.options.pixelRatio,

            height: this.canvas.height / this.options.pixelRatio
        };
    }

    /* =====================================
       SCREEN TO CANVAS COORDINATES
    ===================================== */

    screenToCanvas(x, y) {

        const rect = this.canvas.getBoundingClientRect();

        return {

            x: x - rect.left,

            y: y - rect.top
        };
    }

    /* =====================================
       DESTROY
    ===================================== */

    destroy() {

        this.canvas.remove();

        this.canvas = null;

        this.ctx = null;
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug() {

        console.log("[CanvasRenderer]", {

            width: this.canvas.width,

            height: this.canvas.height,

            pixelRatio: this.options.pixelRatio
        });
    }
}
