export function createDashboardStats() {
    const el = document.createElement("div");
    el.className = "dashboard-stats";

    el.innerHTML = `
        <div>Growth: +12%</div>
        <div>Active: 8 projects</div>
    `;

    return el;
}
