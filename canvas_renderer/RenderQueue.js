/* =========================================
   HAPA MINI FIGMA - RENDER QUEUE
   editor/renderer/RenderQueue.js
========================================= */

export class RenderQueue {

    constructor(options = {}) {

        this.options = {

            enableBatching: true,

            maxBatchSize: 1000,

            sortByPriority: true,

            ...options
        };

        /* =================================
           QUEUE STORAGE
        ================================= */

        this.queue = [];

        this.dirty = false;
    }

    /* =====================================
       ADD TO QUEUE
    ===================================== */

    add(item, priority = 0) {

        if (!item) return;

        this.queue.push({

            item,

            priority,

            timestamp: performance.now()
        });

        this.dirty = true;
    }

    /* =====================================
       REMOVE FROM QUEUE
    ===================================== */

    remove(item) {

        this.queue =
            this.queue.filter(q => q.item !== item);
    }

    /* =====================================
       CLEAR QUEUE
    ===================================== */

    clear() {

        this.queue = [];

        this.dirty = false;
    }

    /* =====================================
       GET SORTED QUEUE
    ===================================== */

    get() {

        if (!this.dirty) return this.queue;

        let result = this.queue;

        /* =================================
           SORT BY PRIORITY
        ================================= */

        if (this.options.sortByPriority) {

            result = [...result].sort((a, b) => {

                return b.priority - a.priority;
            });
        }

        /* =================================
           LIMIT BATCH SIZE
        ================================= */

        if (this.options.enableBatching) {

            result = result.slice(0, this.options.maxBatchSize);
        }

        this.dirty = false;

        this.queue = result;

        return result;
    }

    /* =====================================
       PROCESS QUEUE
    ===================================== */

    process(callback) {

        const items = this.get();

        for (const entry of items) {

            callback(entry.item);
        }
    }

    /* =====================================
       SIZE
    ===================================== */

    size() {

        return this.queue.length;
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug() {

        console.log("[RenderQueue]", {

            size: this.queue.length,

            dirty: this.dirty
        });
    }
}
