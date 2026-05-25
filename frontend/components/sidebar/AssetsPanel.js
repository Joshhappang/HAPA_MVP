import React, { useEffect, useState } from "react";

/* =========================================
   HAPA MINI FIGMA - ASSETS PANEL CORE
   frontend/components/sidebar/AssetsPanel.js
========================================= */

import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";

export const AssetsPanel = ({ editor }) => {
    const [assets, setAssets] = useState([]);

    /* =========================
       LOAD ASSETS FROM EDITOR
    ========================= */

    useEffect(() => {
        if (!editor) return;

        const updateAssets = () => {
            const data = editor.getAssets?.() || [];
            setAssets(data);
        };

        updateAssets();

        editor.onAssetsChange?.(updateAssets);

        return () => {
            editor.offAssetsChange?.(updateAssets);
        };
    }, [editor]);

    /* =========================
       HANDLE INSERT ASSET TO CANVAS
    ========================= */

    const handleInsert = (asset) => {
        editor?.insertAsset?.(asset);
    };

    /* =========================
       DRAG START (FOR CANVAS DROP)
    ========================= */

    const handleDragStart = (e, asset) => {
        e.dataTransfer.setData(
            "asset",
            JSON.stringify(asset)
        );
    };

    return (
        <div className="hapa-assets-panel">

            <SidebarSection title="Assets">

                {/* EMPTY STATE */}
                {assets.length === 0 && (
                    <div className="assets-empty">
                        No assets available
                    </div>
                )}

                {/* ASSET LIST */}
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className="hapa-asset-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, asset)}
                        onClick={() => handleInsert(asset)}
                    >
                        <div className="asset-preview">
                            {asset.preview ? (
                                <img
                                    src={asset.preview}
                                    alt={asset.name}
                                />
                            ) : (
                                <div className="asset-placeholder">
                                    📦
                                </div>
                            )}
                        </div>

                        <div className="asset-name">
                            {asset.name}
                        </div>
                    </div>
                ))}

            </SidebarSection>
        </div>
    );
};
