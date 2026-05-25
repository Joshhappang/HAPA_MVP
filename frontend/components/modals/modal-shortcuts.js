import { ModalBase } from "./modal-base.js";

export class ShortcutsModal extends ModalBase {
    show() {
        this.open(`
            <div class="modal-box">
                <h3>Shortcuts</h3>

                <ul>
                    <li>V - Select</li>
                    <li>M - Move</li>
                    <li>T - Text</li>
                    <li>Ctrl + Z - Undo</li>
                </ul>

                <button id="close">Close</button>
            </div>
        `);

        this.content.querySelector("#close").onclick = () => {
            this.close();
        };
    }
}
