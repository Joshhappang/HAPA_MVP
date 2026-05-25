/* =========================================
   HAPA MINI FIGMA - TEXT RENDERER
   editor/renderer/TextRenderer.js
========================================= */

export class TextRenderer {

    constructor(options = {}) {

        this.options = {

            fontFamily: "Arial",

            fontSize: 16,

            color: "#000000",

            lineHeight: 1.2,

            align: "left", // left | center | right

            baseline: "top",

            ...options
        };
    }

    /* =====================================
       MAIN RENDER ENTRY
    ===================================== */

    render(ctx, texts = []) {

        if (!ctx || !texts.length) return;

        for (const text of texts) {

            this.drawText(ctx, text);
        }
    }

    /* =====================================
       DRAW SINGLE TEXT
    ===================================== */

    drawText(ctx, text) {

        if (!text) return;

        ctx.save();

        /* =================================
           FONT STYLE
        ================================= */

        ctx.font = `${text.fontSize || this.options.fontSize}px ${text.fontFamily || this.options.fontFamily}`;

        ctx.fillStyle = text.color || this.options.color;

        ctx.textAlign = text.align || this.options.align;

        ctx.textBaseline = text.baseline || this.options.baseline;

        /* =================================
           POSITION
        ================================= */

        const x = text.x || 0;

        const y = text.y || 0;

        const content = text.content || "";

        /* =================================
           MULTILINE SUPPORT
        ================================= */

        const lines = content.split("\n");

        const lineHeight = (text.fontSize || this.options.fontSize) * (text.lineHeight || this.options.lineHeight);

        for (let i = 0; i < lines.length; i++) {

            ctx.fillText(
                lines[i],
                x,
                y + (i * lineHeight)
            );
        }

        ctx.restore();
    }

    /* =====================================
       MEASURE TEXT
    ===================================== */

    measure(ctx, text) {

        if (!ctx) return null;

        ctx.save();

        ctx.font = `${text.fontSize || this.options.fontSize}px ${text.fontFamily || this.options.fontFamily}`;

        const lines = (text.content || "").split("\n");

        let maxWidth = 0;

        for (const line of lines) {

            const width = ctx.measureText(line).width;

            if (width > maxWidth) maxWidth = width;
        }

        const height =
            lines.length *
            (text.fontSize || this.options.fontSize) *
            (text.lineHeight || this.options.lineHeight);

        ctx.restore();

        return { width: maxWidth, height };
    }

    /* =====================================
       DEBUG
    ===================================== */

    debug(text) {

        console.log("[TextRenderer]", text);
    }
}
