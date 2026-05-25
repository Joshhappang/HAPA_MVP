/* =========================================
   HAPA MINI FIGMA - RENDER LOOP ENGINE
   frontend/editor/canvas/RenderLoop.js
========================================= */

export class RenderLoop {
    constructor(engine) {
        this.engine = engine;

        this.running = false;

        this.lastTime = 0;

        this.rafId = null;

        // bind agar aman event loop
        this.loop = this.loop.bind(this);
    }

    /* =========================
       START LOOP
    ========================= */

    start() {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();

        this.rafId = requestAnimationFrame(this.loop);
    }

    /* =========================
       MAIN LOOP
    ========================= */

    loop(currentTime) {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // UPDATE ENGINE LOGIC
        this.engine.update(deltaTime);

        // GET CANVAS CONTEXT
        const ctx = this.engine.container?.getContext?.("2d");

        if (ctx) {
            // RENDER ENGINE
            this.engine.render(ctx);
        }

        this.rafId = requestAnimationFrame(this.loop);
    }

    /* =========================
       STOP LOOP
    ========================= */

    stop() {
        this.running = false;

        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /* =========================
       PAUSE (soft stop)
    ========================= */

    pause() {
        this.stop();
    }

    /* =========================
       RESUME
    ========================= */

    resume() {
        this.start();
    }

    /* =========================
       TOGGLE
    ========================= */

    toggle() {
        if (this.running) {
            this.stop();
        } else {
            this.start();
        }
    }
}
