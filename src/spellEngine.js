function resolveSpellCast(context, spell) {

    if (context.enemyHp <= 0) return;

    if (context.cooldowns[spell.name] > 0) {
        return;
    }

    const rank =
        spellRanks[spell.name] || 1;

    let damage =
        spell.damage || 0;

    let bonusText = "";

    if (damage > 0) {

        damage += rank - 1;

    }

    if (
        context.effects.fireBuffActive &&
        damage > 0 &&
        spell.element === "Feuer"
    ) {

        damage += 2;
    }

    if (
    context.effects.fireBuffDuration > 0 &&
    spell.element === "Feuer"
    ) {

    damage += 2;
    }

    // Wintereinbruch
    if (spell.name === "Wintereinbruch") {

        if (context.effects.slowDuration > 0) {

            const bonusDamage =
                Math.round(damage * 0.5);

            damage += bonusDamage;

            bonusText = "↑❄";
        }
}

    // Zerfall
    if (spell.name === "Zerfall") {

        if (context.effects.brittleDuration > 0) {

            const bonusDamage =
                Math.round(damage * 0.5);

            damage += bonusDamage;

            bonusText = "↑◈";
        }
}

    // Äthersturm
    if (spell.name === "Äthersturm") {

        if (context.effects.brittleDuration > 0) {

            const bonusDamage =
                Math.round(damage * 0.25);

            damage += bonusDamage;

            bonusText = "↑◈";
        }
    }

    // Brüchig
    if (damage > 0 && context.effects.brittleDuration > 0) {

        damage = Math.round(
            damage * 1.10
        );

        if (bonusText === "") {
            bonusText = "↑◈";
        }
    }

    let damageMessage = "";

    if (damage > 0) {

        if (bonusText !== "") {

            damageMessage =
                `${spell.name} trifft für ${damage} Schaden. ${bonusText}`;

        } else {

            damageMessage =
                `${spell.name} trifft für ${damage} Schaden.`;
        }
    }

    const displayedDamage =
        damage;

    damage =
        applyEnemyShield(
            context,
            damage
        );

    context.enemyHp -= damage;

    if (damageMessage !== "") {
        addCombatAction(
            context,
            damageMessage,
            {
                type: "spellDamage",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: `-${displayedDamage} Schaden`,
                actor: "Spieler",
                actionName: spell.name,
                impact: `-${displayedDamage}`,
                effectText: "Schaden"
            }
        );
    }

    // Runensplitter
    if (spell.name === "Runensplitter") {

        context.effects.brittleDuration = 1;

        addCombatAction(
            context,
            `${context.enemy.name} wird brüchig. (◈ Brüchig)`,
            {
                type: "debuff",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: "Brüchig",
                actor: "Spieler",
                actionName: spell.name,
                effectText: "Brüchig angewendet"
            }
        );
    }

    // Brennendes Blut
    if (spell.name === "Brennendes Blut") {

        context.effects.fireBuffDuration = 3;
        context.effects.fireBuffActive = true;

        addCombatAction(
            context,
            `Brennendes Blut aktiv. 🔥`,
            {
                type: "buff",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: "aktiv",
                actor: "Spieler",
                actionName: spell.name,
                effectText: "Buff aktiv"
            }
        );
    }
    
    // Glutgeschoss
    if (spell.name === "Glutgeschoss") {

        context.effects.burnDuration = 2;

        context.effects.burnDamage =
            context.effects.fireBuffActive ? 4 : 2;

        addCombatAction(
            context,
            `${context.enemy.name} brennt. (🔥)`,
            {
                type: "debuff",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: "Brennen",
                actor: "Spieler",
                actionName: spell.name,
                effectText: "Brennen angewendet"
            }
    );
}
    // Inferno
    if (spell.name === "Inferno") {

        context.effects.burnDuration = 4;

        context.effects.burnDamage =
            context.effects.fireBuffActive ? 6 : 4;

        addCombatAction(
            context,
            `${context.enemy.name} brennt heftig. (🔥🔥)`,
            {
                type: "debuff",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: "Brennen",
                actor: "Spieler",
                actionName: spell.name,
                effectText: "Brennen angewendet"
            }
    );

    // Brennendes Blut
    if (spell.name === "Brennendes Blut") {

        context.effects.fireBuffDuration = 3;

        addCombatAction(
            context,
            `Brennendes Blut aktiv. 🔥`,
            {
                type: "buff",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: "aktiv",
                actor: "Spieler",
                actionName: spell.name,
                effectText: "Buff aktiv"
            }
        );
    }
}

    // Frostbiss
    if (spell.name === "Frostbiss") {

        context.effects.slowDuration = 2;

        addCombatAction(
            context,
            `${context.enemy.name} wird verlangsamt. (❄)`,
            {
                type: "debuff",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: "Verlangsamt",
                actor: "Spieler",
                actionName: spell.name,
                effectText: "Verlangsamt angewendet"
            }
        );
    }

    // Schilde

    if (spell.shield) {

        const rank =
            spellRanks[spell.name] || 1;

        const shieldValue =
            spell.shield + (rank - 1);

        context.playerShield += shieldValue;

        addCombatAction(
            context,
            `${spell.name} +${spell.shield} 🛡`,
            {
                type: "shield",
                spellName: spell.name,
                feedbackTitle: spell.name,
                feedbackDetail: `+${spell.shield} Schild`,
                actor: "Spieler",
                actionName: spell.name,
                impact: `+${shieldValue}`,
                effectText: "Schild"
            }
        );
    }

    // Arkaner Schleier

    if (spell.name === "Arkaner Schleier") {

        if (context.effects.brittleDuration > 0) {

            context.effects.brittleDuration++;

            addCombatAction(
                context,
                `Brüchig verlängert. ◈`,
                {
                    type: "debuff",
                    spellName: spell.name,
                    feedbackTitle: spell.name,
                    feedbackDetail: "Brüchig verlängert",
                    actor: "Spieler",
                    actionName: spell.name,
                    effectText: "Brüchig verlängert"
                }
            );
        }
    }

    context.cooldowns[spell.name] =
        spell.cooldown;
}
