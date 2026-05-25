/* =========================================
   HAPA MINI FIGMA - CANVAS ENGINE CORE
   frontend/editor/canvas/CanvasEngine.js
========================================= */

import { Camera } from "./Camera";
import { CanvasState } from "./CanvasState";
import { CanvasRenderer } from "./CanvasRenderer";
import { CanvasEvents } from "./CanvasEvents";
import { RenderLoop } from "./RenderLoop";
import { NodeManager } from "./NodeManager";
import { SelectionEngine } from "./SelectionEngine";
import { DragEngine } from "./DragEngine";
import { ZoomEngine } from "./ZoomEngine";
import { GridSystem } from "./GridSystem";

export class CanvasEngine {
    constructor(container) {
        this.container = container;

        // CORE SYSTEMS
        this.camera = new Camera();
        this.state = new CanvasState();
        this.renderer = new CanvasRenderer(this);
        this.events = new CanvasEvents(this);
        this.renderLoop = new RenderLoop(this);

        // FEATURE SYSTEMS
        this.nodeManager = new NodeManager(this);
        this.selection = new SelectionEngine(this);
        this.drag = new DragEngine(this);
        this.zoom = new ZoomEngine(this);
        this.grid = new GridSystem(this);

        this.init();
    }

    /* =========================
       INIT ENGINE
    ========================= */

    init() {
        this.events.init();
        this.renderLoop.start();
    }

    /* =========================
       UPDATE LOOP ENTRY
    ========================= */

    update(deltaTime) {
        this.camera.update?.(deltaTime);
        this.state.update?.(deltaTime);
    }

    /* =========================
       RENDER ENTRY
    ========================= */

    render(ctx) {
        this.renderer.render(ctx);
    }

    /* =========================
       NODE API (BRIDGE LAYERS)
    ========================= */

    addNode(node) {
        return this.nodeManager.addNode(node);
    }

    updateNode(id, props) {
        return this.nodeManager.updateNode(id, props);
    }

    deleteNode(id) {
        return this.nodeManager.deleteNode(id);
    }

    getNode(id) {
        return this.nodeManager.getNode(id);
    }

    /* =========================
       SELECTION API
    ========================= */

    selectNode(id) {
        return this.selection.select(id);
    }

    clearSelection() {
        return this.selection.clear();
    }

    /* =========================
       CAMERA API
    ========================= */

    pan(dx, dy) {
        this.camera.pan(dx, dy);
    }

    zoomAt(factor, x, y) {
        this.camera.zoomAt(factor, x, y);
    }

    /* =========================
       INTERACTION HOOKS
    ========================= */

    onMouseDown(e) {
        this.drag.onMouseDown?.(e);
        this.selection.onMouseDown?.(e);
    }

    onMouseMove(e) {
        this.drag.onMouseMove?.(e);
    }

    onMouseUp(e) {
        this.drag.onMouseUp?.(e);
    }

    onWheel(e) {
        this.zoom.onWheel?.(e);
    }

    /* =========================
       CONTEXT BRIDGE (LAYERS ↔ CANVAS)
    ========================= */

    setVisibility(id, visible) {
        this.state.setVisibility?.(id, visible);
    }

    setLockState(id, locked) {
        this.state.setLockState?.(id, locked);
    }

    reorderNode(draggedId, targetId) {
        this.nodeManager.reorder?.(draggedId, targetId);
    }

    /* =========================
       CLEANUP
    ========================= */

    destroy() {
        this.renderLoop.stop?.();
        this.events.destroy?.();
    }
}
