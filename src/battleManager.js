function simulateFight() {

    const context =
        initializeCombatContext();

    const sortedSpells =
        [...selectedSpells].sort((a, b) => {
            return spellPriority[a.name] - spellPriority[b.name];
        });

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

        sortedSpells.forEach(spell => {
            resolveSpellCast(context, spell);
        });

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

        applyBurnDamage(context);

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

        expireBrittle(context);
        expireFireBuff(context);
        reduceCooldowns(context.cooldowns);

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
        cooldowns[spell.name] = 0;
    });

    return {
        playerHp: PLAYER_START_HP,
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
        // TODO: Der CombatContext wird für den MVP bewusst mutiert.
        // Bei Bedarf später in kleinere State-/Result-Objekte aufteilen.
        effects: initializeCombatEffects()
    };
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
        playerMaxHp: PLAYER_START_HP,
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

    if (context.effects.slowDuration > 0) {

        damageTaken -= 1;

        addCombatAction(
            context,
            `Verlangsamung reduziert den Schaden. (❄)`,
            {
                type: "status",
                feedbackTitle: "Verlangsamung",
                feedbackDetail: "Schaden reduziert",
                actionName: "Verlangsamung",
                effectText: "Gegnerschaden reduziert"
            }
        );

        context.effects.slowDuration--;
    }

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
