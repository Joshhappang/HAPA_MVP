/* =========================================
   HAPA MINI FIGMA - AICommandBar
   frontend/pages/editor/AICommandBar.js
========================================= */

/**
 * AICommandBar - command bar AI editor
 * seperti Figma + AI assistant (Ctrl+K style)
 */

export default function AICommandBar({
    aiStore,
    canvasStore,
    uiStore
}) {
    /* =========================
       RUN AI COMMAND
    ========================= */

    async function runAI(prompt) {
        if (!prompt) return;

        try {
            aiStore.setLoading(true);

            const result =
                await aiStore.generate(prompt, {
                    canvas:
                        canvasStore.getState()
                });

            /* =========================
               APPLY RESULT TO CANVAS
            ========================= */

            if (result?.objects) {
                result.objects.forEach(obj => {
                    canvasStore.addObject(obj);
                });
            }

            if (result?.update) {
                canvasStore.updateMany?.(
                    result.update
                );
            }

            uiStore?.notify?.(
                "AI applied successfully",
                "success"
            );
        } catch (err) {
            uiStore?.notify?.(
                "AI failed: " + err.message,
                "error"
            );
        } finally {
            aiStore.setLoading(false);
        }
    }

    /* =========================
       QUICK PROMPTS
    ========================= */

    function quickPrompt(type) {
        let prompt = "";

        switch (type) {
            case "clean":
                prompt =
                    "rapikan layout desain ini";
                break;

            case "modern":
                prompt =
                    "ubah desain menjadi modern minimalis";
                break;

            case "spacing":
                prompt =
                    "perbaiki spacing dan alignment";
                break;

            case "color":
                prompt =
                    "perbaiki warna agar lebih harmonis";
                break;
        }

        runAI(prompt);
    }

    /* =========================
       RENDER
    ========================= */

    return `
<div class="ai-command-bar">

    <!-- INPUT -->
    <div class="ai-input-wrapper">

        <input type="text"
               placeholder="Ask AI to edit your design..."
               onkeydown="if(event.key==='Enter') window.__runAI(this.value)" />

        <button onclick="window.__runAI(this.previousElementSibling.value)">
            ▶ Run
        </button>

    </div>

    <!-- QUICK ACTIONS -->
    <div class="ai-quick-actions">

        <button onclick="window.__aiQuick('clean')">
            🧹 Clean
        </button>

        <button onclick="window.__aiQuick('modern')">
            ✨ Modern
        </button>

        <button onclick="window.__aiQuick('spacing')">
            📐 Spacing
        </button>

        <button onclick="window.__aiQuick('color')">
            🎨 Color
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__runAI = null;
window.__aiQuick = null;
