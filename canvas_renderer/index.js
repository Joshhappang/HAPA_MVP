/* =========================================
   HAPA MINI FIGMA - RENDERER INDEX
   editor/renderer/index.js
========================================= */

/* =====================================
   CORE RENDER SYSTEM
===================================== */

export { Renderer } from "./Renderer.js";

/* =====================================
   LOW-LEVEL CORE
===================================== */

export { CanvasRenderer } from "./CanvasRenderer.js";

export { RenderContext } from "./RenderContext.js";

export { RenderQueue } from "./RenderQueue.js";

/* =====================================
   CAMERA SYSTEM
===================================== */

export { CameraRenderer } from "./CameraRenderer.js";

/* =====================================
   DRAW SYSTEMS
===================================== */

export { LayerRenderer } from "./LayerRenderer.js";

export { VectorRenderer } from "./VectorRenderer.js";

export { ShapeRenderer } from "./ShapeRenderer.js";

export { TextRenderer } from "./TextRenderer.js";

export { ImageRenderer } from "./ImageRenderer.js";

/* =====================================
   UI OVERLAYS
===================================== */

export { GridRenderer } from "./GridRenderer.js";

export { SelectionRenderer } from "./SelectionRenderer.js";

/* =====================================
   FACTORY HELPER
===================================== */

import { Renderer } from "./Renderer.js";

/**
 * Create a ready-to-use renderer system
 */
export function createRenderer(options = {}) {

    const renderer = new Renderer(options);

    return {

        renderer,

        mount: (container) => {

            renderer.canvasRenderer.mount(container);

            return renderer;
        },

        start: () => renderer.start(),

        stop: () => renderer.stop(),

        resize: (w, h) => renderer.resize(w, h),

        render: (delta) => renderer.render(delta)
    };
}

/* =====================================
   VERSION
===================================== */

export const RENDERER_VERSION = "1.0.0";
