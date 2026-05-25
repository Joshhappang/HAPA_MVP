export function createDashboardHeader() {
    const el = document.createElement("div");
    el.className = "dashboard-header";

    el.innerHTML = `
        <div class="title">Dashboard</div>
        <input class="search" placeholder="Search projects..." />
        <button class="hapa-btn hapa-btn-primary">New Project</button>
    `;

    return el;
}
