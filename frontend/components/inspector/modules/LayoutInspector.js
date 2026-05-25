/* =========================================
   HAPA MINI FIGMA - LAYOUT INSPECTOR CORE
   frontend/components/inspector/LayoutInspector.js
========================================= */

import { InspectorField } from "./InspectorField";

export class LayoutInspector {
    constructor({ node, onChange }) {
        this.node = node;
        this.onChange = onChange;

        this.root = null;
    }

    /* =========================
       RENDER LAYOUT SECTION
    ========================= */

    render() {
        const wrapper = document.createElement("div");
        wrapper.className = "hapa-layout-inspector";

        const n = this.node || {};

        /* =========================
           POSITION X
        ========================= */

        const xField = new InspectorField({
            label: "X",
            type: "number",
            value: n.x || 0,
            step: 1,
            onChange: (val) => {
                this.onChange({ x: val });
            }
        });

        wrapper.appendChild(xField.render());

        /* =========================
           POSITION Y
        ========================= */

        const yField = new InspectorField({
            label: "Y",
            type: "number",
            value: n.y || 0,
            step: 1,
            onChange: (val) => {
                this.onChange({ y: val });
            }
        });

        wrapper.appendChild(yField.render());

        /* =========================
           WIDTH
        ========================= */

        const widthField = new InspectorField({
            label: "Width",
            type: "number",
            value: n.width || 100,
            min: 0,
            step: 1,
            onChange: (val) => {
                this.onChange({ width: val });
            }
        });

        wrapper.appendChild(widthField.render());

        /* =========================
           HEIGHT
        ========================= */

        const heightField = new InspectorField({
            label: "Height",
            type: "number",
            value: n.height || 100,
            min: 0,
            step: 1,
            onChange: (val) => {
                this.onChange({ height: val });
            }
        });

        wrapper.appendChild(heightField.render());

        /* =========================
           ROTATION
        ========================= */

        const rotationField = new InspectorField({
            label: "Rotation",
            type: "number",
            value: n.rotation || 0,
            min: 0,
            max: 360,
            step: 1,
            onChange: (val) => {
                this.onChange({ rotation: val });
            }
        });

        wrapper.appendChild(rotationField.render());

        /* =========================
           ALIGNMENT (BASIC)
        ========================= */

        const alignWrapper = document.createElement("div");
        alignWrapper.className = "hapa-layout-align";

        const alignLabel = document.createElement("div");
        alignLabel.className = "layout-section-label";
        alignLabel.textContent = "Align";

        alignWrapper.appendChild(alignLabel);

        const alignRow = document.createElement("div");
        alignRow.className = "layout-align-row";

        const alignButtons = [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
        ];

        alignButtons.forEach(btn => {
            const b = document.createElement("button");
            b.className = "layout-align-btn";
            b.textContent = btn.label;

            b.addEventListener("click", () => {
                this.onChange({ align: btn.value });
            });

            alignRow.appendChild(b);
        });

        alignWrapper.appendChild(alignRow);

        wrapper.appendChild(alignWrapper);

        this.root = wrapper;

        return wrapper;
    }
}
