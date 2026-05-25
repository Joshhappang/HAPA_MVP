import React, { useEffect, useState } from "react";

/* =========================================
   HAPA MINI FIGMA - PROPERTIES PANEL CORE
   frontend/components/sidebar/PropertiesPanel.js
========================================= */

export const PropertiesPanel = ({ editor, selectedNode }) => {
    const [node, setNode] = useState(null);

    /* =========================
       SYNC SELECTED NODE
    ========================= */

    useEffect(() => {
        setNode(selectedNode);
    }, [selectedNode]);

    /* =========================
       UPDATE PROPERTY HANDLER
    ========================= */

    const updateProperty = (key, value) => {
        if (!node || !editor) return;

        editor.updateNode?.(node.id, {
            [key]: value
        });
    };

    /* =========================
       HANDLE INPUT CHANGE
    ========================= */

    const handleChange = (key) => (e) => {
        const value =
            e.target.type === "number"
                ? Number(e.target.value)
                : e.target.value;

        updateProperty(key, value);
    };

    if (!node) {
        return (
            <div className="hapa-properties-panel empty">
                No selection
            </div>
        );
    }

    return (
        <div className="hapa-properties-panel">

            {/* HEADER */}
            <div className="properties-header">
                Properties
            </div>

            {/* NODE NAME */}
            <div className="property-group">
                <label>Name</label>
                <input
                    type="text"
                    value={node.name || ""}
                    onChange={handleChange("name")}
                />
            </div>

            {/* POSITION */}
            <div className="property-row">
                <div className="property-group">
                    <label>X</label>
                    <input
                        type="number"
                        value={node.x || 0}
                        onChange={handleChange("x")}
                    />
                </div>

                <div className="property-group">
                    <label>Y</label>
                    <input
                        type="number"
                        value={node.y || 0}
                        onChange={handleChange("y")}
                    />
                </div>
            </div>

            {/* SIZE */}
            <div className="property-row">
                <div className="property-group">
                    <label>W</label>
                    <input
                        type="number"
                        value={node.width || 0}
                        onChange={handleChange("width")}
                    />
                </div>

                <div className="property-group">
                    <label>H</label>
                    <input
                        type="number"
                        value={node.height || 0}
                        onChange={handleChange("height")}
                    />
                </div>
            </div>

            {/* ROTATION */}
            <div className="property-group">
                <label>Rotation</label>
                <input
                    type="number"
                    value={node.rotation || 0}
                    onChange={handleChange("rotation")}
                />
            </div>

            {/* OPACITY */}
            <div className="property-group">
                <label>Opacity</label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={node.opacity ?? 1}
                    onChange={handleChange("opacity")}
                />
            </div>

            {/* BACKGROUND COLOR */}
            <div className="property-group">
                <label>Fill</label>
                <input
                    type="color"
                    value={node.fill || "#ffffff"}
                    onChange={handleChange("fill")}
                />
            </div>

            {/* TEXT (ONLY IF TEXT NODE) */}
            {node.type === "text" && (
                <div className="property-group">
                    <label>Text</label>
                    <input
                        type="text"
                        value={node.text || ""}
                        onChange={handleChange("text")}
                    />
                </div>
            )}

        </div>
    );
};
