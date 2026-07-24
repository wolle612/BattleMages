function simulateFight() {
    const context =
        initializeCombatContext();

    while (
        context.playerHp > 0 &&
        context.enemyHp > 0 &&
        context.round < 50
    ) {
        if (context.round > 1) {
            addCombatAction(
                context,
                "",
                {
                    type: "separator"
                }
            );
        }

        addCombatAction(
            context,
            `=== Runde ${context.round} ===`,
            {
                type: "round",
                feedbackTitle: `Runde ${context.round}`,
                feedbackDetail: "Neue Runde",
                actionName: `Runde ${context.round}`,
                effectText: "Neue Runde"
            }
        );

        const castedSpellIds = [];

        while (castedSpellIds.length < context.rotationSpells.length) {
            const spell =
                getNextCombatRotationSpell(context, castedSpellIds);

            castedSpellIds.push(spell.id);

            resolveSpellCast(context, spell);

            if (
                context.enemyHp <= 0 ||
                context.playerHp <= 0
            ) {
                break;
            }

            resolveEnemyImpulse(context);

            if (
                context.enemyHp <= 0 ||
                context.playerHp <= 0
            ) {
                break;
            }
        }

        finalizePlayerRotation(context);

        if (context.enemyHp <= 0) {
            addCombatAction(
                context,
                `${context.enemy.name} wurde besiegt!`,
                {
                    type: "victory",
                    feedbackTitle: "Sieg",
                    feedbackDetail: `${context.enemy.name} wurde besiegt`,
                    actor: "Spieler",
                    actionName: "Sieg",
                    effectText: `${context.enemy.name} wurde besiegt`,
                    importance: "important"
                }
            );

            break;
        }

        if (context.playerHp <= 0) {
            break;
        }

        addCombatAction(
            context,
            `Spieler: ${context.playerHp} Leben | ${context.playerShield} Schild`,
            {
                type: "status",
                feedbackTitle: "Spielerstatus",
                feedbackDetail: `${context.playerHp} Leben | ${context.playerShield} Schild`,
                actionName: "Spielerstatus",
                effectText: `${context.playerHp} Leben | ${context.playerShield} Schild`
            }
        );

        context.round++;
    }

    return {
        victory: context.playerHp > 0 && context.enemyHp <= 0,
        playerHp: context.playerHp,
        enemyName: context.enemy.name,
        log: context.log,
        actionQueue: context.actionQueue
    };
}

function getNextCombatRotationSpell(context, castedSpellIds) {
    return context.rotationSpells
        .filter(spell => !castedSpellIds.includes(spell.id))
        .sort((firstSpell, secondSpell) => {
            return (
                context.rotationOrderOverrides[firstSpell.id] -
                context.rotationOrderOverrides[secondSpell.id]
            );
        })[0];
}

function addCombatAction(context, message, options = {}) {
    context.log.push(message);

    context.actionQueue.push({
        type: options.type || "log",
        message,
        spellName: options.spellName || "",
        iconKey: options.iconKey || "",
        feedbackTitle: options.feedbackTitle || "",
        feedbackDetail: options.feedbackDetail || "",
        actor: options.actor || "",
        actionName: options.actionName || "",
        impact: options.impact || "",
        effectText: options.effectText || "",
        importance: options.importance || "normal",
        playerHp: context.playerHp,
        playerMaxHp: context.playerMaxHp,
        enemyHp: context.enemyHp,
        enemyMaxHp: context.enemy.hp,
        playerShield: context.playerShield,
        enemyShield: context.enemyShield,
        playerStatuses: getPlayerStatusViews(context),
        enemyBuffs: getEnemyBuffViews(context),
        enemyDebuffs: getEnemyDebuffViews(context),
        enemyIntent: getEnemyIntentView(context),
        enemyActionBar: getEnemyActionBarView(context)
    });
}

function getPlayerStatusViews(context) {
    const views = [];

    if (context.playerResistance > 0) {
        views.push({
            id: "resistance",
            stacks: context.playerResistance
        });
    }

    const precisionCharges =
        context.effects.nextSpellPreps.filter(
            prep => prep.guaranteedCrit
        ).length;

    if (precisionCharges > 0) {
        views.push({
            id: "precision",
            stacks: precisionCharges
        });
    }

    return views;
}

function getEnemyBuffViews() {
    return [];
}

function hasPlayerStatus(context, statusId) {
    return Boolean(
        context.effects.playerStatuses[
            normalizeStatusId(statusId)
        ]
    );
}
