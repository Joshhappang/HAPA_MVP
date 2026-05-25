export function createDashboardSidebar() {
    const el = document.createElement("div");
    el.className = "dashboard-sidebar";

    el.innerHTML = `
        <div class="menu">
            <div class="item">Overview</div>
            <div class="item">Projects</div>
            <div class="item">Analytics</div>
            <div class="item">Settings</div>
        </div>
    `;

    return el;
}
