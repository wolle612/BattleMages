const PORTRAIT_EFFECT_ASSETS = {
    vulnerable: "assets/effects/impact/vulnerable.png"
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
    return Object
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
