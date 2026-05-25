/* =========================================
   HAPA MINI FIGMA - INSPECTOR UTILS CORE
   frontend/components/inspector/InspectorUtils.js
========================================= */

/* =========================
   NUMBER CLAMP
========================= */

export function clamp(value, min = -Infinity, max = Infinity) {
    if (typeof value !== "number" || isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
}

/* =========================
   SAFE GET (nested object)
========================= */

export function get(obj, path, fallback = null) {
    if (!obj) return fallback;

    const keys = path.split(".");
    let current = obj;

    for (let key of keys) {
        if (!current || typeof current !== "object") {
            return fallback;
        }
        current = current[key];
    }

    return current !== undefined ? current : fallback;
}

/* =========================
   SAFE SET (immutable update)
========================= */

export function set(obj, path, value) {
    const keys = path.split(".");
    const result = Array.isArray(obj) ? [...obj] : { ...obj };

    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
        } else {
            current[key] = Array.isArray(current[key])
                ? [...current[key]]
                : { ...current[key] };
        }

        current = current[key];
    }

    current[keys[keys.length - 1]] = value;

    return result;
}

/* =========================
   DEEP MERGE (node update)
========================= */

export function deepMerge(target, patch) {
    const output = Array.isArray(target) ? [...target] : { ...target };

    for (const key in patch) {
        const val = patch[key];

        if (
            val &&
            typeof val === "object" &&
            !Array.isArray(val) &&
            typeof output[key] === "object" &&
            !Array.isArray(output[key])
        ) {
            output[key] = deepMerge(output[key], val);
        } else {
            output[key] = val;
        }
    }

    return output;
}

/* =========================
   IS EMPTY CHECK
========================= */

export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;

    return false;
}

/* =========================
   NORMALIZE NODE
========================= */

export function normalizeNode(node) {
    if (!node) return null;

    return {
        id: node.id || null,
        type: node.type || "unknown",

        x: node.x || 0,
        y: node.y || 0,
        width: node.width || 100,
        height: node.height || 100,

        rotation: node.rotation || 0,

        style: {
            fill: "#ffffff",
            stroke: "#000000",
            strokeWidth: 0,
            opacity: 1,
            radius: 0,
            shadowBlur: 0,
            ...(node.style || {})
        },

        text: node.text || "",
        src: node.src || null,

        ...node
    };
}

/* =========================
   CLONE NODE (safe copy)
========================= */

export function cloneNode(node) {
    return JSON.parse(JSON.stringify(node));
}

/* =========================
   GENERATE NODE ID
========================= */

export function generateId(prefix = "node") {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/* =========================
   EQUALITY CHECK (shallow)
========================= */

export function shallowEqual(a, b) {
    if (a === b) return true;

    if (!a || !b) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
        if (a[key] !== b[key]) return false;
    }

    return true;
}
