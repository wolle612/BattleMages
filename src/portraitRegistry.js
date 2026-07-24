const PORTRAIT_SHIELD_RISE_ASSET = {
    sheet: "assets/effects/shield/portrait_shield_rise/portrait_shield_rise_sheet.png",
    frameCount: 8,
    durationMs: 640
};

const PORTRAIT_ENTITY_OVERRIDES = {
    dev_training_dummy: "enemy"
};

const PORTRAIT_PROFILES = {
    player: {
        directory: "assets/portraits/player",
        portraitId: "player"
    },
    enemy: {
        directory: "assets/portraits/enemies",
        portraitIdFromEntity: true,
        fallbackPortraitId: "enemy"
    },
    boss: {
        directory: "assets/portraits/enemies",
        portraitIdFromEntity: true,
        fallbackPortraitId: "enemy"
    },
    npc: {
        directory: "assets/portraits/npcs",
        portraitIdFromEntity: true,
        fallbackPortraitId: "npc"
    },
    event: {
        directory: "assets/portraits/events",
        portraitIdFromEntity: true,
        fallbackPortraitId: "event"
    }
};

function buildPortraitPath(directory, portraitId) {
    if (!directory || !portraitId) {
        return null;
    }

    return `${directory}/${portraitId}.png`;
}

function resolvePortraitId(profile, entityId) {
    if (entityId && PORTRAIT_ENTITY_OVERRIDES[entityId]) {
        return PORTRAIT_ENTITY_OVERRIDES[entityId];
    }

    if (profile.portraitId) {
        return profile.portraitId;
    }

    if (profile.portraitIdFromEntity) {
        return entityId || profile.fallbackPortraitId || null;
    }

    return entityId || null;
}

function getPortraitProfile(combatantType) {
    return PORTRAIT_PROFILES[combatantType] || null;
}

function getCombatantPortraitSources(combatantType, entityId) {
    const profile =
        getPortraitProfile(combatantType);

    if (!profile) {
        return null;
    }

    const portraitId =
        resolvePortraitId(profile, entityId);

    const primary =
        buildPortraitPath(profile.directory, portraitId);

    if (!primary) {
        return null;
    }

    const fallback =
        profile.fallbackPortraitId &&
        profile.fallbackPortraitId !== portraitId
            ? buildPortraitPath(
                profile.directory,
                profile.fallbackPortraitId
            )
            : null;

    return {
        primary,
        fallback
    };
}

function getCombatantPortraitPath(combatantType, entityId) {
    return getCombatantPortraitSources(
        combatantType,
        entityId
    )?.primary || null;
}

function renderPortraitEffectOverlaysHtml() {
    const vulnerableEffect = `
        <div
            class="combatant-portrait-effect combatant-portrait-effect--vulnerable"
            aria-hidden="true"
        ></div>
    `;

    const shieldEffect = `
        <div
            class="combatant-portrait-effect combatant-portrait-effect--shield"
            aria-hidden="true"
        ></div>
    `;

    const precisionEffect = `
        <div
            class="combatant-portrait-effect combatant-portrait-effect--precision"
            aria-hidden="true"
        ></div>
    `;

    return `${vulnerableEffect}${shieldEffect}${precisionEffect}`;
}

function statusListHasVulnerable(statuses) {
    return (statuses || []).some(status =>
        status.id === "vulnerable" ||
        status.id === "wound"
    );
}

function updatePortraitSlotVulnerable(slot, isVulnerable) {
    if (!slot) {
        return;
    }

    slot.classList.toggle(
        "combatant-portrait-slot--vulnerable",
        isVulnerable
    );
}

function updatePortraitVulnerableOverlays(action) {
    updatePortraitSlotVulnerable(
        document.querySelector(".player-panel .combatant-portrait-slot"),
        statusListHasVulnerable(action.playerStatuses)
    );

    updatePortraitSlotVulnerable(
        document.querySelector(".enemy-panel .combatant-portrait-slot"),
        statusListHasVulnerable(action.enemyDebuffs)
    );
}

function updatePortraitShieldOverlays(action) {
    updatePortraitSlotShielded(
        document.querySelector(".player-panel .combatant-portrait-slot"),
        (action.playerShield || 0) > 0
    );

    updatePortraitSlotShielded(
        document.querySelector(".enemy-panel .combatant-portrait-slot"),
        (action.enemyShield || 0) > 0
    );
}

