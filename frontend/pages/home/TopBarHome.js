/* =========================================
   HAPA MINI FIGMA - TopBarHome
   frontend/pages/home/TopBarHome.js
========================================= */

/**
 * TopBarHome - header atas halaman home
 * seperti Figma top navigation
 */

export default function TopBarHome({
    router,
    uiStore,
    onCreate,
    onSearch
}) {
    /* =========================
       CREATE PROJECT
    ========================= */

    function createProject() {
        if (onCreate) return onCreate();

        uiStore?.setLoading?.(
            true,
            "Creating project..."
        );

        setTimeout(() => {
            uiStore?.setLoading?.(false);
            router?.navigate?.("/editor/new");
        }, 500);
    }

    /* =========================
       SEARCH HANDLER
    ========================= */

    function handleSearch(e) {
        const value = e.target.value;

        if (onSearch) {
            onSearch(value);
        }
    }

    /* =========================
       NOTIFICATION
    ========================= */

    function openNotifications() {
        uiStore?.openModal?.("notifications");
    }

    /* =========================
       PROFILE MENU
    ========================= */

    function openProfile() {
        uiStore?.openModal?.("profile");
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="topbar-home">

    <!-- LEFT: BRAND -->
    <div class="topbar-left">
        <div class="logo">
            HAPA
        </div>
    </div>

    <!-- CENTER: SEARCH -->
    <div class="topbar-center">

        <input
            type="text"
            placeholder="Search projects, AI tools..."
            oninput="window.__topbarSearch(event)"
        />

    </div>

    <!-- RIGHT: ACTIONS -->
    <div class="topbar-right">

        <button class="btn-create"
                onclick="window.__createProject()">
            + New
        </button>

        <button class="btn-icon"
                onclick="window.__openNotifications()">
            🔔
        </button>

        <button class="btn-icon"
                onclick="window.__openProfile()">
            👤
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__createProject = null;
window.__topbarSearch = null;
window.__openNotifications = null;
window.__openProfile = null;
