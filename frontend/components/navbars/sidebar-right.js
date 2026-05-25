export function createRightSidebar() {
    const el = document.createElement("div");
    el.className = "sidebar right-sidebar";

    el.innerHTML = `
        <div class="hapa-card">
            <div class="hapa-card-header">Inspector</div>

            <div class="form-group">
                <label>Width</label>
                <input type="number" />
            </div>

            <div class="form-group">
                <label>Height</label>
                <input type="number" />
            </div>

            <div class="form-group">
                <label>Color</label>
                <input type="color" />
            </div>
        </div>
    `;

    return el;
}
