const enemyDefinitions =
    createEnemyDefinitions(rawEnemyDefinitions);

const enemies =
    enemyDefinitions;

const ENEMY_ACTION_ICON_ALIASES = {
    construct_shield: "rune_shield",
    construct_attack: "rune_attack",
    soul_shield: "rune_shield"
};

function normalizeEnemyActionIconKey(actionId) {
    if (!actionId) {
        return "unknown";
    }

    let key =
        actionId.endsWith("_repeat")
            ? actionId.slice(0, -"_repeat".length)
            : actionId;

    return ENEMY_ACTION_ICON_ALIASES[key] || key;
}

function getEnemyActionIconPath(iconKey) {
    return `assets/icons/enemy_actions/${iconKey}.png`;
}

function getEnemyActionIconFallbackInitial(name) {
    return name ? name.charAt(0) : "?";
}

function createEnemyDefinitions(definitions) {
    return [...definitions]
        .sort((firstEnemy, secondEnemy) => {
            return firstEnemy.encounter - secondEnemy.encounter;
        })
        .map(enemy => {
            return {
                ...enemy,
                actionBar: enemy.actionBar || [],
                passive: enemy.passive || null,
                rewards: enemy.rewards || {},
                ui: enemy.ui || {}
            };
        });
}

function getEnemyByEncounter(encounter) {
    return enemyDefinitions.find(enemy => enemy.encounter === encounter);
}

function getEnemyViewModel(enemy, runtimeState = null) {
    const runtime =
        runtimeState || {
            actionBarIndex: 0,
            currentBossSchool: BOSS_SCHOOL_CYCLE[0]
        };

    const context = {
        enemy,
        enemyRuntime: runtime
    };

    const nextAction =
        getCurrentEnemyAction(context);

    const actionBar =
        getEnemyActionBarView(context);

    return {
        id: enemy.id,
        name: enemy.name,
        encounter: enemy.encounter,
        tier: enemy.tier,
        combatIdentity: enemy.combatIdentity,
        buildTest: enemy.buildTest,
        hp: enemy.hp,
        maxHp: enemy.hp,
        passive: enemy.passive
            ? {
                id: enemy.passive.id,
                name: enemy.passive.name,
                text: enemy.ui.passiveText || enemy.passive.description
            }
            : null,
        nextAction: nextAction
            ? {
                id: nextAction.id,
                name: nextAction.name,
                iconKey: normalizeEnemyActionIconKey(nextAction.id)
            }
            : null,
        actionBar,
        rewards: enemy.rewards
    };
}

function getEnemyTierLabel(tier) {
    const labels = {
        Normal: "Normal",
        Elite: "Elite",
        Boss: "Boss"
    };

    return labels[tier] || tier;
}
