import { InspectorSection } from "./InspectorSection";
import { InspectorField } from "./InspectorField";
import { StyleInspector } from "./StyleInspector";
import { TransformInspector } from "./TransformInspector";
import { TextInspector } from "./TextInspector";
import { ImageInspector } from "./ImageInspector";

/* =========================================
   HAPA MINI FIGMA - INSPECTOR PANEL UI
   frontend/components/inspector/InspectorPanel.js
========================================= */

export class InspectorPanel {
    constructor({ container, inspector }) {
        this.container = container;
        this.inspector = inspector;

        this.node = null;

        this.init();
    }

    /* =========================
       INIT RENDER + SUBSCRIBE
    ========================= */

    init() {
        this.inspector.subscribe(() => {
            this.render();
        });

        this.render();
    }

    /* =========================
       MAIN RENDER
    ========================= */

    render() {
        const state = this.inspector.getActiveNode();

        this.node = state;

        this.container.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.className = "hapa-inspector-panel";

        /* =========================
           EMPTY STATE
        ========================= */

        if (!state) {
            const empty = document.createElement("div");
            empty.className = "inspector-empty";
            empty.textContent = "No selection";

            wrapper.appendChild(empty);
            this.container.appendChild(wrapper);
            return;
        }

        /* =========================
           HEADER
        ========================= */

        const header = document.createElement("div");
        header.className = "inspector-header";
        header.textContent = `${state.type || "Node"} Properties`;

        wrapper.appendChild(header);

        /* =========================
           TRANSFORM SECTION
        ========================= */

        const transformSection = new InspectorSection("Transform");

        const transform = new TransformInspector({
            node: state,
            onChange: (patch) => {
                this.inspector.updateTransform(patch);
            }
        });

        transformSection.setContent(transform.render());

        wrapper.appendChild(transformSection.render());

        /* =========================
           STYLE SECTION
        ========================= */

        const styleSection = new InspectorSection("Style");

        const style = new StyleInspector({
            node: state,
            onChange: (key, value) => {
                this.inspector.updateStyle(key, value);
            }
        });

        styleSection.setContent(style.render());

        wrapper.appendChild(styleSection.render());

        /* =========================
           TEXT SECTION (IF TEXT NODE)
        ========================= */

        if (state.type === "text") {
            const textSection = new InspectorSection("Text");

            const text = new TextInspector({
                node: state,
                onChange: (value) => {
                    this.inspector.updateText(value);
                }
            });

            textSection.setContent(text.render());

            wrapper.appendChild(textSection.render());
        }

        /* =========================
           IMAGE SECTION (IF IMAGE NODE)
        ========================= */

        if (state.type === "image") {
            const imageSection = new InspectorSection("Image");

            const image = new ImageInspector({
                node: state,
                onChange: (value) => {
                    this.inspector.updateImage(value);
                }
            });

            imageSection.setContent(image.render());

            wrapper.appendChild(imageSection.render());
        }

        /* =========================
           APPEND ROOT
        ========================= */

        this.container.appendChild(wrapper);
    }
}
