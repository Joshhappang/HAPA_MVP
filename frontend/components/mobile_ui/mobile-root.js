import { createMobileNavbar } from "./mobile-navbar.js";
import { createBottomNav } from "./mobile-bottom-nav.js";
import { createMobileCanvas } from "./mobile-canvas.js";
import { createGestureLayer } from "./mobile-gesture-layer.js";
import { createFloatingActions } from "./mobile-floating-actions.js";

export function mountMobileUI() {
    const root = document.createElement("div");
    root.className = "mobile-root";

    const navbar = createMobileNavbar();
    const canvas = createMobileCanvas();
    const bottom = createBottomNav();
    const gestures = createGestureLayer();
    const fab = createFloatingActions();

    root.appendChild(navbar);
    root.appendChild(canvas);
    root.appendChild(bottom);
    root.appendChild(fab);
    root.appendChild(gestures);

    document.body.appendChild(root);

    return root;
}
