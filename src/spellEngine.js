function resolveSpellCast(context, spell) {
    if (context.enemyHp <= 0 || context.playerHp <= 0) {
        return false;
    }

    const rank =
        spellRanks[spell.id] || 1;

    const values =
        getSpellRankValues(spell, rank);

    const cast = {
        sacrificedHp: 0,
        defeatedEnemy: false,
        shieldPierce: 0,
        adaptiveDamageBonus: 0,
        adaptiveShieldBonus: 0,
        flatShieldBonus: 0,
        flatShieldApplied: false,
        momentumGainBonus: 0,
        momentumGainApplied: false,
        timingEffectApplied: false,
        consumedTimingEffect: null,
        reactivateTimingEffects: false,
        ignoreLifeCost: false,
        ignoreCooldown: false,
        ignorePrerequisite: false,
        additionalBuildTags: 0,
        isEcho: false
    };

    const nextSpellEffect =
        applyNextSpellEffects(context, spell, values, cast);

    if (
        context.cooldowns[spell.id] > 0 &&
        !cast.ignoreCooldown
    ) {
        restoreNextSpellEffect(context, nextSpellEffect);
        context.cooldowns[spell.id]--;
        return false;
    }

    applyConditionalSpellBonuses(context, spell, cast);
    applyTimingEffectToCast(context, spell, values, cast);

    spell.effects.forEach(effect => {
        resolveSpellEffect(context, spell, values, cast, effect);
    });

    applyBloodFrenzyShield(context, spell);
    applyFlatShieldBonus(context, spell, cast);
    applyConditionalMomentumGain(context, spell, cast);
    triggerEcho(context, spell, values, cast);
    consumeTimingEffectIfNeeded(context, values, cast);
    reactivateTimingEffects(context, spell, values, cast);
    context.cooldowns[spell.id] = spell.cooldown;
    trackResolvedSpell(context, spell);

    return true;
}

function resolveSpellEffect(context, spell, values, cast, effect) {
    if (effect === "pay_hp_percent") {
        payHpPercent(context, spell, values, cast);
        return;
    }

    if (effect === "deal_damage") {
        dealSpellDamage(context, spell, values, cast);
        return;
    }

    if (effect === "gain_shield") {
        gainSpellShield(context, spell, values, cast);
        return;
    }

    if (effect === "grant_next_blood_damage_bonus") {
        grantNextBloodDamageBonus(context, spell, values);
        return;
    }

    if (effect === "activate_blood_pact") {
        activateBloodPact(context, spell, values);
        return;
    }

    if (effect === "activate_blood_frenzy") {
        activateBloodFrenzy(context, spell, values);
        return;
    }

    if (effect === "apply_status") {
        applyEnemyStatus(context, spell, values);
        return;
    }

    if (effect === "grant_next_school_damage_bonus") {
        grantNextSchoolDamageBonus(context, spell, values);
        return;
    }

    if (effect === "trigger_echo") {
        return;
    }

    if (effect === "grant_next_echo_bonus") {
        grantNextEchoBonus(context, spell, values);
        return;
    }

    if (effect === "reduce_next_enemy_attack") {
        reduceNextEnemyAttack(context, spell, values);
        return;
    }

    if (effect === "grant_next_spell_rule_break") {
        grantNextSpellRuleBreak(context, spell, values);
        return;
    }

    if (effect === "activate_dreamwalk") {
        activateDreamwalk(context, spell, values);
        return;
    }

    if (effect === "grant_conditional_spell_bonus") {
        grantConditionalSpellBonus(context, spell, values);
        return;
    }

    if (effect === "move_next_matching_spell_forward") {
        moveNextMatchingSpellForward(context, spell, values);
        return;
    }

    if (effect === "activate_master_rune") {
        activateMasterRune(context, spell, values);
        return;
    }

    if (effect === "activate_timing_effect") {
        activateTimingEffect(context, spell, values);
        return;
    }

    if (effect === "empower_timing_effects") {
        empowerTimingEffects(context, spell, values);
        return;
    }

    if (effect === "enable_auto_timing") {
        enableAutoTiming(context, spell, values);
        return;
    }

    if (effect === "reactivate_timing_effects") {
        markTimingReactivation(cast, values);
        return;
    }

    if (effect === "trigger_aftershock") {
        triggerAftershock(context, spell, values, cast);
        return;
    }

    if (effect === "gain_momentum") {
        gainMomentum(
            context,
            spell,
            (values.momentumGain || 0) + cast.momentumGainBonus
        );

        cast.momentumGainApplied = true;
        return;
    }

    if (effect === "consume_momentum") {
        applyConditionalMomentumGain(context, spell, cast);
        consumeMomentum(context, spell, values);
        return;
    }

    if (effect === "empower_momentum") {
        empowerMomentum(context, spell, values);
        return;
    }
}

function payHpPercent(context, spell, values, cast) {
    if (!values.hpCostPercent || cast.ignoreLifeCost) {
        return;
    }

    const hpCost =
        Math.ceil(context.playerMaxHp * values.hpCostPercent / 100);

    context.playerHp =
        Math.max(0, context.playerHp - hpCost);

    cast.sacrificedHp += hpCost;
    context.effects.bloodPactSacrificedHp += hpCost;

    addCombatAction(
        context,
        `${spell.name} opfert ${hpCost} HP.`,
        {
            type: "status",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `-${hpCost} HP`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `-${hpCost}`,
            effectText: "Opfer"
        }
    );
}

