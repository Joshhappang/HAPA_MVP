/* =========================================
   HAPA MINI FIGMA - INSPECTOR FIELD CORE
   frontend/components/inspector/InspectorField.js
========================================= */

export class InspectorField {
    constructor({
        label,
        type = "text",
        value = "",
        onChange = () => {},
        step = 1,
        min = null,
        max = null
    }) {
        this.label = label;
        this.type = type;
        this.value = value;

        this.onChange = onChange;

        this.step = step;
        this.min = min;
        this.max = max;

        this.root = null;
        this.input = null;
    }

    /* =========================
       CREATE INPUT ELEMENT
    ========================= */

    render() {
        const wrapper = document.createElement("div");
        wrapper.className = "hapa-inspector-field";

        /* =========================
           LABEL
        ========================= */

        const label = document.createElement("div");
        label.className = "inspector-field-label";
        label.textContent = this.label;

        wrapper.appendChild(label);

        /* =========================
           INPUT
        ========================= */

        const input = document.createElement("input");

        input.className = "inspector-field-input";
        input.type = this.mapType(this.type);
        input.value = this.value ?? "";

        /* numeric config */
        if (this.type === "number") {
            input.step = this.step;

            if (this.min !== null) input.min = this.min;
            if (this.max !== null) input.max = this.max;
        }

        /* =========================
           EVENTS
        ========================= */

        input.addEventListener("input", (e) => {
            let val = e.target.value;

            if (this.type === "number") {
                val = parseFloat(val);

                if (isNaN(val)) val = 0;

                if (this.min !== null) val = Math.max(this.min, val);
                if (this.max !== null) val = Math.min(this.max, val);
            }

            this.value = val;

            this.onChange(val);
        });

        wrapper.appendChild(input);

        this.root = wrapper;
        this.input = input;

        return wrapper;
    }

    /* =========================
       TYPE MAPPER
    ========================= */

    mapType(type) {
        switch (type) {
            case "number":
                return "number";
            case "color":
                return "color";
            case "text":
            default:
                return "text";
        }
    }

    /* =========================
       UPDATE VALUE EXTERNALLY
    ========================= */

    setValue(val) {
        this.value = val;

        if (this.input) {
            this.input.value = val;
        }
    }
}
