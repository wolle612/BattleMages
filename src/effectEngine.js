function initializeCombatEffects() {
    return {
        burnDuration: 0,
        burnDamage: 2,
        slowDuration: 0,
        brittleDuration: 0,
        fireBuffDuration: 0,
        fireBuffActive: false
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

function applyBurnDamage(context) {
    if (
        context.effects.burnDuration > 0 &&
        context.enemyHp > 0
    ) {

        let currentBurnDamage =
            context.effects.burnDamage;

        if (context.effects.fireBuffDuration > 0) {

            currentBurnDamage += 1;
        }

        context.enemyHp -= currentBurnDamage;

        addCombatAction(
            context,
            `${context.enemy.name} erleidet ${currentBurnDamage} Brennschaden. (🔥)`,
            {
                type: "burn",
                feedbackTitle: "Brennen",
                feedbackDetail: `-${currentBurnDamage} Schaden`,
                actor: "Brennen",
                actionName: "Brennen",
                impact: `-${currentBurnDamage}`,
                effectText: "Schaden"
            }
        );

        context.effects.burnDuration--;
    }
}

function expireBrittle(context) {
    if (context.effects.brittleDuration > 0) {
        context.effects.brittleDuration--;
    }
}

function expireFireBuff(context) {
    if (context.effects.fireBuffDuration > 0) {

        context.effects.fireBuffDuration--;

        if (context.effects.fireBuffDuration === 0) {

            context.effects.fireBuffActive = false;

            addCombatAction(
                context,
                `Brennendes Blut endet.`,
                {
                    type: "status",
                    feedbackTitle: "Brennendes Blut",
                    feedbackDetail: "endet",
                    actionName: "Brennendes Blut",
                    effectText: "endet"
                }
            );
        }
    }
}

function reduceCooldowns(cooldowns) {
    Object.keys(cooldowns).forEach(key => {

        if (cooldowns[key] > 0) {
            cooldowns[key]--;
        }

    });
}
