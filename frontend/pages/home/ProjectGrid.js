/* =========================================
   HAPA MINI FIGMA - ProjectGrid
   frontend/pages/home/ProjectGrid.js
========================================= */

/**
 * ProjectGrid - grid semua project user
 * seperti Figma "All Designs"
 */

export default function ProjectGrid({
    projects = [],
    router,
    onOpen,
    onDelete
}) {
    /* =========================
       OPEN PROJECT
    ========================= */

    function openProject(id) {
        if (onOpen) return onOpen(id);

        if (router?.navigate) {
            router.navigate("/editor/" + id);
        }
    }

    /* =========================
       DELETE PROJECT
    ========================= */

    function deleteProject(id, e) {
        e?.stopPropagation?.();

        if (onDelete) return onDelete(id);
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="project-grid-wrapper">

    <div class="section-header">
        📁 Your Projects
    </div>

    <div class="project-grid">

        ${
            projects.length === 0
                ? `
            <div class="empty-state">
                No projects yet. Create your first design ✨
            </div>
        `
                : projects
                      .map(
                          project => `
            <div class="project-card"
                 onclick="window.__openProject('${project.id}')">

                <!-- Thumbnail -->
                <div class="project-thumb">
                    ${project.thumbnail
                        ? `<img src="${project.thumbnail}" />`
                        : `<div class="placeholder-thumb"></div>`}
                </div>

                <!-- Info -->
                <div class="project-info">

                    <div class="project-title">
                        ${project.name}
                    </div>

                    <div class="project-meta">
                        ${project.updatedAt
                            ? "Updated " +
                              new Date(
                                  project.updatedAt
                              ).toLocaleDateString()
                            : "New project"}
                    </div>

                </div>

                <!-- Actions -->
                <div class="project-actions">
                    <button onclick="window.__deleteProject('${project.id}', event)">
                        🗑
                    </button>
                </div>

            </div>
        `
                      )
                      .join("")
        }

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__openProject = null;
window.__deleteProject = null;