function dealSpellDamage(context, spell, values, cast) {
    if (!values.damage) {
        return;
    }

    const damage =
        getTotalSpellDamage(context, spell, values, cast);

    const shieldPierce =
        getSpellShieldPierce(context, spell, values, cast);

    const appliedDamage =
        applySpellDamageToEnemy(context, damage, values, shieldPierce);

    context.enemyHp -= appliedDamage;
    cast.defeatedEnemy = context.enemyHp <= 0;
    cast.lastDamage = damage;

    addCombatAction(
        context,
        `${spell.name} trifft für ${damage} Schaden.`,
        {
            type: "spellDamage",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `-${damage} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `-${damage}`,
            effectText: "Schaden",
            importance: spell.isSignature ? "important" : "normal"
        }
    );

    refundSacrificeOnKill(context, spell, values, cast);
}

function getTotalSpellDamage(context, spell, values, cast) {
    let damage = values.damage;

    damage += cast.adaptiveDamageBonus;
    damage += getMissingLifeBonus(context, values);
    damage += getMissingLifePercentDamage(context, values);
    damage += consumeBloodDamageBonus(context, spell);
    damage += consumeBloodPactBonus(context, spell, cast);
    damage += getBloodFrenzyBonus(context, spell);
    damage += getNegativeEffectDamageBonus(context, values, cast);
    damage += getStatusDamageBonus(context, values, cast);
    damage += getAdditionalNegativeEffectDamageBonus(context, values, cast);
    damage += getPerNegativeEffectDamageBonus(context, values);
    damage += getStatusSchoolDamageBonus(context, spell);
    damage += consumeSchoolDamageBonuses(context, spell, cast);
    damage += getPreviousSequenceDamageBonus(context, values);
    damage += getMomentumDamageBonus(context, values);
    damage += getConsumedMomentumDamageBonus(context, values);
    damage += getPrimalDamageBonus(context, spell);

    return Math.max(0, damage);
}

function applySpellDamageToEnemy(context, damage, values, shieldPierce) {
    if (values.ignoreShield) {
        return damage;
    }

    if (shieldPierce <= 0 || context.enemyShield <= 0) {
        return applyEnemyShield(context, damage);
    }

    const piercedDamage =
        Math.min(damage, shieldPierce, context.enemyShield);

    const remainingDamage =
        applyEnemyShield(context, damage - piercedDamage);

    return piercedDamage + remainingDamage;
}

function getSpellShieldPierce(context, spell, values, cast) {
    let shieldPierce =
        cast.shieldPierce;

    if (
        values.negativeEffectShieldPierce &&
        (
            hasEnemyNegativeEffect(context) ||
            cast.ignorePrerequisite
        )
    ) {
        shieldPierce += values.negativeEffectShieldPierce;
    }

    if (
        values.statusShieldPierce &&
        (
            hasEnemyStatus(context, values.requiredStatusId) ||
            cast.ignorePrerequisite
        )
    ) {
        shieldPierce += values.statusShieldPierce;
    }

    if (values.shieldPiercePerMomentum) {
        shieldPierce +=
            context.effects.momentum * values.shieldPiercePerMomentum;
    }

    return shieldPierce;
}

function getMissingLifeBonus(context, values) {
    if (!values.missingLifeBonusMax) {
        return 0;
    }

    const missingLifeRatio =
        (context.playerMaxHp - context.playerHp) / context.playerMaxHp;

    return Math.floor(values.missingLifeBonusMax * missingLifeRatio);
}

function getMissingLifePercentDamage(context, values) {
    if (!values.damagePerMissingLifePercent) {
        return 0;
    }

    const missingLifePercent =
        ((context.playerMaxHp - context.playerHp) / context.playerMaxHp) * 100;

    return Math.floor(missingLifePercent * values.damagePerMissingLifePercent);
}

function consumeBloodDamageBonus(context, spell) {
    if (!isBloodSpell(spell) || context.effects.bloodDamageBonusCharges <= 0) {
        return 0;
    }

    context.effects.bloodDamageBonusCharges--;
    return context.effects.bloodDamageBonusValue;
}

function consumeBloodPactBonus(context, spell, cast) {
    if (!isBloodSpell(spell) || context.effects.bloodPactCharges <= 0) {
        return 0;
    }

    const bonus =
        cast.sacrificedHp * context.effects.bloodPactDamagePerHp;

    context.effects.bloodPactCharges--;
    expireBloodPactIfNeeded(context);
    return bonus;
}

function getBloodFrenzyBonus(context, spell) {
    if (!isBloodFrenzyActive(context, spell)) {
        return 0;
    }

    return context.effects.bloodFrenzyDamageBonus;
}

function getNegativeEffectDamageBonus(context, values, cast) {
    if (
        !values.negativeEffectDamageBonus ||
        (
            !hasEnemyNegativeEffect(context) &&
            !cast.ignorePrerequisite
        )
    ) {
        return 0;
    }

    return values.negativeEffectDamageBonus;
}

function getStatusDamageBonus(context, values, cast) {
    if (
        !values.statusDamageBonus ||
        (
            !hasEnemyStatus(context, values.requiredStatusId) &&
            !cast.ignorePrerequisite
        )
    ) {
        return 0;
    }

    return values.statusDamageBonus;
}

function getAdditionalNegativeEffectDamageBonus(context, values, cast) {
    if (
        !values.additionalNegativeEffectDamageBonus ||
        (
            !hasEnemyStatus(context, values.requiredStatusId) &&
            !cast.ignorePrerequisite
        )
    ) {
        return 0;
    }

    return (
        getAdditionalNegativeEffectCount(context, values.requiredStatusId) *
        values.additionalNegativeEffectDamageBonus
    );
}

function getPerNegativeEffectDamageBonus(context, values) {
    if (!values.perNegativeEffectDamageBonus) {
        return 0;
    }

    return (
        getEnemyNegativeEffectCount(context) *
        values.perNegativeEffectDamageBonus
    );
}

function getPreviousSequenceDamageBonus(context, values) {
    if (!values.previousDifferentTypeDamageBonus) {
        return 0;
    }

    const recentSpells =
        getRecentDifferentSpellSequence(context);

    let bonus =
        getUniqueValueCount(recentSpells, "type") *
        values.previousDifferentTypeDamageBonus;

    if (values.previousDifferentSchoolDamageBonus) {
        bonus +=
            getUniqueValueCount(recentSpells, "school") *
            values.previousDifferentSchoolDamageBonus;
    }

    return Math.min(
        bonus,
        values.sequenceMaxDamageBonus || bonus
    );
}

function getRecentDifferentSpellSequence(context) {
    const sequence = [];
    const usedTypes = {};
    const usedSchools = {};

    for (let index = context.castHistory.length - 1; index >= 0; index--) {
        const spell =
            context.castHistory[index];

        if (usedTypes[spell.type] && usedSchools[spell.school]) {
            break;
        }

        sequence.push(spell);
        usedTypes[spell.type] = true;
        usedSchools[spell.school] = true;
    }

    return sequence;
}

function getUniqueValueCount(spellsToCount, key) {
    return Object
        .keys(
            spellsToCount.reduce((values, spell) => {
                values[spell[key]] = true;
                return values;
            }, {})
        )
        .length;
}

function getMomentumDamageBonus(context, values) {
    if (!values.damagePerMomentum) {
        return 0;
    }

    return context.effects.momentum * values.damagePerMomentum;
}

function getConsumedMomentumDamageBonus(context, values) {
    if (!values.consumedMomentumDamageBonus) {
        return 0;
    }

    return (
        context.effects.consumedMomentum *
        values.consumedMomentumDamageBonus
    );
}

function getPrimalDamageBonus(context, spell) {
    if (spell.school !== "primal") {
        return 0;
    }

    return context.effects.primalDamageBonus;
}

function getStatusSchoolDamageBonus(context, spell) {
    return Object
        .values(context.effects.enemyStatuses)
        .reduce((totalBonus, status) => {
            if (
                status.schoolDamageBonus &&
                status.affectedSchool === spell.school
            ) {
                return totalBonus + status.schoolDamageBonus;
            }

            return totalBonus;
        }, 0);
}

function consumeSchoolDamageBonuses(context, spell, cast) {
    let totalBonus = 0;

    context.effects.nextSchoolBonuses.forEach(bonus => {
        if (
            bonus.school !== spell.school ||
            bonus.charges <= 0
        ) {
            return;
        }

        totalBonus += bonus.damageBonus;

        if (!bonus.firstBonusConsumed) {
            totalBonus += bonus.firstDamageBonus;
            bonus.firstBonusConsumed = true;
        }

        cast.shieldPierce += bonus.shieldPierce;
        bonus.charges--;
    });

    context.effects.nextSchoolBonuses =
        context.effects.nextSchoolBonuses.filter(
            bonus => bonus.charges > 0
        );

    return totalBonus;
}

function gainSpellShield(context, spell, values, cast) {
    const shieldValue =
        (values.shield || 0) +
        cast.adaptiveShieldBonus +
        cast.flatShieldBonus;

    if (!shieldValue) {
        return;
    }

    cast.flatShieldApplied = true;
    context.playerShield += shieldValue;

    addCombatAction(
        context,
        `${spell.name} +${shieldValue} Schild.`,
        {
            type: "shield",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${shieldValue} Schild`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `+${shieldValue}`,
            effectText: "Schild"
        }
    );
}

