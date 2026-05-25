/* =========================================
   HAPA MINI FIGMA - AISettings
   frontend/pages/settings/AISettings.js
========================================= */

/**
 * AISettings - konfigurasi AI engine HAPA
 * kontrol behavior AI design assistant
 */

export default function AISettings({
    settingsStore,
    uiStore,
    aiStore
}) {
    /* =========================
       GET AI SETTINGS
    ========================= */

    function getAISettings() {
        return (
            settingsStore?.getState?.()
                ?.ai || {
                model: "gpt-like",
                creativity: 0.7,
                autoApply: true,
                smartLayout: true,
                promptMemory: true
            }
        );
    }

    /* =========================
       UPDATE SETTING
    ========================= */

    function update(field, value) {
        const ai = getAISettings();

        settingsStore.setState({
            ai: {
                ...ai,
                [field]: value
            }
        });
    }

    /* =========================
       TEST AI
    ========================= */

    async function testAI() {
        try {
            uiStore?.notify?.(
                "Testing AI...",
                "info"
            );

            const result =
                await aiStore?.generate?.(
                    "buat kotak sederhana"
                );

            uiStore?.notify?.(
                "AI working correctly",
                "success"
            );

            return result;
        } catch (err) {
            uiStore?.notify?.(
                "AI error: " + err.message,
                "error"
            );
        }
    }

    /* =========================
       SAVE SETTINGS
    ========================= */

    function save() {
        settingsStore?.save?.();

        uiStore?.notify?.(
            "AI settings saved",
            "success"
        );
    }

    /* =========================
       RENDER SLIDER
    ========================= */

    function renderSlider(label, field, value) {
        return `
        <div class="setting-group">

            <label>${label}</label>

            <input type="range"
                min="0"
                max="1"
                step="0.1"
                value="${value}"
                oninput="window.__updateAI('${field}', this.value)"
            />

            <div class="slider-value">
                ${value}
            </div>

        </div>
        `;
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
                    onchange="window.__updateAI('${field}', this.checked)"
                />
                ${label}
            </label>

        </div>
        `;
    }

    /* =========================
       RENDER
    ========================= */

    const ai = getAISettings();

    return `
<div class="ai-settings">

    <div class="settings-title">
        🤖 AI Settings
    </div>

    <!-- MODEL -->
    <div class="setting-group">

        <label>AI Model</label>

        <select onchange="window.__updateAI('model', this.value)">

            <option value="gpt-like"
                ${ai.model === "gpt-like" ? "selected" : ""}>
                GPT-like (Balanced)
            </option>

            <option value="fast"
                ${ai.model === "fast" ? "selected" : ""}>
                Fast Mode
            </option>

            <option value="creative"
                ${ai.model === "creative" ? "selected" : ""}>
                Creative Mode
            </option>

        </select>

    </div>

    <!-- CREATIVITY -->
    ${renderSlider(
        "Creativity",
        "creativity",
        ai.creativity
    )}

    <!-- AUTO APPLY -->
    ${renderToggle(
        "Auto Apply AI Result",
        "autoApply",
        ai.autoApply
    )}

    <!-- SMART LAYOUT -->
    ${renderToggle(
        "Smart Layout AI",
        "smartLayout",
        ai.smartLayout
    )}

    <!-- PROMPT MEMORY -->
    ${renderToggle(
        "Prompt Memory",
        "promptMemory",
        ai.promptMemory
    )}

    <!-- TEST AI -->
    <div class="settings-actions">

        <button onclick="window.__testAI()">
            Test AI
        </button>

        <button onclick="window.__saveAI()">
            Save Settings
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__updateAI = null;
window.__saveAI = null;
window.__testAI = null;
