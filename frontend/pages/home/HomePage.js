/* =========================================
   HAPA MINI FIGMA - HomePage
   frontend/pages/home/HomePage.js
========================================= */

import { useEffect, useState } from "../../hooks/useState.js";

/**
 * HomePage - Dashboard utama HAPA
 * Menampilkan project, recent files, dan entry ke editor
 */

export default function HomePage({
    api,
    router,
    uiStore
}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* =========================
       LOAD PROJECTS
    ========================= */

    async function loadProjects() {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("/projects");

            setProjects(res.data || []);
        } catch (err) {
            setError(
                err.message || "Failed to load"
            );
        } finally {
            setLoading(false);
        }
    }

    /* =========================
       CREATE NEW PROJECT
    ========================= */

    async function createProject() {
        try {
            uiStore?.setLoading?.(
                true,
                "Creating project..."
            );

            const res = await api.post(
                "/projects/create",
                {
                    name: "Untitled Design"
                }
            );

            router.navigate(
                "/editor/" + res.id
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
       OPEN PROJECT
    ========================= */

    function openProject(id) {
        router.navigate("/editor/" + id);
    }

    /* =========================
       EFFECT INIT
    ========================= */

    useEffect(() => {
        loadProjects();
    }, []);

    /* =========================
       RENDER
    ========================= */

    return `
<div class="hapa-home">

    <!-- TOP BAR -->
    <div class="home-topbar">
        <h1>HAPA Workspace</h1>

        <button class="new-btn"
                onclick="window.__createProject()">
            + New Project
        </button>
    </div>

    <!-- CONTENT -->
    <div class="home-content">

        <!-- LEFT SIDEBAR -->
        <div class="home-sidebar">
            <div class="menu">
                <div>📁 Projects</div>
                <div>🕘 Recent</div>
                <div>🤖 AI Templates</div>
                <div>⚙️ Settings</div>
            </div>
        </div>

        <!-- MAIN GRID -->
        <div class="home-main">

            ${loading ? `
                <div class="loading">
                    Loading projects...
                </div>
            ` : ""}

            ${error ? `
                <div class="error">
                    ${error}
                </div>
            ` : ""}

            <div class="project-grid">

                ${projects.map(p => `
                    <div class="project-card"
                         onclick="window.__openProject('${p.id}')">

                        <div class="thumbnail"></div>

                        <div class="title">
                            ${p.name}
                        </div>

                        <div class="meta">
                            Updated ${p.updatedAt || "now"}
                        </div>

                    </div>
                `).join("")}

            </div>

        </div>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL ACTIONS (simple bridge)
========================= */

window.__createProject = null;
window.__openProject = null;
