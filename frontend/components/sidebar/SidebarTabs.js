import React from "react";

/* =========================================
   HAPA MINI FIGMA - SIDEBAR TABS CORE
   frontend/components/sidebar/SidebarTabs.js
========================================= */

import { SidebarState } from "./SidebarState";

export const SidebarTabs = ({ activeTab, onChange }) => {
    const tabs = [
        { id: "layers", label: "Layers" },
        { id: "assets", label: "Assets" },
        { id: "pages", label: "Pages" },
        { id: "properties", label: "Properties" },
        { id: "ai", label: "AI" }
    ];

    const handleClick = (tabId) => {
        SidebarState.setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div className="hapa-sidebar-tabs">

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => handleClick(tab.id)}
                >
                    {tab.label}
                </button>
            ))}

        </div>
    );
};
