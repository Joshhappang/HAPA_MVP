/* =========================================
   HAPA MINI FIGMA - AppSettings
   frontend/pages/settings/AppSettings.js
========================================= */

/**
 * AppSettings - konfigurasi aplikasi utama
 * theme, language, UI behavior, performance
 */

export default function AppSettings({
    settingsStore,
    uiStore
}) {
    /* =========================
       GET APP SETTINGS
    ========================= */

    function getAppSettings() {
        return (
            settingsStore?.getState?.()
                ?.app || {
                theme: "dark",
                language: "id",
                autosave: true,
                performance: "medium"
            }
        );
    }

    /* =========================
       UPDATE SETTING
    ========================= */

    function update(field, value) {
        const app = getAppSettings();

        settingsStore.setState({
            app: {
                ...app,
                [field]: value
            }
        });
    }

    /* =========================
       SAVE SETTINGS
    ========================= */

    function save() {
        settingsStore?.save?.();

        uiStore?.notify?.(
            "App settings saved",
            "success"
        );
    }

    /* =========================
       RENDER SELECT OPTION
    ========================= */

    function renderSelect(
        label,
        field,
        value,
        options
    ) {
        return `
        <div class="setting-group">

            <label>${label}</label>

            <select onchange="window.__updateApp('${field}', this.value)">

                ${options
                    .map(
                        opt => `
                    <option value="${opt.value}"
                        ${
                            opt.value === value
                                ? "selected"
                                : ""
                        }>
                        ${opt.label}
                    </option>
                `
                    )
                    .join("")}

            </select>

        </div>
        `;
    }

    /* =========================
       RENDER CHECKBOX
    ========================= */

    function renderToggle(label, field, value) {
        return `
        <div class="setting-group">

            <label>
                <input type="checkbox"
                    ${value ? "checked" : ""}
                    onchange="window.__updateApp('${field}', this.checked)"
                />
                ${label}
            </label>

        </div>
        `;
    }

    /* =========================
       RENDER
    ========================= */

    const app = getAppSettings();

    return `
<div class="app-settings">

    <div class="settings-title">
        ⚙️ App Settings
    </div>

    <!-- THEME -->
    ${renderSelect(
        "Theme",
        "theme",
        app.theme,
        [
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" }
        ]
    )}

    <!-- LANGUAGE -->
    ${renderSelect(
        "Language",
        "language",
        app.language,
        [
            { value: "id", label: "Bahasa Indonesia" },
            { value: "en", label: "English" }
        ]
    )}

    <!-- AUTOSAVE -->
    ${renderToggle(
        "Auto Save",
        "autosave",
        app.autosave
    )}

    <!-- PERFORMANCE -->
    ${renderSelect(
        "Performance Mode",
        "performance",
        app.performance,
        [
            { value: "low", label: "Low (Save Battery)" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High (Smooth)" }
        ]
    )}

    <!-- SAVE -->
    <div class="settings-actions">

        <button onclick="window.__saveApp()">
            Save Settings
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__updateApp = null;
window.__saveApp = null;
