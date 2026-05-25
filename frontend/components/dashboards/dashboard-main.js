import { createDashboardHeader } from "./dashboard-header.js";
import { createDashboardSidebar } from "./dashboard-sidebar.js";
import { createDashboardCards } from "./dashboard-cards.js";
import { createDashboardStats } from "./dashboard-stats.js";
import { createDashboardActivity } from "./dashboard-activity.js";
import { createDashboardProjects } from "./dashboard-projects.js";
import { createDashboardWidgets } from "./dashboard-widgets.js";

export function mountDashboard() {
    const root = document.createElement("div");
    root.className = "dashboard";

    const layout = document.createElement("div");
    layout.className = "dashboard-layout";

    layout.appendChild(createDashboardSidebar());

    const main = document.createElement("div");
    main.className = "dashboard-main";

    main.appendChild(createDashboardHeader());
    main.appendChild(createDashboardCards());
    main.appendChild(createDashboardStats());
    main.appendChild(createDashboardProjects());
    main.appendChild(createDashboardActivity());
    main.appendChild(createDashboardWidgets());

    layout.appendChild(main);
    root.appendChild(layout);

    return root;
}
