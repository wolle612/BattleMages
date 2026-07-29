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

// Widerstands- und Schildgewinn bekommen keine volle Zauber-/Aktions-VFX-
// Kette (Cast/Projektil/Impact) -- der eigene, kurze Porträt-Burst
// (playPortraitResistanceRise/playPortraitShieldRise, siehe
// portraitRegistry.js) deckt das Feedback vollstaendig ab. Ohne diesen
// fruehen Ausstieg wuerde zusaetzlich noch der Schul-/Aktions-Impact aufs
// eigene Portrait abgespielt -- bei Zaubern/Aktionen mit deal_damage +
// gain_resistance (Spieler) bzw. bei Gegner-Aktionen wie rune_shield/
// nameless_shield, die ueber VFX_ENEMY_ACTION_STYLE_KEYS (siehe
// data/vfx/enemyActionVfxDefaults.js) einer vollen Schul-VFX zugeordnet
// sind, wirkte das wie ein zweiter, unnoetig lauter Effekt direkt nach dem
// eigentlichen Impact. Urspruenglich nur fuer Widerstand gefixt
// (2026-07-29); beim Gegenchecken bestaetigt, dass Schild denselben Bug
// hat -- Spieler-Schild ist zwar seit der Widerstand-Migration toter Code
// (kein Zauber vergibt noch gain_shield/increase_shield_percent/
// gain_shield_from_dealt_damage an den Spieler, context.playerShield
// bleibt immer 0), aber Gegner nutzen gain_shield weiterhin aktiv.
function isPortraitBurstOnlyMoment(action) {
    return (
        (typeof isResistanceGainCombatAction === "function" &&
            isResistanceGainCombatAction(action)) ||
        (typeof isShieldGainCombatAction === "function" &&
            isShieldGainCombatAction(action))
    );
}

function playVfxForCombatMoment(moment, action, presentationCallbacks = {}, previousMoment = null) {
    if (!isVfxSupported() || isPortraitBurstOnlyMoment(action)) {
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
    if (isPortraitBurstOnlyMoment(action)) {
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
