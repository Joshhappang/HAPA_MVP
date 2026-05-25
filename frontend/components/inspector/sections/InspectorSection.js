/* =========================================
   HAPA MINI FIGMA - INSPECTOR SECTION UI
   frontend/components/inspector/InspectorSection.js
========================================= */

export class InspectorSection {
    constructor(title, options = {}) {
        this.title = title;

        this.collapsible = options.collapsible ?? true;
        this.defaultOpen = options.defaultOpen ?? true;

        this.isOpen = this.defaultOpen;

        this.content = null;

        this.root = null;
    }

    /* =========================
       SET CONTENT
    ========================= */

    setContent(contentElement) {
        this.content = contentElement;
    }

    /* =========================
       TOGGLE SECTION
    ========================= */

    toggle() {
        this.isOpen = !this.isOpen;

        if (this.contentWrapper) {
            this.contentWrapper.style.display = this.isOpen ? "flex" : "none";
        }
    }

    /* =========================
       RENDER SECTION UI
    ========================= */

    render() {
        const wrapper = document.createElement("div");
        wrapper.className = "hapa-inspector-section";

        /* =========================
           HEADER
        ========================= */

        const header = document.createElement("div");
        header.className = "inspector-section-header";

        const title = document.createElement("div");
        title.className = "inspector-section-title";
        title.textContent = this.title;

        header.appendChild(title);

        /* =========================
           TOGGLE ICON
        ========================= */

        if (this.collapsible) {
            const toggle = document.createElement("div");
            toggle.className = "inspector-section-toggle";
            toggle.textContent = this.isOpen ? "▾" : "▸";

            header.appendChild(toggle);

            header.addEventListener("click", () => {
                this.toggle();
                toggle.textContent = this.isOpen ? "▾" : "▸";
            });
        }

        wrapper.appendChild(header);

        /* =========================
           CONTENT
        ========================= */

        const contentWrapper = document.createElement("div");
        contentWrapper.className = "inspector-section-content";

        if (!this.isOpen) {
            contentWrapper.style.display = "none";
        }

        if (this.content) {
            contentWrapper.appendChild(this.content);
        }

        wrapper.appendChild(contentWrapper);

        this.root = wrapper;
        this.contentWrapper = contentWrapper;

        return wrapper;
    }
}
