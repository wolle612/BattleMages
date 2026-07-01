const SPELL_DESCRIPTIONS = {
    blood_strike: "Aggressiver Burst, ideal während Eskalationsphasen.",
    blood_lance: "Je riskanter der Spieler spielt, desto stärker wird Blutlanze.",
    blood_wall: "Risiko wird sofort in Verteidigung umgewandelt.",
    blood_pact: "Sofort stärker werden und zukünftige Opfer effizienter machen.",
    blood_frenzy: "Der Kampf gerät zunehmend außer Kontrolle.",
    blood_moon: "Der Höhepunkt jeder Blutrotation.",
    dream_shard: "Der Angriff hinterlässt einen Nachhall.",
    deja_vu: "Der nächste Zauber fühlt sich an, als wäre er bereits gewirkt worden.",
    dream_veil: "Der Gegner trifft nur eine verzerrte Wirklichkeit.",
    dream_paradox: "Für einen kurzen Moment gelten andere Regeln.",
    false_awakening: "Ein bereits abgeschlossener Moment kehrt zurück.",
    dreamwalk: "Der Höhepunkt der Traummagie."
};

const SCHOOL_LABELS = {
    blood: "Blut",
    shadow: "Schatten",
    dream: "Traum",
    rune: "Rune",
    star: "Stern",
    primal: "Urgewalt"
};

const RARITY_LABELS = {
    Common: "Gewöhnlich",
    Rare: "Selten",
    Epic: "Episch",
    Legendary: "Legendär"
};

const RARITY_CLASS_NAMES = {
    Common: "rarity-common",
    Rare: "rarity-rare",
    Epic: "rarity-epic",
    Legendary: "rarity-legendary"
};

const TYPE_LABELS = {
    Attack: "Angriff",
    Status: "Status",
    Protection: "Schutz"
};

const TAG_LABELS = {
    Preparation: "Vorbereitung",
    Control: "Kontrolle",
    Sacrifice: "Opfer",
    Manipulation: "Manipulation",
    Echo: "Echo",
    Burst: "Burst",
    Attack: "Angriff",
    Protection: "Schutz"
};

const SPELL_RARITIES_BY_ORDER = [
    "Common",
    "Common",
    "Common",
    "Rare",
    "Epic",
    "Legendary"
];

const SPELL_EFFECTS = {
    blood_strike: ["deal_damage"],
    blood_lance: ["pay_hp_percent", "deal_damage"],
    blood_wall: ["gain_shield", "grant_next_blood_damage_bonus"],
    blood_pact: ["activate_blood_pact"],
    blood_frenzy: ["activate_blood_frenzy"],
    blood_moon: ["deal_damage", "activate_blood_frenzy"]
};

const spellDefinitions =
    createSpellDefinitions(rawSpellDefinitions);

function createLegacySpells(definitions) {
    return sortSpellsByRotationOrder(definitions)
        .map(definition => {
            const rankOneValues =
                getSpellRankValues(definition, 1);

            return {
                ...definition,
                element: SCHOOL_LABELS[definition.school] || definition.school,
                damage: rankOneValues.damage,
                shield: rankOneValues.shield,
                starter: definition.starter
            };
        });
}

function createSpellDefinitions(definitions) {
    return definitions.map((definition, index) => {
        return {
            ...definition,
            description: definition.description || SPELL_DESCRIPTIONS[definition.id],
            rarity: definition.rarity || getDefaultSpellRarity(definitions, definition),
            rotationOrder: definition.rotationOrder || getDefaultRotationOrder(definitions, definition),
            effects: definition.effects || SPELL_EFFECTS[definition.id] || [],
            starter: definition.starter === true,
            isSignature: definition.isSignature || false
        };
    });
}

function getDefaultSpellRarity(definitions, definition) {
    return SPELL_RARITIES_BY_ORDER[
        getSchoolSpellIndex(definitions, definition)
    ];
}

function getDefaultRotationOrder(definitions, definition) {
    return getSchoolSpellIndex(definitions, definition) + 1;
}

