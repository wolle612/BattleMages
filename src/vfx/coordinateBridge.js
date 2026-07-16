const VFX_ANCHOR_SELECTORS = {
    player: ".combatant-portrait-slot--player",
    enemy: ".combatant-portrait-slot--enemy",
    stage: ".action-popup-stage"
};

function resolveVfxAnchorPoint(anchorKey) {
    mountVfxStage();

    const host =
        document.querySelector(".battle-arena");

    const selector =
        VFX_ANCHOR_SELECTORS[anchorKey];

    if (!host || !selector) {
        return null;
    }

    let anchorElement =
        document.querySelector(selector);

    if (!anchorElement && anchorKey === "player") {
        anchorElement =
            document.querySelector(".player-panel .combatant-portrait-slot");
    }

    if (!anchorElement && anchorKey === "enemy") {
        anchorElement =
            document.querySelector(".enemy-panel .combatant-portrait-slot");
    }

    if (!anchorElement) {
        return null;
    }

    resizeVfxStageToHost();

    const hostRect =
        host.getBoundingClientRect();

    if (hostRect.width <= 0 || hostRect.height <= 0) {
        return null;
    }

    const anchorRect =
        anchorElement.getBoundingClientRect();

    return {
        x: anchorRect.left + anchorRect.width / 2 - hostRect.left,
        y: anchorRect.top + anchorRect.height / 2 - hostRect.top
    };
}
