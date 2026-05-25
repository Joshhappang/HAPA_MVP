import React from "react";

/* =========================================
   HAPA MINI FIGMA - TOOL BUTTON COMPONENT
   frontend/components/toolbar/ToolButton.js
========================================= */

export const ToolButton = ({
    icon,
    label,
    active,
    onClick,
    shortcut,
    disabled
}) => {
    return (
        <button
            className={`hapa-tool-button ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
            onClick={onClick}
            title={label}
            disabled={disabled}
        >
            {/* ICON */}
            <div className="icon-wrapper">
                {typeof icon === "function" ? icon() : icon}
            </div>

            {/* OPTIONAL LABEL (hover / expanded mode) */}
            {label && (
                <span className="tool-label">
                    {label}
                </span>
            )}

            {/* SHORTCUT HINT */}
            {shortcut && (
                <span className="shortcut-hint">
                    {shortcut}
                </span>
            )}
        </button>
    );
};
