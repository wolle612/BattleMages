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

function getUpgradeChangeLines(currentValues, nextValues) {
    const lines = [];

    addChangedValueLine(lines, currentValues, nextValues, "damage", "Schaden");
    addChangedValueLine(lines, currentValues, nextValues, "shield", "Schild");

    return lines;
}

function addChangedValueLine(lines, currentValues, nextValues, key, label) {
    if (!hasChangedValue(currentValues, nextValues, key)) {
        return;
    }

    lines.push(
        `${formatValue(currentValues[key])} → ${formatValue(nextValues[key])} ${label}`
    );
}

function hasChangedValue(currentValues, nextValues, key) {
    return (
        typeof currentValues[key] !== "undefined" &&
        typeof nextValues[key] !== "undefined" &&
        currentValues[key] !== nextValues[key]
    );
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
