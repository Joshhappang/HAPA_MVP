/* =========================================
   HAPA MINI FIGMA - IMAGE RENDERER
   editor/renderer/ImageRenderer.js
========================================= */

export class ImageRenderer {

    constructor(options = {}) {

        this.options = {

            smoothing: true,

            cache: true,

            fallbackColor: "#e0e0e0",

            ...options
        };

        /* =================================
           IMAGE CACHE
        ================================= */

        this.cache = new Map();
    }

    /* =====================================
       MAIN RENDER ENTRY
    ===================================== */

    render(ctx, images = []) {

        if (!ctx || !images.length) return;

        for (const img of images) {

            this.drawImage(ctx, img);
        }
    }

    /* =====================================
       DRAW SINGLE IMAGE
    ===================================== */

    drawImage(ctx, img) {

        if (!img) return;

        const { x = 0, y = 0, width, height, src } = img;

        if (!src) return;

        const image = this._getImage(src);

        if (!image) {

            this._drawPlaceholder(ctx, img);

            return;
        }

        ctx.save();

        /* =================================
           IMAGE SMOOTHING
        ================================= */

        ctx.imageSmoothingEnabled = this.options.smoothing;

        /* =================================
           DRAW IMAGE
        ================================= */

        const w = width || image.width;

        const h = height || image.height;

        ctx.drawImage(image, x, y, w, h);

        ctx.restore();
    }

    /* =====================================
       LOAD / CACHE IMAGE
    ===================================== */

    _getImage(src) {

        if (this.cache.has(src)) {

            return this.cache.get(src);
        }

        const img = new Image();

        img.src = src;

        img.onload = () => {

            this.cache.set(src, img);
        };

        return null;
    }

    /* =====================================
       PLACEHOLDER RENDER
    ===================================== */

    _drawPlaceholder(ctx, img) {

        const { x = 0, y = 0, width = 100, height = 100 } = img;

        ctx.save();

        ctx.fillStyle = this.options.fallbackColor;

        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = "#999";

        ctx.fillText("loading...", x + 10, y + 20);

        ctx.restore();
    }

    /* =====================================
       CLEAR CACHE
    ===================================== */

    clearCache() {

        this.cache.clear();
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug() {

        console.log("[ImageRenderer]", {

            cached: this.cache.size
        });
    }
}
