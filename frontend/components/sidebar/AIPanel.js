import React, { useState } from "react";

/* =========================================
   HAPA MINI FIGMA - AI PANEL CORE
   frontend/components/sidebar/AIPanel.js
========================================= */

export const AIPanel = ({ editor, selectedNode }) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    /* =========================
       HANDLE AI ACTION
    ========================= */

    const handleRunAI = async () => {
        if (!prompt.trim() || !editor) return;

        setLoading(true);

        const userPrompt = prompt;

        try {
            /**
             * MOCK AI ENGINE
             * (nanti bisa diganti OpenAI / local model / HAPA AI engine)
             */
            const result = await fakeAIEngine(userPrompt, selectedNode);

            // apply result to editor
            if (result.action === "createNode") {
                editor.createNode?.(result.node);
            }

            if (result.action === "updateNode" && selectedNode) {
                editor.updateNode?.(selectedNode.id, result.update);
            }

            if (result.action === "layout") {
                editor.applyLayout?.(result.layout);
            }

            // save history
            setHistory(prev => [
                {
                    prompt: userPrompt,
                    result,
                    time: Date.now()
                },
                ...prev
            ]);

            setPrompt("");
        } catch (err) {
            console.error("[AIPanel] error:", err);
        }

        setLoading(false);
    };

    /* =========================
       FAKE AI ENGINE (SIMULASI)
    ========================= */

    const fakeAIEngine = async (prompt, node) => {
        await new Promise(res => setTimeout(res, 600));

        const lower = prompt.toLowerCase();

        // CREATE NODE
        if (lower.includes("button")) {
            return {
                action: "createNode",
                node: {
                    type: "button",
                    name: "AI Button",
                    x: 100,
                    y: 100,
                    width: 120,
                    height: 40,
                    fill: "#007aff",
                    text: "Button"
                }
            };
        }

        // UPDATE NODE COLOR
        if (lower.includes("color") && node) {
            return {
                action: "updateNode",
                update: {
                    fill: "#ff3b30"
                }
            };
        }

        // LAYOUT
        if (lower.includes("center")) {
            return {
                action: "layout",
                layout: {
                    type: "center-all"
                }
            };
        }

        // DEFAULT
        return {
            action: "createNode",
            node: {
                type: "text",
                name: "AI Text",
                x: 200,
                y: 200,
                text: prompt,
                fontSize: 14
            }
        };
    };

    return (
        <div className="hapa-ai-panel">

            {/* HEADER */}
            <div className="ai-header">
                AI Design Assistant
            </div>

            {/* PROMPT INPUT */}
            <textarea
                className="ai-input"
                placeholder="e.g. create a button, make it red, center layout..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            {/* RUN BUTTON */}
            <button
                className="ai-run-button"
                onClick={handleRunAI}
                disabled={loading}
            >
                {loading ? "Generating..." : "Run AI"}
            </button>

            {/* HISTORY */}
            <div className="ai-history">
                {history.map((item, idx) => (
                    <div key={idx} className="ai-history-item">
                        <div className="ai-history-prompt">
                            {item.prompt}
                        </div>
                        <div className="ai-history-result">
                            {item.result.action}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
