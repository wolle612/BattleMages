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

        applyEnemyStartOfRoundAbilities(context);

        const castedSpellIds =
            [];

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
        }

        if (context.playerHp <= 0) {
            break;
        }

        applyEnemyAfterSpellAbilities(context);

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

        resolveEnemyAttack(context);

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
        victory: context.playerHp > 0,
        playerHp: context.playerHp,
        log: context.log,
        actionQueue: context.actionQueue
    };
}

function initializeCombatContext() {

    const enemy =
        enemies[currentFight];

    const cooldowns = {};

    selectedSpells.forEach(spell => {
        cooldowns[spell.id] = 0;
    });

    const effects =
        initializeCombatEffects();

    effects.momentum =
        getInitialCombatMomentum(selectedSpells);

    return {
        playerHp: PLAYER_START_HP,
        playerMaxHp: PLAYER_START_HP,
        playerShield: 0,
        enemy,
        enemyHp: enemy.hp,
        enemyDamage: enemy.damage,
        round: 1,
        enemyShield: 0,
        empoweredAttack: 0,
        log: [],
        actionQueue: [],
        cooldowns,
        rotationSpells: [...selectedSpells],
        rotationOrderOverrides: createRotationOrderOverrides(selectedSpells),
        temporaryRotationMoves: [],
        castHistory: [],
        lastPlayerSpell: null,
        // TODO: Der CombatContext wird für den MVP bewusst mutiert.
        // Bei Bedarf später in kleinere State-/Result-Objekte aufteilen.
        effects
    };
}

