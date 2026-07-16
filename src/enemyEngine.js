const ENEMY_PASSIVE_HOOKS = {
    COMBAT_START: "combat_start",
    BEFORE_ENEMY_ACTION: "before_enemy_action",
    AFTER_ENEMY_ACTION: "after_enemy_action",
    AFTER_PLAYER_SPELL: "after_player_spell",
    AFTER_PLAYER_ROTATION: "after_player_rotation",
    BEFORE_PLAYER_DAMAGE: "before_player_damage",
    AFTER_PLAYER_DAMAGE: "after_player_damage"
};

const BOSS_SCHOOL_CYCLE = [
    "blood",
    "shadow",
    "dream",
    "rune",
    "star",
    "primal"
];

function initializeEnemyRuntime(enemy) {
    return {
        actionBarIndex: 0,
        impulseCount: 0,
        actionCount: 0,
        consecutivePlayerDamageSpells: 0,
        vulnerableBonusSinceLastEnemyAction: false,
        firstPlayerCritResolved: false,
        pendingAttackDamageBonus: 0,
        nextPlayerDamagePenalty: 0,
        incomingDamageCap: null,
        currentBossSchool: BOSS_SCHOOL_CYCLE[0],
        bossSchoolIndex: 0,
        rotationMechanics: {
            vulnerable: false,
            shield: false,
            crit: false,
            sequence: false
        }
    };
}

function applyEnemyCombatStart(context) {
    applyEnemyPassiveHooks(
        context,
        ENEMY_PASSIVE_HOOKS.COMBAT_START
    );
}

function resolveEnemyImpulse(context) {
    if (context.enemyHp <= 0 || context.playerHp <= 0) {
        return;
    }

    applyEnemyPassiveHooks(
        context,
        ENEMY_PASSIVE_HOOKS.BEFORE_ENEMY_ACTION
    );

    const action =
        getCurrentEnemyAction(context);

    if (!action) {
        return;
    }

    resolveEnemyAction(context, action);

    context.enemyRuntime.actionCount++;
    context.enemyRuntime.impulseCount++;
    context.enemyRuntime.vulnerableBonusSinceLastEnemyAction = false;
    context.enemyRuntime.consecutivePlayerDamageSpells = 0;

    advanceEnemyActionBar(context);

    applyEnemyPassiveHooks(
        context,
        ENEMY_PASSIVE_HOOKS.AFTER_ENEMY_ACTION
    );
}

function finalizePlayerRotation(context) {
    applyEnemyPassiveHooks(
        context,
        ENEMY_PASSIVE_HOOKS.AFTER_PLAYER_ROTATION
    );

    context.enemyRuntime.rotationMechanics = {
        vulnerable: false,
        shield: false,
        crit: false,
        sequence: false
    };
}

function notifyPlayerSpellResolved(context, spell, cast) {
    trackPlayerRotationMechanics(context, spell, cast);

    applyEnemyPassiveHooks(
        context,
        ENEMY_PASSIVE_HOOKS.AFTER_PLAYER_SPELL,
        { spell, cast }
    );
}

function notifyPlayerDamageDealt(context, spell, cast, damage, meta = {}) {
    if (damage > 0) {
        context.enemyRuntime.consecutivePlayerDamageSpells++;
    }

    if (meta.vulnerableBonusApplied) {
        context.enemyRuntime.vulnerableBonusSinceLastEnemyAction = true;
    }

    if (meta.isCrit) {
        context.enemyRuntime.rotationMechanics.crit = true;
        context.enemyRuntime.pendingAttackDamageBonus =
            getEnemyPassiveValue(
                context.enemy,
                "after_player_crit_attack_bonus"
            ) || 0;
    }

    applyEnemyPassiveHooks(
        context,
        ENEMY_PASSIVE_HOOKS.AFTER_PLAYER_DAMAGE,
        { spell, cast, damage, meta }
    );
}

