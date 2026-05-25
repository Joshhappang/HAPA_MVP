import React, { useEffect, useRef } from "react";

/* =========================================
   HAPA MINI FIGMA - CANVAS ENTRY CORE
   frontend/components/canvas/Canvas.js
========================================= */

import { CanvasEngine } from "./CanvasEngine";
import { CanvasRenderer } from "./CanvasRenderer";
import { CanvasEvents } from "./CanvasEvents";
import { RenderLoop } from "./RenderLoop";
import { Camera } from "./Camera";
import { GridSystem } from "./GridSystem";

export const Canvas = ({ editor }) => {
    const canvasRef = useRef(null);

    const engineRef = useRef(null);
    const rendererRef = useRef(null);
    const eventsRef = useRef(null);
    const loopRef = useRef(null);
    const cameraRef = useRef(null);

    /* =========================
       INIT CANVAS SYSTEM
    ========================= */

    useEffect(() => {
        if (!canvasRef.current) return;

        // CAMERA
        cameraRef.current = new Camera();

        // ENGINE
        engineRef.current = new CanvasEngine(editor);

        // RENDERER
        rendererRef.current = new CanvasRenderer({
            engine: engineRef.current,
            camera: cameraRef.current,
            canvas: canvasRef.current
        });

        // EVENTS
        eventsRef.current = new CanvasEvents({
            canvas: canvasRef.current,
            engine: engineRef.current,
            camera: cameraRef.current
        });

        // GRID (optional visual helper)
        const grid = new GridSystem();

        // RENDER LOOP
        loopRef.current = new RenderLoop(() => {
            const ctx = rendererRef.current;

            if (!ctx) return;

            ctx.clear();
            ctx.drawGrid?.(grid);
            ctx.render();
        });

        loopRef.current.start();

        return () => {
            loopRef.current?.stop();
            eventsRef.current?.destroy?.();
        };
    }, [editor]);

    /* =========================
       SYNC EDITOR → ENGINE
    ========================= */

    useEffect(() => {
        if (!engineRef.current || !editor) return;

        engineRef.current.setEditor(editor);
    }, [editor]);

    return (
        <div className="hapa-canvas-wrapper">
            <canvas
                ref={canvasRef}
                className="hapa-canvas"
            />
        </div>
    );
};
