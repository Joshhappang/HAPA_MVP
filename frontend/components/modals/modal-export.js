import { ModalBase } from "./modal-base.js";

export class ExportModal extends ModalBase {
    show() {
        this.open(`
            <div class="modal-box">
                <h3>Export</h3>

                <button>PNG</button>
                <button>SVG</button>
                <button>PDF</button>

                <button id="close">Close</button>
            </div>
        `);

        this.content.querySelector("#close").onclick = () => {
            this.close();
        };
    }
}
