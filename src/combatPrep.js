function createNextSpellPrep(overrides = {}) {
    return {
        flatDamage: 0,
        flatShield: 0,
        shieldPierce: 0,
        critChanceBonus: 0,
        guaranteedCrit: false,
        critDamageBonus: 0,
        shieldPercentBonus: 0,
        requiredSchool: null,
        requiredType: null,
        requireHybrid: false,
        requireRuneCombo: false,
        adaptiveBonus: 0,
        appliesVulnerable: false,
        timingDamageBonus: 0,
        doubleTimingBonus: false,
        echoPercent: 0,
        echoFlatBonus: 0,
        ruleBreak: null,
        label: "",
        requeueOnConsume: false,
        sourceSpellId: "",
        ignoreShield: false,
        flatResistance: 0,
        ...overrides
    };
}

function queueNextSpellPrep(context, prep, charges = 1) {
    const normalizedPrep =
        createNextSpellPrep(prep);

    for (let index = 0; index < charges; index++) {
        context.effects.nextSpellPreps.push({
            ...normalizedPrep
        });
    }
}

function getPendingPrepCount(context) {
    return context.effects.nextSpellPreps.length;
}

function doesPrepMatchSpell(context, spell, prep) {
    if (
        prep.requiredSchool &&
        prep.requiredSchool !== spell.school
    ) {
        return false;
    }

    if (
        prep.requiredType &&
        prep.requiredType !== spell.type
    ) {
        return false;
    }

    if (
        prep.requireHybrid &&
        !isHybridCombination(context, spell)
    ) {
        return false;
    }

    if (
        prep.requireRuneCombo &&
        !isRunicCombination(context, spell)
    ) {
        return false;
    }

    return true;
}

function isRunicCombination(context, spell) {
    const previousSpell =
        getPreviousCastSpell(context);

    return Boolean(
        previousSpell &&
        previousSpell.school === "rune" &&
        spell.school === "rune"
    );
}

function findMatchingPrepIndex(context, spell) {
    return context.effects.nextSpellPreps.findIndex(prep => {
        return doesPrepMatchSpell(context, spell, prep);
    });
}

function applyNextSpellPrepToCast(context, spell, cast) {
    const prepIndex =
        findMatchingPrepIndex(context, spell);

    if (prepIndex < 0) {
        return null;
    }

    const prep =
        context.effects.nextSpellPreps.splice(
            prepIndex,
            1
        )[0];

    cast.flatDamageBonus =
        (cast.flatDamageBonus || 0) +
        (prep.flatDamage || 0);

    cast.flatShieldBonus =
        (cast.flatShieldBonus || 0) +
        (prep.flatShield || 0);

    cast.flatResistanceBonus =
        (cast.flatResistanceBonus || 0) +
        (prep.flatResistance || 0);

    cast.shieldPierce +=
        prep.shieldPierce || 0;

    cast.critChanceBonus =
        (cast.critChanceBonus || 0) +
        (prep.critChanceBonus || 0);

    cast.guaranteedCrit =
        cast.guaranteedCrit ||
        prep.guaranteedCrit;

    cast.critDamageBonus =
        (cast.critDamageBonus || 0) +
        (prep.critDamageBonus || 0);

    cast.shieldPercentBonus =
        (cast.shieldPercentBonus || 0) +
        (prep.shieldPercentBonus || 0);

    if (prep.appliesVulnerable) {
        cast.nextSpellAppliesVulnerable = true;
    }

    if (prep.ignoreShield) {
        cast.ignoreShieldFromPrep = true;
    }

    if (prep.adaptiveBonus) {
        if (spell.type === "Attack") {
            cast.flatDamageBonus += prep.adaptiveBonus;
        }

        if (spell.type === "Protection") {
            cast.flatShieldBonus += prep.adaptiveBonus;
        }
    }

    if (prep.timingDamageBonus) {
        cast.timingDamageBonus =
            (cast.timingDamageBonus || 0) +
            prep.timingDamageBonus;

        if (prep.doubleTimingBonus) {
            cast.timingDamageBonus *= 2;
        }
    }

    if (prep.ruleBreak) {
        applyRuleBreakToCast(
            prep.ruleBreak,
            spell,
            {},
            cast
        );
    }

    if (prep.requeueOnConsume) {
        queueNextSpellPrep(context, prep, 1);
    }

    return prep;
}

function getSchoolFantasyName(schoolId) {
    return COMBAT_SCHOOLS[schoolId]?.fantasyName ||
        schoolId;
}

function applyRuleBreakToCast(effect, spell, values, cast) {
    if (effect.ignoreLifeCost) {
        cast.ignoreLifeCost = true;
    }

    if (effect.ignoreCooldown) {
        cast.ignoreCooldown = true;
    }

    if (effect.ignorePrerequisite) {
        cast.ignorePrerequisite = true;
    }

    if (effect.ignoreAllRestrictions) {
        cast.ignoreLifeCost = true;
        cast.ignoreCooldown = true;
        cast.ignorePrerequisite = true;
    }
}