function applyFlatShieldBonus(context, spell, cast) {
    if (
        cast.flatShieldApplied ||
        cast.flatShieldBonus <= 0
    ) {
        return;
    }

    context.playerShield += cast.flatShieldBonus;

    addCombatAction(
        context,
        `${spell.name} erhält ${cast.flatShieldBonus} Schild durch Kombination.`,
        {
            type: "shield",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${cast.flatShieldBonus} Schild`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `+${cast.flatShieldBonus}`,
            effectText: "Kombinationsschild"
        }
    );
}

function grantNextBloodDamageBonus(context, spell, values) {
    context.effects.bloodDamageBonusCharges =
        values.nextBloodBonusCharges;

    context.effects.bloodDamageBonusValue =
        values.nextBloodDamageBonus;

    addCombatAction(
        context,
        `${spell.name} stärkt kommende Blutzauber.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${values.nextBloodDamageBonus} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Blutbonus aktiv"
        }
    );
}

function applyEnemyStatus(context, spell, values) {
    if (!values.statusId || context.enemyHp <= 0) {
        return;
    }

    const existingStatus =
        context.effects.enemyStatuses[values.statusId] || {};

    context.effects.enemyStatuses[values.statusId] = {
        id: values.statusId,
        type: "negative",
        affectedSchool: spell.school,
        schoolDamageBonus: Math.max(
            existingStatus.schoolDamageBonus || 0,
            values.statusSchoolDamageBonus || 0
        )
    };

    addCombatAction(
        context,
        `${spell.name} verursacht ${getStatusName(values.statusId)}.`,
        {
            type: "debuff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: getStatusName(values.statusId),
            actor: "Spieler",
            actionName: spell.name,
            effectText: `${getStatusName(values.statusId)} angewendet`
        }
    );
}

function grantNextSchoolDamageBonus(context, spell, values) {
    if (
        !values.nextSchool ||
        !values.nextSchoolDamageBonus ||
        !values.nextSchoolBonusCharges
    ) {
        return;
    }

    context.effects.nextSchoolBonuses.push({
        school: values.nextSchool,
        charges: values.nextSchoolBonusCharges,
        damageBonus: values.nextSchoolDamageBonus,
        firstDamageBonus: values.firstNextSchoolDamageBonus || 0,
        firstBonusConsumed: false,
        shieldPierce: values.nextSchoolShieldPierce || 0
    });

    addCombatAction(
        context,
        `${spell.name} stärkt kommende ${getSchoolName(values.nextSchool)}zauber.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${values.nextSchoolDamageBonus} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: `${getSchoolName(values.nextSchool)}bonus aktiv`
        }
    );
}

function grantConditionalSpellBonus(context, spell, values) {
    if (
        !values.conditionalBonusCharges &&
        !values.conditionalPersistent
    ) {
        return;
    }

    context.effects.conditionalSpellBonuses.push({
        sourceSpellId: spell.id,
        targetSchool: values.conditionalTargetSchool || "",
        targetType: values.conditionalTargetType || "",
        trigger: values.conditionalTrigger || "",
        damageBonus: values.conditionalDamageBonus || 0,
        shieldBonus: values.conditionalShieldBonus || 0,
        adaptiveBonus: values.conditionalAdaptiveBonus || 0,
        momentumGain: values.conditionalMomentumGain || 0,
        charges: values.conditionalBonusCharges || 0,
        persistent: Boolean(values.conditionalPersistent),
        includeHybridCombinations: Boolean(values.includeHybridCombinations),
        additionalHybridBuildTags: values.additionalHybridBuildTags || 0
    });

    addCombatAction(
        context,
        `${spell.name} bereitet eine Kombination vor.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: "Kombination vorbereitet",
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Vorbereitung aktiv"
        }
    );
}

