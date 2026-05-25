/* =========================================
   HAPA MINI FIGMA - LAYER RENDERER
   editor/renderer/LayerRenderer.js
========================================= */

export class LayerRenderer {

    constructor(options = {}) {

        this.options = {

            sortByZ: true,

            respectVisibility: true,

            respectOpacity: true,

            ...options
        };
    }

    /* =====================================
       MAIN RENDER
    ===================================== */

    render(ctx, layers = [], vectorRenderer) {

        if (!ctx || !layers.length) return;

        const sortedLayers = this.options.sortByZ
            ? this._sortLayers(layers)
            : layers;

        for (const layer of sortedLayers) {

            this.drawLayer(ctx, layer, vectorRenderer);
        }
    }

    /* =====================================
       DRAW SINGLE LAYER
    ===================================== */

    drawLayer(ctx, layer, vectorRenderer) {

        if (!layer) return;

        if (this.options.respectVisibility && layer.visible === false) {

            return;
        }

        ctx.save();

        /* =================================
           OPACITY
        ================================= */

        if (this.options.respectOpacity) {

            ctx.globalAlpha =
                layer.opacity ?? 1;
        }

        /* =================================
           BLEND MODE
        ================================= */

        if (layer.blendMode) {

            ctx.globalCompositeOperation =
                layer.blendMode;
        }

        /* =================================
           RENDER VECTORS IN LAYER
        ================================= */

        if (Array.isArray(layer.vectors) && vectorRenderer) {

            vectorRenderer.render(ctx, layer.vectors);
        }

        ctx.restore();
    }

    /* =====================================
       SORT LAYERS
    ===================================== */

    _sortLayers(layers) {

        return [...layers].sort((a, b) => {

            const za = a.zIndex ?? 0;

            const zb = b.zIndex ?? 0;

            return za - zb;
        });
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug(layers) {

        console.log("[LayerRenderer]", {

            count: layers.length
        });
    }
}