function createRotationOrderOverrides(spellsToOrder) {
    return spellsToOrder.reduce((overrides, spell) => {
        overrides[spell.id] = spell.rotationOrder;
        return overrides;
    }, {});
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

function getInitialCombatMomentum(spellsToCheck) {
    return spellsToCheck.reduce((initialMomentum, spell) => {
        const rank =
            spellRanks[spell.id] || 1;

        const values =
            getSpellRankValues(spell, rank);

        return Math.max(
            initialMomentum,
            values.initialMomentum || 0
        );
    }, 0);
}

function addCombatAction(context, message, options = {}) {
    context.log.push(message);

    context.actionQueue.push({
        type: options.type || "log",
        message,
        spellName: options.spellName || "",
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
        enemyShield: context.enemyShield
    });
}

function applyEnemyStartOfRoundAbilities(context) {

    if (context.enemy.name === "Beschworene Rüstung") {

        context.enemyShield += 2;

        addCombatAction(
            context,
            "Beschworene Rüstung erhält 2 Schild. 🛡",
            {
                type: "shield",
                feedbackTitle: "Beschworene Rüstung",
                feedbackDetail: "+2 Schild",
                actor: context.enemy.name,
                actionName: "Rüstung",
                impact: "+2",
                effectText: "Schild"
            }
        );
    }

    if (
        context.enemy.name === "Manazehrer" &&
        context.round >= 3
    ) {

        context.enemyDamage += 1;

        addCombatAction(
            context,
            "Manazehrer verschlingt Magie. ⚡",
            {
                type: "enemy",
                feedbackTitle: "Manazehrer",
                feedbackDetail: "verschlingt Magie",
                actor: context.enemy.name,
                actionName: "Magie verschlingen",
                effectText: "Angriffskraft steigt"
            }
        );
    }

    if (
        context.enemy.name === "Runenfanatiker" &&
        context.round % 3 === 0
    ) {

        context.empoweredAttack = 2;

        addCombatAction(
            context,
            "Runenfanatiker kanalisiert Macht. ◈",
            {
                type: "enemy",
                feedbackTitle: "Runenfanatiker",
                feedbackDetail: "kanalisiert Macht",
                actor: context.enemy.name,
                actionName: "Macht kanalisieren",
                effectText: "Nächster Angriff verstärkt"
            }
        );
    }

    if (
        context.enemy.name === "Runenwächter" &&
        context.round % 3 === 0
    ) {

        context.empoweredAttack = 4;

        addCombatAction(
            context,
            "Runenwächter lädt eine Rune auf. ◈",
            {
                type: "enemy",
                feedbackTitle: "Runenwächter",
                feedbackDetail: "lädt eine Rune auf",
                actor: context.enemy.name,
                actionName: "Rune aufladen",
                effectText: "Nächster Angriff verstärkt"
            }
        );
    }

    if (
        context.enemy.name === "Fluchwirker" &&
        context.round % 2 === 0
    ) {

        context.playerShield =
            Math.max(
                0,
                context.playerShield - 3
            );

        addCombatAction(
            context,
            "Fluchwirker zerreißt Schutzmagie. ☠",
            {
                type: "enemy",
                feedbackTitle: "Fluchwirker",
                feedbackDetail: "zerreißt Schutzmagie",
                actor: context.enemy.name,
                actionName: "Schutzmagie zerreißen",
                effectText: "Schild reduziert"
            }
        );
    }
}

function applyEnemyAfterSpellAbilities(context) {

    if (
        context.enemy.name === "Seelenbinder" &&
        context.enemyHp > 0
    ) {

        context.enemyHp += 4;

        addCombatAction(
            context,
            "Seelenbinder absorbiert Seelenkraft. ♥",
            {
                type: "enemy",
                feedbackTitle: "Seelenbinder",
                feedbackDetail: "absorbiert Seelenkraft",
                actor: context.enemy.name,
                actionName: "Seelenkraft absorbieren",
                impact: "+4",
                effectText: "HP"
            }
        );
    }
}

function resolveEnemyAttack(context) {

    let damageTaken =
        context.enemyDamage +
        context.empoweredAttack;

    context.empoweredAttack = 0;

    if (
        context.enemy.name === "Dunkler Magister" &&
        context.round % 3 === 0
    ) {

        damageTaken += 6;

        addCombatAction(
            context,
            "Dunkler Magister entfesselt dunkle Magie. 🔥",
            {
                type: "enemy",
                feedbackTitle: "Dunkler Magister",
                feedbackDetail: "entfesselt dunkle Magie",
                actor: context.enemy.name,
                actionName: "Magischer Angriff",
                effectText: "Dunkle Magie verstärkt den Angriff"
            }
        );
    }

    if (
        context.enemy.name === "Erzmagier" &&
        context.round % 4 === 0
    ) {

        damageTaken += 15;

        addCombatAction(
            context,
            "Erzmagier kanalisiert einen Großzauber. ✨",
            {
                type: "enemy",
                feedbackTitle: "Erzmagier",
                feedbackDetail: "kanalisiert Großzauber",
                actor: context.enemy.name,
                actionName: "Großzauber",
                effectText: "Nächster Angriff massiv verstärkt",
                importance: "important"
            }
        );
    }

    if (context.effects.nextEnemyAttackReduction > 0) {
        damageTaken =
            Math.max(
                0,
                damageTaken - context.effects.nextEnemyAttackReduction
            );

        addCombatAction(
            context,
            `Traumschleier reduziert den Angriff um ${context.effects.nextEnemyAttackReduction}.`,
            {
                type: "buff",
                feedbackTitle: "Traumschleier",
                feedbackDetail: `-${context.effects.nextEnemyAttackReduction} Schaden`,
                actor: "Spieler",
                actionName: "Traumschleier",
                effectText: "Angriff reduziert"
            }
        );

        context.effects.nextEnemyAttackReduction = 0;
        context.effects.blockNextNegativeStatus = false;
    }

    if (damageTaken < 0) {
        damageTaken = 0;
    }

    damageTaken =
        applyPlayerShield(
            context,
            damageTaken
        );

    if (damageTaken > 0) {

        context.playerHp -= damageTaken;

        addCombatAction(
            context,
            `${context.enemy.name} verursacht ${damageTaken} Schaden.`,
            {
                type: "enemyAttack",
                feedbackTitle: `${context.enemy.name} greift an`,
                feedbackDetail: `-${damageTaken} HP`,
                actor: context.enemy.name,
                actionName: "Angriff",
                impact: `-${damageTaken}`,
                effectText: "HP"
            }
        );

    } else {

        addCombatAction(
            context,
            "🛡 Angriff absorbiert",
            {
                type: "shield",
                feedbackTitle: "Schild",
                feedbackDetail: "Angriff absorbiert",
                actor: context.enemy.name,
                actionName: "Angriff",
                effectText: "Angriff absorbiert"
            }
        );
    }
}
