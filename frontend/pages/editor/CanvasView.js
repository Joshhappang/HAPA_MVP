/* =========================================
   HAPA MINI FIGMA - CanvasView
   frontend/pages/editor/CanvasView.js
========================================= */

/**
 * CanvasView - renderer utama canvas HAPA
 * handle drawing, zoom, pan, selection
 */

export default function CanvasView({
    canvasStore,
    selectionStore,
    uiStore,
    collaboration
}) {
    let canvas = null;
    let ctx = null;

    let state = {
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        isPanning: false,
        lastX: 0,
        lastY: 0
    };

    /* =========================
       INIT CANVAS
    ========================= */

    function init() {
        canvas = document.getElementById(
            "hapa-canvas"
        );

        if (!canvas) return;

        ctx = canvas.getContext("2d");

        resize();
        render();

        bindEvents();
    }

    /* =========================
       RESIZE CANVAS
    ========================= */

    function resize() {
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /* =========================
       MAIN RENDER LOOP
    ========================= */

    function render() {
        if (!ctx) return;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.save();

        /* =========================
           ZOOM + PAN
        ========================= */

        ctx.scale(state.zoom, state.zoom);
        ctx.translate(
            state.offsetX,
            state.offsetY
        );

        const objects =
            canvasStore?.getState?.()
                ?.objects || [];

        objects.forEach(drawObject);

        ctx.restore();

        requestAnimationFrame(render);
    }

    /* =========================
       DRAW OBJECTS
    ========================= */

    function drawObject(obj) {
        if (!ctx) return;

        switch (obj.type) {
            case "rect":
                ctx.fillStyle =
                    obj.fill || "#2d2dff";

                ctx.fillRect(
                    obj.x,
                    obj.y,
                    obj.width,
                    obj.height
                );
                break;

            case "text":
                ctx.fillStyle =
                    obj.color || "#fff";

                ctx.font =
                    `${obj.size || 16}px Arial`;

                ctx.fillText(
                    obj.text,
                    obj.x,
                    obj.y
                );
                break;

            case "circle":
                ctx.beginPath();

                ctx.arc(
                    obj.x,
                    obj.y,
                    obj.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    obj.fill || "#ff4d4d";

                ctx.fill();
                break;

            default:
                break;
        }
    }

    /* =========================
       MOUSE EVENTS
    ========================= */

    function bindEvents() {
        if (!canvas) return;

        /* CLICK SELECT */
        canvas.addEventListener(
            "click",
            handleClick
        );

        /* DRAG PAN */
        canvas.addEventListener(
            "mousedown",
            startPan
        );

        canvas.addEventListener(
            "mousemove",
            panMove
        );

        canvas.addEventListener(
            "mouseup",
            endPan
        );

        /* ZOOM */
        canvas.addEventListener(
            "wheel",
            handleZoom
        );
    }

    /* =========================
       CLICK SELECT
    ========================= */

    function handleClick(e) {
        const rect =
            canvas.getBoundingClientRect();

        const x =
            (e.clientX - rect.left) /
            state.zoom;

        const y =
            (e.clientY - rect.top) /
            state.zoom;

        const objects =
            canvasStore.getState().objects;

        let selected = null;

        objects.forEach(obj => {
            if (
                x >= obj.x &&
                x <= obj.x + (obj.width || 50) &&
                y >= obj.y &&
                y <= obj.y + (obj.height || 50)
            ) {
                selected = obj.id;
            }
        });

        if (selected) {
            selectionStore.setSelection([
                selected
            ]);
        } else {
            selectionStore.clearSelection();
        }
    }

    /* =========================
       PAN SYSTEM
    ========================= */

    function startPan(e) {
        state.isPanning = true;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
    }

    function panMove(e) {
        if (!state.isPanning) return;

        const dx =
            (e.clientX - state.lastX) /
            state.zoom;

        const dy =
            (e.clientY - state.lastY) /
            state.zoom;

        state.offsetX += dx;
        state.offsetY += dy;

        state.lastX = e.clientX;
        state.lastY = e.clientY;
    }

    function endPan() {
        state.isPanning = false;
    }

    /* =========================
       ZOOM SYSTEM
    ========================= */

    function handleZoom(e) {
        e.preventDefault();

        const delta = e.deltaY * -0.001;

        state.zoom += delta;

        if (state.zoom < 0.3)
            state.zoom = 0.3;

        if (state.zoom > 3)
            state.zoom = 3;
    }

    /* =========================
       INIT CALL
    ========================= */

    init();

    /* =========================
       EXPORT API
    ========================= */

    return {
        init,
        resize,
        render
    };
}
