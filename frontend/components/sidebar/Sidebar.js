import React, { useEffect, useState } from "react";

/* =========================================
   HAPA MINI FIGMA - SIDEBAR CORE
   frontend/components/sidebar/Sidebar.js
========================================= */

import { SidebarTabs } from "./SidebarTabs";
import { LayersPanel } from "./LayersPanel";
import { AssetsPanel } from "./AssetsPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { PagesPanel } from "./PagesPanel";
import { AIPanel } from "./AIPanel";
import { SidebarState } from "./SidebarState";

export const Sidebar = ({ editor }) => {
    const [activeTab, setActiveTab] = useState(
        SidebarState.getActiveTab()
    );

    const [selectedNode, setSelectedNode] = useState(null);

    /* =========================
       SYNC SIDEBAR STATE
    ========================= */

    useEffect(() => {
        const unsubscribe = SidebarState.subscribe((tab) => {
            setActiveTab(tab);
        });

        return () => unsubscribe();
    }, []);

    /* =========================
       SYNC SELECTED NODE FROM EDITOR
    ========================= */

    useEffect(() => {
        if (!editor) return;

        const updateSelection = () => {
            setSelectedNode(editor.getSelectedNode?.() || null);
        };

        editor.onSelectionChange?.(updateSelection);

        return () => {
            editor.offSelectionChange?.(updateSelection);
        };
    }, [editor]);

    /* =========================
       RENDER ACTIVE PANEL
    ========================= */

    const renderPanel = () => {
        switch (activeTab) {
            case "layers":
                return <LayersPanel editor={editor} selectedNode={selectedNode} />;

            case "assets":
                return <AssetsPanel editor={editor} />;

            case "properties":
                return <PropertiesPanel editor={editor} selectedNode={selectedNode} />;

            case "pages":
                return <PagesPanel editor={editor} />;

            case "ai":
                return <AIPanel editor={editor} selectedNode={selectedNode} />;

            default:
                return <LayersPanel editor={editor} selectedNode={selectedNode} />;
        }
    };

    /* =========================
       HANDLE TAB CHANGE
    ========================= */

    const handleTabChange = (tab) => {
        SidebarState.setActiveTab(tab);
    };

    return (
        <div className="hapa-sidebar">
            {/* SIDEBAR TABS */}
            <SidebarTabs
                activeTab={activeTab}
                onChange={handleTabChange}
            />

            {/* SIDEBAR CONTENT */}
            <div className="hapa-sidebar-content">
                {renderPanel()}
            </div>
        </div>
    );
};