function modifyIncomingPlayerDamage(context, damage, meta = {}) {
    let modifiedDamage =
        Math.max(0, damage);

    if (context.enemyRuntime.nextPlayerDamagePenalty > 0) {
        modifiedDamage =
            Math.max(
                0,
                modifiedDamage -
                context.enemyRuntime.nextPlayerDamagePenalty
            );

        context.enemyRuntime.nextPlayerDamagePenalty = 0;
    }

    if (context.enemyRuntime.incomingDamageCap != null) {
        modifiedDamage =
            Math.min(
                modifiedDamage,
                context.enemyRuntime.incomingDamageCap
            );
    }

    if (
        meta.isCrit &&
        !context.enemyRuntime.firstPlayerCritResolved
    ) {
        const critReduction =
            getEnemyPassiveValue(
                context.enemy,
                "first_player_crit_damage_reduction"
            );

        if (critReduction) {
            modifiedDamage =
                Math.max(
                    0,
                    modifiedDamage - critReduction
                );

            context.enemyRuntime.firstPlayerCritResolved = true;
        }
    }

    const antiSpikeThreshold =
        getEnemyPassiveValue(
            context.enemy,
            "anti_spike_threshold"
        );

    if (
        antiSpikeThreshold &&
        damage > antiSpikeThreshold
    ) {
        context.enemyRuntime.nextPlayerDamagePenalty =
            getEnemyPassiveValue(
                context.enemy,
                "anti_spike_penalty"
            ) || 0;
    }

    return Math.max(0, Math.floor(modifiedDamage));
}

function getCurrentEnemyAction(context) {
    const enemy =
        context.enemy;

    const actionBar =
        enemy.actionBar || [];

    if (actionBar.length === 0) {
        return null;
    }

    const action =
        actionBar[
            context.enemyRuntime.actionBarIndex % actionBar.length
        ];

    if (action.actionType === "school_technique") {
        return resolveSchoolTechniqueAction(
            context,
            action
        );
    }

    return action;
}

function resolveSchoolTechniqueAction(context, actionTemplate) {
    const school =
        context.enemyRuntime.currentBossSchool;

    const technique =
        actionTemplate.schoolTechniques?.[school];

    if (!technique) {
        return {
            ...actionTemplate,
            name: actionTemplate.name,
            effects: []
        };
    }

    return {
        id: `${actionTemplate.id}_${school}`,
        name: technique.name,
        effects: technique.effects
    };
}

function advanceEnemyActionBar(context) {
    const actionBarLength =
        (context.enemy.actionBar || []).length;

    if (actionBarLength <= 0) {
        return;
    }

    context.enemyRuntime.actionBarIndex =
        (context.enemyRuntime.actionBarIndex + 1) %
        actionBarLength;
}

function resolveEnemyAction(context, action) {
    action.effects.forEach(effect => {
        resolveEnemyEffect(context, action, effect);
    });
}

function getEnemyCombatActionMeta(action) {
    return {
        actionName: action.name,
        iconKey: action.id
            ? normalizeEnemyActionIconKey(action.id)
            : null
    };
}

function resolveEnemyEffect(context, action, effect) {
    if (effect.id === "deal_damage" && effect.target === "player") {
        const hitCount =
            effect.hitCount || 1;

        for (let hitIndex = 0; hitIndex < hitCount; hitIndex++) {
            applyEnemyDamageToPlayer(
                context,
                action,
                getEnemyActionDamage(
                    context,
                    action,
                    effect.amount
                )
            );
        }

        return;
    }

    if (effect.id === "gain_shield" && effect.target === "enemy") {
        context.enemyShield += effect.amount;

        addCombatAction(
            context,
            `${context.enemy.name} erhält ${effect.amount} Schild.`,
            {
                type: "shield",
                feedbackTitle: action.name,
                feedbackDetail: `+${effect.amount} Schild`,
                actor: context.enemy.name,
                ...getEnemyCombatActionMeta(action),
                impact: `+${effect.amount}`,
                effectText: "Schild"
            }
        );
        return;
    }

    if (effect.id === "heal" && effect.target === "enemy") {
        const healedAmount =
            Math.min(
                effect.amount,
                context.enemy.hp - context.enemyHp
            );

        context.enemyHp =
            Math.min(
                context.enemy.hp,
                context.enemyHp + effect.amount
            );

        if (healedAmount > 0) {
            addCombatAction(
                context,
                `${context.enemy.name} heilt ${healedAmount} HP.`,
                {
                    type: "buff",
                    feedbackTitle: action.name,
                    feedbackDetail: `+${healedAmount} HP`,
                    actor: context.enemy.name,
                    ...getEnemyCombatActionMeta(action),
                    impact: `+${healedAmount}`,
                    effectText: "Heilung"
                }
            );
        }
        return;
    }

    if (effect.id === "apply_status" && effect.target === "player") {
        const normalizedStatusId =
            normalizeStatusId(effect.statusId);

        context.effects.playerStatuses[normalizedStatusId] = {
            id: normalizedStatusId,
            type: "negative"
        };

        addCombatAction(
            context,
            `${context.enemy.name} verursacht ${getStatusName(effect.statusId)}.`,
            {
                type: "debuff",
                feedbackTitle: action.name,
                feedbackDetail: getStatusName(effect.statusId),
                actor: context.enemy.name,
                ...getEnemyCombatActionMeta(action),
                effectText: `${getStatusName(effect.statusId)} angewendet`
            }
        );
    }
}

