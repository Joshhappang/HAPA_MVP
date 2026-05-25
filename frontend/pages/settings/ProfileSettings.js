/* =========================================
   HAPA MINI FIGMA - ProfileSettings
   frontend/pages/settings/ProfileSettings.js
========================================= */

/**
 * ProfileSettings - pengaturan profil user
 * nama, email, avatar, workspace
 */

export default function ProfileSettings({
    settingsStore,
    uiStore
}) {
    /* =========================
       GET PROFILE DATA
    ========================= */

    function getProfile() {
        return (
            settingsStore?.getState?.()
                ?.profile || {
                name: "",
                email: "",
                avatar: "",
                workspace: ""
            }
        );
    }

    /* =========================
       UPDATE PROFILE FIELD
    ========================= */

    function updateField(field, value) {
        const profile = getProfile();

        settingsStore.setState({
            profile: {
                ...profile,
                [field]: value
            }
        });
    }

    /* =========================
       SAVE PROFILE
    ========================= */

    function saveProfile() {
        settingsStore?.save?.();

        uiStore?.notify?.(
            "Profile updated successfully",
            "success"
        );
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
                oninput="window.__updateProfile('${field}', this.value)"
            />

        </div>
        `;
    }

    /* =========================
       RENDER
    ========================= */

    const profile = getProfile();

    return `
<div class="profile-settings">

    <div class="settings-title">
        👤 Profile Settings
    </div>

    <!-- AVATAR -->
    <div class="avatar-section">

        <div class="avatar-preview">
            ${profile.avatar
                ? `<img src="${profile.avatar}" />`
                : "👤"}
        </div>

        <input type="text"
            placeholder="Avatar URL"
            value="${profile.avatar || ""}"
            oninput="window.__updateProfile('avatar', this.value)"
        />

    </div>

    <!-- NAME -->
    ${renderInput(
        "Name",
        "name",
        profile.name
    )}

    <!-- EMAIL -->
    ${renderInput(
        "Email",
        "email",
        profile.email
    )}

    <!-- WORKSPACE -->
    ${renderInput(
        "Workspace",
        "workspace",
        profile.workspace
    )}

    <!-- SAVE BUTTON -->
    <div class="settings-actions">

        <button onclick="window.__saveProfile()">
            Save Profile
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__updateProfile = null;
window.__saveProfile = null;