function applyConditionalSpellBonuses(context, spell, cast) {
    context.effects.conditionalSpellBonuses.forEach(bonus => {
        if (!doesConditionalBonusApply(context, spell, bonus)) {
            return;
        }

        cast.adaptiveDamageBonus +=
            getAdaptiveDamageBonus(spell, bonus.adaptiveBonus);

        cast.adaptiveShieldBonus +=
            getAdaptiveShieldBonus(spell, bonus.adaptiveBonus);

        cast.adaptiveDamageBonus += bonus.damageBonus;
        cast.flatShieldBonus += bonus.shieldBonus;
        cast.momentumGainBonus =
            (cast.momentumGainBonus || 0) + bonus.momentumGain;

        if (isHybridCombination(context, spell)) {
            cast.additionalBuildTags += bonus.additionalHybridBuildTags || 0;
        }

        if (!bonus.persistent) {
            bonus.charges--;
        }
    });

    context.effects.conditionalSpellBonuses =
        context.effects.conditionalSpellBonuses.filter(
            bonus => bonus.persistent || bonus.charges > 0
        );
}

function doesConditionalBonusApply(context, spell, bonus) {
    if (
        bonus.targetSchool &&
        bonus.targetSchool !== spell.school
    ) {
        return false;
    }

    if (
        bonus.targetType &&
        bonus.targetType !== spell.type
    ) {
        return false;
    }

    if (bonus.trigger === "hybrid") {
        return isHybridCombination(context, spell);
    }

    if (bonus.trigger === "rune_combo") {
        return isRunicCombination(context, spell);
    }

    if (bonus.includeHybridCombinations) {
        return true;
    }

    return true;
}

function getAdaptiveDamageBonus(spell, bonus) {
    return spell.type === "Attack"
        ? bonus
        : 0;
}

function getAdaptiveShieldBonus(spell, bonus) {
    return spell.type === "Protection"
        ? bonus
        : 0;
}

function moveNextMatchingSpellForward(context, spell, values) {
    const targetSpell =
        getNextMatchingRotationSpell(context, spell, values);

    if (!targetSpell) {
        return;
    }

    const currentOrder =
        context.rotationOrderOverrides[targetSpell.id];

    context.rotationOrderOverrides[targetSpell.id] =
        currentOrder - (values.moveSlotsForward || 1);

    if (!values.persistentRotationChange) {
        context.temporaryRotationMoves.push({
            spellId: targetSpell.id,
            originalOrder: currentOrder
        });
    }

    addCombatAction(
        context,
        `${spell.name} zieht ${targetSpell.name} in der Rotation nach vorne.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: "Rotation verändert",
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Rotation"
        }
    );
}

function getNextMatchingRotationSpell(context, sourceSpell, values) {
    const sourceOrder =
        context.rotationOrderOverrides[sourceSpell.id];

    const matchingSpells =
        context.rotationSpells
        .filter(spell => {
            return (
                spell.id !== sourceSpell.id &&
                matchesRotationMoveTarget(spell, values)
            );
        })
        .sort((firstSpell, secondSpell) => {
            return (
                context.rotationOrderOverrides[firstSpell.id] -
                context.rotationOrderOverrides[secondSpell.id]
            );
        });

    return matchingSpells.find(spell => {
        return context.rotationOrderOverrides[spell.id] > sourceOrder;
    }) || matchingSpells[0];
}

function matchesRotationMoveTarget(spell, values) {
    if (
        values.moveTargetSchool &&
        values.moveTargetSchool !== spell.school
    ) {
        return false;
    }

    if (
        values.moveTargetType &&
        values.moveTargetType !== spell.type
    ) {
        return false;
    }

    return true;
}

function activateMasterRune(context, spell, values) {
    const runeSpellCount =
        getSelectedSchoolSpellCount(context, spell.school);

    context.effects.conditionalSpellBonuses.push({
        sourceSpellId: spell.id,
        targetSchool: spell.school,
        targetType: "",
        trigger: "",
        damageBonus: 0,
        shieldBonus: 0,
        adaptiveBonus: values.masterRuneAdaptiveBonus || 0,
        charges: runeSpellCount,
        persistent: false,
        includeHybridCombinations: false,
        additionalHybridBuildTags: 0
    });

    if (values.maximizeRuneEffects) {
        maximizeConditionalRuneBonuses(context, values.masterRuneAdaptiveBonus);
    }

    if (values.retriggerRuneLinks) {
        retriggerConditionalRuneLinks(context);
    }

    if (values.activateHybridCombinations) {
        activatePreparedHybridBonuses(context);
    }

    addCombatAction(
        context,
        `${spell.name} aktiviert vorbereitete Runenboni.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${values.masterRuneAdaptiveBonus} Wirkung`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Meisterrune aktiv",
            importance: "important"
        }
    );
}

function getSelectedSchoolSpellCount(context, school) {
    return context.rotationSpells
        .filter(spell => spell.school === school)
        .length;
}

function maximizeConditionalRuneBonuses(context, masterBonus) {
    context.effects.conditionalSpellBonuses.forEach(bonus => {
        bonus.damageBonus =
            Math.max(bonus.damageBonus, masterBonus);

        bonus.shieldBonus =
            Math.max(bonus.shieldBonus, masterBonus);

        bonus.adaptiveBonus =
            Math.max(bonus.adaptiveBonus, masterBonus);
    });
}

function retriggerConditionalRuneLinks(context) {
    const activeBonuses =
        context.effects.conditionalSpellBonuses.map(bonus => {
            return {
                ...bonus,
                charges: Math.max(1, bonus.charges)
            };
        });

    context.effects.conditionalSpellBonuses.push(...activeBonuses);
}

function activatePreparedHybridBonuses(context) {
    const activatedHybridBonuses =
        context.effects.conditionalSpellBonuses
            .filter(bonus => bonus.trigger === "hybrid")
            .map(bonus => {
                return {
                    ...bonus,
                    trigger: "",
                    persistent: false,
                    charges: 1
                };
            });

    context.effects.conditionalSpellBonuses.push(...activatedHybridBonuses);
}

function activateTimingEffect(context, spell, values) {
    const timingValues =
        createTimingEffectValues(spell, values);

    context.effects.timingEffect = timingValues;
    context.effects.lastTimingEffectValues = timingValues;

    addCombatAction(
        context,
        `${spell.name} aktiviert einen Timing-Effekt.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: "Timing aktiv",
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Timing"
        }
    );
}

