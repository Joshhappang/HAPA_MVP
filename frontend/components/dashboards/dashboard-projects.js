export function createDashboardProjects() {
    const el = document.createElement("div");
    el.className = "dashboard-projects";

    el.innerHTML = `
        <div>Project Alpha</div>
        <div>Project Beta</div>
        <div>Project Gamma</div>
    `;

    return el;
}
