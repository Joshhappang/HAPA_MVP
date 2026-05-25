import React, { useEffect, useState } from "react";

/* =========================================
   HAPA MINI FIGMA - LAYERS PANEL CORE
   frontend/components/sidebar/LayersPanel.js
========================================= */

import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";

export const LayersPanel = ({ editor, selectedNode }) => {
    const [layers, setLayers] = useState([]);

    /* =========================
       SYNC FROM EDITOR
    ========================= */

    useEffect(() => {
        if (!editor) return;

        const updateLayers = () => {
            const nodes = editor.getNodes?.() || [];
            setLayers(nodes);
        };

        updateLayers();

        editor.onChange?.(updateLayers);

        return () => {
            editor.offChange?.(updateLayers);
        };
    }, [editor]);

    /* =========================
       HANDLE SELECT NODE
    ========================= */

    const handleSelect = (id) => {
        editor?.selectNode?.(id);
    };

    /* =========================
       HANDLE DOUBLE CLICK (RENAME FUTURE)
    ========================= */

    const handleDoubleClick = (id) => {
        console.log("[LayersPanel] rename node:", id);
    };

    /* =========================
       DRAG & DROP (REORDER LAYERS)
    ========================= */

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("layerId", id);
    };

    const handleDrop = (e, targetId) => {
        const draggedId = e.dataTransfer.getData("layerId");

        if (!draggedId || draggedId === targetId) return;

        editor?.reorderNodes?.(draggedId, targetId);
    };

    return (
        <div className="hapa-layers-panel">

            {/* SECTION */}
            <SidebarSection title="Layers">

                {/* EMPTY STATE */}
                {layers.length === 0 && (
                    <div className="layers-empty">
                        No layers yet
                    </div>
                )}

                {/* LAYER LIST */}
                {layers.map((node) => (
                    <SidebarItem
                        key={node.id}
                        id={node.id}
                        name={node.name || "Unnamed"}
                        icon={node.icon}
                        active={selectedNode?.id === node.id}
                        selected={selectedNode?.id === node.id}
                        onClick={handleSelect}
                        onDoubleClick={handleDoubleClick}
                        draggable={true}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                    />
                ))}

            </SidebarSection>
        </div>
    );
};