function applyEnemyDamageToPlayer(context, action, damage) {
    let damageTaken =
        Math.max(0, damage);

    damageTaken =
        applyPlayerShield(context, damageTaken);

    if (damageTaken > 0) {
        context.playerHp -= damageTaken;

        addCombatAction(
            context,
            `${context.enemy.name} verursacht ${damageTaken} Schaden.`,
            {
                type: "enemyAttack",
                feedbackTitle: action.name,
                feedbackDetail: `-${damageTaken} HP`,
                actor: context.enemy.name,
                ...getEnemyCombatActionMeta(action),
                impact: `-${damageTaken}`,
                effectText: "HP"
            }
        );
        return;
    }

    addCombatAction(
        context,
        "Angriff absorbiert",
        {
            type: "shield",
            feedbackTitle: "Schild",
            feedbackDetail: "Angriff absorbiert",
            actor: context.enemy.name,
            ...getEnemyCombatActionMeta(action),
            effectText: "Angriff absorbiert"
        }
    );
}

function getEnemyActionDamage(context, action, baseDamage) {
    let damage =
        baseDamage +
        (context.enemyRuntime.pendingAttackDamageBonus || 0);

    context.enemyRuntime.pendingAttackDamageBonus = 0;

    damage +=
        getPassiveActionDamageBonus(context);

    return Math.max(0, Math.floor(damage));
}

function getPassiveActionDamageBonus(context) {
    const passive =
        context.enemy.passive;

    if (!passive?.rules) {
        return 0;
    }

    let bonus = 0;

    passive.rules.forEach(rule => {
        if (
            rule.hook !== ENEMY_PASSIVE_HOOKS.BEFORE_ENEMY_ACTION ||
            !matchesPassiveRule(context, rule)
        ) {
            return;
        }

        rule.effects.forEach(effect => {
            if (effect.id === "modify_action_damage") {
                bonus += effect.amount || 0;
            }
        });
    });

    return bonus;
}

function applyEnemyPassiveHooks(context, hook, payload = {}) {
    const passive =
        context.enemy.passive;

    if (!passive?.rules) {
        return;
    }

    passive.rules.forEach(rule => {
        if (rule.hook !== hook || !matchesPassiveRule(context, rule)) {
            return;
        }

        rule.effects.forEach(effect => {
            resolvePassiveEffect(context, effect, payload);
        });
    });
}

function matchesPassiveRule(context, rule) {
    const runtime =
        context.enemyRuntime;

    if (rule.everyNthAction) {
        return (runtime.actionCount + 1) % rule.everyNthAction === 0;
    }

    if (rule.everyNthImpulse) {
        return (
            runtime.impulseCount > 0 &&
            runtime.impulseCount % rule.everyNthImpulse === 0
        );
    }

    if (rule.withoutVulnerableBonusSinceLastAction) {
        return !runtime.vulnerableBonusSinceLastEnemyAction;
    }

    if (rule.consecutivePlayerDamageSpells) {
        return (
            runtime.consecutivePlayerDamageSpells >=
            rule.consecutivePlayerDamageSpells
        );
    }

    if (rule.minimumRotationMechanics) {
        return (
            countRotationMechanics(runtime.rotationMechanics) <
            rule.minimumRotationMechanics
        );
    }

    if (rule.afterPlayerRotation) {
        return true;
    }

    if (rule.combatStart) {
        return true;
    }

    return !rule.condition;
}

