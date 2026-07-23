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

// Widerstands-Gegenstueck zu getShieldBonusDamage() unten. Anders als
// beim Schild-Original ist dies KEIN "gib Verteidigung fuer Schaden
// auf"-Tausch mehr (Widerstand wird dabei nicht verbraucht, siehe
// applyPlayerResistance) -- eher ein reiner Skalierungsbonus fuer
// investierten Widerstand. Bewusst so uebernommen (faithful mechanical
// port, siehe Migrationstabelle shield_wall Pfad B); ob das ohne
// Deckel/Diminishing-Returns balanciert bleibt, ist eine offene Frage
// fuer die Balance-Phase (Abschnitt 4.1 der Spec).
function getResistanceBonusDamage(context, values) {
    if (
        !values.resistanceBonusDamagePercent ||
        context.playerResistance <= 0
    ) {
        return 0;
    }

    return Math.floor(
        context.playerResistance *
        values.resistanceBonusDamagePercent / 100
    );
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

// Bedingter Widerstand-Skalierungsschaden -- Gegenstueck zu
// deal_shield_damage/dealShieldDamage OHNE Verbrauch (Widerstand wird
// nie konsumiert, siehe applyPlayerResistance). Der Bonus ist deshalb
// an eine Sequence-Bedingung gekoppelt (typischerweise
// after_protection) statt an "wie viel Schild ist noch da" -- ersetzt
// fuer migrierte Zauber (z. B. shield_breaker) die alte
// Schild-Verbrauchslogik vollstaendig ueber den normalen
// deal_damage-Pfad, kein eigener Effekt-Typ mehr noetig.
function getSequenceGatedResistanceBonusDamage(context, spell, values) {
    if (
        !values.resistanceBonusDamagePercentOnSequence ||
        !values.sequenceTrigger ||
        !matchesSequenceTrigger(context, spell, values.sequenceTrigger)
    ) {
        return 0;
    }

    return Math.floor(
        context.playerResistance *
        values.resistanceBonusDamagePercentOnSequence / 100
    );
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
    damage += getResistanceBonusDamage(context, values);
    damage += getSequenceGatedResistanceBonusDamage(context, spell, values);
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

    // Widerstands-Gegenstueck: liest den in resolveSpellDamageHit()
    // (spellEngine.js) vorab in cast.lastKnownSequenceResistanceBonus
    // zwischengespeicherten Wert, da applyCritToDamage() keinen Zugriff
    // auf den echten context/spell hat (gleiches Muster wie oben bei
    // lastKnownPlayerShield).
    if (
        values.resistanceBonusDamageCritMultiplier &&
        cast.lastKnownSequenceResistanceBonus
    ) {
        critDamage +=
            cast.lastKnownSequenceResistanceBonus *
            (values.resistanceBonusDamageCritMultiplier - 1);
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

// Magischer Widerstand -- Formel-Gegenstueck zu calculateShieldGain()
// oben. Bewusst identischer Aufbau (Basiswert + Sequence-Bonus +
// Praesenz-Bonus + Prozent-Multiplikator), damit bestehende
// Zauber-Muster (Sequence-verstaerkte Generatoren, Verstaerker-Zauber)
// unveraendert uebertragen werden koennen. Der einzige Unterschied
// steckt nicht in dieser Formel, sondern darin, wie der Rueckgabewert
// spaeter verrechnet wird (siehe applyPlayerResistance in
// effectEngine.js: nie konsumiert, im Unterschied zu Schild).
function calculateResistanceGain(context, spell, values, cast) {
    let baseResistance =
        (values.resistance || 0) +
        (cast.flatResistanceBonus || 0);

    if (
        values.sequenceResistanceBonus &&
        values.sequenceTrigger &&
        matchesSequenceTrigger(
            context,
            spell,
            values.sequenceTrigger
        )
    ) {
        baseResistance += values.sequenceResistanceBonus;
    }

    if (
        values.sequenceResistanceGain &&
        values.sequenceTrigger &&
        matchesSequenceTrigger(
            context,
            spell,
            values.sequenceTrigger
        )
    ) {
        baseResistance += values.sequenceResistanceGain;
    }

    if (
        values.resistanceGainIfPlayerHasResistance &&
        context.playerResistance > 0
    ) {
        baseResistance += values.resistanceGainIfPlayerHasResistance;
    }

    if (!baseResistance) {
        return 0;
    }

    const percentBonus =
        cast.resistancePercentBonus || 0;

    return Math.floor(
        baseResistance * (1 + percentBonus)
    );
}

function healPlayer(context, amount) {
    context.playerHp =
        Math.min(
            context.playerMaxHp,
            context.playerHp + amount
        );
}
