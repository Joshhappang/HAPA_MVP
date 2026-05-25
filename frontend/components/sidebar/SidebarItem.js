import React from "react";

/* =========================================
   HAPA MINI FIGMA - SIDEBAR ITEM CORE
   frontend/components/sidebar/SidebarItem.js
========================================= */

export const SidebarItem = ({
    id,
    name,
    icon,
    active,
    selected,
    onClick,
    onDoubleClick,
    draggable = false,
    onDragStart,
    onDragOver,
    onDrop
}) => {
    return (
        <div
            className={`hapa-sidebar-item ${active ? "active" : ""} ${selected ? "selected" : ""}`}
            onClick={() => onClick?.(id)}
            onDoubleClick={() => onDoubleClick?.(id)}
            draggable={draggable}
            onDragStart={(e) => onDragStart?.(e, id)}
            onDragOver={(e) => onDragOver?.(e, id)}
            onDrop={(e) => onDrop?.(e, id)}
        >
            {/* ICON */}
            <div className="sidebar-item-icon">
                {typeof icon === "function" ? icon() : icon}
            </div>

            {/* NAME */}
            <div className="sidebar-item-name">
                {name}
            </div>

            {/* OPTIONAL ACTION SLOT (future: eye, lock, menu) */}
            <div className="sidebar-item-actions">
                {/* placeholder */}
            </div>
        </div>
    );
};
