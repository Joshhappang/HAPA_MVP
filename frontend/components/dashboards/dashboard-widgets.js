export function createDashboardWidgets() {
    const el = document.createElement("div");
    el.className = "dashboard-widgets";

    el.innerHTML = `
        <div class="widget">AI Tip: Use shortcuts for speed</div>
        <div class="widget">Status: All systems OK</div>
    `;

    return el;
}