function updatePortraitSlotShielded(slot, isShielded) {
    if (!slot) {
        return;
    }

    slot.classList.toggle(
        "combatant-portrait-slot--shielded",
        isShielded
    );

    if (!isShielded) {
        slot.classList.remove("combatant-portrait-slot--shield-rise");
    }
}

function statusListHasPrecision(statuses) {
    return (statuses || []).some(status => status.id === "precision");
}

function updatePortraitPrecisionOverlay(action) {
    const slot =
        document.querySelector(".player-panel .combatant-portrait-slot");

    if (!slot) {
        return;
    }

    slot.classList.toggle(
        "combatant-portrait-slot--precision",
        statusListHasPrecision(action.playerStatuses)
    );
}

function getPlayerResistanceValue(statuses) {
    return (statuses || [])
        .find(status => status.id === "resistance")
        ?.stacks || 0;
}

// Muss mit RESISTANCE_MITIGATION_CONSTANT (effectEngine.js,
// applyPlayerResistance) uebereinstimmen -- reine Anzeige-Ableitung der
// dortigen Formel, keine eigene Balance-Quelle. Bei einer Aenderung des
// Balance-Werts dort auch hier nachziehen.
function getResistanceReductionPercent(resistanceValue) {
    if (resistanceValue <= 0) {
        return 0;
    }

    return Math.round(
        (resistanceValue / (resistanceValue + RESISTANCE_MITIGATION_CONSTANT)) * 100
    );
}

function updatePlayerResistanceBadge(action) {
    const badge =
        document.getElementById("playerResistanceBadge");

    if (!badge) {
        return;
    }

    const value =
        getPlayerResistanceValue(action.playerStatuses);

    badge.hidden = value <= 0;

    const valueLabel =
        badge.querySelector(".resistance-badge-value");

    if (valueLabel) {
        valueLabel.textContent = value;
    }

    const tooltipValue =
        badge.querySelector(".resistance-badge-tooltip-value");

    if (tooltipValue) {
        tooltipValue.textContent = value;
    }

    const tooltipPercent =
        badge.querySelector(".resistance-badge-tooltip-percent");

    if (tooltipPercent) {
        tooltipPercent.textContent =
            getResistanceReductionPercent(value);
    }
}

function isShieldGainCombatAction(action) {
    if (!action || action.type !== "shield") {
        return false;
    }

    const impact =
        action.impact ||
        (action.feedbackDetail && action.feedbackDetail.startsWith("+")
            ? action.feedbackDetail.match(/\+(\d+)/)?.[0]
            : "");

    return typeof impact === "string" && impact.startsWith("+");
}

function playPortraitShieldRise(targetSide) {
    const selector =
        targetSide === "enemy"
            ? ".enemy-panel .combatant-portrait-slot"
            : ".player-panel .combatant-portrait-slot";

    const slot =
        document.querySelector(selector);

    if (!slot) {
        return;
    }

    slot.classList.remove("combatant-portrait-slot--shield-rise");
    void slot.offsetWidth;
    slot.classList.add("combatant-portrait-slot--shield-rise");
}

function applyPortraitPlaceholder(slot) {
    slot.classList.add("combatant-portrait-slot--placeholder");

    slot
        .querySelector(".combatant-portrait-image")
        ?.remove();
}

function bindCombatantPortrait(slot) {
    const image =
        slot.querySelector(".combatant-portrait-image");

    if (!image) {
        return;
    }

    image.addEventListener("error", () => {
        const fallbackSrc =
            image.dataset.portraitFallback;

        if (
            fallbackSrc &&
            image.dataset.portraitUsingFallback !== "true"
        ) {
            image.dataset.portraitUsingFallback = "true";
            image.src = fallbackSrc;
            return;
        }

        applyPortraitPlaceholder(slot);
    });

    if (image.complete && image.naturalWidth === 0) {
        image.dispatchEvent(new Event("error"));
    }

    slot
        .querySelectorAll(".combatant-portrait-effect")
        .forEach(effectImage => {
            effectImage.addEventListener("error", () => {
                effectImage.remove();
            });
        });
}

function bindCombatantPortraits(root = document) {
    root
        .querySelectorAll(".combatant-portrait-slot")
        .forEach(bindCombatantPortrait);
}
