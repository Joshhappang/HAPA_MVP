import { ModalBase } from "./modal-base.js";

export class AIModal extends ModalBase {
    show(onGenerate) {
        this.open(`
            <div class="modal-box">
                <h3>AI Generator</h3>

                <textarea id="prompt" placeholder="Describe your UI..."></textarea>

                <button id="generate">Generate</button>
                <button id="close">Close</button>
            </div>
        `);

        this.content.querySelector("#generate").onclick = () => {
            const prompt = this.content.querySelector("#prompt").value;
            onGenerate?.(prompt);
        };

        this.content.querySelector("#close").onclick = () => {
            this.close();
        };
    }
}
