/* =========================================
   HAPA MINI FIGMA - CANVAS SERVICE
   frontend/services/canvasService.js
========================================= */

class CanvasService {
    constructor(renderer, eventBus) {
        this.renderer = renderer;
        this.eventBus = eventBus;

        this.selectedId = null;
        this.dragging = false;
        this.offset = { x: 0, y: 0 };

        this.init();
    }

    /* =========================
       INIT
    ========================= */

    init() {
        this.bindEvents();
    }

    /* =========================
       EVENT BINDING
    ========================= */

    bindEvents() {
        const canvas = this.renderer?.canvasEl;
        if (!canvas) return;

        // SELECT OBJECT
        canvas.addEventListener("mousedown", (e) => {
            const obj = this.getObjectAt(e.clientX, e.clientY);

            if (obj) {
                this.select(obj.id);
                this.startDrag(e, obj);
            } else {
                this.clearSelection();
            }
        });

        // DRAG MOVE
        window.addEventListener("mousemove", (e) => {
            if (!this.dragging || !this.selectedId) return;

            this.moveSelected(e.clientX, e.clientY);
        });

        // STOP DRAG
        window.addEventListener("mouseup", () => {
            this.dragging = false;
        });

        // ZOOM (optional future)
        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();

            const delta = Math.sign(e.deltaY);

            this.eventBus.emit("canvas:zoom", {
                delta
            });
        });
    }

    /* =========================
       OBJECT DETECTION
    ========================= */

    getObjectAt(x, y) {
        if (!this.renderer?.objects) return null;

        return this.renderer.objects.find(obj => {
            return (
                x >= obj.x &&
                x <= obj.x + obj.width &&
                y >= obj.y &&
                y <= obj.y + obj.height
            );
        });
    }

    /* =========================
       SELECTION
    ========================= */

    select(id) {
        this.selectedId = id;

        this.eventBus.emit("canvas:select", {
            id
        });
    }

    clearSelection() {
        this.selectedId = null;

        this.eventBus.emit("canvas:clear-selection");
    }

    /* =========================
       DRAG SYSTEM
    ========================= */

    startDrag(e, obj) {
        this.dragging = true;

        this.offset.x = e.clientX - obj.x;
        this.offset.y = e.clientY - obj.y;
    }

    moveSelected(x, y) {
        const obj = this.renderer.objects.find(o => o.id === this.selectedId);
        if (!obj) return;

        obj.x = x - this.offset.x;
        obj.y = y - this.offset.y;

        this.renderer.render();

        this.eventBus.emit("canvas:update", {
            id: obj.id,
            x: obj.x,
            y: obj.y
        });
    }

    /* =========================
       OBJECT MANIPULATION
    ========================= */

    addObject(obj) {
        this.renderer.objects.push(obj);

        this.renderer.render();

        this.eventBus.emit("canvas:add-object", obj);
    }

    deleteObject(id) {
        this.renderer.objects = this.renderer.objects.filter(
            obj => obj.id !== id
        );

        this.renderer.render();

        this.eventBus.emit("canvas:delete-object", { id });
    }

    updateObject(id, data) {
        const obj = this.renderer.objects.find(o => o.id === id);
        if (!obj) return;

        Object.assign(obj, data);

        this.renderer.render();

        this.eventBus.emit("canvas:update-object", obj);
    }

    /* =========================
       GET STATE
    ========================= */

    getState() {
        return {
            objects: this.renderer.objects,
            selectedId: this.selectedId
        };
    }
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.CanvasService = CanvasService;
