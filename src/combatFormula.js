function rollCrit(context, cast) {
    const critChance =
        COMBAT_FORMULA_CONSTANTS.baseCritChance +
        (cast.critChanceBonus || 0);

    const isCrit =
        cast.guaranteedCrit ||
        Math.random() < critChance;

    const multiplier =
        COMBAT_FORMULA_CONSTANTS.critDamageMultiplier +
        (cast.critDamageBonus || 0);

    return {
        isCrit,
        multiplier: isCrit ? multiplier : 1
    };
}

function getMissingLifeBonus(context, values) {
    if (!values.missingLifeBonusMax) {
        return 0;
    }

    const missingLifeRatio =
        (context.playerMaxHp - context.playerHp) /
        context.playerMaxHp;

    return Math.floor(
        values.missingLifeBonusMax * missingLifeRatio
    );
}

function getMissingLifePercentDamage(context, values) {
    if (!values.damagePerMissingLifePercent) {
        return 0;
    }

    const missingLifePercent =
        (
            (context.playerMaxHp - context.playerHp) /
            context.playerMaxHp
        ) * 100;

    return Math.floor(
        missingLifePercent *
        values.damagePerMissingLifePercent
    );
}

function getDebuffDamageBonuses(context, values, cast) {
    let bonus = 0;

    if (
        values.negativeEffectDamageBonus &&
        (
            hasEnemyNegativeEffect(context) ||
            cast.ignorePrerequisite
        )
    ) {
        bonus += values.negativeEffectDamageBonus;
    }

    if (
        values.statusDamageBonus &&
        (
            hasEnemyStatus(
                context,
                values.requiredStatusId || "vulnerable"
            ) ||
            cast.ignorePrerequisite
        )
    ) {
        bonus += values.statusDamageBonus;
    }

    if (
        values.additionalNegativeEffectDamageBonus &&
        (
            hasEnemyStatus(
                context,
                values.requiredStatusId || "vulnerable"
            ) ||
            cast.ignorePrerequisite
        )
    ) {
        bonus +=
            getAdditionalNegativeEffectCount(
                context,
                values.requiredStatusId || "vulnerable"
            ) *
            values.additionalNegativeEffectDamageBonus;
    }

    if (values.perNegativeEffectDamageBonus) {
        bonus +=
            getEnemyNegativeEffectCount(context) *
            values.perNegativeEffectDamageBonus;
    }

    if (
        values.vulnerableBonusDamage &&
        hasEnemyVulnerable(context)
    ) {
        bonus += values.vulnerableBonusDamage;
    }

    return bonus;
}

function getShieldBonusDamage(context, values) {
    if (
        !values.shieldBonusDamagePercent ||
        context.playerShield <= 0
    ) {
        return 0;
    }

    return Math.floor(
        context.playerShield *
        values.shieldBonusDamagePercent / 100
    );
}

function resolveSpellBaseDamage(values, cast) {
    if (
        values.randomDamageMin != null &&
        values.randomDamageMax != null
    ) {
        if (cast.rolledBaseDamage == null) {
            const minimum =
                Math.min(
                    values.randomDamageMin,
                    values.randomDamageMax
                );

            const maximum =
                Math.max(
                    values.randomDamageMin,
                    values.randomDamageMax
                );

            cast.rolledBaseDamage =
                minimum +
                Math.floor(
                    Math.random() *
                    (maximum - minimum + 1)
                );
        }

        return cast.rolledBaseDamage;
    }

    return values.damage || 0;
}

function getUniqueSchoolCountInRotation(context) {
    const schools =
        new Set(
            (context.rotationSpells || [])
                .map(spell => spell.school)
        );

    return schools.size;
}

function getDamagePerUniqueSchoolBonus(context, values) {
    if (!values.damagePerUniqueSchoolInRotation) {
        return 0;
    }

    const uniqueSchoolCount =
        getUniqueSchoolCountInRotation(context);

    if (uniqueSchoolCount <= 1) {
        return 0;
    }

    return (
        uniqueSchoolCount - 1
    ) * values.damagePerUniqueSchoolInRotation;
}

function calculateFlatSpellDamage(context, spell, values, cast) {
    let damage = resolveSpellBaseDamage(values, cast);

    damage += cast.flatDamageBonus || 0;
    damage += getMissingLifeBonus(context, values);
    damage += getMissingLifePercentDamage(context, values);
    damage += getDebuffDamageBonuses(context, values, cast);
    damage += getVulnerableFlatBonus(context, spell);
    damage += getSequenceDamageBonus(context, spell, values);
    damage += getShieldBonusDamage(context, values);
    damage += getDamagePerUniqueSchoolBonus(context, values);
    damage += cast.timingDamageBonus || 0;

    return Math.max(0, Math.floor(damage));
}

