/* =========================================
   HAPA MINI FIGMA - TEXT INSPECTOR CORE
   frontend/components/inspector/TextInspector.js
========================================= */

import { InspectorField } from "./InspectorField";

export class TextInspector {
    constructor({ node, onChange }) {
        this.node = node;
        this.onChange = onChange;

        this.root = null;
    }

    /* =========================
       RENDER TEXT SECTION
    ========================= */

    render() {
        const wrapper = document.createElement("div");
        wrapper.className = "hapa-text-inspector";

        const n = this.node || {};

        /* =========================
           TEXT CONTENT
        ========================= */

        const textField = new InspectorField({
            label: "Text",
            type: "text",
            value: n.text || "",
            onChange: (val) => {
                this.onChange(val);
            }
        });

        wrapper.appendChild(textField.render());

        /* =========================
           FONT SIZE
        ========================= */

        const fontSizeField = new InspectorField({
            label: "Font Size",
            type: "number",
            value: n.fontSize || 16,
            min: 1,
            max: 200,
            step: 1,
            onChange: (val) => {
                this.onChangeStyle("fontSize", val);
            }
        });

        wrapper.appendChild(fontSizeField.render());

        /* =========================
           FONT WEIGHT
        ========================= */

        const fontWeightField = new InspectorField({
            label: "Font Weight",
            type: "number",
            value: n.fontWeight || 400,
            min: 100,
            max: 900,
            step: 100,
            onChange: (val) => {
                this.onChangeStyle("fontWeight", val);
            }
        });

        wrapper.appendChild(fontWeightField.render());

        /* =========================
           LINE HEIGHT
        ========================= */

        const lineHeightField = new InspectorField({
            label: "Line Height",
            type: "number",
            value: n.lineHeight || 1.2,
            min: 0.5,
            max: 5,
            step: 0.1,
            onChange: (val) => {
                this.onChangeStyle("lineHeight", val);
            }
        });

        wrapper.appendChild(lineHeightField.render());

        /* =========================
           TEXT ALIGNMENT
        ========================= */

        const alignWrapper = document.createElement("div");
        alignWrapper.className = "hapa-text-align";

        const alignLabel = document.createElement("div");
        alignLabel.className = "text-section-label";
        alignLabel.textContent = "Alignment";

        alignWrapper.appendChild(alignLabel);

        const alignRow = document.createElement("div");
        alignRow.className = "text-align-row";

        const alignButtons = [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
        ];

        alignButtons.forEach(btn => {
            const b = document.createElement("button");
            b.className = "text-align-btn";
            b.textContent = btn.label;

            b.addEventListener("click", () => {
                this.onChangeStyle("textAlign", btn.value);
            });

            alignRow.appendChild(b);
        });

        alignWrapper.appendChild(alignRow);

        wrapper.appendChild(alignWrapper);

        this.root = wrapper;

        return wrapper;
    }

    /* =========================
       TEXT VALUE UPDATE
    ========================= */

    onChangeStyle(key, value) {
        if (this.onChange) {
            this.onChange({
                type: "style",
                key,
                value
            });
        }
    }
}
