import React, { useEffect, useRef } from "react";

/* =========================================
   HAPA MINI FIGMA - CANVAS VIEWPORT CORE
   frontend/components/canvas/CanvasViewport.js
========================================= */

import { Camera } from "./Camera";

/**
 * CanvasViewport
 * - Handles pan & zoom space (infinite canvas feel)
 * - Wraps CanvasContainer
 * - Applies camera transform
 */

export const CanvasViewport = ({ children, editor }) => {
    const viewportRef = useRef(null);
    const cameraRef = useRef(null);

    /* =========================
       INIT CAMERA SYSTEM
    ========================= */

    useEffect(() => {
        cameraRef.current = new Camera();

        if (editor) {
            editor.setCamera?.(cameraRef.current);
        }
    }, [editor]);

    /* =========================
       MOUSE WHEEL ZOOM
    ========================= */

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            e.preventDefault();

            const zoomIntensity = 0.0015;

            const camera = cameraRef.current;
            if (!camera) return;

            const delta = -e.deltaY * zoomIntensity;

            camera.zoomAt(
                e.clientX,
                e.clientY,
                delta
            );
        };

        el.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", handleWheel);
        };
    }, []);

    /* =========================
       PAN (DRAG BACKGROUND)
    ========================= */

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        let isPanning = false;
        let lastX = 0;
        let lastY = 0;

        const onMouseDown = (e) => {
            // middle mouse OR space + drag (Figma style future)
            if (e.button !== 1) return;

            isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
        };

        const onMouseMove = (e) => {
            if (!isPanning) return;

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;

            lastX = e.clientX;
            lastY = e.clientY;

            cameraRef.current?.pan(dx, dy);
        };

        const onMouseUp = () => {
            isPanning = false;
        };

        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    /* =========================
       APPLY CAMERA TRANSFORM
    ========================= */

    const getTransformStyle = () => {
        const cam = cameraRef.current;
        if (!cam) return {};

        return {
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.zoom})`,
            transformOrigin: "0 0"
        };
    };

    return (
        <div
            ref={viewportRef}
            className="hapa-canvas-viewport"
        >

            {/* CAMERA TRANSFORM LAYER */}
            <div
                className="hapa-canvas-world"
                style={getTransformStyle()}
            >
                {children}
            </div>

        </div>
    );
};
