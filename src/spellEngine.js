// `enemyWasVulnerableAtCast` ist eine Momentaufnahme von VOR der
// Effekt-Ausführung (siehe resolveSpellCast), nicht ein Live-Check auf
// context. Grund: deal_damage gegen ein verwundbares Ziel konsumiert
// Verwundbar normalerweise noch im selben Cast (applyVulnerableMultiplier),
// bevor diese Funktion (die NACH der Effekt-Schleife läuft) sonst prüfen
// würde -- ein Live-Check hier würde also fast immer fälschlich "false"
// liefern, selbst wenn das Ziel beim Cast-Start verwundbar war. Betraf schon
// vor dieser Änderung organ_failure Pfad B Rang 5, gefunden beim Testen der
// soul_spark-Neugestaltung.
function hasCastTimeNextSpellPrepValues(values, context, cast) {
    if (
        values.nextSpellPrepRequiresVulnerable &&
        !cast.enemyWasVulnerableAtCast
    ) {
        return false;
    }

    return Boolean(
        values.nextSpellDamageBonus ||
        values.nextSpellCritChanceBonus ||
        values.nextSpellGuaranteedCrit ||
        values.nextSpellAppliesVulnerable ||
        values.nextSpellShieldBonus ||
        values.nextSpellIgnoresShield ||
        values.nextSpellResistanceBonus
    );
}

function applyValuesToCast(context, values, cast, spell) {
    if (values.critChanceBonus) {
        cast.critChanceBonus =
            (cast.critChanceBonus || 0) +
            values.critChanceBonus / 100;
    }

    if (
        values.vulnerableCritChanceBonus &&
        hasEnemyVulnerable(context)
    ) {
        cast.critChanceBonus =
            (cast.critChanceBonus || 0) +
            values.vulnerableCritChanceBonus / 100;
    }

    if (
        values.vulnerableGuaranteedCrit &&
        hasEnemyVulnerable(context)
    ) {
        cast.guaranteedCrit = true;
    }

    if (
        values.sequenceGuaranteedCrit &&
        values.sequenceTrigger &&
        matchesSequenceTrigger(
            context,
            spell,
            values.sequenceTrigger
        )
    ) {
        cast.guaranteedCrit = true;
    }
}

function getDamageHitCount(context, spell, values) {
    let hitCount =
        getSequenceHitCount(context, spell, values);

    if (
        values.vulnerableRepeatHits &&
        hasEnemyVulnerable(context)
    ) {
        hitCount =
            Math.max(
                hitCount,
                values.vulnerableRepeatHits
            );
    }

    return hitCount;
}

function getSequenceHitCount(context, spell, values) {
    if (
        !values.sequenceRepeatHits ||
        values.sequenceRepeatHits <= 1
    ) {
        return 1;
    }

    if (
        !values.sequenceTrigger ||
        !matchesSequenceTrigger(
            context,
            spell,
            values.sequenceTrigger
        )
    ) {
        return 1;
    }

    return values.sequenceRepeatHits;
}

function resolveSpellCast(context, spell) {
    if (context.enemyHp <= 0 || context.playerHp <= 0) {
        return false;
    }

    const resolved =
        getResolvedSpellState(spell);

    const values =
        resolved.values;

    const effects =
        resolved.effects;

    const cast =
        createSpellCastState();

    if (
        context.cooldowns[spell.id] > 0 &&
        !cast.ignoreCooldown
    ) {
        context.cooldowns[spell.id]--;
        return false;
    }

    cast.enemyWasVulnerableAtCast =
        hasEnemyVulnerable(context);

    applyValuesToCast(context, values, cast, spell);
    applyNextSpellPrepToCast(context, spell, cast);

    cast.deferVulnerableConsume =
        Boolean(values.vulnerableRepeatHits);

    // Next-Spell-Prep (Praezision u.a.) wird VOR der Effekt-Schleife
    // gewaehrt, nicht danach: der Log-Eintrag fuer diesen Cast (z.B. der
    // Schadens-Effekt in der Schleife unten) soll den neuen Status bereits
    // widerspiegeln, statt ihn erst einen Kampf-Moment zu spaet anzuzeigen
    // (betraf die Spieler-Status-UI, siehe Roadmap-Dokument). Aendert nur
    // den Zeitpunkt der Zustandsaenderung, nicht das Endergebnis --
    // applyNextSpellPrepToCast (eingehende Preps aus vorherigen Casts) lief
    // bereits vorher, kein Effekt in der Schleife liest nextSpellPreps fuer
    // die eigene Schadensberechnung.
    if (
        effects.includes("grant_next_spell_prep") ||
        hasCastTimeNextSpellPrepValues(values, context, cast)
    ) {
        grantUniversalNextSpellPrep(context, spell, values);
    }

    effects.forEach(effect => {
        if (effect === "grant_next_spell_prep") {
            return;
        }

        resolveSpellEffect(context, spell, values, cast, effect);
    });

    if (cast.nextSpellAppliesVulnerable) {
        applyEnemyVulnerable(context, spell, values);
    }

    if (values.postCastShieldGain) {
        grantCombatShield(
            context,
            spell,
            values.postCastShieldGain,
            "Schild"
        );
    }

    if (values.postCastResistanceGain) {
        grantResistance(
            context,
            spell,
            values.postCastResistanceGain,
            "Widerstand"
        );
    }

    notifyPlayerSpellResolved(context, spell, cast);

    context.cooldowns[spell.id] = spell.cooldown;
    trackResolvedSpell(context, spell);

    return true;
}