function getSchoolSpellIndex(definitions, definition) {
    return definitions
        .filter(spell => spell.school === definition.school)
        .findIndex(spell => spell.id === definition.id);
}

function getSpellById(spellId) {
    return spellDefinitions.find(spell => spell.id === spellId);
}

function getSpellRankValues(spell, rank) {
    const upgrade =
        spell.upgrades.find(upgradeStep => upgradeStep.rank === rank);

    return upgrade
        ? upgrade.values
        : {};
}

function getSpellTooltipView(spell, rank) {
    const values =
        getSpellRankValues(spell, rank);

    return {
        name: spell.name,
        rarity: getRarityView(spell.rarity),
        type: getTypeView(spell.type),
        tags: getTagViews(spell),
        rankLabel: romanize(rank),
        valueLines: getSpellValueLines(values),
        mechanicLines: getSpellMechanicLines(values)
    };
}

function getSpellRewardView(spell, currentRank, isUpgrade) {
    const targetRank =
        isUpgrade ? currentRank + 1 : 1;

    return {
        rarity: getRarityView(spell.rarity),
        rank: targetRank,
        rankLabel: romanize(targetRank),
        changeLines: isUpgrade
            ? getUpgradeChangeLines(
                getSpellRankValues(spell, currentRank),
                getSpellRankValues(spell, targetRank)
            )
            : getNewSpellLines(
                getSpellRankValues(spell, targetRank)
            )
    };
}

function getActionbarSlots(spellsToSlot, maxSlots = 5) {
    const sortedSpells =
        sortSpellsByRotationOrder(spellsToSlot);

    const slots = [];

    for (let index = 0; index < maxSlots; index++) {
        slots.push({
            slotId: `actionbar-slot-${index + 1}`,
            slotIndex: index + 1,
            spell: sortedSpells[index] || null
        });
    }

    return slots;
}

function getRarityView(rarity) {
    return {
        label: RARITY_LABELS[rarity] || rarity,
        className: RARITY_CLASS_NAMES[rarity] || "rarity-common"
    };
}

function getTypeView(type) {
    return {
        label: TYPE_LABELS[type] || type
    };
}

function getTagViews(spell) {
    return spell.tags
        .filter(tag => tag !== spell.type)
        .map(tag => {
            return {
                label: TAG_LABELS[tag] || tag
            };
        });
}

function getSpellValueLines(values) {
    const lines = [];

    addValueLine(lines, values.damage, "Schaden");
    addValueLine(lines, values.shield, "Schild");

    if (values.frenzyDamageBonus) {
        lines.push(`+${values.frenzyDamageBonus} Schaden für Blutzauber`);
    }

    if (values.damagePerSacrificedHp) {
        lines.push(`+${values.damagePerSacrificedHp} Schaden pro geopfertem HP`);
    }

    if (values.negativeEffectDamageBonus) {
        lines.push(`+${values.negativeEffectDamageBonus} Schaden gegen geschwächte Gegner`);
    }

    if (values.statusDamageBonus) {
        lines.push(`+${values.statusDamageBonus} Schaden bei ${getStatusLabel(values.requiredStatusId)}`);
    }

    if (values.perNegativeEffectDamageBonus) {
        lines.push(`+${values.perNegativeEffectDamageBonus} Schaden pro negativem Effekt`);
    }

    if (values.nextEchoDamageBonus) {
        lines.push(`+${values.nextEchoDamageBonus} Schaden für Echo`);
    }

    if (values.nextSpellAdaptiveBonus) {
        lines.push(`+${values.nextSpellAdaptiveBonus} Schaden oder Schild`);
    }

    if (values.conditionalAdaptiveBonus) {
        lines.push(`+${values.conditionalAdaptiveBonus} Schaden oder Schild`);
    }

    if (values.timingDamageBonus) {
        lines.push(`+${values.timingDamageBonus} Schaden bei Timing`);
    }

    if (values.aftershockDamage) {
        lines.push(`${values.aftershockDamage} Nachbeben-Schaden`);
    }

    if (values.damagePerMomentum) {
        lines.push(`+${values.damagePerMomentum} Schaden pro Momentum`);
    }

    if (values.consumedMomentumDamageBonus) {
        lines.push(`+${values.consumedMomentumDamageBonus} Schaden pro verbrauchtem Momentum`);
    }

    if (values.primalDamageBonus) {
        lines.push(`+${values.primalDamageBonus} Schaden für Urgewaltenzauber`);
    }

    return lines;
}

