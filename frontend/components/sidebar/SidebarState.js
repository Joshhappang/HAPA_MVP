import { useSyncExternalStore } from "react";

/* =========================================
   HAPA MINI FIGMA - SIDEBAR STATE CORE
   frontend/components/sidebar/SidebarState.js
========================================= */

/**
 * GLOBAL SIDEBAR STATE STORE
 * simple event-based state system (tanpa Redux)
 */

const SidebarStore = {
    activeTab: "layers",
    listeners: new Set(),

    setActiveTab(tab) {
        this.activeTab = tab;
        this.emit();
    },

    getActiveTab() {
        return this.activeTab;
    },

    subscribe(listener) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    },

    emit() {
        this.listeners.forEach((listener) => {
            listener(this.activeTab);
        });
    }
};

/* =========================
   PUBLIC API (NON-REACT)
========================= */

export const SidebarState = {
    setActiveTab: (tab) => SidebarStore.setActiveTab(tab),

    getActiveTab: () => SidebarStore.getActiveTab(),

    subscribe: (listener) => SidebarStore.subscribe(listener)
};

/* =========================
   REACT HOOK (OPTIONAL)
========================= */

export const useSidebarState = () => {
    return useSyncExternalStore(
        SidebarStore.subscribe.bind(SidebarStore),
        SidebarStore.getActiveTab.bind(SidebarStore),
        SidebarStore.getActiveTab.bind(SidebarStore)
    );
};
