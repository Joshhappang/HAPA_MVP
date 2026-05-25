export function createDashboardActivity() {
    const el = document.createElement("div");
    el.className = "dashboard-activity";

    el.innerHTML = `
        <div>User A edited canvas</div>
        <div>User B exported design</div>
    `;

    return el;
}
