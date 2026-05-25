/* =========================================
   HAPA MINI FIGMA - SettingsPage
   frontend/pages/settings/SettingsPage.js
========================================= */

/**
 * SettingsPage - halaman utama settings HAPA
 * mengatur semua konfigurasi aplikasi
 */

export default function SettingsPage({
    router,
    settingsStore,
    uiStore
}) {
    /* =========================
       STATE ACTIVE TAB
    ========================= */

    let activeTab =
        settingsStore?.getState?.()
            ?.activeTab || "profile";

    /* =========================
       CHANGE TAB
    ========================= */

    function setTab(tab) {
        settingsStore.setState({
            activeTab: tab
        });

        activeTab = tab;
    }

    /* =========================
       SAVE SETTINGS
    ========================= */

    function saveSettings() {
        uiStore?.notify?.(
            "Settings saved successfully",
            "success"
        );

        settingsStore?.save?.();
    }

    /* =========================
       NAV BACK
    ========================= */

    function goBack() {
        router?.navigate?.("/home");
    }

    /* =========================
       RENDER TAB CONTENT
    ========================= */

    function renderContent() {
        switch (activeTab) {
            case "profile":
                return `
                    <div class="settings-content">
                        <h2>👤 Profile Settings</h2>
                        <p>Edit your personal information</p>
                    </div>
                `;

            case "app":
                return `
                    <div class="settings-content">
                        <h2>⚙️ App Settings</h2>
                        <p>Theme, language, and UI behavior</p>
                    </div>
                `;

            case "ai":
                return `
                    <div class="settings-content">
                        <h2>🤖 AI Settings</h2>
                        <p>Configure AI behavior and model</p>
                    </div>
                `;

            case "editor":
                return `
                    <div class="settings-content">
                        <h2>🎨 Editor Settings</h2>
                        <p>Canvas, grid, and performance settings</p>
                    </div>
                `;

            case "security":
                return `
                    <div class="settings-content">
                        <h2>🔐 Security</h2>
                        <p>Login and privacy settings</p>
                    </div>
                `;

            case "billing":
                return `
                    <div class="settings-content">
                        <h2>💳 Billing</h2>
                        <p>Subscription and usage</p>
                    </div>
                `;

            default:
                return `
                    <div class="settings-content">
                        <h2>Settings</h2>
                    </div>
                `;
        }
    }

    /* =========================
       RENDER SIDEBAR
    ========================= */

    function renderSidebar() {
        const tabs = [
            { id: "profile", name: "Profile", icon: "👤" },
            { id: "app", name: "App", icon: "⚙️" },
            { id: "ai", name: "AI", icon: "🤖" },
            { id: "editor", name: "Editor", icon: "🎨" },
            { id: "security", name: "Security", icon: "🔐" },
            { id: "billing", name: "Billing", icon: "💳" }
        ];

        return `
            <div class="settings-sidebar">

                <div class="settings-title">
                    Settings
                </div>

                ${tabs
                    .map(
                        tab => `
                    <div class="settings-tab ${
                        activeTab === tab.id
                            ? "active"
                            : ""
                    }"
                         onclick="window.__setSettingsTab('${tab.id}')">

                        <span>${tab.icon}</span>
                        <span>${tab.name}</span>

                    </div>
                `
                    )
                    .join("")}

                <div class="settings-actions">
                    <button onclick="window.__saveSettings()">
                        Save
                    </button>

                    <button onclick="window.__goBack()">
                        Back
                    </button>
                </div>

            </div>
        `;
    }

    /* =========================
       GLOBAL BRIDGE
    ========================= */

    window.__setSettingsTab = setTab;
    window.__saveSettings = saveSettings;
    window.__goBack = goBack;

    /* =========================
       RENDER PAGE
    ========================= */

    return `
<div class="settings-page">

    ${renderSidebar()}

    <div class="settings-main">

        ${renderContent()}

    </div>

</div>
    `;
}