function createTimingEffectValues(spell, values) {
    return {
        sourceSpellId: spell.id,
        targetSchool: values.timingTargetSchool || "",
        starCharges: values.timingStarCharges || 0,
        hybridCharges: values.timingHybridCharges || 0
    };
}

function applyTimingEffectToCast(context, spell, values, cast) {
    if (
        !values.timingDamageBonus ||
        !context.effects.timingEffect ||
        !doesTimingEffectApply(context, spell)
    ) {
        return;
    }

    const timingBonus =
        getTimingDamageBonus(context, values);

    cast.adaptiveDamageBonus += timingBonus;
    cast.shieldPierce += values.timingShieldPierce || 0;
    cast.timingEffectApplied = true;
    cast.consumedTimingEffect = context.effects.timingEffect;
    cast.consumedTimingMode =
        getTimingEffectMode(context, spell);
}

function getTimingDamageBonus(context, values) {
    let timingBonus =
        values.timingDamageBonus +
        context.effects.globalTimingDamageBonus;

    if (
        values.doubleTimingBonus ||
        context.effects.doubleNextTimingBonus
    ) {
        timingBonus *= 2;
        context.effects.doubleNextTimingBonus = false;
    }

    return timingBonus;
}

function doesTimingEffectApply(context, spell) {
    const timingEffect =
        context.effects.timingEffect;

    if (!timingEffect) {
        return false;
    }

    if (
        timingEffect.targetSchool &&
        timingEffect.targetSchool === spell.school &&
        timingEffect.starCharges > 0
    ) {
        return true;
    }

    return (
        timingEffect.hybridCharges > 0 &&
        isHybridCombination(context, spell)
    );
}

function getTimingEffectMode(context, spell) {
    const timingEffect =
        context.effects.timingEffect;

    if (
        timingEffect &&
        timingEffect.targetSchool === spell.school &&
        timingEffect.starCharges > 0
    ) {
        return "school";
    }

    if (
        timingEffect &&
        timingEffect.hybridCharges > 0 &&
        isHybridCombination(context, spell)
    ) {
        return "hybrid";
    }

    return "";
}

function consumeTimingEffectIfNeeded(context, values, cast) {
    if (
        !cast.timingEffectApplied ||
        values.preserveTimingEffect
    ) {
        return;
    }

    const timingEffect =
        cast.consumedTimingEffect;

    if (!timingEffect) {
        return;
    }

    if (cast.consumedTimingMode === "school") {
        timingEffect.starCharges =
            Math.max(0, timingEffect.starCharges - 1);
    }

    if (cast.consumedTimingMode === "hybrid") {
        timingEffect.hybridCharges =
            Math.max(0, timingEffect.hybridCharges - 1);
    }

    if (
        timingEffect.starCharges <= 0 &&
        timingEffect.hybridCharges <= 0
    ) {
        context.effects.timingEffect = null;
    }
}

function empowerTimingEffects(context, spell, values) {
    if (values.doubleNextTimingBonus) {
        context.effects.doubleNextTimingBonus = true;
    }

    if (values.globalTimingDamageBonus) {
        context.effects.globalTimingDamageBonus =
            Math.max(
                context.effects.globalTimingDamageBonus,
                values.globalTimingDamageBonus
            );
    }
}

function enableAutoTiming(context, spell, values) {
    if (!values.autoTimingOnHybrid) {
        return;
    }

    context.effects.autoTimingOnHybrid = true;
}

function markTimingReactivation(cast, values) {
    cast.reactivateTimingEffects =
        Boolean(values.reactivateTimingEffects);
}

function reactivateTimingEffects(context, spell, values, cast) {
    if (
        !cast.reactivateTimingEffects ||
        !context.effects.lastTimingEffectValues
    ) {
        return;
    }

    context.effects.timingEffect = {
        ...context.effects.lastTimingEffectValues
    };
}

