// "vulnerable" ist absichtlich deaktiviert: das alte Asset (vulnerable.png)
// war fehlerhaft und wurde geloescht. Die CSS-Klasse
// (combatant-portrait-slot--vulnerable) wird weiterhin toggled (siehe
// updatePortraitVulnerableOverlays), es existiert nur aktuell kein Bild dafuer.
// Neues Asset einfach wieder hier eintragen, um die Visualisierung zu
// reaktivieren.
const PORTRAIT_EFFECT_ASSETS = {};

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

function getPortraitEffectAsset(effectId) {
    return PORTRAIT_EFFECT_ASSETS[effectId] || null;
}

function renderPortraitEffectOverlaysHtml() {
    const staticEffects =
        Object
            .entries(PORTRAIT_EFFECT_ASSETS)
            .map(([effectId, asset]) => `
            <img
                class="combatant-portrait-effect combatant-portrait-effect--${effectId}"
                src="${asset}"
                alt=""
                aria-hidden="true"
            />
        `)
            .join("");

    const shieldEffect = `
        <div
            class="combatant-portrait-effect combatant-portrait-effect--shield"
            aria-hidden="true"
        ></div>
    `;

    return `${staticEffects}${shieldEffect}`;
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
