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

// Ein Zauber-Cast (resolveSpellCast, spellEngine.js) kann mehrere Effekte
// (effects[]) haben, von denen jeder seinen eigenen actionQueue-Eintrag und
// damit seinen eigenen Moment erzeugt (z. B. "deal_damage" + "gain_shield").
// Ohne diese Erkennung wuerde jeder dieser Momente die volle Cast-Phase
// (den Beschwoerungs-Flash am Zauberer) erneut abspielen, obwohl es sich
// gameplay-seitig um EINEN Cast handelt. Nur direkt aufeinanderfolgende
// Momente desselben Zaubers gelten als Fortsetzung; ein Wechsel des Akteurs
// oder ein anderer Zauber dazwischen zaehlt nicht.
function isContinuationOfSameSpellCast(moment, previousMoment) {
    if (!previousMoment) {
        return false;
    }

    const spellId =
        getCombatFeedbackView(moment).spellId;

    if (!spellId) {
        return false;
    }

    return getCombatFeedbackView(previousMoment).spellId === spellId;
}

// Widerstandsgewinn (Zauber mit gain_resistance) bekommt keine volle
// Zauber-VFX-Kette (Cast/Projektil/Impact) -- der eigene, kurze
// Porträt-Burst (playPortraitResistanceRise, siehe portraitRegistry.js)
// deckt das Feedback vollstaendig ab. Ohne diesen fruehen Ausstieg wuerde
// zusaetzlich noch der Schul-Impact der Zauberschule aufs eigene Portrait
// abgespielt -- bei Zaubern mit deal_damage + gain_resistance in einem
// Cast wirkt das wie ein zweiter, unnoetig lauter Effekt direkt nach dem
// Schadens-Impact am Gegner. Analog zu gain_shield, das denselben
// Sonderfall schon rein ueber den eigenen Porträt-Effekt loest, ohne dass
// die volle Kette dafuer je unterdrueckt wurde -- hier bewusst explizit
// gemacht, weil Widerstand sonst sichtbar "zu viel los" erzeugt hat.
function isResistanceGainVfxMoment(action) {
    return (
        typeof isResistanceGainCombatAction === "function" &&
        isResistanceGainCombatAction(action)
    );
}

function playVfxForCombatMoment(moment, action, presentationCallbacks = {}, previousMoment = null) {
    if (!isVfxSupported() || isResistanceGainVfxMoment(action)) {
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
        onImpact: presentationCallbacks.onImpact,
        skipCast: isContinuationOfSameSpellCast(moment, previousMoment)
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

function estimateCombatVfxImpactDelay(moment, action, previousMoment = null) {
    if (isResistanceGainVfxMoment(action)) {
        return 0;
    }

    const feedbackView =
        getCombatFeedbackView(moment);

    const context =
        buildCombatVfxContext(moment, action);

    const skipCast =
        isContinuationOfSameSpellCast(moment, previousMoment);

    if (feedbackView.spellId && getSpellById(feedbackView.spellId)) {
        return estimateVfxImpactDelayMs(
            resolveSpellVfxDefinition(feedbackView.spellId),
            context,
            skipCast
        );
    }

    if (feedbackView.iconKey) {
        return estimateVfxImpactDelayMs(
            resolveEnemyActionVfxDefinition(feedbackView.iconKey),
            context,
            skipCast
        );
    }

    return 0;
}