function grantNextEchoBonus(context, spell, values) {
    if (!values.nextEchoDamageBonus || !values.nextEchoBonusCharges) {
        return;
    }

    context.effects.nextEchoBonuses.push({
        charges: values.nextEchoBonusCharges,
        damageBonus: values.nextEchoDamageBonus,
        echoImmediate: Boolean(values.echoImmediate),
        echoCopiesAllEffects: Boolean(values.echoCopiesAllEffects)
    });

    if (values.globalEchoPercent) {
        context.effects.globalEchoPercent =
            Math.max(
                context.effects.globalEchoPercent,
                values.globalEchoPercent
            );
    }

    addCombatAction(
        context,
        `${spell.name} verstärkt kommende Echos.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${values.nextEchoDamageBonus} Echo-Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Echo verstärkt"
        }
    );
}

function reduceNextEnemyAttack(context, spell, values) {
    if (!values.nextEnemyAttackReduction) {
        return;
    }

    context.effects.nextEnemyAttackReduction =
        Math.max(
            context.effects.nextEnemyAttackReduction,
            values.nextEnemyAttackReduction
        );

    context.effects.blockNextNegativeStatus =
        context.effects.blockNextNegativeStatus ||
        Boolean(values.blockNextNegativeStatus);

    addCombatAction(
        context,
        `${spell.name} verzerrt den nächsten Angriff.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `-${values.nextEnemyAttackReduction} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Angriff abgeschwächt"
        }
    );
}

function grantNextSpellRuleBreak(context, spell, values) {
    context.effects.nextSpellEffects.push({
        sourceSpellId: spell.id,
        ignoreRestrictionCount: values.ignoreRestrictionCount || 0,
        ignoreAllRestrictions: Boolean(values.ignoreAllRestrictions),
        adaptiveBonus: values.nextSpellAdaptiveBonus || 0
    });

    addCombatAction(
        context,
        `${spell.name} verändert die Regeln des nächsten Zaubers.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: "Regelbruch",
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Nächster Zauber verändert"
        }
    );
}

function activateDreamwalk(context, spell, values) {
    if (values.activateDreamParadox) {
        grantNextSpellRuleBreak(
            context,
            spell,
            getDreamwalkParadoxValues(values)
        );
    }

    if (values.activateFalseAwakening) {
        grantNextEchoBonus(
            context,
            spell,
            getDreamwalkEchoValues(values)
        );
    }

    if (values.globalEchoPercent) {
        context.effects.globalEchoPercent =
            Math.max(
                context.effects.globalEchoPercent,
                values.globalEchoPercent
            );
    }
}

function getDreamwalkParadoxValues(values) {
    const paradoxSpell =
        getSpellById("dream_paradox");

    const paradoxValues =
        getSpellRankValues(
            paradoxSpell,
            spellRanks.dream_paradox || 1
        );

    return {
        ignoreRestrictionCount: paradoxValues.ignoreRestrictionCount,
        ignoreAllRestrictions:
            values.ignoreAllRestrictions ||
            paradoxValues.ignoreAllRestrictions,
        nextSpellAdaptiveBonus:
            values.nextSpellAdaptiveBonus ||
            paradoxValues.nextSpellAdaptiveBonus
    };
}

function getDreamwalkEchoValues(values) {
    const falseAwakeningSpell =
        getSpellById("false_awakening");

    const falseAwakeningValues =
        getSpellRankValues(
            falseAwakeningSpell,
            spellRanks.false_awakening || 1
        );

    return {
        nextEchoDamageBonus: falseAwakeningValues.nextEchoDamageBonus || 4,
        nextEchoBonusCharges: values.maximizeDreamEffects
            ? Number.MAX_SAFE_INTEGER
            : falseAwakeningValues.nextEchoBonusCharges || 2,
        echoImmediate:
            values.triggerActiveEchoes ||
            falseAwakeningValues.echoImmediate,
        echoCopiesAllEffects:
            values.maximizeDreamEffects ||
            falseAwakeningValues.echoCopiesAllEffects,
        globalEchoPercent:
            values.globalEchoPercent ||
            falseAwakeningValues.globalEchoPercent
    };
}

function applyNextSpellEffects(context, spell, values, cast) {
    if (context.effects.nextSpellEffects.length === 0) {
        return null;
    }

    const effect =
        context.effects.nextSpellEffects.shift();

    applyRuleBreakToCast(effect, spell, values, cast);

    if (spell.type === "Attack") {
        cast.adaptiveDamageBonus += effect.adaptiveBonus;
    }

    if (spell.type === "Protection") {
        cast.adaptiveShieldBonus += effect.adaptiveBonus;
    }

    return effect;
}

function restoreNextSpellEffect(context, effect) {
    if (!effect) {
        return;
    }

    context.effects.nextSpellEffects.unshift(effect);
}

function applyRuleBreakToCast(effect, spell, values, cast) {
    if (effect.ignoreAllRestrictions) {
        cast.ignoreLifeCost = true;
        cast.ignoreCooldown = true;
        cast.ignorePrerequisite = true;
        return;
    }

    let remaining =
        effect.ignoreRestrictionCount;

    if (remaining <= 0) {
        return;
    }

    if (values.hpCostPercent && remaining > 0) {
        cast.ignoreLifeCost = true;
        remaining--;
    }

    if (remaining > 0) {
        cast.ignoreCooldown = true;
        remaining--;
    }

    if (hasPrerequisiteValues(values) && remaining > 0) {
        cast.ignorePrerequisite = true;
    }
}

function hasPrerequisiteValues(values) {
    return Boolean(
        values.requiredStatusId ||
        values.negativeEffectDamageBonus ||
        values.negativeEffectShieldPierce
    );
}

function triggerEcho(context, spell, values, cast) {
    if (
        cast.isEcho ||
        !values.echoPercent ||
        !cast.lastDamage ||
        context.enemyHp <= 0
    ) {
        return;
    }

    const echoPercent =
        getEchoPercent(context, values);

    const copiesAllEffects =
        values.echoCopiesStatusEffects ||
        hasEchoCopyAllEffects(context);

    const echoDamage =
        Math.floor(cast.lastDamage * echoPercent / 100) +
        consumeEchoDamageBonus(context);

    if (echoDamage <= 0) {
        return;
    }

    const appliedDamage =
        applySpellDamageToEnemy(context, echoDamage, {}, 0);

    context.enemyHp -= appliedDamage;

    addCombatAction(
        context,
        `Echo von ${spell.name} trifft für ${echoDamage} Schaden.`,
        {
            type: "spellDamage",
            spellName: spell.id,
            feedbackTitle: "Echo",
            feedbackDetail: `-${echoDamage} Schaden`,
            actor: "Echo",
            actionName: "Echo",
            impact: `-${echoDamage}`,
            effectText: "Nachhall"
        }
    );

    if (copiesAllEffects) {
        copyEchoStatusEffects(context, spell, values);
    }
}

