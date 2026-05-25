/* =========================================
   HAPA MINI FIGMA - SettingsLayout
   frontend/pages/settings/SettingsLayout.js
========================================= */

/**
 * SettingsLayout - layout utama halaman settings
 * sidebar kiri + content kanan (Figma style settings UI)
 */

export default function SettingsLayout({
    sidebar,
    content,
    header
}) {
    return `
<div class="settings-layout">

    <!-- =========================
         HEADER
    ========================== -->
    <header class="settings-header">

        ${header || `
            <div class="settings-header-left">
                ⚙️ Settings
            </div>

            <div class="settings-header-right">
                <button>Help</button>
                <button>Docs</button>
            </div>
        `}

    </header>

    <!-- =========================
         BODY
    ========================== -->
    <div class="settings-body">

        <!-- SIDEBAR -->
        <aside class="settings-sidebar">

            ${sidebar || `
                <div class="settings-tab">
                    Profile
                </div>
                <div class="settings-tab">
                    App
                </div>
                <div class="settings-tab">
                    AI
                </div>
                <div class="settings-tab">
                    Editor
                </div>
                <div class="settings-tab">
                    Security
                </div>
                <div class="settings-tab">
                    Billing
                </div>
            `}

        </aside>

        <!-- CONTENT -->
        <main class="settings-content-area">

            ${content || `
                <div class="settings-empty">
                    Select a setting section
                </div>
            `}

        </main>

    </div>

</div>
    `;
}
