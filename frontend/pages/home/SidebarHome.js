/* =========================================
   HAPA MINI FIGMA - SidebarHome
   frontend/pages/home/SidebarHome.js
========================================= */

/**
 * SidebarHome - navigasi kiri halaman home
 * seperti Figma sidebar (Projects, Recent, AI, dll)
 */

export default function SidebarHome({
    router,
    active = "projects",
    onNavigate
}) {
    /* =========================
       NAVIGATION
    ========================= */

    function go(page) {
        if (onNavigate) return onNavigate(page);

        if (router?.navigate) {
            router.navigate("/home/" + page);
        }
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="sidebar-home">

    <!-- BRAND -->
    <div class="sidebar-brand">
        <h2>HAPA</h2>
        <small>Mini Figma AI</small>
    </div>

    <!-- MENU -->
    <nav class="sidebar-menu">

        <div class="menu-item ${active === "projects" ? "active" : ""}"
             onclick="window.__goSidebar('projects')">
            📁 Projects
        </div>

        <div class="menu-item ${active === "recent" ? "active" : ""}"
             onclick="window.__goSidebar('recent')">
            🕘 Recent
        </div>

        <div class="menu-item ${active === "ai" ? "active" : ""}"
             onclick="window.__goSidebar('ai')">
            🤖 AI Tools
        </div>

        <div class="menu-item ${active === "templates" ? "active" : ""}"
             onclick="window.__goSidebar('templates')">
            🧩 Templates
        </div>

        <div class="menu-item ${active === "plugins" ? "active" : ""}"
             onclick="window.__goSidebar('plugins')">
            🔌 Plugins
        </div>

        <div class="menu-item ${active === "settings" ? "active" : ""}"
             onclick="window.__goSidebar('settings')">
            ⚙️ Settings
        </div>

    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">

        <div class="user-box">
            <div class="avatar"></div>
            <div class="user-info">
                <div class="name">User</div>
                <div class="status">Free Plan</div>
            </div>
        </div>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE
========================= */

window.__goSidebar = null;