function getEchoPercent(context, values) {
    return Math.max(
        values.echoPercent,
        context.effects.globalEchoPercent || 0
    );
}

function consumeEchoDamageBonus(context) {
    let bonusDamage = 0;

    context.effects.nextEchoBonuses.forEach(bonus => {
        if (bonus.charges <= 0) {
            return;
        }

        bonusDamage += bonus.damageBonus;
        bonus.charges--;
    });

    context.effects.nextEchoBonuses =
        context.effects.nextEchoBonuses.filter(
            bonus => bonus.charges > 0
        );

    return bonusDamage;
}

function hasEchoCopyAllEffects(context) {
    return context.effects.nextEchoBonuses.some(
        bonus => bonus.echoCopiesAllEffects && bonus.charges > 0
    );
}

function copyEchoStatusEffects(context, spell, values) {
    if (values.statusId) {
        applyEnemyStatus(context, spell, values);
    }
}

function trackResolvedSpell(context, spell) {
    const wasHybridCombination =
        isHybridCombination(context, spell);

    context.lastPlayerSpell = spell;
    context.castHistory.push(spell);

    if (context.castHistory.length > 8) {
        context.castHistory.shift();
    }

    restoreTemporaryRotationMove(context, spell);
    activateAutoTimingFromHybrid(context, spell, wasHybridCombination);
}

function activateAutoTimingFromHybrid(context, spell, wasHybridCombination) {
    if (
        !context.effects.autoTimingOnHybrid ||
        !wasHybridCombination ||
        context.effects.timingEffect
    ) {
        return;
    }

    context.effects.timingEffect = {
        sourceSpellId: spell.id,
        targetSchool: "star",
        starCharges: 1,
        hybridCharges: 0
    };

    context.effects.lastTimingEffectValues =
        context.effects.timingEffect;
}

function triggerAftershock(context, spell, values, cast) {
    if (!values.aftershockDamage || context.enemyHp <= 0) {
        return;
    }

    const shieldPierce =
        values.aftershockShieldPierce || 0;

    const appliedDamage =
        applySpellDamageToEnemy(
            context,
            values.aftershockDamage,
            {},
            shieldPierce
        );

    context.enemyHp -= appliedDamage;

    addCombatAction(
        context,
        `${spell.name} löst ein Nachbeben für ${values.aftershockDamage} Schaden aus.`,
        {
            type: "spellDamage",
            spellName: spell.id,
            feedbackTitle: "Nachbeben",
            feedbackDetail: `-${values.aftershockDamage} Schaden`,
            actor: "Spieler",
            actionName: "Nachbeben",
            impact: `-${values.aftershockDamage}`,
            effectText: "Nachbeben"
        }
    );

    gainMomentum(context, spell, values.aftershockMomentumGain || 0);
}

function gainMomentum(context, spell, amount) {
    const totalGain =
        amount +
        (amount > 0 ? context.effects.additionalMomentumGain : 0);

    if (totalGain <= 0) {
        return;
    }

    context.effects.momentum =
        clampMomentum(context.effects.momentum + totalGain);

    addCombatAction(
        context,
        `${spell.name} erzeugt ${totalGain} Momentum.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: "Momentum",
            feedbackDetail: `+${totalGain}`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Momentum"
        }
    );
}

function applyConditionalMomentumGain(context, spell, cast) {
    if (
        cast.momentumGainApplied ||
        cast.momentumGainBonus <= 0
    ) {
        return;
    }

    gainMomentum(context, spell, cast.momentumGainBonus);
    cast.momentumGainApplied = true;
}

function consumeMomentum(context, spell, values) {
    if (!values.consumeMomentum) {
        return;
    }

    const consumedMomentum =
        context.effects.momentum;

    context.effects.momentum = 0;
    context.effects.consumedMomentum += consumedMomentum;

    addCombatAction(
        context,
        `${spell.name} verbraucht ${consumedMomentum} Momentum.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: "Momentum",
            feedbackDetail: `${consumedMomentum} verbraucht`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Momentum verbraucht"
        }
    );
}

function empowerMomentum(context, spell, values) {
    if (values.additionalMomentumGain) {
        context.effects.additionalMomentumGain =
            Math.max(
                context.effects.additionalMomentumGain,
                values.additionalMomentumGain
            );
    }

    if (values.primalDamageBonus) {
        context.effects.primalDamageBonus =
            Math.max(
                context.effects.primalDamageBonus,
                values.primalDamageBonus
            );
    }

    if (values.minimumMomentum) {
        context.effects.momentum =
            Math.max(
                context.effects.momentum,
                values.minimumMomentum
            );
    }

    addCombatAction(
        context,
        `${spell.name} verstärkt Momentum-Effekte.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: "Momentum verstärkt",
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Momentum"
        }
    );
}

function clampMomentum(momentum) {
    return Math.max(0, Math.min(5, momentum));
}

function restoreTemporaryRotationMove(context, spell) {
    const movesToRestore =
        context.temporaryRotationMoves.filter(move => {
            return move.spellId === spell.id;
        });

    movesToRestore.forEach(move => {
        context.rotationOrderOverrides[move.spellId] =
            move.originalOrder;
    });

    context.temporaryRotationMoves =
        context.temporaryRotationMoves.filter(move => {
            return move.spellId !== spell.id;
        });
}

function isHybridCombination(context, spell) {
    return Boolean(
        context.lastPlayerSpell &&
        context.lastPlayerSpell.school !== spell.school
    );
}

function isRunicCombination(context, spell) {
    return Boolean(
        context.lastPlayerSpell &&
        context.lastPlayerSpell.school === "rune" &&
        spell.school === "rune"
    );
}

function activateBloodPact(context, spell, values) {
    context.effects.bloodPactCharges =
        values.pactCharges;

    context.effects.bloodPactDamagePerHp =
        values.damagePerSacrificedHp;

    context.effects.bloodPactSacrificedHp = 0;
    context.effects.bloodPactHealPercentOnExpire =
        values.healSacrificePercentOnExpire || 0;

    addCombatAction(
        context,
        `${spell.name} bindet Opferkraft.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `${values.pactCharges} Blutzauber`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Blutpakt aktiv"
        }
    );
}

