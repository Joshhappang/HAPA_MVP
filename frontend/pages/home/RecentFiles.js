/* =========================================
   HAPA MINI FIGMA - RecentFiles
   frontend/pages/home/RecentFiles.js
========================================= */

/**
 * RecentFiles - daftar project terakhir dibuka
 * seperti Figma "Recent Designs"
 */

export default function RecentFiles({
    projects = [],
    router,
    limit = 6
}) {
    const recent = projects
        .sort(
            (a, b) =>
                new Date(b.updatedAt) -
                new Date(a.updatedAt)
        )
        .slice(0, limit);

    /* =========================
       OPEN FILE
    ========================= */

    function openFile(id) {
        if (router?.navigate) {
            router.navigate("/editor/" + id);
        }
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="recent-files">

    <div class="section-title">
        🕘 Recent Files
    </div>

    <div class="recent-list">

        ${
            recent.length === 0
                ? `
            <div class="empty-state">
                No recent files yet
            </div>
        `
                : recent
                      .map(
                          file => `
            <div class="recent-item"
                 onclick="window.__openRecent('${file.id}')">

                <!-- Thumbnail -->
                <div class="recent-thumb"></div>

                <!-- Info -->
                <div class="recent-info">

                    <div class="recent-name">
                        ${file.name}
                    </div>

                    <div class="recent-meta">
                        ${file.updatedAt
                            ? "Updated " +
                              new Date(
                                  file.updatedAt
                              ).toLocaleDateString()
                            : "New"}
                    </div>

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
   GLOBAL BRIDGE (simple hook)
========================= */

window.__openRecent = null;
