import React from "react";

/* =========================================
   HAPA MINI FIGMA - CANVAS CONTAINER CORE
   frontend/components/canvas/CanvasContainer.js
========================================= */

import { Canvas } from "./Canvas";

/**
 * CanvasContainer
 * - Layout wrapper editor stage
 * - Host untuk Canvas engine
 * - Bisa ditambah overlay (grid, guides, UI layer)
 */

export const CanvasContainer = ({ editor }) => {
    return (
        <div className="hapa-canvas-container">

            {/* BACKGROUND / STAGE LAYER */}
            <div className="hapa-canvas-stage">

                {/* MAIN CANVAS */}
                <Canvas editor={editor} />

                {/* OVERLAY LAYER (future: selection box, guides, snapping UI) */}
                <div className="hapa-canvas-overlay">

                    {/* Selection overlay layer placeholder */}
                    <div id="selection-overlay-root" />

                    {/* Guide overlay layer placeholder */}
                    <div id="guide-overlay-root" />

                </div>

            </div>

        </div>
    );
};
