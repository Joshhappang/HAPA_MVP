/* =========================================
   HAPA MINI FIGMA - TOOL ICONS CORE
   frontend/components/toolbar/ToolIcons.js
========================================= */

export const ToolIcons = {
    /* =========================
       SELECT TOOL ICON
    ========================= */

    select: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M4 3L10 21L12 14L19 12L4 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />
        </svg>
    ),

    /* =========================
       MOVE TOOL ICON
    ========================= */

    move: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 2L8 6H11V11H6V8L2 12L6 16V13H11V18H8L12 22L16 18H13V13H18V16L22 12L18 8V11H13V6H16L12 2Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
            />
        </svg>
    ),

    /* =========================
       FRAME TOOL ICON
    ========================= */

    frame: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect
                x="4"
                y="4"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />
            <path
                d="M8 4V2M16 4V2M8 22V20M16 22V20"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    ),

    /* =========================
       TEXT TOOL ICON
    ========================= */

    text: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M4 6H20M9 6V20M15 6V20"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    ),

    /* =========================
       HAND TOOL ICON
    ========================= */

    hand: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M7 11V5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5V11M11 11V3C11 2.4 11.4 2 12 2C12.6 2 13 2.4 13 3V11M15 11V5C15 4.4 15.4 4 16 4C16.6 4 17 4.4 17 5V13"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
            />
            <path
                d="M7 11V14C7 17.3 9.7 20 13 20H14C17.3 20 20 17.3 20 14V13"
                stroke="currentColor"
                strokeWidth="1.3"
            />
        </svg>
    )
};