function resolveSpellEffect(context, spell, values, cast, effect) {
    if (effect === "deal_damage") {
        dealSpellDamage(context, spell, values, cast);
        return;
    }

    if (effect === "gain_shield") {
        gainSpellShield(context, spell, values, cast);
        return;
    }

    if (effect === "apply_vulnerable") {
        applyVulnerableEffect(context, spell, values);
        return;
    }

    if (effect === "grant_next_spell_prep") {
        grantUniversalNextSpellPrep(context, spell, values);
        return;
    }

    if (effect === "deal_shield_damage") {
        dealShieldDamage(context, spell, values, cast);
        return;
    }

    if (effect === "increase_shield_percent") {
        increaseShieldPercent(context, spell, values);
        return;
    }

    if (effect === "gain_shield_from_dealt_damage") {
        gainShieldFromDealtDamage(context, spell, values, cast);
        return;
    }

    if (effect === "gain_resistance_from_dealt_damage") {
        gainResistanceFromDealtDamage(context, spell, values, cast);
        return;
    }

    if (effect === "gain_resistance") {
        gainSpellResistance(context, spell, values, cast);
        return;
    }

    if (effect === "increase_resistance") {
        increaseResistance(context, spell, values);
    }
}

function dealSpellDamage(context, spell, values, cast) {
    const hitCount =
        getDamageHitCount(context, spell, values);

    for (let hitIndex = 0; hitIndex < hitCount; hitIndex++) {
        resolveSpellDamageHit(
            context,
            spell,
            values,
            cast,
            hitIndex,
            hitCount
        );

        if (context.enemyHp <= 0) {
            break;
        }
    }

    if (cast.deferVulnerableConsume) {
        consumeEnemyVulnerable(context);
    }
}

function getHitValues(values, hitIndex, hitCount) {
    if (hitIndex === 0) {
        return values;
    }

    if (values.sequenceRepeatFullDamage) {
        return values;
    }

    return {
        ...values,
        vulnerableBonusDamage: 0,
        sequenceDamageBonus: 0,
        sequenceRepeatHits: 0,
        shieldBonusDamagePercent: 0,
        damagePerUniqueSchoolInRotation: 0
    };
}

