/* =========================================
   HAPA MINI FIGMA - NewProjectButton
   frontend/pages/home/NewProjectButton.js
========================================= */

/**
 * NewProjectButton - tombol create project baru
 * bisa connect ke AI atau langsung editor
 */

export default function NewProjectButton({
    router,
    uiStore,
    api,
    mode = "manual" // manual | ai
}) {
    /* =========================
       CREATE PROJECT
    ========================= */

    async function createProject() {
        try {
            uiStore?.setLoading?.(
                true,
                "Creating new project..."
            );

            let project;

            /* =========================
               MODE AI GENERATION
            ========================= */

            if (mode === "ai") {
                project = await api?.post?.(
                    "/ai/generate-project",
                    {
                        prompt:
                            "auto design project",
                        type: "figma-like"
                    }
                );
            }

            /* =========================
               MODE MANUAL
            ========================= */
            else {
                project = await api?.post?.(
                    "/projects/create",
                    {
                        name: "Untitled Design"
                    }
                );
            }

            /* =========================
               NAVIGATE TO EDITOR
            ========================= */

            const id = project?.id || "new";

            router?.navigate?.(
                "/editor/" + id
            );
        } catch (err) {
            uiStore?.notify?.(
                "Failed to create project",
                "error"
            );
        } finally {
            uiStore?.setLoading?.(false);
        }
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="new-project-wrapper">

    <button class="new-project-btn"
            onclick="window.__createNewProject()">

        <div class="icon">+</div>

        <div class="text">
            New Project
        </div>

        <div class="subtext">
            ${mode === "ai"
                ? "AI Generated Design"
                : "Start from blank"}
        </div>

    </button>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTION
========================= */

window.__createNewProject = null;
