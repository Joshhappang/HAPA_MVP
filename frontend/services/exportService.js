/* =========================================
   HAPA MINI FIGMA - EXPORT SERVICE
   frontend/services/exportService.js
========================================= */

class ExportService {
    constructor(renderer, canvasService) {
        this.renderer = renderer;
        this.canvasService = canvasService;
    }

    /* =========================
       EXPORT AS JSON (PROJECT FILE)
    ========================= */

    exportJSON() {
        try {
            const state = {
                objects: this.renderer.objects || [],
                zoom: this.renderer.zoom || 1,
                offsetX: this.renderer.offsetX || 0,
                offsetY: this.renderer.offsetY || 0,
                exportedAt: Date.now()
            };

            const blob = new Blob(
                [JSON.stringify(state, null, 2)],
                { type: "application/json" }
            );

            this._download(blob, "hapa-project.json");

            return true;

        } catch (err) {
            console.error("[HAPA EXPORT JSON ERROR]", err);
            return false;
        }
    }

    /* =========================
       EXPORT AS IMAGE (CANVAS SNAPSHOT)
    ========================= */

    exportPNG() {
        try {
            const canvas = this.renderer?.canvasEl;
            if (!canvas) return false;

            const dataURL = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "hapa-canvas.png";
            link.click();

            return true;

        } catch (err) {
            console.error("[HAPA EXPORT PNG ERROR]", err);
            return false;
        }
    }

    /* =========================
       EXPORT SELECTED OBJECT ONLY
    ========================= */

    exportSelected() {
        try {
            const selectedId = this.canvasService?.selectedId;
            if (!selectedId) return false;

            const obj = this.renderer.objects.find(o => o.id === selectedId);
            if (!obj) return false;

            const blob = new Blob(
                [JSON.stringify(obj, null, 2)],
                { type: "application/json" }
            );

            this._download(blob, `hapa-object-${selectedId}.json`);

            return true;

        } catch (err) {
            console.error("[HAPA EXPORT SELECTED ERROR]", err);
            return false;
        }
    }

    /* =========================
       EXPORT FULL PROJECT PACKAGE
    ========================= */

    exportPackage() {
        try {
            const packageData = {
                project: {
                    objects: this.renderer.objects || [],
                    zoom: this.renderer.zoom,
                    offsetX: this.renderer.offsetX,
                    offsetY: this.renderer.offsetY
                },
                meta: {
                    name: "HAPA Project",
                    version: "1.0.0",
                    createdAt: Date.now()
                }
            };

            const blob = new Blob(
                [JSON.stringify(packageData, null, 2)],
                { type: "application/json" }
            );

            this._download(blob, "hapa-package.json");

            return true;

        } catch (err) {
            console.error("[HAPA EXPORT PACKAGE ERROR]", err);
            return false;
        }
    }

    /* =========================
       DOWNLOAD HELPER
    ========================= */

    _download(blob, filename) {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.ExportService = ExportService;