function resolvePassiveEffect(context, effect, payload) {
    if (effect.id === "gain_shield" && effect.target === "enemy") {
        context.enemyShield += effect.amount;

        addCombatAction(
            context,
            `${context.enemy.name} erhält ${effect.amount} Schild.`,
            {
                type: "shield",
                feedbackTitle: context.enemy.passive.name,
                feedbackDetail: `+${effect.amount} Schild`,
                actor: context.enemy.name,
                actionName: context.enemy.passive.name,
                impact: `+${effect.amount}`,
                effectText: "Passiv"
            }
        );
        return;
    }

    if (effect.id === "heal" && effect.target === "enemy") {
        resolveEnemyEffect(
            context,
            { name: context.enemy.passive.name },
            effect
        );
        return;
    }

    if (effect.id === "set_incoming_damage_cap") {
        context.enemyRuntime.incomingDamageCap =
            effect.amount;
        return;
    }

    if (effect.id === "cycle_boss_school") {
        cycleBossSchool(context);
        return;
    }

    if (effect.id === "reset_consecutive_player_damage") {
        context.enemyRuntime.consecutivePlayerDamageSpells = 0;
    }
}

function cycleBossSchool(context) {
    context.enemyRuntime.bossSchoolIndex =
        (context.enemyRuntime.bossSchoolIndex + 1) %
        BOSS_SCHOOL_CYCLE.length;

    context.enemyRuntime.currentBossSchool =
        BOSS_SCHOOL_CYCLE[
            context.enemyRuntime.bossSchoolIndex
        ];

    const schoolLabel =
        getCombatSchoolDefinition(
            context.enemyRuntime.currentBossSchool
        )?.fantasyName ||
        context.enemyRuntime.currentBossSchool;

    addCombatAction(
        context,
        `${context.enemy.name} wechselt zu ${schoolLabel}.`,
        {
            type: "buff",
            feedbackTitle: context.enemy.passive.name,
            feedbackDetail: schoolLabel,
            actor: context.enemy.name,
            actionName: context.enemy.passive.name,
            effectText: "Schulwechsel"
        }
    );
}

function getEnemyPassiveValue(enemy, valueKey) {
    return enemy.passive?.values?.[valueKey] ?? null;
}

function trackPlayerRotationMechanics(context, spell, cast) {
    const mechanics =
        context.enemyRuntime.rotationMechanics;

    if (cast?.lastDamage > 0) {
        mechanics.damage = true;
    }

    if (cast?.flatShieldApplied) {
        mechanics.shield = true;
    }

    if (
        spell.effects?.includes("apply_vulnerable") ||
        cast?.vulnerableApplied
    ) {
        mechanics.vulnerable = true;
    }

    if (cast?.isCritHit) {
        mechanics.crit = true;
    }

    if (
        spell.effects?.includes("grant_next_spell_prep") ||
        getPendingPrepCount(context) > 0
    ) {
        mechanics.sequence = true;
    }
}

function countRotationMechanics(mechanics) {
    return [
        mechanics.vulnerable,
        mechanics.shield,
        mechanics.crit,
        mechanics.sequence
    ].filter(Boolean).length;
}

function getEnemyIntentView(context) {
    const action =
        getCurrentEnemyAction(context);

    if (!action) {
        return null;
    }

    return {
        id: action.id,
        name: action.name,
        iconKey: normalizeEnemyActionIconKey(action.id),
        actionBarIndex: context.enemyRuntime.actionBarIndex,
        actionBarLength: (context.enemy.actionBar || []).length
    };
}

function getEnemyActionBarView(context) {
    const enemy =
        context.enemy;

    const actionBar =
        enemy.actionBar || [];

    return actionBar.map((action, index) => {
        const resolvedAction =
            action.actionType === "school_technique"
                ? resolveSchoolTechniqueAction(context, action)
                : action;

        return {
            id: resolvedAction.id || action.id,
            name: resolvedAction.name || action.name,
            iconKey: normalizeEnemyActionIconKey(
                resolvedAction.id || action.id
            ),
            isNext: index === context.enemyRuntime.actionBarIndex
        };
    });
}
