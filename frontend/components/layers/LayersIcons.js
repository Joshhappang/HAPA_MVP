/* =========================================
   HAPA MINI FIGMA - LAYER ICONS MAP
   frontend/components/layers/LayersIcons.js
========================================= */

export class LayersIcons {
    static get(type) {
        switch (type) {
            case "frame":
                return "⬛"; // frame/container
            case "group":
                return "📦"; // group
            case "text":
                return "T"; // text layer
            case "image":
                return "🖼"; // image layer
            case "rect":
                return "▭"; // rectangle
            case "circle":
                return "◯"; // circle
            case "line":
                return "—"; // line
            case "vector":
                return "✎"; // vector/path
            case "button":
                return "🔘"; // UI button
            case "icon":
                return "⭐"; // icon asset
            default:
                return "•"; // fallback
        }
    }

    /* =========================
       OPTIONAL: LABEL ICON + NAME
    ========================= */

    static getWithLabel(type, name) {
        return {
            icon: this.get(type),
            label: name || type,
        };
    }
}
