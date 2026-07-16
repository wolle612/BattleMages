function getPreviousCastSpell(context) {
    if (context.lastPlayerSpell) {
        return context.lastPlayerSpell;
    }

    return context.castHistory.length > 0
        ? context.castHistory[context.castHistory.length - 1]
        : null;
}

function isHybridCombination(context, spell) {
    const previousSpell =
        getPreviousCastSpell(context);

    return Boolean(
        previousSpell &&
        previousSpell.school !== spell.school
    );
}

function isSameSchoolSequence(context, spell) {
    const previousSpell =
        getPreviousCastSpell(context);

    return Boolean(
        previousSpell &&
        previousSpell.school === spell.school
    );
}

function isDifferentSchoolSequence(context, spell) {
    return isHybridCombination(context, spell);
}

function matchesSequenceTrigger(context, spell, trigger) {
    const previousSpell =
        getPreviousCastSpell(context);

    if (!previousSpell || !trigger) {
        return false;
    }

    if (trigger === "after_protection") {
        return previousSpell.type === "Protection";
    }

    if (trigger === "after_attack") {
        return previousSpell.type === "Attack";
    }

    if (trigger === "same_school") {
        return previousSpell.school === spell.school;
    }

    if (
        trigger === "different_school" ||
        trigger === "hybrid"
    ) {
        return previousSpell.school !== spell.school;
    }

    return false;
}

function getSequenceDamageBonus(context, spell, values) {
    if (values.sequenceTrigger) {
        if (
            !matchesSequenceTrigger(
                context,
                spell,
                values.sequenceTrigger
            )
        ) {
            return 0;
        }

        return values.sequenceDamageBonus || 0;
    }

    const previousSpell =
        getPreviousCastSpell(context);

    if (!previousSpell) {
        return 0;
    }

    let bonus = 0;

    if (
        values.previousDifferentTypeDamageBonus &&
        previousSpell.type !== spell.type
    ) {
        bonus += values.previousDifferentTypeDamageBonus;
    }

    if (
        values.previousDifferentSchoolDamageBonus &&
        previousSpell.school !== spell.school
    ) {
        bonus +=
            values.previousDifferentSchoolDamageBonus;
    }

    if (!bonus) {
        return 0;
    }

    return Math.min(
        bonus,
        values.sequenceMaxDamageBonus || bonus
    );
}
