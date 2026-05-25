import { ModalBase } from "./modal-base.js";

export class ConfirmModal extends ModalBase {
    show(message, onConfirm) {
        this.open(`
            <div class="modal-box">
                <p>${message}</p>
                <div class="actions">
                    <button id="ok">OK</button>
                    <button id="cancel">Cancel</button>
                </div>
            </div>
        `);

        this.content.querySelector("#ok").onclick = () => {
            onConfirm?.();
            this.close();
        };

        this.content.querySelector("#cancel").onclick = () => {
            this.close();
        };
    }
}
