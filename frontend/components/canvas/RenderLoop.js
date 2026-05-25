/* =========================================
   HAPA MINI FIGMA - RENDER LOOP CORE
   frontend/components/canvas/RenderLoop.js
========================================= */

export class RenderLoop {
    constructor(callback) {
        this.callback = callback;

        this.running = false;
        this.rafId = null;

        this.lastTime = 0;
        this.fps = 0;
    }

    /* =========================
       START LOOP
    ========================= */

    start() {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();

        const loop = (time) => {
            if (!this.running) return;

            const delta = time - this.lastTime;
            this.lastTime = time;

            this.fps = 1000 / delta;

            // MAIN RENDER CALLBACK
            if (this.callback) {
                this.callback({
                    time,
                    delta,
                    fps: this.fps
                });
            }

            this.rafId = requestAnimationFrame(loop);
        };

        this.rafId = requestAnimationFrame(loop);
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
       PAUSE / RESUME (OPTIONAL)
    ========================= */

    pause() {
        this.stop();
    }

    resume() {
        this.start();
    }

    /* =========================
       GET FPS INFO
    ========================= */

    getFPS() {
        return this.fps;
    }

    /* =========================
       RESET LOOP STATE
    ========================= */

    reset() {
        this.stop();
        this.lastTime = 0;
        this.fps = 0;
    }
}
