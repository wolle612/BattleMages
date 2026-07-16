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
