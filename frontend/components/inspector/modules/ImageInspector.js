/* =========================================
   HAPA MINI FIGMA - IMAGE INSPECTOR CORE
   frontend/components/inspector/ImageInspector.js
========================================= */

import { InspectorField } from "./InspectorField";

export class ImageInspector {
    constructor({ node, onChange }) {
        this.node = node;
        this.onChange = onChange;

        this.root = null;
    }

    /* =========================
       RENDER IMAGE SECTION
    ========================= */

    render() {
        const wrapper = document.createElement("div");
        wrapper.className = "hapa-image-inspector";

        const n = this.node || {};

        /* =========================
           IMAGE SOURCE URL
        ========================= */

        const srcField = new InspectorField({
            label: "Image URL",
            type: "text",
            value: n.src || "",
            onChange: (val) => {
                this.onChange("src", val);
            }
        });

        wrapper.appendChild(srcField.render());

        /* =========================
           FIT MODE
        ========================= */

        const fitField = new InspectorField({
            label: "Fit (cover/contain)",
            type: "text",
            value: n.fit || "cover",
            onChange: (val) => {
                this.onChange("fit", val);
            }
        });

        wrapper.appendChild(fitField.render());

        /* =========================
           OPACITY
        ========================= */

        const opacityField = new InspectorField({
            label: "Opacity",
            type: "number",
            value: n.opacity ?? 1,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (val) => {
                this.onChange("opacity", val);
            }
        });

        wrapper.appendChild(opacityField.render());

        /* =========================
           BORDER RADIUS (IMAGE MASK STYLE)
        ========================= */

        const radiusField = new InspectorField({
            label: "Radius",
            type: "number",
            value: n.radius || 0,
            min: 0,
            max: 200,
            step: 1,
            onChange: (val) => {
                this.onChange("radius", val);
            }
        });

        wrapper.appendChild(radiusField.render());

        /* =========================
           SIMPLE CROP (BASIC)
        ========================= */

        const cropXField = new InspectorField({
            label: "Crop X",
            type: "number",
            value: n.cropX || 0,
            step: 1,
            onChange: (val) => {
                this.onChange("cropX", val);
            }
        });

        const cropYField = new InspectorField({
            label: "Crop Y",
            type: "number",
            value: n.cropY || 0,
            step: 1,
            onChange: (val) => {
                this.onChange("cropY", val);
            }
        });

        const cropWrapper = document.createElement("div");
        cropWrapper.className = "hapa-image-crop-group";

        cropWrapper.appendChild(cropXField.render());
        cropWrapper.appendChild(cropYField.render());

        wrapper.appendChild(cropWrapper);

        /* =========================
           SCALE (BASIC IMAGE SCALE)
        ========================= */

        const scaleField = new InspectorField({
            label: "Scale",
            type: "number",
            value: n.scale ?? 1,
            min: 0.1,
            max: 10,
            step: 0.1,
            onChange: (val) => {
                this.onChange("scale", val);
            }
        });

        wrapper.appendChild(scaleField.render());

        this.root = wrapper;

        return wrapper;
    }
}