function resolveSpellDamageHit(context, spell, values, cast, hitIndex, hitCount) {
    const hitValues =
        getHitValues(values, hitIndex, hitCount);

    const enemyWasVulnerable =
        hasEnemyVulnerable(context);

    let damage =
        calculateFlatSpellDamage(
            context,
            spell,
            hitValues,
            cast
        );

    if (!damage && !cast.flatDamageBonus) {
        return;
    }

    damage =
        applyVulnerableMultiplier(
            context,
            damage,
            hitValues,
            cast,
            hitIndex,
            hitCount
        );

    // Zwischenspeicherung fuer applyCritToDamage() (combatFormula.js),
    // die keinen Zugriff auf context/spell hat -- gleiches Muster wie
    // lastKnownPlayerShield fuer den Schild-Krit-Multiplikator.
    cast.lastKnownSequenceResistanceBonus =
        getSequenceGatedResistanceBonusDamage(context, spell, hitValues);

    const critResult =
        applyCritToDamage(
            damage,
            cast,
            hitValues,
            hitIndex,
            values
        );

    damage = critResult.damage;

    const shieldPierce =
        getSpellShieldPierce(context, spell, hitValues, cast);

    // ignoreShield kann entweder direkt am Zauber stehen (values.ignoreShield)
    // oder per Praep vom vorherigen Cast gewaehrt worden sein
    // (cast.ignoreShieldFromPrep, siehe applyNextSpellPrepToCast in
    // combatPrep.js) -- applySpellDamageToEnemy kennt nur `values`, daher
    // hier zusammenfuehren statt die Funktionssignatur zu erweitern.
    const effectiveHitValues =
        cast.ignoreShieldFromPrep
            ? { ...hitValues, ignoreShield: true }
            : hitValues;

    const appliedDamage =
        applySpellDamageToEnemy(
            context,
            damage,
            effectiveHitValues,
            shieldPierce
        );

    const finalDamage =
        modifyIncomingPlayerDamage(
            context,
            appliedDamage,
            {
                isCrit: critResult.isCrit
            }
        );

    context.enemyHp -= finalDamage;
    cast.defeatedEnemy = context.enemyHp <= 0;
    cast.lastDamage = finalDamage;

    if (critResult.isCrit) {
        cast.isCritHit = true;
    }

    notifyPlayerDamageDealt(
        context,
        spell,
        cast,
        finalDamage,
        {
            isCrit: critResult.isCrit,
            vulnerableBonusApplied:
                enemyWasVulnerable
        }
    );

    if (critResult.isCrit && hitValues.critShieldGain) {
        const critShieldValue =
            hitValues.critShieldMultiplier
                ? hitValues.critShieldGain *
                    hitValues.critShieldMultiplier
                : hitValues.critShieldGain;

        grantCombatShield(
            context,
            spell,
            critShieldValue,
            "Kritischer Treffer"
        );
    }

    if (critResult.isCrit && hitValues.critResistanceGain) {
        const critResistanceValue =
            hitValues.critResistanceMultiplier
                ? hitValues.critResistanceGain *
                    hitValues.critResistanceMultiplier
                : hitValues.critResistanceGain;

        grantResistance(
            context,
            spell,
            critResistanceValue,
            "Kritischer Treffer"
        );
    }

    if (
        critResult.isCrit &&
        hitValues.critAppliesVulnerable
    ) {
        applyEnemyVulnerable(context, spell, hitValues);
    }

    if (
        enemyWasVulnerable &&
        hitValues.vulnerableShieldGain
    ) {
        const vulnerableShieldValue =
            hitValues.vulnerableShieldMultiplier
                ? hitValues.vulnerableShieldGain *
                    hitValues.vulnerableShieldMultiplier
                : hitValues.vulnerableShieldGain;

        grantCombatShield(
            context,
            spell,
            vulnerableShieldValue,
            "Verwundbar"
        );
    }

    if (
        enemyWasVulnerable &&
        hitValues.vulnerableResistanceGain
    ) {
        const vulnerableResistanceValue =
            hitValues.vulnerableResistanceMultiplier
                ? hitValues.vulnerableResistanceGain *
                    hitValues.vulnerableResistanceMultiplier
                : hitValues.vulnerableResistanceGain;

        grantResistance(
            context,
            spell,
            vulnerableResistanceValue,
            "Verwundbar"
        );
    }

    if (
        hitIndex > 0 &&
        hitValues.sequenceRepeatAppliesVulnerable
    ) {
        applyEnemyVulnerable(context, spell, hitValues);
    }

    if (
        critResult.isCrit &&
        hitValues.critFollowUpPercent
    ) {
        resolveFollowUpDamageHit(
            context,
            spell,
            hitValues,
            cast,
            Math.floor(
                damage *
                hitValues.critFollowUpPercent / 100
            )
        );
    }

    const effectText =
        critResult.isCrit
            ? "Kritischer Treffer"
            : hitCount > 1
                ? `Treffer ${hitIndex + 1}/${hitCount}`
                : "Schaden";

    addCombatAction(
        context,
        `${spell.name} trifft für ${finalDamage} Schaden.`,
        {
            type: "spellDamage",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `-${finalDamage} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `-${finalDamage}`,
            effectText,
            importance: spell.isSignature ? "important" : "normal"
        }
    );
}

function resolveFollowUpDamageHit(context, spell, values, cast, damage) {
    if (!damage) {
        return;
    }

    const appliedDamage =
        applySpellDamageToEnemy(
            context,
            damage,
            values,
            0
        );

    const finalDamage =
        modifyIncomingPlayerDamage(
            context,
            appliedDamage,
            {}
        );

    context.enemyHp -= finalDamage;
    cast.lastDamage = finalDamage;

    addCombatAction(
        context,
        `${spell.name} trifft erneut für ${damage} Schaden.`,
        {
            type: "spellDamage",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `-${damage} Schaden`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `-${damage}`,
            effectText: "Folgetreffer"
        }
    );
}

function dealShieldDamage(context, spell, values, cast) {
    if (context.playerShield <= 0) {
        return;
    }

    cast.lastKnownPlayerShield =
        context.playerShield;

    const damagePercent =
        values.shieldBonusDamagePercent ?? 100;

    let shieldDamage =
        Math.floor(
            context.playerShield *
            damagePercent / 100
        );

    if (values.damage) {
        shieldDamage += values.damage;
    }

    if (shieldDamage <= 0) {
        return;
    }

    if (values.consumePlayerShield !== false) {
        const consumePercent =
            values.shieldConsumePercent ?? 100;

        const consumedShield =
            Math.floor(
                context.playerShield *
                consumePercent / 100
            );

        context.playerShield =
            Math.max(
                0,
                context.playerShield - consumedShield
            );
    }

    const shieldHitCast = {
        ...cast,
        flatDamageBonus:
            (cast.flatDamageBonus || 0) +
            shieldDamage
    };

    resolveSpellDamageHit(
        context,
        spell,
        {
            ...values,
            shieldBonusDamagePercent: 0,
            damage: 0
        },
        shieldHitCast,
        0,
        1
    );
}

function gainSpellShield(context, spell, values, cast) {
    const shieldValue =
        calculateShieldGain(context, spell, values, cast);

    if (!shieldValue) {
        return;
    }

    cast.flatShieldApplied = true;
    grantCombatShield(context, spell, shieldValue, "Schild");
}

function increaseShieldPercent(context, spell, values) {
    if (context.playerShield <= 0) {
        return;
    }

    let shieldGain = 0;

    if (values.playerShieldPercentIncrease) {
        shieldGain +=
            Math.floor(
                context.playerShield *
                values.playerShieldPercentIncrease / 100
            );
    }

    if (values.playerShieldFlatIncrease) {
        shieldGain +=
            values.playerShieldFlatIncrease;
    }

    if (shieldGain <= 0) {
        return;
    }

    grantCombatShield(
        context,
        spell,
        shieldGain,
        "Schild verstärkt"
    );
}

function gainShieldFromDealtDamage(context, spell, values, cast) {
    if (
        !values.shieldFromDealtDamagePercent ||
        !cast.lastDamage
    ) {
        return;
    }

    const shieldGain =
        Math.floor(
            cast.lastDamage *
            values.shieldFromDealtDamagePercent / 100
        );

    if (shieldGain <= 0) {
        return;
    }

    grantCombatShield(
        context,
        spell,
        shieldGain,
        "Schild"
    );
}

function gainResistanceFromDealtDamage(context, spell, values, cast) {
    if (
        !values.resistanceFromDealtDamagePercent ||
        !cast.lastDamage
    ) {
        return;
    }

    const resistanceGain =
        Math.floor(
            cast.lastDamage *
            values.resistanceFromDealtDamagePercent / 100
        );

    if (resistanceGain <= 0) {
        return;
    }

    grantResistance(
        context,
        spell,
        resistanceGain,
        "Widerstand"
    );
}

function grantCombatShield(context, spell, shieldValue, effectText) {
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
            effectText
        }
    );
}

// Magischer Widerstand (Combat Condition Engine, siehe
// docs/design/BattleMages_Combat_Condition_Engine_Spec.md): permanenter,
// nie konsumierter Flachwert, im Unterschied zu grantCombatShield() oben
// KEIN depletable Pool. Wird in applyPlayerResistance() (effectEngine.js)
// gegen jeden eingehenden Treffer verrechnet, ohne sich dabei zu
// verringern. grantResistance() ist der gemeinsame Schreib-/Log-Pfad für
// alle Widerstand-Quellen (Basis-Gewinn, Verstärkung, Post-Cast-Bonus).
function grantResistance(context, spell, resistanceValue, effectText) {
    context.playerResistance += resistanceValue;

    addCombatAction(
        context,
        `${spell.name} +${resistanceValue} Magischer Widerstand.`,
        {
            type: "resistance",
            spellName: spell.id,
            feedbackTitle: spell.name,
            feedbackDetail: `+${resistanceValue} Widerstand`,
            actor: "Spieler",
            actionName: spell.name,
            impact: `+${resistanceValue}`,
            effectText
        }
    );
}

function gainSpellResistance(context, spell, values, cast) {
    const resistanceValue =
        calculateResistanceGain(context, spell, values, cast);

    if (!resistanceValue) {
        return;
    }

    grantResistance(context, spell, resistanceValue, "Widerstand");
}

function increaseResistance(context, spell, values) {
    if (context.playerResistance <= 0) {
        return;
    }

    let resistanceGain = 0;

    if (values.playerResistancePercentIncrease) {
        resistanceGain +=
            Math.floor(
                context.playerResistance *
                values.playerResistancePercentIncrease / 100
            );
    }

    if (values.playerResistanceFlatIncrease) {
        resistanceGain +=
            values.playerResistanceFlatIncrease;
    }

    if (resistanceGain <= 0) {
        return;
    }

    grantResistance(context, spell, resistanceGain, "Widerstand verstärkt");
}

function applyVulnerableEffect(context, spell, values) {
    if (
        values.applyVulnerableOnlyIfVulnerable &&
        !hasEnemyVulnerable(context)
    ) {
        return;
    }

    if (
        values.applyVulnerableOnSequenceTrigger &&
        !matchesSequenceTrigger(
            context,
            spell,
            values.applyVulnerableOnSequenceTrigger
        )
    ) {
        return;
    }

    if (
        values.applyVulnerableIfPlayerShield &&
        context.playerShield <= 0
    ) {
        return;
    }

    if (
        values.applyVulnerableIfPlayerResistance &&
        context.playerResistance <= 0
    ) {
        return;
    }

    // Deterministischer Ersatz fuer "bei zufaelligem Maximalschaden" (siehe
    // chaos_eruption-Neugestaltung, Combat Condition Engine): prueft die
    // eigene fehlende Lebensenergie in Prozent statt eines Wuerfelwurfs.
    if (
        values.applyVulnerableIfMissingLifePercent &&
        getMissingLifePercent(context) < values.applyVulnerableIfMissingLifePercent
    ) {
        return;
    }

    applyEnemyVulnerable(context, spell, values);
}

function getMissingLifePercent(context) {
    return (
        (context.playerMaxHp - context.playerHp) /
        context.playerMaxHp
    ) * 100;
}

function grantUniversalNextSpellPrep(context, spell, values) {
    queueNextSpellPrep(
        context,
        createNextSpellPrep({
            flatDamage: values.nextSpellDamageBonus || 0,
            flatShield: values.nextSpellShieldBonus || 0,
            flatResistance: values.nextSpellResistanceBonus || 0,
            shieldPierce: values.nextSpellShieldPierce || 0,
            critChanceBonus:
                (values.nextSpellCritChanceBonus || 0) / 100,
            guaranteedCrit:
                Boolean(values.nextSpellGuaranteedCrit),
            critDamageBonus:
                values.nextSpellCritDamageBonus || 0,
            shieldPercentBonus:
                (values.nextSpellShieldPercentBonus || 0) / 100,
            appliesVulnerable:
                Boolean(values.nextSpellAppliesVulnerable),
            ignoreShield:
                Boolean(values.nextSpellIgnoresShield),
            requiredSchool: values.nextSpellSchool || null,
            requiredType: values.nextSpellType || null,
            requireHybrid:
                values.nextSpellSequenceTrigger === "hybrid",
            label: "",
            sourceSpellId: spell.id
        }),
        values.nextSpellPrepCharges || 1
    );
}

function trackResolvedSpell(context, spell) {
    if (context.castHistory.length > 8) {
        context.castHistory.shift();
    }

    context.castHistory.push(spell);
    context.lastPlayerSpell = spell;
}