function getSpellMechanicLines(values) {
    const lines = [];

    if (values.hpCostPercent) {
        lines.push(`Opfert ${values.hpCostPercent} % des maximalen Lebens.`);
    }

    if (values.missingLifeBonusMax) {
        lines.push(`Bis zu +${values.missingLifeBonusMax} Schaden durch fehlendes Leben.`);
    }

    if (values.nextBloodDamageBonus) {
        lines.push(
            getBloodBonusLine(
                values.nextBloodBonusCharges,
                values.nextBloodDamageBonus
            )
        );
    }

    if (values.pactCharges) {
        lines.push(
            `Die nächsten ${values.pactCharges} Blutzauber profitieren von geopfertem Leben.`
        );
    }

    if (values.healSacrificePercentOnExpire) {
        lines.push(
            `Heilt nach Ablauf ${values.healSacrificePercentOnExpire} % geopferter HP.`
        );
    }

    if (values.frenzyThresholdPercent) {
        lines.push(
            `Aktiv unter ${values.frenzyThresholdPercent} % Leben.`
        );
    }

    if (values.frenzyShieldPerBloodSpell) {
        lines.push(
            `Jeder Blutzauber erzeugt ${values.frenzyShieldPerBloodSpell} Schild.`
        );
    }

    if (values.damagePerMissingLifePercent) {
        lines.push(
            getMissingLifePercentLine(values.damagePerMissingLifePercent)
        );
    }

    if (values.activateBloodFrenzy) {
        lines.push("Aktiviert Blutrausch nach dem Treffer.");
    }

    if (values.ignoreShield) {
        lines.push("Ignoriert Schilde.");
    }

    if (values.refundSacrificeOnKill) {
        lines.push("Erstattet Opferkosten bei Kill.");
    }

    if (values.statusId) {
        lines.push(`Verleiht ${getStatusLabel(values.statusId)}.`);
    }

    if (values.statusSchoolDamageBonus) {
        lines.push(
            `${getStatusLabel(values.statusId)}: +${values.statusSchoolDamageBonus} Schaden für ${getSchoolLabel(values.nextSchool || "shadow")}.`
        );
    }

    if (values.nextSchoolDamageBonus) {
        lines.push(
            getSchoolBonusLine(
                values.nextSchool,
                values.nextSchoolBonusCharges,
                values.nextSchoolDamageBonus
            )
        );
    }

    if (values.conditionalDamageBonus && values.conditionalTargetSchool) {
        lines.push(
            getSchoolBonusLine(
                values.conditionalTargetSchool,
                values.conditionalBonusCharges,
                values.conditionalDamageBonus
            )
        );
    }

    if (values.conditionalShieldBonus && values.conditionalTargetSchool) {
        lines.push(
            `Verstärkte ${getSchoolLabel(values.conditionalTargetSchool)}-Zauber erhalten +${values.conditionalShieldBonus} Schild.`
        );
    }

    if (values.conditionalAdaptiveBonus) {
        lines.push(
            `Der nächste passende Zauber erhält +${values.conditionalAdaptiveBonus} Schaden oder Schild.`
        );
    }

    if (values.includeHybridCombinations) {
        lines.push("Hybridkombinationen können den Bonus ebenfalls auslösen.");
    }

    if (values.firstNextSchoolDamageBonus) {
        lines.push(
            `Erster verstärkter Zauber: +${values.firstNextSchoolDamageBonus} Schaden.`
        );
    }

    if (values.nextSchoolShieldPierce) {
        lines.push(
            `Verstärkte Zauber ignorieren ${values.nextSchoolShieldPierce} Schild.`
        );
    }

    if (values.negativeEffectShieldPierce) {
        lines.push(
            `Ignoriert ${values.negativeEffectShieldPierce} Schild gegen geschwächte Gegner.`
        );
    }

    if (values.statusShieldPierce) {
        lines.push(
            `Ignoriert ${values.statusShieldPierce} Schild bei ${getStatusLabel(values.requiredStatusId)}.`
        );
    }

    if (values.aftershockShieldPierce) {
        lines.push(`Nachbeben ignoriert ${values.aftershockShieldPierce} Schild.`);
    }

    if (values.shieldPiercePerMomentum) {
        lines.push(`Ignoriert ${values.shieldPiercePerMomentum} Schild pro Momentum.`);
    }

    if (values.momentumGain) {
        lines.push(`Erzeugt ${values.momentumGain} Momentum.`);
    }

    if (values.aftershockMomentumGain) {
        lines.push(`Nachbeben erzeugt ${values.aftershockMomentumGain} Momentum.`);
    }

    if (values.conditionalMomentumGain) {
        lines.push(`Verstärkte Zauber erzeugen ${values.conditionalMomentumGain} Momentum.`);
    }

    if (values.additionalMomentumGain) {
        lines.push(`Momentum-Effekte erzeugen +${values.additionalMomentumGain} Momentum.`);
    }

    if (values.initialMomentum) {
        lines.push(`Der Kampf beginnt mit ${values.initialMomentum} Momentum.`);
    }

    if (values.minimumMomentum) {
        lines.push(`Momentum steigt sofort auf mindestens ${values.minimumMomentum}.`);
    }

    if (values.consumeMomentum) {
        lines.push("Verbraucht sämtliches Momentum nach dem Treffer.");
    }

    if (values.additionalNegativeEffectDamageBonus) {
        lines.push(
            `+${values.additionalNegativeEffectDamageBonus} Schaden pro weiterem negativen Effekt.`
        );
    }

    if (values.echoPercent) {
        lines.push(`Erzeugt ein Echo mit ${values.echoPercent} % Stärke.`);
    }

    if (values.echoCopiesStatusEffects) {
        lines.push("Echo übernimmt Statuseffekte.");
    }

    if (values.echoCopiesAllEffects) {
        lines.push("Echo übernimmt sämtliche Effekte.");
    }

    if (values.nextEchoBonusCharges) {
        lines.push(
            `Verstärkt die nächsten ${formatValue(values.nextEchoBonusCharges)} Echo-Effekte.`
        );
    }

    if (values.echoImmediate) {
        lines.push("Echo löst unmittelbar nach seinem Ursprung aus.");
    }

    if (values.globalEchoPercent) {
        lines.push(`Echo wirkt mit mindestens ${values.globalEchoPercent} % Stärke.`);
    }

    if (values.nextEnemyAttackReduction) {
        lines.push(
            `Der nächste gegnerische Angriff verursacht ${values.nextEnemyAttackReduction} Schaden weniger.`
        );
    }

    if (values.blockNextNegativeStatus) {
        lines.push("Schützt bis zum nächsten eigenen Zug vor negativen Statuseffekten.");
    }

    if (values.ignoreRestrictionCount) {
        lines.push(
            `Der nächste Zauber ignoriert ${values.ignoreRestrictionCount} Einschränkung(en).`
        );
    }

    if (values.timingTargetSchool) {
        lines.push(
            `Aktiviert Timing für ${formatValue(values.timingStarCharges)} ${getSchoolLabel(values.timingTargetSchool)}-Zauber.`
        );
    }

    if (values.timingHybridCharges) {
        lines.push(
            `Timing gilt zusätzlich für ${formatValue(values.timingHybridCharges)} Hybridzauber.`
        );
    }

    if (values.timingShieldPierce) {
        lines.push(`Timing ignoriert zusätzlich ${values.timingShieldPierce} Schild.`);
    }

    if (values.preserveTimingEffect) {
        lines.push("Verbraucht keinen aktiven Timing-Effekt.");
    }

    if (values.doubleNextTimingBonus) {
        lines.push("Der erste Timing-Bonus wird verdoppelt.");
    }

    if (values.globalTimingDamageBonus) {
        lines.push(`Alle Timing-Effekte erhalten +${values.globalTimingDamageBonus} Schaden.`);
    }

    if (values.ignoreAllRestrictions) {
        lines.push("Der nächste Zauber ignoriert sämtliche Einschränkungen.");
    }

    if (values.activateDreamParadox) {
        lines.push("Aktiviert Traumparadoxon für den nächsten Zauber.");
    }

    if (values.activateFalseAwakening) {
        lines.push("Aktiviert Falsches Erwachen für den nächsten Zauber.");
    }

    if (values.triggerActiveEchoes) {
        lines.push("Löst aktive Echo-Effekte sofort aus.");
    }

    if (values.maximizeDreamEffects) {
        lines.push("Maximiert aktive Traum-Effekte.");
    }

    return lines;
}

