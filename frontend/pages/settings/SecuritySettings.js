/* =========================================
   HAPA MINI FIGMA - SecuritySettings
   frontend/pages/settings/SecuritySettings.js
========================================= */

/**
 * SecuritySettings - pengaturan keamanan user
 * password, session, API key, privacy
 */

export default function SecuritySettings({
    settingsStore,
    uiStore
}) {
    /* =========================
       GET SECURITY SETTINGS
    ========================= */

    function getSecuritySettings() {
        return (
            settingsStore?.getState?.()
                ?.security || {
                twoFactor: false,
                sessionTimeout: 30,
                apiKey: "",
                privacyMode: "standard",
                loginAlerts: true
            }
        );
    }

    /* =========================
       UPDATE SETTING
    ========================= */

    function update(field, value) {
        const sec = getSecuritySettings();

        settingsStore.setState({
            security: {
                ...sec,
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
            "Security settings saved",
            "success"
        );
    }

    /* =========================
       GENERATE API KEY
    ========================= */

    function generateAPIKey() {
        const key =
            "hapa_" +
            Math.random()
                .toString(36)
                .substring(2, 15);

        update("apiKey", key);

        uiStore?.notify?.(
            "New API key generated",
            "success"
        );
    }

    /* =========================
       RENDER TOGGLE
    ========================= */

    function renderToggle(label, field, value) {
        return `
        <div class="setting-group">

            <label>
                <input type="checkbox"
                    ${value ? "checked" : ""}
                    onchange="window.__updateSecurity('${field}', this.checked)"
                />
                ${label}
            </label>

        </div>
        `;
    }

    /* =========================
       RENDER INPUT
    ========================= */

    function renderInput(label, field, value) {
        return `
        <div class="setting-group">

            <label>${label}</label>

            <input type="text"
                value="${value || ""}"
                oninput="window.__updateSecurity('${field}', this.value)"
            />

        </div>
        `;
    }

    /* =========================
       RENDER SELECT
    ========================= */

    function renderSelect(label, field, value, options) {
        return `
        <div class="setting-group">

            <label>${label}</label>

            <select onchange="window.__updateSecurity('${field}', this.value)">

                ${options
                    .map(
                        opt => `
                    <option value="${opt.value}"
                        ${opt.value === value ? "selected" : ""}>
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
       RENDER
    ========================= */

    const sec = getSecuritySettings();

    return `
<div class="security-settings">

    <div class="settings-title">
        🔐 Security Settings
    </div>

    <!-- TWO FACTOR -->
    ${renderToggle(
        "Two Factor Authentication (2FA)",
        "twoFactor",
        sec.twoFactor
    )}

    <!-- LOGIN ALERTS -->
    ${renderToggle(
        "Login Alerts",
        "loginAlerts",
        sec.loginAlerts
    )}

    <!-- SESSION TIMEOUT -->
    ${renderInput(
        "Session Timeout (minutes)",
        "sessionTimeout",
        sec.sessionTimeout
    )}

    <!-- PRIVACY MODE -->
    ${renderSelect(
        "Privacy Mode",
        "privacyMode",
        sec.privacyMode,
        [
            { value: "standard", label: "Standard" },
            { value: "private", label: "Private" },
            { value: "strict", label: "Strict" }
        ]
    )}

    <!-- API KEY -->
    ${renderInput(
        "API Key",
        "apiKey",
        sec.apiKey
    )}

    <div class="security-actions">

        <button onclick="window.__generateAPIKey()">
            Generate API Key
        </button>

    </div>

    <!-- SAVE -->
    <div class="settings-actions">

        <button onclick="window.__saveSecurity()">
            Save Security
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__updateSecurity = null;
window.__saveSecurity = null;
window.__generateAPIKey = null;
