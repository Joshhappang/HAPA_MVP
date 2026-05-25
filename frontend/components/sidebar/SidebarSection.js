import React, { useState } from "react";

/* =========================================
   HAPA MINI FIGMA - SIDEBAR SECTION CORE
   frontend/components/sidebar/SidebarSection.js
========================================= */

export const SidebarSection = ({
    title,
    children,
    defaultOpen = true,
    collapsible = true
}) => {
    const [open, setOpen] = useState(defaultOpen);

    const toggle = () => {
        if (!collapsible) return;
        setOpen(prev => !prev);
    };

    return (
        <div className="hapa-sidebar-section">

            {/* SECTION HEADER */}
            <div
                className="sidebar-section-header"
                onClick={toggle}
            >
                <span className="sidebar-section-title">
                    {title}
                </span>

                {collapsible && (
                    <span className="sidebar-section-toggle">
                        {open ? "▾" : "▸"}
                    </span>
                )}
            </div>

            {/* SECTION CONTENT */}
            {open && (
                <div className="sidebar-section-content">
                    {children}
                </div>
            )}
        </div>
    );
};