function getUpgradeChangeLines(currentValues, nextValues) {
    const lines = [];

    addChangedValueLine(lines, currentValues, nextValues, "damage", "Schaden");
    addChangedValueLine(lines, currentValues, nextValues, "shield", "Schild");
    addChangedPercentLine(lines, currentValues, nextValues, "hpCostPercent", "Opferkosten", "Leben");
    addChangedBonusLine(lines, currentValues, nextValues, "missingLifeBonusMax", "Skalierung", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "nextBloodDamageBonus", "Blutbonus", "Schaden");
    addChangedDurationLine(lines, currentValues, nextValues, "nextBloodBonusCharges", "Dauer");
    addChangedDurationLine(lines, currentValues, nextValues, "pactCharges", "Dauer");
    addChangedBonusLine(lines, currentValues, nextValues, "damagePerSacrificedHp", "Opferbonus", "Schaden pro HP");
    addChangedPercentLine(lines, currentValues, nextValues, "frenzyThresholdPercent", "Aktivierung", "Leben");
    addChangedBonusLine(lines, currentValues, nextValues, "frenzyDamageBonus", "Blutrausch-Bonus", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "negativeEffectDamageBonus", "Schwächebonus", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "statusDamageBonus", "Statusbonus", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "additionalNegativeEffectDamageBonus", "Weitere Schwächen", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "perNegativeEffectDamageBonus", "Schwächen", "Schaden pro Effekt");
    addChangedBonusLine(lines, currentValues, nextValues, "nextSchoolDamageBonus", "Vorbereitung", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "firstNextSchoolDamageBonus", "Erster Zauber", "Schaden");
    addChangedValueLine(lines, currentValues, nextValues, "nextSchoolBonusCharges", "verstärkte Zauber");
    addChangedBonusLine(lines, currentValues, nextValues, "negativeEffectShieldPierce", "Schilddurchdringung", "Schild");
    addChangedBonusLine(lines, currentValues, nextValues, "statusShieldPierce", "Schilddurchdringung", "Schild");
    addChangedBonusLine(lines, currentValues, nextValues, "nextSchoolShieldPierce", "Schilddurchdringung", "Schild");
    addChangedBonusLine(lines, currentValues, nextValues, "nextEchoDamageBonus", "Echo-Bonus", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "nextSpellAdaptiveBonus", "Regelbonus", "Schaden oder Schild");
    addChangedBonusLine(lines, currentValues, nextValues, "conditionalAdaptiveBonus", "Vorbereitung", "Schaden oder Schild");
    addChangedBonusLine(lines, currentValues, nextValues, "nextEnemyAttackReduction", "Angriffsreduktion", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "timingDamageBonus", "Timing", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "timingShieldPierce", "Timing", "Schilddurchdringung");
    addChangedBonusLine(lines, currentValues, nextValues, "aftershockDamage", "Nachbeben", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "damagePerMomentum", "Momentum", "Schaden pro Momentum");
    addChangedBonusLine(lines, currentValues, nextValues, "consumedMomentumDamageBonus", "Verbrauchtes Momentum", "Schaden pro Momentum");
    addChangedBonusLine(lines, currentValues, nextValues, "primalDamageBonus", "Urgewaltenbonus", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "shieldPiercePerMomentum", "Schilddurchdringung", "Schild pro Momentum");
    addChangedBonusLine(lines, currentValues, nextValues, "momentumGain", "Momentum", "Momentum");
    addChangedBonusLine(lines, currentValues, nextValues, "conditionalDamageBonus", "Vorbereitung", "Schaden");
    addChangedBonusLine(lines, currentValues, nextValues, "conditionalShieldBonus", "Vorbereitung", "Schild");
    addChangedValueLine(lines, currentValues, nextValues, "conditionalBonusCharges", "verstärkte Zauber");
    addChangedValueLine(lines, currentValues, nextValues, "timingStarCharges", "Timing-Zauber");
    addChangedValueLine(lines, currentValues, nextValues, "timingHybridCharges", "Timing-Hybridzauber");
    addChangedPercentLine(lines, currentValues, nextValues, "echoPercent", "Echo-Stärke", "Stärke");
    addChangedPercentLine(lines, currentValues, nextValues, "globalEchoPercent", "Echo-Stärke", "Stärke");

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "healSacrificePercentOnExpire",
        value => `Heilt ${value} % geopferter HP`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "frenzyShieldPerBloodSpell",
        value => `Jeder Blutzauber erzeugt ${value} Schild`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "activateBloodFrenzy",
        () => "Aktiviert Blutrausch"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "ignoreShield",
        () => "Ignoriert Schilde"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "refundSacrificeOnKill",
        () => "Erstattet Opferkosten bei Kill"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "statusId",
        value => `Verleiht ${getStatusLabel(value)}`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "statusSchoolDamageBonus",
        value => `${getStatusLabel(nextValues.statusId)} erhöht Schatten-Schaden um +${value}`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "negativeEffectShieldPierce",
        value => `Ignoriert ${value} Schild gegen geschwächte Gegner`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "statusShieldPierce",
        value => `Ignoriert ${value} Schild bei ${getStatusLabel(nextValues.requiredStatusId)}`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "aftershockMomentumGain",
        value => `Nachbeben erzeugt ${value} Momentum`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "aftershockShieldPierce",
        value => `Nachbeben ignoriert ${value} Schild`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "conditionalMomentumGain",
        value => `Verstärkte Zauber erzeugen ${value} Momentum`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "includeHybridCombinations",
        () => "Hybridkombinationen können den Bonus ebenfalls auslösen"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "preserveTimingEffect",
        () => "Verbraucht keinen aktiven Timing-Effekt"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "doubleNextTimingBonus",
        () => "Der erste Timing-Bonus wird verdoppelt"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "globalTimingDamageBonus",
        value => `Alle Timing-Effekte erhalten +${value} Schaden`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "additionalMomentumGain",
        value => `Momentum-Effekte erzeugen +${value} Momentum`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "initialMomentum",
        value => `Der Kampf beginnt mit ${value} Momentum`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "minimumMomentum",
        value => `Momentum steigt sofort auf mindestens ${value}`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "nextSchoolShieldPierce",
        value => `Verstärkte Zauber ignorieren ${value} Schild`
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "echoCopiesStatusEffects",
        () => "Echo übernimmt Statuseffekte"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "echoCopiesAllEffects",
        () => "Echo übernimmt sämtliche Effekte"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "echoImmediate",
        () => "Echo löst unmittelbar aus"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "blockNextNegativeStatus",
        () => "Schützt vor negativen Statuseffekten"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "ignoreAllRestrictions",
        () => "Ignoriert sämtliche Einschränkungen"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "triggerActiveEchoes",
        () => "Löst aktive Echo-Effekte sofort aus"
    );

    addNewMechanicLine(
        lines,
        currentValues,
        nextValues,
        "maximizeDreamEffects",
        () => "Maximiert aktive Traum-Effekte"
    );

    return lines;
}

