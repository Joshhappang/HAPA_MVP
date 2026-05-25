/* =========================================
   HAPA MINI FIGMA - BillingSettings
   frontend/pages/settings/BillingSettings.js
========================================= */

/**
 * BillingSettings - pengaturan subscription & usage
 * plan, AI usage, upgrade, invoice
 */

export default function BillingSettings({
    settingsStore,
    uiStore
}) {
    /* =========================
       GET BILLING DATA
    ========================= */

    function getBilling() {
        return (
            settingsStore?.getState?.()
                ?.billing || {
                plan: "free",
                aiUsage: 120,
                aiLimit: 500,
                billingCycle: "monthly",
                nextBilling: "2026-06-01"
            }
        );
    }

    /* =========================
       UPGRADE PLAN
    ========================= */

    function upgrade(plan) {
        const billing = getBilling();

        settingsStore.setState({
            billing: {
                ...billing,
                plan
            }
        });

        uiStore?.notify?.(
            `Upgraded to ${plan.toUpperCase()} plan`,
            "success"
        );
    }

    /* =========================
       SAVE BILLING
    ========================= */

    function save() {
        settingsStore?.save?.();

        uiStore?.notify?.(
            "Billing settings updated",
            "success"
        );
    }

    /* =========================
       FORMAT USAGE
    ========================= */

    function usagePercent() {
        const b = getBilling();

        return Math.round(
            (b.aiUsage / b.aiLimit) * 100
        );
    }

    /* =========================
       RENDER PLAN CARD
    ========================= */

    function renderPlanCard(name, price, desc, current) {
        return `
        <div class="plan-card ${
            current ? "active" : ""
        }">

            <h3>${name}</h3>
            <div class="price">${price}</div>
            <p>${desc}</p>

            ${
                current
                    ? `<span class="active-badge">Current Plan</span>`
                    : `<button onclick="window.__upgradePlan('${name.toLowerCase()}')">
                        Upgrade
                       </button>`
            }

        </div>
        `;
    }

    /* =========================
       RENDER
    ========================= */

    const billing = getBilling();

    return `
<div class="billing-settings">

    <div class="settings-title">
        💳 Billing Settings
    </div>

    <!-- CURRENT PLAN -->
    <div class="billing-section">

        <h3>Current Plan</h3>

        <div class="current-plan">
            <strong>${billing.plan.toUpperCase()}</strong>
        </div>

    </div>

    <!-- USAGE -->
    <div class="billing-section">

        <h3>AI Usage</h3>

        <div class="usage-bar">

            <div class="usage-fill"
                style="width:${usagePercent()}%">
            </div>

        </div>

        <div class="usage-text">
            ${billing.aiUsage} / ${billing.aiLimit} requests
            (${usagePercent()}%)
        </div>

    </div>

    <!-- PLANS -->
    <div class="billing-plans">

        ${renderPlanCard(
            "Free",
            "$0",
            "Basic AI + Editor tools",
            billing.plan === "free"
        )}

        ${renderPlanCard(
            "Pro",
            "$9/mo",
            "Advanced AI + Collaboration",
            billing.plan === "pro"
        )}

        ${renderPlanCard(
            "Team",
            "$19/mo",
            "Full SaaS + Team features",
            billing.plan === "team"
        )}

    </div>

    <!-- BILLING INFO -->
    <div class="billing-info">

        <p>Billing Cycle: ${billing.billingCycle}</p>
        <p>Next Billing: ${billing.nextBilling}</p>

    </div>

    <!-- ACTIONS -->
    <div class="settings-actions">

        <button onclick="window.__saveBilling()">
            Save Billing
        </button>

    </div>

</div>
    `;
}

/* =========================
   GLOBAL BRIDGE FUNCTIONS
========================= */

window.__upgradePlan = null;
window.__saveBilling = null;
