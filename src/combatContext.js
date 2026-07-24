function initializeCombatContext() {
    const enemy =
        enemies[currentFight];

    const cooldowns = {};

    getPlayerRotation().forEach(spell => {
        cooldowns[spell.id] = 0;
    });

    const effects =
        initializeCombatEffects();

    const context = {
        playerHp: PLAYER_START_HP,
        playerMaxHp: PLAYER_START_HP,
        playerShield: 0,
        playerResistance: 0,
        enemy,
        enemyHp: enemy.hp,
        round: 1,
        enemyShield: 0,
        enemyRuntime: initializeEnemyRuntime(enemy),
        log: [],
        actionQueue: [],
        cooldowns,
        rotationSpells: getPlayerRotation(),
        rotationOrderOverrides: createRotationOrderOverrides(
            getPlayerRotation()
        ),
        temporaryRotationMoves: [],
        castHistory: [],
        lastPlayerSpell: null,
        effects
    };

    applyEnemyCombatStart(context);

    return context;
}

function createSpellCastState() {
    return {
        sacrificedHp: 0,
        defeatedEnemy: false,
        shieldPierce: 0,
        flatDamageBonus: 0,
        flatShieldBonus: 0,
        flatShieldApplied: false,
        flatResistanceBonus: 0,
        resistancePercentBonus: 0,
        critChanceBonus: 0,
        critDamageBonus: 0,
        guaranteedCrit: false,
        shieldPercentBonus: 0,
        timingDamageBonus: 0,
        ignoreLifeCost: false,
        ignoreCooldown: false,
        ignorePrerequisite: false,
        isEcho: false,
        isFollowUp: false,
        lastDamage: 0,
        nextSpellAppliesVulnerable: false,
        deferVulnerableConsume: false,
        lastKnownPlayerShield: 0,
        lastKnownSequenceResistanceBonus: 0,
        enemyWasVulnerableAtCast: false,
        ignoreShieldFromPrep: false
    };
}

function getCombatSchoolDefinition(schoolId) {
    return COMBAT_SCHOOLS[schoolId] || null;
}

function inferSpellRole(spell) {
    if (spell.role) {
        return spell.role;
    }

    if (spell.isSignature) {
        return SPELL_ROLES.finisher.id;
    }

    if (spell.type === "Protection") {
        return SPELL_ROLES.utility.id;
    }

    if (
        (spell.tags || []).includes("Preparation") ||
        (spell.effects || []).includes("grant_next_spell_prep")
    ) {
        return SPELL_ROLES.verstaerker.id;
    }

    if (
        (spell.tags || []).includes("Burst") ||
        spell.type === "Attack"
    ) {
        return SPELL_ROLES.generator.id;
    }

    return SPELL_ROLES.build_enabler.id;
}

function getSpellRole(spell) {
    return inferSpellRole(spell);
}
