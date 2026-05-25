/* =========================================
   HAPA MINI FIGMA - STYLE INSPECTOR CORE
   frontend/components/inspector/StyleInspector.js
========================================= */

import { InspectorField } from "./InspectorField";

export class StyleInspector {
    constructor({ node, onChange }) {
        this.node = node;
        this.onChange = onChange;

        this.root = null;
    }

    /* =========================
       RENDER STYLE SECTION
    ========================= */

    render() {
        const wrapper = document.createElement("div");
        wrapper.className = "hapa-style-inspector";

        const style = this.node?.style || {};

        /* =========================
           FILL COLOR
        ========================= */

        const fillField = new InspectorField({
            label: "Fill",
            type: "color",
            value: style.fill || "#ffffff",
            onChange: (val) => {
                this.onChange("fill", val);
            }
        });

        wrapper.appendChild(fillField.render());

        /* =========================
           STROKE COLOR
        ========================= */

        const strokeField = new InspectorField({
            label: "Stroke",
            type: "color",
            value: style.stroke || "#000000",
            onChange: (val) => {
                this.onChange("stroke", val);
            }
        });

        wrapper.appendChild(strokeField.render());

        /* =========================
           STROKE WIDTH
        ========================= */

        const strokeWidthField = new InspectorField({
            label: "Stroke Width",
            type: "number",
            value: style.strokeWidth || 0,
            min: 0,
            max: 100,
            step: 1,
            onChange: (val) => {
                this.onChange("strokeWidth", val);
            }
        });

        wrapper.appendChild(strokeWidthField.render());

        /* =========================
           OPACITY
        ========================= */

        const opacityField = new InspectorField({
            label: "Opacity",
            type: "number",
            value: style.opacity ?? 1,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (val) => {
                this.onChange("opacity", val);
            }
        });

        wrapper.appendChild(opacityField.render());

        /* =========================
           BORDER RADIUS
        ========================= */

        const radiusField = new InspectorField({
            label: "Radius",
            type: "number",
            value: style.radius || 0,
            min: 0,
            max: 200,
            step: 1,
            onChange: (val) => {
                this.onChange("radius", val);
            }
        });

        wrapper.appendChild(radiusField.render());

        /* =========================
           SHADOW (BASIC)
        ========================= */

        const shadowField = new InspectorField({
            label: "Shadow Blur",
            type: "number",
            value: style.shadowBlur || 0,
            min: 0,
            max: 100,
            step: 1,
            onChange: (val) => {
                this.onChange("shadowBlur", val);
            }
        });

        wrapper.appendChild(shadowField.render());

        this.root = wrapper;

        return wrapper;
    }
}
