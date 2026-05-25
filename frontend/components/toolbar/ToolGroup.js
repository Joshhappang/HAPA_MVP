import React from "react";

/* =========================================
   HAPA MINI FIGMA - TOOL GROUP COMPONENT
   frontend/components/toolbar/ToolGroup.js
========================================= */

export const ToolGroup = ({ name, children }) => {
    return (
        <div className="hapa-tool-group">
            {/* GROUP LABEL (optional / future UI) */}
            {name && (
                <div className="tool-group-label">
                    {name}
                </div>
            )}

            {/* TOOL BUTTON CONTAINER */}
            <div className="tool-group-items">
                {children}
            </div>
        </div>
    );
};
