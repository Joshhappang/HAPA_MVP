export class ModalBase {
    constructor() {
        this.el = document.createElement("div");
        this.el.className = "hapa-modal hidden";

        this.content = document.createElement("div");
        this.content.className = "hapa-modal-content";

        this.el.appendChild(this.content);
        document.body.appendChild(this.el);

        this.bind();
    }

    bind() {
        this.el.addEventListener("click", (e) => {
            if (e.target === this.el) {
                this.close();
            }
        });
    }

    open(html) {
        this.content.innerHTML = html;
        this.el.classList.remove("hidden");
    }

    close() {
        this.el.classList.add("hidden");
    }
}
