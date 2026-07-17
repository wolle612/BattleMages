const SPELL_DESCRIPTIONS = {};

const KEYWORD_TOOLTIPS = {
    "Vorbereitung": "Verstärkt oder verändert deinen nächsten Zauber.",
    "Verwundbar": "Das Ziel nimmt vom nächsten Treffer 50 % mehr Schaden.",
    "Schild": "Absorbiert eingehenden Schaden, bevor du Leben verlierst.",
    "Kritischer Treffer": "Verursacht doppelten Schaden.",
    "Kritische Treffer": "Verursachen doppelten Schaden.",
    "Kritchance": "Chance, einen kritischen Treffer zu landen.",
    "Schwäche": "Negativer Effekt auf dem Ziel, z. B. Verwundbar.",
    "Schwächen": "Negative Effekte auf dem Ziel, z. B. Verwundbar."
};

const SCHOOL_LABELS = Object
    .keys(COMBAT_SCHOOLS)
    .reduce((labels, schoolId) => {
        labels[schoolId] =
            COMBAT_SCHOOLS[schoolId].fantasyName;

        return labels;
    }, {});

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

const spellDefinitions =
    createSpellDefinitions(rawSpellDefinitions);

const spells =
    sortSpellsByRotationOrder(spellDefinitions);

function createSpellDefinitions(definitions) {
    return definitions.map((definition, index) => {
        return {
            ...definition,
            description: definition.description || SPELL_DESCRIPTIONS[definition.id],
            rarity: definition.rarity || getDefaultSpellRarity(definitions, definition),
            rotationOrder: definition.rotationOrder || getDefaultRotationOrder(definitions, definition),
            role: definition.role || "",
            build: definition.build || "",
            mechanics: definition.mechanics || [],
            tooltip: definition.tooltip || [],
            effects: definition.effects || [],
            spellbookCore: definition.spellbookCore === true,
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

function getSpellRankValues(spell, rank, path) {
    return resolveSpellUpgradeValues(
        spell,
        rank,
        path
    );
}

function getSpellTooltipView(spell, rank, path, options = {}) {
    const resolvedPath =
        path !== undefined
            ? path
            : (
                rank >= PATH_CHOICE_RANK
                    ? getSpellPath(spell.id)
                    : null
            );

    const pathLabel =
        getSpellPathLabel(spell, resolvedPath);

    const valueLines =
        getSpellTooltipLines(
            spell,
            rank,
            resolvedPath
        ).map(enrichTooltipText);

    const description =
        spell.description
            ? enrichTooltipText(spell.description)
            : "";

    const showRank =
        options.showRank !== false;

    const showUpgradePreview =
        options.showUpgradePreview !== false;

    const upgradePreview =
        showUpgradePreview
            ? getSpellUpgradePreview(spell, rank, resolvedPath)
            : { rank3: [], rank5: [] };

    return {
        name: spell.name,
        schoolLabel: getSchoolLabel(spell.school),
        rarity: getRarityView(spell.rarity),
        rankLabel: romanize(rank),
        showRank,
        description,
        valueLines,
        pathLabel,
        upgradePreview
    };
}

function getSpellRewardView(spell, currentRank, rewardOption) {
    if (rewardOption?.type === "path_choice") {
        return {
            rarity: getRarityView(spell.rarity),
            rank: PATH_CHOICE_RANK,
            rankLabel: romanize(PATH_CHOICE_RANK),
            changeLines: [],
            pathChoices: getPathChoiceOptions(spell)
        };
    }

    const targetRank =
        currentRank + 1;

    const currentValues =
        getSpellRankValues(spell, currentRank);

    const nextValues =
        getSpellRankValues(spell, targetRank);

    const deltaLines =
        getUpgradeChangeLines(currentValues, nextValues);

    const previewLines =
        deltaLines.length > 0
            ? deltaLines
            : getSpellRewardPreviewLines(
                spell,
                currentRank
            );

    return {
        rarity: getRarityView(spell.rarity),
        rank: targetRank,
        rankLabel: romanize(targetRank),
        rankProgressLabel: `Rang ${romanize(currentRank)} → ${romanize(targetRank)}`,
        changeLines: previewLines.map(line => enrichTooltipText(line))
    };
}


function getRarityView(rarity) {
    return {
        label: RARITY_LABELS[rarity] || rarity,
        className: RARITY_CLASS_NAMES[rarity] || "rarity-common"
    };
}

function getSpellIconPath(spell) {
    const schoolDefinition =
        COMBAT_SCHOOLS[spell.school];

    const iconFolder =
        schoolDefinition?.iconFolder || spell.school;

    return `assets/icons/spells/${iconFolder}/${spell.id}.png`;
}

function getSpellIconFallbackInitial(spell) {
    return spell.name.charAt(0);
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
    const sections =
        getSpellTooltipSections(null, values);

    return [
        ...sections.direct,
        ...sections.additional
    ];
}

function getSpellMechanicLines(values) {
    const sections =
        getSpellTooltipSections(null, values);

    return [
        ...sections.conditional,
        ...sections.special
    ];
}

function getSpellTooltipSections(spell, values) {
    const sections = {
        direct: [],
        additional: [],
        conditional: [],
        special: []
    };

    addDirectEffectLine(sections.direct, values.damage, "damage");
    addDirectEffectLine(sections.direct, values.shield, "shield");

    if (values.hpCostPercent) {
        sections.direct.push(
            `Opfert ${values.hpCostPercent} % des maximalen Lebens.`
        );
    }

    if (values.aftershockDamage) {
        sections.additional.push(
            `Verursacht ${formatValue(values.aftershockDamage)} Nachbeben-Schaden.`
        );
    }

    if (values.momentumGain) {
        sections.additional.push(
            `Erzeugt ${formatValue(values.momentumGain)} Momentum.`
        );
    }

    if (values.aftershockMomentumGain) {
        sections.additional.push(
            `Nachbeben erzeugt ${formatValue(values.aftershockMomentumGain)} Momentum.`
        );
    }

    if (values.statusId) {
        sections.additional.push(
            `Verleiht ${getStatusLabel(values.statusId)}.`
        );
    }

    if (values.echoPercent) {
        sections.additional.push(
            `Echo: Der Treffer kehrt mit ${values.echoPercent} % Stärke zurück.`
        );
    }

    if (values.frenzyThresholdPercent) {
        sections.additional.push(
            `Aktiviert Blutrausch unter ${values.frenzyThresholdPercent} % Leben.`
        );
    }

    if (values.frenzyDamageBonus) {
        sections.additional.push(
            `Blutrausch: +${values.frenzyDamageBonus} Schaden für Blutzauber.`
        );
    }

    if (values.frenzyShieldPerBloodSpell) {
        sections.additional.push(
            `Blutrausch: Jeder Blutzauber erzeugt ${values.frenzyShieldPerBloodSpell} Schild.`
        );
    }

    if (values.activateBloodFrenzy) {
        sections.additional.push(
            "Aktiviert Blutrausch nach dem Treffer."
        );
    }

    if (values.nextBloodDamageBonus) {
        sections.conditional.push(
            getBloodBonusLine(
                values.nextBloodBonusCharges,
                values.nextBloodDamageBonus
            )
        );
    }

    if (values.statusDamageBonus && values.requiredStatusId) {
        sections.conditional.push(
            `Falls ${getStatusLabel(values.requiredStatusId)} aktiv ist: +${values.statusDamageBonus} Schaden.`
        );
    }

    if (values.negativeEffectDamageBonus) {
        sections.conditional.push(
            `Falls der Gegner Schwächen hat: +${values.negativeEffectDamageBonus} Schaden.`
        );
    }

    if (values.perNegativeEffectDamageBonus) {
        sections.conditional.push(
            `+${values.perNegativeEffectDamageBonus} Schaden pro Schwäche auf dem Ziel.`
        );
    }

    if (values.additionalNegativeEffectDamageBonus) {
        sections.conditional.push(
            `+${values.additionalNegativeEffectDamageBonus} Schaden pro weiterer Schwäche.`
        );
    }

    if (values.nextSchoolDamageBonus && values.nextSchool) {
        sections.conditional.push(
            getSchoolBonusLine(
                values.nextSchool,
                values.nextSchoolBonusCharges,
                values.nextSchoolDamageBonus
            )
        );
    }

    if (values.conditionalDamageBonus && values.conditionalTargetSchool) {
        sections.conditional.push(
            getSchoolBonusLine(
                values.conditionalTargetSchool,
                values.conditionalBonusCharges,
                values.conditionalDamageBonus
            )
        );
    }

    if (
        values.conditionalTrigger === "hybrid" &&
        values.conditionalDamageBonus
    ) {
        sections.conditional.push(
            `Bei Hybrid verursacht der auslösende Zauber +${values.conditionalDamageBonus} Schaden.`
        );
    }

    if (
        values.conditionalTrigger === "hybrid" &&
        values.conditionalShieldBonus
    ) {
        sections.conditional.push(
            `Bei Hybrid gewährt der auslösende Zauber +${values.conditionalShieldBonus} Schild.`
        );
    }

    if (values.conditionalShieldBonus && values.conditionalTargetSchool) {
        sections.conditional.push(
            `Der nächste ${getSchoolLabel(values.conditionalTargetSchool)}-Zauber gewährt +${values.conditionalShieldBonus} Schild.`
        );
    }

    if (values.conditionalAdaptiveBonus) {
        sections.conditional.push(
            getAdaptiveBonusLine(
                values.conditionalBonusCharges,
                values.conditionalAdaptiveBonus
            )
        );
    }

    if (values.conditionalMomentumGain) {
        sections.conditional.push(
            `Verstärkte Zauber erzeugen ${values.conditionalMomentumGain} Momentum.`
        );
    }

    if (values.timingDamageBonus) {
        sections.conditional.push(
            `Bei Timing: +${values.timingDamageBonus} Schaden.`
        );
    }

    if (values.nextEchoDamageBonus) {
        sections.conditional.push(
            `Echo: +${values.nextEchoDamageBonus} Schaden.`
        );
    }

    if (values.previousDifferentTypeDamageBonus) {
        sections.conditional.push(
            `Falls der vorherige Zauber ein anderer Typ ist: +${values.previousDifferentTypeDamageBonus} Schaden.`
        );
    }

    if (values.previousDifferentSchoolDamageBonus) {
        sections.conditional.push(
            `Falls der vorherige Zauber eine andere Schule ist: +${values.previousDifferentSchoolDamageBonus} Schaden.`
        );
    }

    if (values.damagePerSacrificedHp) {
        sections.conditional.push(
            `+${values.damagePerSacrificedHp} Schaden pro geopfertem HP.`
        );
    }

    if (values.pactCharges) {
        sections.conditional.push(
            `Die nächsten ${values.pactCharges} Blutzauber profitieren von geopfertem Leben.`
        );
    }

    if (values.damagePerMomentum) {
        sections.special.push(
            `+${values.damagePerMomentum} Schaden pro Momentum.`
        );
    }

    if (values.consumedMomentumDamageBonus) {
        sections.special.push(
            `+${values.consumedMomentumDamageBonus} Schaden pro verbrauchtem Momentum.`
        );
    }

    if (values.primalDamageBonus) {
        sections.special.push(
            `+${values.primalDamageBonus} Schaden für Urgewaltenzauber.`
        );
    }

    if (values.masterRuneAdaptiveBonus) {
        sections.special.push(
            `Meisterrune: +${values.masterRuneAdaptiveBonus} Schaden oder Schild für Runeneffekte.`
        );
    }

    if (values.sequenceMaxDamageBonus) {
        sections.special.push(
            `Runenfolge: Bis zu +${values.sequenceMaxDamageBonus} Schaden durch aufeinanderfolgende Zauber.`
        );
    }

    if (values.missingLifeBonusMax) {
        sections.special.push(
            `Bis zu +${values.missingLifeBonusMax} Schaden durch fehlendes Leben.`
        );
    }

    if (values.damagePerMissingLifePercent) {
        sections.special.push(
            getMissingLifePercentLine(values.damagePerMissingLifePercent)
        );
    }

    if (values.nextSpellAdaptiveBonus) {
        sections.special.push(
            `Der nächste Zauber verursacht +${values.nextSpellAdaptiveBonus} Schaden oder gewährt +${values.nextSpellAdaptiveBonus} Schild.`
        );
    }

    if (values.includeHybridCombinations) {
        sections.special.push(
            "Hybridkombinationen lösen die Vorbereitung ebenfalls aus."
        );
    }

    if (values.conditionalPersistent && values.conditionalTrigger === "hybrid") {
        sections.special.push(
            "Vorbereitung bleibt aktiv, bis Hybrid ausgelöst wird."
        );
    }

    if (values.firstNextSchoolDamageBonus) {
        sections.special.push(
            `Erster verstärkter Zauber: +${values.firstNextSchoolDamageBonus} Schaden.`
        );
    }

    if (values.healSacrificePercentOnExpire) {
        sections.special.push(
            `Heilt nach Ablauf ${values.healSacrificePercentOnExpire} % geopferter HP.`
        );
    }

    if (values.ignoreShield) {
        sections.special.push("Ignoriert Schilde.");
    }

    if (values.refundSacrificeOnKill) {
        sections.special.push("Erstattet Opferkosten bei Kill.");
    }

    if (values.statusSchoolDamageBonus) {
        sections.special.push(
            `${getStatusLabel(values.statusId)}: +${values.statusSchoolDamageBonus} Schaden für ${getSchoolLabel(values.nextSchool || "shadow")}.`
        );
    }

    if (values.nextSchoolShieldPierce) {
        sections.special.push(
            `Verstärkte Zauber ignorieren ${values.nextSchoolShieldPierce} Schild.`
        );
    }

    if (values.negativeEffectShieldPierce) {
        sections.special.push(
            `Ignoriert ${values.negativeEffectShieldPierce} Schild gegen Ziele mit Schwächen.`
        );
    }

    if (values.statusShieldPierce) {
        sections.special.push(
            `Ignoriert ${values.statusShieldPierce} Schild bei ${getStatusLabel(values.requiredStatusId)}.`
        );
    }

    if (values.aftershockShieldPierce) {
        sections.special.push(
            `Nachbeben ignoriert ${values.aftershockShieldPierce} Schild.`
        );
    }

    if (values.shieldPiercePerMomentum) {
        sections.special.push(
            `Ignoriert ${values.shieldPiercePerMomentum} Schild pro Momentum.`
        );
    }

    if (values.additionalMomentumGain) {
        sections.special.push(
            `Momentum-Effekte erzeugen +${values.additionalMomentumGain} Momentum.`
        );
    }

    if (values.initialMomentum) {
        sections.special.push(
            `Der Kampf beginnt mit ${values.initialMomentum} Momentum.`
        );
    }

    if (values.minimumMomentum) {
        sections.special.push(
            `Momentum steigt sofort auf mindestens ${values.minimumMomentum}.`
        );
    }

    if (values.consumeMomentum) {
        sections.special.push(
            "Verbraucht sämtliches Momentum nach dem Treffer."
        );
    }

    if (values.echoCopiesStatusEffects) {
        sections.special.push("Echo übernimmt Statuseffekte.");
    }

    if (values.echoCopiesAllEffects) {
        sections.special.push("Echo übernimmt sämtliche Effekte.");
    }

    if (values.nextEchoBonusCharges) {
        sections.special.push(
            `Verstärkt die nächsten ${formatValue(values.nextEchoBonusCharges)} Echo-Effekte.`
        );
    }

    if (values.echoImmediate) {
        sections.special.push(
            "Echo löst unmittelbar nach seinem Ursprung aus."
        );
    }

    if (values.globalEchoPercent) {
        sections.special.push(
            `Echo wirkt mindestens mit ${values.globalEchoPercent} % Stärke.`
        );
    }

    if (values.nextEnemyAttackReduction) {
        sections.special.push(
            `Der nächste gegnerische Angriff verursacht ${values.nextEnemyAttackReduction} Schaden weniger.`
        );
    }

    if (values.blockNextNegativeStatus) {
        sections.special.push(
            "Schützt bis zum nächsten eigenen Zug vor negativen Statuseffekten."
        );
    }

    if (values.ignoreRestrictionCount) {
        sections.special.push(
            `Der nächste Zauber ignoriert ${values.ignoreRestrictionCount} Einschränkung(en).`
        );
    }

    if (values.timingTargetSchool) {
        sections.special.push(
            `Aktiviert Timing für ${formatValue(values.timingStarCharges)} ${getSchoolLabel(values.timingTargetSchool)}-Zauber.`
        );
    }

    if (values.timingHybridCharges) {
        sections.special.push(
            `Timing gilt zusätzlich für ${formatValue(values.timingHybridCharges)} Hybrid-Zauber.`
        );
    }

    if (values.timingShieldPierce) {
        sections.special.push(
            `Timing ignoriert zusätzlich ${values.timingShieldPierce} Schild.`
        );
    }

    if (values.preserveTimingEffect) {
        sections.special.push(
            "Verbraucht keinen aktiven Timing-Effekt."
        );
    }

    if (values.doubleNextTimingBonus) {
        sections.special.push(
            "Der erste Timing-Bonus wird verdoppelt."
        );
    }

    if (values.globalTimingDamageBonus) {
        sections.special.push(
            `Alle Timing-Effekte erhalten +${values.globalTimingDamageBonus} Schaden.`
        );
    }

    if (values.ignoreAllRestrictions) {
        sections.special.push(
            "Der nächste Zauber ignoriert sämtliche Einschränkungen."
        );
    }

    if (values.activateDreamParadox) {
        sections.special.push(
            "Setzt Traumparadoxon auf den nächsten Zauber."
        );
    }

    if (values.activateFalseAwakening) {
        sections.special.push(
            "Setzt Falsches Erwachen auf den nächsten Zauber."
        );
    }

    if (values.triggerActiveEchoes) {
        sections.special.push(
            "Löst alle aktiven Echo-Effekte sofort aus."
        );
    }

    if (values.maximizeDreamEffects) {
        sections.special.push(
            "Verstärkt alle aktiven Traum-Effekte auf Maximum."
        );
    }

    if (values.retriggerRuneLinks) {
        sections.special.push(
            "Aktiviert Runenverbindungen erneut."
        );
    }

    if (values.maximizeRuneEffects) {
        sections.special.push(
            "Maximiert alle aktiven Runenkombinationen."
        );
    }

    if (values.activateHybridCombinations) {
        sections.special.push(
            "Aktiviert Hybridkombinationen im Build."
        );
    }

    if (values.moveSlotsForward) {
        sections.special.push(
            `Rückt den nächsten passenden Zauber um ${values.moveSlotsForward} Platz nach vorne.`
        );
    }

    if (values.additionalHybridBuildTags) {
        sections.special.push(
            `Hybridkombinationen zählen ${values.additionalHybridBuildTags} zusätzliche(n) Tag(s).`
        );
    }

    return sections;
}

function addDirectEffectLine(lines, value, effectType) {
    if (typeof value !== "number") {
        return;
    }

    if (effectType === "damage") {
        lines.push(`Verursacht ${formatValue(value)} Schaden.`);
        return;
    }

    if (effectType === "shield") {
        lines.push(`Erhalte ${formatValue(value)} Schild.`);
    }
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
    addDirectEffectLine(
        lines,
        value,
        label === "Schild" ? "shield" : "damage"
    );
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

function getAdaptiveBonusLine(charges, bonus) {
    if (charges === 1) {
        return `Der nächste passende Zauber verursacht +${bonus} Schaden oder gewährt +${bonus} Schild.`;
    }

    return `Die nächsten ${charges} passenden Zauber verursachen +${bonus} Schaden oder gewähren +${bonus} Schild.`;
}

function getBloodBonusLine(charges, bonus) {
    if (charges === 1) {
        return `Der nächste Blutzauber verursacht +${bonus} Schaden.`;
    }

    return `Die nächsten ${charges} Blutzauber verursachen +${bonus} Schaden.`;
}

function getSchoolBonusLine(school, charges, bonus) {
    const schoolLabel =
        getSchoolLabel(school);

    if (charges === 1) {
        return `Der nächste ${schoolLabel}-Zauber verursacht +${bonus} Schaden.`;
    }

    return `Die nächsten ${charges} ${schoolLabel}-Zauber verursachen +${bonus} Schaden.`;
}

function getSchoolLabel(school) {
    return SCHOOL_LABELS[school] || school;
}

function enrichTooltipText(text) {
    if (!text) {
        return text;
    }

    let enrichedText =
        escapeTooltipText(text);

    Object
        .keys(KEYWORD_TOOLTIPS)
        .sort((firstKeyword, secondKeyword) => {
            return secondKeyword.length - firstKeyword.length;
        })
        .forEach(keyword => {
            const pattern =
                new RegExp(escapeRegExp(keyword), "gi");

            enrichedText =
                enrichedText.replace(
                    pattern,
                    match => {
                        return `<span class="tooltip-keyword" title="${escapeTooltipText(KEYWORD_TOOLTIPS[keyword])}">${match}</span>`;
                    }
                );
        });

    return enrichedText;
}

function escapeTooltipText(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getStatusLabel(statusId) {
    const statusLabels = {
        vulnerable: "Verwundbar",
        wound: "Verwundbar"
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
        typeof spellPriority[spell.id] === "number"
    ) {
        return spellPriority[spell.id];
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
        priorityMap[spell.id] = spell.rotationOrder;
        return priorityMap;
    }, {});
}
