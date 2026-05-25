/* =========================================
   HAPA MINI FIGMA - HomeLayout
   frontend/pages/home/HomeLayout.js
========================================= */

/**
 * HomeLayout - struktur layout utama halaman home
 * (Sidebar + Topbar + Content wrapper)
 */

export default function HomeLayout({
    sidebar,
    topbar,
    children
}) {
    return `
<div class="hapa-home-layout">

    <!-- =========================
         TOPBAR
    ========================== -->
    <header class="home-topbar">
        ${topbar || `
            <div class="topbar-left">
                <h2>HAPA</h2>
            </div>

            <div class="topbar-center">
                <input type="text"
                       placeholder="Search projects..." />
            </div>

            <div class="topbar-right">
                <button>🔔</button>
                <button>👤</button>
            </div>
        `}
    </header>

    <!-- =========================
         MAIN AREA
    ========================== -->
    <div class="home-body">

        <!-- SIDEBAR -->
        <aside class="home-sidebar">
            ${sidebar || `
                <nav class="sidebar-menu">

                    <div class="menu-item active">
                        📁 Projects
                    </div>

                    <div class="menu-item">
                        🕘 Recent
                    </div>

                    <div class="menu-item">
                        🤖 AI Tools
                    </div>

                    <div class="menu-item">
                        🧩 Templates
                    </div>

                    <div class="menu-item">
                        ⚙️ Settings
                    </div>

                </nav>
            `}
        </aside>

        <!-- CONTENT -->
        <main class="home-content">
            ${children || ""}
        </main>

    </div>

</div>
    `;
}
