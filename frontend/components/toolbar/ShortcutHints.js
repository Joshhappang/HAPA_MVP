import React, { useState, useEffect } from "react";

/* =========================================
   HAPA MINI FIGMA - SHORTCUT HINTS CORE
   frontend/components/toolbar/ShortcutHints.js
========================================= */

export const ShortcutHints = ({ visible = true }) => {
    const [show, setShow] = useState(visible);

    /* =========================
       KEYBOARD LISTENER (HELP TOGGLE)
    ========================= */

    useEffect(() => {
        const handleKey = (e) => {
            // toggle hints with ?
            if (e.key === "?") {
                setShow(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    if (!show) return null;

    /* =========================
       SHORTCUT DATA
    ========================= */

    const shortcuts = [
        { key: "V", action: "Select Tool" },
        { key: "H", action: "Move Tool" },
        { key: "F", action: "Frame Tool" },
        { key: "T", action: "Text Tool" },
        { key: "Space", action: "Hand / Pan" },
        { key: "Ctrl + Z", action: "Undo" },
        { key: "Ctrl + Y", action: "Redo" }
    ];

    return (
        <div className="hapa-shortcut-hints">
            <div className="shortcut-header">
                Keyboard Shortcuts
                <span className="hint-close" onClick={() => setShow(false)}>
                    ✕
                </span>
            </div>

            <div className="shortcut-list">
                {shortcuts.map((item, idx) => (
                    <div key={idx} className="shortcut-item">
                        <span className="shortcut-key">
                            {item.key}
                        </span>
                        <span className="shortcut-action">
                            {item.action}
                        </span>
                    </div>
                ))}
            </div>

            <div className="shortcut-footer">
                Press <b>?</b> to toggle
            </div>
        </div>
    );
};