function getNewSpellLines(values) {
    return [
        ...getSpellValueLines(values),
        ...getSpellMechanicLines(values)
    ];
}

function addValueLine(lines, value, label) {
    if (typeof value === "number") {
        lines.push(`${formatValue(value)} ${label}`);
    }
}

function addChangedValueLine(lines, currentValues, nextValues, key, label) {
    if (!hasChangedValue(currentValues, nextValues, key)) {
        return;
    }

    lines.push(
        `${formatValue(currentValues[key])} → ${formatValue(nextValues[key])} ${label}`
    );
}

function addChangedPercentLine(lines, currentValues, nextValues, key, label, suffix) {
    if (!hasChangedValue(currentValues, nextValues, key)) {
        return;
    }

    lines.push(
        `${label}: ${formatValue(currentValues[key])} % → ${formatValue(nextValues[key])} % ${suffix}`
    );
}

function addChangedBonusLine(lines, currentValues, nextValues, key, label, suffix) {
    if (!hasChangedValue(currentValues, nextValues, key)) {
        return;
    }

    lines.push(
        `${label}: +${formatValue(currentValues[key])} → +${formatValue(nextValues[key])} ${suffix}`
    );
}

function addChangedDurationLine(lines, currentValues, nextValues, key, label) {
    if (!hasChangedValue(currentValues, nextValues, key)) {
        return;
    }

    lines.push(
        `${label}: ${formatValue(currentValues[key])} → ${formatValue(nextValues[key])} Blutzauber`
    );
}

