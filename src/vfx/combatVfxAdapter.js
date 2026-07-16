/*
 * Duenne Bruecke zwischen der Presentation-Schicht (renderer.js) und der
 * VFX-Engine. Enthaelt keine Gameplay-Logik und keine eigene Zahlen-
 * berechnung. Nutzt bewusst dieselben Resolver-Funktionen wie renderer.js
 * (getCombatFeedbackView, getMomentActor, getImpactTarget) statt eigener
 * Heuristiken, um keine zweite, abweichende Interpretation des
 * actionQueue/moment-Datenmodells zu erzeugen (siehe Architekturplan,
 * Abschnitt 2 und Risiko 7).
 */

function buildCombatVfxContext(moment, action) {
    const casterSide =
        getMomentActor(moment) === "enemy" ? "enemy" : "player";

    const targetSide =
        getImpactTarget(action) ||
        (casterSide === "enemy" ? "player" : "enemy");

    return {
        caster: casterSide,
        target: targetSide
    };
}

function playVfxForCombatMoment(moment, action, presentationCallbacks = {}) {
    if (!isVfxSupported()) {
        if (typeof presentationCallbacks.onImpact === "function") {
            presentationCallbacks.onImpact();
        }

        return;
    }

    // Der renderer bleibt alleinige Zeit-Autoritaet: wartet die naechste
    // Kampfaktion nicht auf das Ende der laufenden Animation, wird diese
    // sanft unterbrochen statt liegenzubleiben (siehe Architekturplan,
    // Abschnitt 5 / Risiko 4).
    interruptAllVfx();

    const context =
        buildCombatVfxContext(moment, action);

    const feedbackView =
        getCombatFeedbackView(moment);

    const vfxOptions = {
        onImpact: presentationCallbacks.onImpact
    };

    if (feedbackView.spellId && getSpellById(feedbackView.spellId)) {
        playSpellVfx(feedbackView.spellId, context, vfxOptions);
        return;
    }

    if (feedbackView.iconKey) {
        playEnemyActionVfx(feedbackView.iconKey, context, vfxOptions);
    } else if (typeof presentationCallbacks.onImpact === "function") {
        presentationCallbacks.onImpact();
    }
}

function estimateCombatVfxImpactDelay(moment, action) {
    const feedbackView =
        getCombatFeedbackView(moment);

    const context =
        buildCombatVfxContext(moment, action);

    if (feedbackView.spellId && getSpellById(feedbackView.spellId)) {
        return estimateVfxImpactDelayMs(
            resolveSpellVfxDefinition(feedbackView.spellId),
            context
        );
    }

    if (feedbackView.iconKey) {
        return estimateVfxImpactDelayMs(
            resolveEnemyActionVfxDefinition(feedbackView.iconKey),
            context
        );
    }

    return 0;
}
