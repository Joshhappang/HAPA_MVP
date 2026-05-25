import { ModalBase } from "./modal-base.js";

export class SettingsModal extends ModalBase {
    show() {
        this.open(`
            <div class="modal-box">
                <h3>Settings</h3>

                <label>Theme</label>
                <select>
                    <option>Dark</option>
                    <option>Light</option>
                    <option>Neon</option>
                </select>

                <label>Grid</label>
                <input type="checkbox" />

                <button id="closeBtn">Close</button>
            </div>
        `);

        this.content.querySelector("#closeBtn").onclick = () => {
            this.close();
        };
    }
}
