export function createDashboardCards() {
    const el = document.createElement("div");
    el.className = "dashboard-cards";

    el.innerHTML = `
        <div class="card">Projects: 12</div>
        <div class="card">Users: 48</div>
        <div class="card">Files: 320</div>
    `;

    return el;
}
