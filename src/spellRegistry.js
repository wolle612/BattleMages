const LEGACY_SCHOOL_ELEMENTS = {
    fire: "Feuer",
    frost: "Frost",
    arcane: "Arkan"
};

const LEGACY_SPELL_LIST_ORDER = [
    "Glutgeschoss",
    "Frostbiss",
    "Runensplitter",
    "Glutpanzer",
    "Frostschild",
    "Inferno",
    "Brennendes Blut",
    "Lawine",
    "Wintereinbruch",
    "Äthersturm",
    "Zerfall",
    "Arkaner Schleier"
];

function createLegacySpells(definitions) {
    return [...definitions]
        .sort((a, b) => {
            return getLegacySpellListOrder(a) - getLegacySpellListOrder(b);
        })
        .map(definition => {
            const rankOneValues =
                getSpellRankValues(definition, 1);

            return {
                ...definition,
                element: LEGACY_SCHOOL_ELEMENTS[definition.school] || definition.school,
                damage: rankOneValues.damage,
                shield: rankOneValues.shield,
                fireBuff: rankOneValues.fireBuff,
                starter: definition.starter
            };
        });
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

function getLegacySpellListOrder(spell) {
    const index =
        LEGACY_SPELL_LIST_ORDER.indexOf(spell.name);

    return index === -1
        ? Number.MAX_SAFE_INTEGER
        : index;
}