function applyVulnerableMultiplier(
    context,
    damage,
    values,
    cast,
    hitIndex,
    hitCount
) {
    if (!hasEnemyVulnerable(context)) {
        return damage;
    }

    const multiplied =
        Math.floor(
            damage *
            COMBAT_FORMULA_CONSTANTS.vulnerableDamageMultiplier
        );

    const shouldDeferConsume =
        cast.deferVulnerableConsume &&
        hitIndex < hitCount - 1;

    if (!shouldDeferConsume) {
        consumeEnemyVulnerable(context);
    }

    return multiplied;
}

function applyCritToDamage(
    damage,
    cast,
    values = {},
    hitIndex = 0
) {
    const allowCrit =
        hitIndex === 0 ||
        values.sequenceBothHitsCanCrit;

    if (!allowCrit) {
        return {
            damage,
            isCrit: false
        };
    }

    const critResult =
        rollCrit({}, cast);

    if (!critResult.isCrit) {
        return {
            damage,
            isCrit: false
        };
    }

    let critDamage =
        Math.floor(damage * critResult.multiplier);

    if (values.critFlatBonus) {
        critDamage += values.critFlatBonus;
    }

    if (
        values.vulnerableBonusWithoutStatus &&
        critResult.isCrit
    ) {
        critDamage =
            Math.floor(
                critDamage *
                COMBAT_FORMULA_CONSTANTS.vulnerableDamageMultiplier
            );

        critDamage +=
            values.vulnerableBonusDamage || 0;
    }

    if (
        values.shieldBonusDamageCritMultiplier &&
        values.shieldBonusDamagePercent
    ) {
        const bonusShieldDamage =
            getShieldBonusDamage(
                { playerShield: cast.lastKnownPlayerShield || 0 },
                values
            );

        critDamage +=
            bonusShieldDamage *
            (values.shieldBonusDamageCritMultiplier - 1);
    }

    return {
        damage: critDamage,
        isCrit: true
    };
}

function applySpellDamageToEnemy(context, damage, values, shieldPierce) {
    if (values.ignoreShield) {
        return damage;
    }

    if (shieldPierce <= 0 || context.enemyShield <= 0) {
        return applyEnemyShield(context, damage);
    }

    const piercedDamage =
        Math.min(
            damage,
            shieldPierce,
            context.enemyShield
        );

    const remainingDamage =
        applyEnemyShield(
            context,
            damage - piercedDamage
        );

    return piercedDamage + remainingDamage;
}

function getSpellShieldPierce(context, spell, values, cast) {
    let shieldPierce =
        cast.shieldPierce || 0;

    if (
        values.negativeEffectShieldPierce &&
        (
            hasEnemyNegativeEffect(context) ||
            cast.ignorePrerequisite
        )
    ) {
        shieldPierce +=
            values.negativeEffectShieldPierce;
    }

    if (
        values.statusShieldPierce &&
        (
            hasEnemyStatus(
                context,
                values.requiredStatusId || "vulnerable"
            ) ||
            cast.ignorePrerequisite
        )
    ) {
        shieldPierce += values.statusShieldPierce;
    }

    return shieldPierce;
}

function calculateShieldGain(context, spell, values, cast) {
    let baseShield =
        (values.shield || 0) +
        (cast.flatShieldBonus || 0);

    if (
        values.sequenceShieldBonus &&
        values.sequenceTrigger &&
        matchesSequenceTrigger(
            context,
            spell,
            values.sequenceTrigger
        )
    ) {
        baseShield += values.sequenceShieldBonus;
    }

    if (
        values.sequenceShieldGain &&
        values.sequenceTrigger &&
        matchesSequenceTrigger(
            context,
            spell,
            values.sequenceTrigger
        )
    ) {
        baseShield += values.sequenceShieldGain;
    }

    if (
        values.shieldGainIfPlayerShielded &&
        context.playerShield > 0
    ) {
        baseShield += values.shieldGainIfPlayerShielded;
    }

    if (!baseShield) {
        return 0;
    }

    const percentBonus =
        cast.shieldPercentBonus || 0;

    return Math.floor(
        baseShield * (1 + percentBonus)
    );
}

function healPlayer(context, amount) {
    context.playerHp =
        Math.min(
            context.playerMaxHp,
            context.playerHp + amount
        );
}
