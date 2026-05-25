import React, { useEffect, useState } from "react";

/* =========================================
   HAPA MINI FIGMA - PAGES PANEL CORE
   frontend/components/sidebar/PagesPanel.js
========================================= */

import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";

export const PagesPanel = ({ editor }) => {
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState(null);

    /* =========================
       LOAD PAGES FROM EDITOR
    ========================= */

    useEffect(() => {
        if (!editor) return;

        const updatePages = () => {
            const data = editor.getPages?.() || [];
            setPages(data);

            const current = editor.getActivePage?.();
            setActivePage(current);
        };

        updatePages();

        editor.onPagesChange?.(updatePages);

        return () => {
            editor.offPagesChange?.(updatePages);
        };
    }, [editor]);

    /* =========================
       HANDLE PAGE SWITCH
    ========================= */

    const handleSelectPage = (pageId) => {
        editor?.setActivePage?.(pageId);
        setActivePage(pageId);
    };

    /* =========================
       ADD NEW PAGE
    ========================= */

    const handleAddPage = () => {
        const newPage = editor?.createPage?.({
            name: `Page ${pages.length + 1}`
        });

        if (newPage?.id) {
            handleSelectPage(newPage.id);
        }
    };

    return (
        <div className="hapa-pages-panel">

            <SidebarSection title="Pages">

                {/* PAGE LIST */}
                {pages.map((page) => (
                    <SidebarItem
                        key={page.id}
                        id={page.id}
                        name={page.name || "Untitled Page"}
                        icon="📄"
                        active={activePage === page.id}
                        selected={activePage === page.id}
                        onClick={handleSelectPage}
                    />
                ))}

                {/* ADD PAGE BUTTON */}
                <div
                    className="hapa-add-page"
                    onClick={handleAddPage}
                >
                    + New Page
                </div>

            </SidebarSection>
        </div>
    );
};
