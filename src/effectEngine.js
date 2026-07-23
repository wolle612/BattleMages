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

// Magischer Widerstand (Combat Condition Engine, siehe
// docs/design/BattleMages_Combat_Condition_Engine_Spec.md, Abschnitt
// 4.1): reduziert JEDEN eingehenden Treffer permanent, wird dabei nie
// selbst verringert (im Unterschied zu applyPlayerShield unten). Wird
// VOR dem Schild verrechnet. Mindestens 1 Schaden bleibt immer
// bestehen, damit Widerstand niemals zu vollständiger Unverwundbarkeit
// führt -- die Grenze gilt nur hier an der Widerstands-Stufe, ein
// danach noch vorhandener Schild kann den Rest trotzdem vollstaendig
// abfangen.
function applyPlayerResistance(context, damageTaken) {
    if (context.playerResistance <= 0 || damageTaken <= 0) {
        return damageTaken;
    }

    return Math.max(1, damageTaken - context.playerResistance);
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
