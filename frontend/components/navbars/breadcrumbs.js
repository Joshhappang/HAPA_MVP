export function createBreadcrumbs() {
    const el = document.createElement("div");
    el.className = "hapa-breadcrumbs";

    el.innerHTML = `
        <span>Project</span>
        <span>/</span>
        <span>Canvas 1</span>
    `;

    return el;
}