function addNewMechanicLine(lines, currentValues, nextValues, key, createText) {
    if (currentValues[key] || !nextValues[key]) {
        return;
    }

    lines.push(`NEU: ${createText(nextValues[key])}`);
}

function hasChangedValue(currentValues, nextValues, key) {
    return (
        typeof currentValues[key] !== "undefined" &&
        typeof nextValues[key] !== "undefined" &&
        currentValues[key] !== nextValues[key]
    );
}

function getBloodBonusLine(charges, bonus) {
    if (charges === 1) {
        return `Nächster Blutzauber: +${bonus} Schaden.`;
    }

    return `Nächste ${charges} Blutzauber: +${bonus} Schaden.`;
}

function getSchoolBonusLine(school, charges, bonus) {
    const schoolLabel =
        getSchoolLabel(school);

    if (charges === 1) {
        return `Nächster ${schoolLabel}-Zauber: +${bonus} Schaden.`;
    }

    return `Nächste ${charges} ${schoolLabel}-Zauber: +${bonus} Schaden.`;
}

function getSchoolLabel(school) {
    return SCHOOL_LABELS[school] || school;
}

function getStatusLabel(statusId) {
    const statusLabels = {
        wound: "Wunde"
    };

    return statusLabels[statusId] || statusId;
}

function getMissingLifePercentLine(value) {
    const percentPerDamage =
        1 / value;

    return `+1 Schaden je ${formatValue(percentPerDamage)} % fehlendes Leben.`;
}

function formatValue(value) {
    return Number.isInteger(value)
        ? `${value}`
        : `${value}`.replace(".", ",");
}

function getSpellRotationOrder(spell) {
    if (typeof spell.rotationOrder === "number") {
        return spell.rotationOrder;
    }

    if (
        typeof spellPriority !== "undefined" &&
        typeof spellPriority[spell.name] === "number"
    ) {
        return spellPriority[spell.name];
    }

    return Number.MAX_SAFE_INTEGER;
}

function sortSpellsByRotationOrder(spellsToSort) {
    return [...spellsToSort].sort((a, b) => {
        return getSpellRotationOrder(a) - getSpellRotationOrder(b);
    });
}

function createSpellPriority(definitions) {
    return definitions.reduce((priorityMap, spell) => {
        priorityMap[spell.name] = spell.rotationOrder;
        return priorityMap;
    }, {});
}
