import React, { useState } from "react";

/* =========================================
   HAPA MINI FIGMA - MAIN TOOLBAR
   frontend/components/toolbar/Toolbar.js
========================================= */

import { ToolButton } from "./ToolButton";
import { ToolGroup } from "./ToolGroup";
import { ToolState } from "./ToolState";
import { ToolIcons } from "./ToolIcons";

export const Toolbar = ({ editor }) => {
    const [activeTool, setActiveTool] = useState("select");

    /* =========================
       HANDLE TOOL CHANGE
    ========================= */

    const handleToolChange = (tool) => {
        setActiveTool(tool);

        if (editor?.setTool) {
            editor.setTool(tool);
        }

        if (ToolState?.setActiveTool) {
            ToolState.setActiveTool(tool);
        }
    };

    /* =========================
       TOOL DEFINITIONS
    ========================= */

    const tools = [
        { id: "select", icon: ToolIcons.select, label: "Select (V)" },
        { id: "move", icon: ToolIcons.move, label: "Move (H)" },
        { id: "frame", icon: ToolIcons.frame, label: "Frame (F)" },
        { id: "text", icon: ToolIcons.text, label: "Text (T)" },
        { id: "hand", icon: ToolIcons.hand, label: "Hand (Space)" }
    ];

    /* =========================
       GROUPED TOOLS (FUTURE EXPAND)
    ========================= */

    const groups = [
        {
            name: "Main Tools",
            tools: tools
        }
    ];

    return (
        <div className="hapa-toolbar">
            {/* TOOL GROUPS */}
            {groups.map((group, idx) => (
                <ToolGroup key={idx} name={group.name}>
                    {group.tools.map((tool) => (
                        <ToolButton
                            key={tool.id}
                            icon={tool.icon}
                            label={tool.label}
                            active={activeTool === tool.id}
                            onClick={() => handleToolChange(tool.id)}
                        />
                    ))}
                </ToolGroup>
            ))}
        </div>
    );
};
