function initializeCombatEffects() {
    return {
        bloodDamageBonusCharges: 0,
        bloodDamageBonusValue: 0,
        bloodPactCharges: 0,
        bloodPactDamagePerHp: 0,
        bloodPactSacrificedHp: 0,
        bloodPactHealPercentOnExpire: 0,
        bloodFrenzyActive: false,
        bloodFrenzyThresholdPercent: 0,
        bloodFrenzyDamageBonus: 0,
        bloodFrenzyShieldPerBloodSpell: 0,
        enemyStatuses: {},
        nextSchoolBonuses: [],
        nextEchoBonuses: [],
        globalEchoPercent: 0,
        nextSpellEffects: [],
        nextEnemyAttackReduction: 0,
        blockNextNegativeStatus: false,
        conditionalSpellBonuses: [],
        timingEffect: null,
        globalTimingDamageBonus: 0,
        doubleNextTimingBonus: false,
        autoTimingOnHybrid: false,
        lastTimingEffectValues: null,
        momentum: 0,
        consumedMomentum: 0,
        additionalMomentumGain: 0,
        primalDamageBonus: 0
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

function reduceCooldowns(cooldowns) {
    Object.keys(cooldowns).forEach(key => {

        if (cooldowns[key] > 0) {
            cooldowns[key]--;
        }

    });
}
