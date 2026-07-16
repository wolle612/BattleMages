const UNIVERSAL_STATUS_IDS = {
    vulnerable: "vulnerable"
};

const STATUS_ALIASES = {
    wound: "vulnerable"
};

function normalizeStatusId(statusId) {
    return STATUS_ALIASES[statusId] || statusId;
}

function hasEnemyStatus(context, statusId) {
    const normalizedId =
        normalizeStatusId(statusId);

    return Boolean(
        context.effects.enemyStatuses[normalizedId]
    );
}

function hasEnemyVulnerable(context) {
    return hasEnemyStatus(context, "vulnerable");
}

function hasEnemyNegativeEffect(context) {
    return Object
        .keys(context.effects.enemyStatuses)
        .length > 0;
}

function getEnemyNegativeEffectCount(context) {
    return Object
        .keys(context.effects.enemyStatuses)
        .length;
}

function getAdditionalNegativeEffectCount(context, primaryStatusId) {
    const normalizedPrimary =
        normalizeStatusId(primaryStatusId);

    return Object
        .keys(context.effects.enemyStatuses)
        .filter(statusId => statusId !== normalizedPrimary)
        .length;
}

function hasPlayerStatus(context, statusId) {
    const normalizedId =
        normalizeStatusId(statusId);

    return Boolean(
        context.effects.playerStatuses[normalizedId]
    );
}

function applyEnemyVulnerable(context, spell, values) {
    if (context.enemyHp <= 0) {
        return;
    }

    context.effects.enemyStatuses.vulnerable = {
        id: "vulnerable",
        type: "negative",
        sourceSchool: spell.school,
        flatDamageBonus:
            values.statusSchoolDamageBonus || 0
    };

    addCombatAction(
        context,
        `${spell.name} macht das Ziel verwundbar.`,
        {
            type: "debuff",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: "Verwundbar",
            actor: "Spieler",
            actionName: spell.name,
            effectText: "Verwundbar angewendet"
        }
    );

    if (values.applyVulnerableShieldGain) {
        grantCombatShield(
            context,
            spell,
            values.applyVulnerableShieldGain,
            "Verwundbar"
        );
    }

    if (
        values.nextSpellPrepTrigger === "on_apply_vulnerable" ||
        values.nextSpellPrepOnApplyVulnerable
    ) {
        grantUniversalNextSpellPrep(context, spell, values);
    }
}

function consumeEnemyVulnerable(context) {
    delete context.effects.enemyStatuses.vulnerable;
}

function getStatusName(statusId) {
    const normalizedId =
        normalizeStatusId(statusId);

    const labels = {
        vulnerable: "Verwundbar"
    };

    return labels[normalizedId] || normalizedId;
}

function getEnemyDebuffViews(context) {
    return Object
        .values(context.effects.enemyStatuses)
        .map(status => ({
            id: status.id,
            stacks: status.stacks || 0
        }));
}

function getVulnerableFlatBonus(context, spell) {
    const status =
        context.effects.enemyStatuses.vulnerable;

    if (
        !status ||
        !status.flatDamageBonus ||
        status.sourceSchool !== spell.school
    ) {
        return 0;
    }

    return status.flatDamageBonus;
}
