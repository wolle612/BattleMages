function initializeCombatEffects() {
    return {
        playerStatuses: {},
        enemyStatuses: {},
        nextSpellPreps: []
    };
}

function applyEnemyShield(context, damage) {
    if (context.enemyShield > 0) {
        const blocked =
            Math.min(
                context.enemyShield,
                damage
            );

        context.enemyShield -= blocked;
        damage -= blocked;
    }

    return damage;
}

// Magischer Widerstand (Combat Condition Engine, Phase 3 Balance-
// Neukalibrierung, siehe docs/specs/combat_condition_engine_roadmap.md):
// prozentuale Schadensreduktion mit abnehmendem Grenznutzen statt
// linearem Abzug (Ruestungs-Formel-Muster aus League of Legends/Dota/
// WoW). Grund: ein linearer Abzug wird bei mehreren gestapelten
// Widerstand-Quellen in einer Rotation unweigerlich zu voller
// Unverwundbarkeit -- keine feste Zahl laesst sich dagegen sauber
// balancieren. Die prozentuale Kurve naehert sich 100% nur asymptotisch
// an, macht den vorherigen kuenstlichen Mindestschaden-1 ueberfluessig,
// und jede weitere Investition bleibt spuerbar, aber mit sinkendem
// Grenzertrag. RESISTANCE_MITIGATION_CONSTANT (K) ist der Widerstands-
// Wert, der 50% Reduktion ergibt -- reiner Balance-Tuning-Wert, siehe
// Roadmap-Dokument fuer die Herleitung.
const RESISTANCE_MITIGATION_CONSTANT = 40;

function applyPlayerResistance(context, damageTaken) {
    if (context.playerResistance <= 0 || damageTaken <= 0) {
        return damageTaken;
    }

    const reductionPercent =
        context.playerResistance /
        (context.playerResistance + RESISTANCE_MITIGATION_CONSTANT);

    return Math.max(
        0,
        Math.floor(damageTaken * (1 - reductionPercent))
    );
}

function applyPlayerShield(context, damageTaken) {
    if (context.playerShield > 0) {
        const blocked =
            Math.min(context.playerShield, damageTaken);

        context.playerShield -= blocked;
        damageTaken -= blocked;

        if (blocked > 0) {
            addCombatAction(
                context,
                `🛡 absorbiert ${blocked}`,
                {
                    type: "shield",
                    feedbackTitle: "Schild",
                    feedbackDetail: `${blocked} absorbiert`,
                    actor: "Spieler",
                    actionName: "Schild",
                    impact: `${blocked}`,
                    effectText: "absorbiert"
                }
            );
        }
    }

    return damageTaken;
}