function activateBloodFrenzy(context, spell, values) {
    if (!values.activateBloodFrenzy && !values.frenzyDamageBonus) {
        return;
    }

    const frenzyValues =
        getBloodFrenzyValues(values);

    context.effects.bloodFrenzyActive = true;
    context.effects.bloodFrenzyThresholdPercent =
        frenzyValues.frenzyThresholdPercent;
    context.effects.bloodFrenzyDamageBonus =
        frenzyValues.frenzyDamageBonus;
    context.effects.bloodFrenzyShieldPerBloodSpell =
        frenzyValues.frenzyShieldPerBloodSpell || 0;

    addCombatAction(
        context,
        `${spell.name} entfacht Blutrausch.`,
        {
            type: "buff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${frenzyValues.frenzyDamageBonus} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Blutrausch aktiv"
        }
    );
}

function getBloodFrenzyValues(values) {
    if (values.frenzyDamageBonus) {
        return values;
    }

    const frenzySpell =
        getSpellById("blood_frenzy");

    return getSpellRankValues(frenzySpell, spellRanks.blood_frenzy || 1);
}

function applyBloodFrenzyShield(context, spell) {
    if (
        !isBloodFrenzyActive(context, spell) ||
        context.effects.bloodFrenzyShieldPerBloodSpell <= 0
    ) {
        return;
    }

    const frenzyName =
        getSpellById("blood_frenzy").name;

    context.playerShield += context.effects.bloodFrenzyShieldPerBloodSpell;

    addCombatAction(
        context,
        `${frenzyName} erzeugt ${context.effects.bloodFrenzyShieldPerBloodSpell} Schild.`,
        {
            type: "shield",
            spellName: spell.id,
            feedbackTitle: frenzyName,
            feedbackDetail: `+${context.effects.bloodFrenzyShieldPerBloodSpell} Schild`,
            actor: "Spieler",
            actionName: frenzyName,
            impact: `+${context.effects.bloodFrenzyShieldPerBloodSpell}`,
            effectText: "Schild"
        }
    );
}

function isBloodFrenzyActive(context, spell) {
    if (!context.effects.bloodFrenzyActive || !isBloodSpell(spell)) {
        return false;
    }

    const currentHpPercent =
        (context.playerHp / context.playerMaxHp) * 100;

    return currentHpPercent < context.effects.bloodFrenzyThresholdPercent;
}

function refundSacrificeOnKill(context, spell, values, cast) {
    if (
        !values.refundSacrificeOnKill ||
        !cast.defeatedEnemy ||
        cast.sacrificedHp <= 0
    ) {
        return;
    }

    healPlayer(context, cast.sacrificedHp);

    addCombatAction(
        context,
        `${spell.name} gibt ${cast.sacrificedHp} HP zurück.`,
        {
            type: "heal",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${cast.sacrificedHp} HP`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `+${cast.sacrificedHp}`,
            effectText: "Heilung"
        }
    );
}

function expireBloodPactIfNeeded(context) {
    if (context.effects.bloodPactCharges > 0) {
        return;
    }

    if (context.effects.bloodPactHealPercentOnExpire > 0) {
        const pactName =
            getSpellById("blood_pact").name;

        const healValue =
            Math.floor(
                context.effects.bloodPactSacrificedHp *
                context.effects.bloodPactHealPercentOnExpire /
                100
            );

        healPlayer(context, healValue);

        addCombatAction(
            context,
            `${pactName} heilt ${healValue} HP.`,
            {
                type: "heal",
                feedbackTitle: pactName,
                feedbackDetail: `+${healValue} HP`,
                actor: "Spieler",
                actionName: pactName,
                impact: `+${healValue}`,
                effectText: "Heilung"
            }
        );
    }

    context.effects.bloodPactSacrificedHp = 0;
    context.effects.bloodPactHealPercentOnExpire = 0;
}

function healPlayer(context, amount) {
    context.playerHp =
        Math.min(
            context.playerMaxHp,
            context.playerHp + amount
        );
}

function isBloodSpell(spell) {
    return spell.school === "blood";
}

function hasEnemyNegativeEffect(context) {
    return getEnemyNegativeEffectCount(context) > 0;
}

function getEnemyNegativeEffectCount(context) {
    return Object
        .values(context.effects.enemyStatuses)
        .filter(status => status.type === "negative")
        .length;
}

function getAdditionalNegativeEffectCount(context, primaryStatusId) {
    return Object
        .values(context.effects.enemyStatuses)
        .filter(status => {
            return (
                status.type === "negative" &&
                status.id !== primaryStatusId
            );
        })
        .length;
}

function hasEnemyStatus(context, statusId) {
    return Boolean(statusId && context.effects.enemyStatuses[statusId]);
}

function getStatusName(statusId) {
    const statusNames = {
        wound: "Wunde"
    };

    return statusNames[statusId] || statusId;
}

function getSchoolName(school) {
    const schoolNames = {
        shadow: "Schatten",
        blood: "Blut",
        dream: "Traum",
        rune: "Runen",
        star: "Sternen",
        primal: "Urgewalten"
    };

    return schoolNames[school] || school;
}
