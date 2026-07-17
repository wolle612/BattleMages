const REWARD_SLOT_COUNT = 3;
const REWARD_UPGRADE_TYPE_CHANCE = 0.55;
const SCHOOL_AFFINITY_MULTIPLIER = 1.5;

const REWARD_RARITY_WEIGHTS_BY_PROGRESS = [
    {
        maxFightIndex: 2,
        weights: {
            Common: 68,
            Rare: 32,
            Epic: 0,
            Legendary: 0
        }
    },
    {
        maxFightIndex: 4,
        weights: {
            Common: 48,
            Rare: 42,
            Epic: 10,
            Legendary: 0
        }
    },
    {
        maxFightIndex: 6,
        weights: {
            Common: 32,
            Rare: 43,
            Epic: 22,
            Legendary: 3
        }
    },
    {
        maxFightIndex: 7,
        weights: {
            Common: 24,
            Rare: 41,
            Epic: 27,
            Legendary: 8
        }
    },
    {
        maxFightIndex: 11,
        weights: {
            Common: 14,
            Rare: 34,
            Epic: 34,
            Legendary: 18
        }
    }
];

const NEW_SPELL_START_RANK_WEIGHTS_BY_PROGRESS = [
    {
        maxFightIndex: 2,
        weights: {
            1: 95,
            2: 5
        }
    },
    {
        maxFightIndex: 6,
        weights: {
            1: 80,
            2: 20
        }
    },
    {
        maxFightIndex: 11,
        weights: {
            1: 60,
            2: 40
        }
    }
];

const SHADOW_SETUP_DEPENDENCY_MULTIPLIER = 0.2;

function getRewardRarityWeights(fightIndex) {
    const progressStep =
        REWARD_RARITY_WEIGHTS_BY_PROGRESS.find(step => {
            return fightIndex <= step.maxFightIndex;
        }) ||
        REWARD_RARITY_WEIGHTS_BY_PROGRESS[
            REWARD_RARITY_WEIGHTS_BY_PROGRESS.length - 1
        ];

    return progressStep.weights;
}

function getNewSpellStartRankWeights(fightIndex) {
    const progressStep =
        NEW_SPELL_START_RANK_WEIGHTS_BY_PROGRESS.find(step => {
            return fightIndex <= step.maxFightIndex;
        }) ||
        NEW_SPELL_START_RANK_WEIGHTS_BY_PROGRESS[
            NEW_SPELL_START_RANK_WEIGHTS_BY_PROGRESS.length - 1
        ];

    return progressStep.weights;
}

function rollNewSpellStartRank(fightIndex) {
    const weights =
        getNewSpellStartRankWeights(fightIndex);

    const entries =
        Object.keys(weights).map(rankKey => {
            return Number(rankKey);
        });

    return pickWeightedEntry(
        entries,
        rank => weights[rank] || 0
    ) || 1;
}

function getOwnedSchoolIds(ownedSpellIds) {
    const schools =
        new Set();

    ownedSpellIds.forEach(spellId => {
        const spell =
            getSpellById(spellId);

        if (spell?.school) {
            schools.add(spell.school);
        }
    });

    return schools;
}

function playerHasWoundEnabler(ownedSpellIds) {
    return ownedSpellIds.some(spellId => {
        const spell =
            getSpellById(spellId);

        if (!spell) {
            return false;
        }

        return (spell.effects || []).includes("apply_vulnerable");
    });
}

function spellRequiresWoundSetup(spell) {
    const values =
        getSpellBaseValues(spell);

    return Boolean(
        values.requiredStatusId === "wound" ||
        values.vulnerableBonusDamage ||
        values.applyVulnerableOnlyIfVulnerable
    );
}

function spellRequiresNegativeEffectSetup(spell) {
    const values =
        getSpellRankValues(spell, 1);

    return Boolean(
        values.perNegativeEffectDamageBonus ||
        (
            values.additionalNegativeEffectDamageBonus &&
            !values.statusId
        )
    );
}

function getNewSpellOfferWeight(spell, ownedSpellIds, fightIndex) {
    const rarityWeights =
        getRewardRarityWeights(fightIndex);

    let weight =
        rarityWeights[spell.rarity] || 0;

    if (weight <= 0) {
        return 0;
    }

    const ownedSchools =
        getOwnedSchoolIds(ownedSpellIds);

    if (ownedSchools.has(spell.school)) {
        weight *= SCHOOL_AFFINITY_MULTIPLIER;
    }

    const hasWoundEnabler =
        playerHasWoundEnabler(ownedSpellIds);

    if (
        spellRequiresWoundSetup(spell) &&
        !hasWoundEnabler
    ) {
        weight *= SHADOW_SETUP_DEPENDENCY_MULTIPLIER;
    } else if (
        spellRequiresNegativeEffectSetup(spell) &&
        !hasWoundEnabler
    ) {
        weight *= SHADOW_SETUP_DEPENDENCY_MULTIPLIER * 2;
    }

    return weight;
}

function getUpgradeOfferWeight(spell, ownedSpellIds) {
    let weight = 1;

    const ownedSchools =
        getOwnedSchoolIds(ownedSpellIds);

    if (ownedSchools.has(spell.school)) {
        weight *= SCHOOL_AFFINITY_MULTIPLIER;
    }

    return weight;
}

function pickWeightedEntry(entries, getWeight) {
    const weightedEntries =
        entries
            .map(entry => {
                return {
                    entry,
                    weight: Math.max(0, getWeight(entry))
                };
            })
            .filter(item => item.weight > 0);

    if (weightedEntries.length === 0) {
        if (entries.length === 0) {
            return null;
        }

        return entries[
            Math.floor(Math.random() * entries.length)
        ];
    }

    const totalWeight =
        weightedEntries.reduce((sum, item) => {
            return sum + item.weight;
        }, 0);

    let roll =
        Math.random() * totalWeight;

    for (const item of weightedEntries) {
        roll -= item.weight;

        if (roll <= 0) {
            return item.entry;
        }
    }

    return weightedEntries[weightedEntries.length - 1].entry;
}

function createUpgradeRewardOption(spell) {
    const nextKind =
        getNextUpgradeKind(spell);

    if (nextKind === "path_choice") {
        return {
            type: "path_choice",
            spell,
            pathChoices: getPathChoiceOptions(spell)
        };
    }

    return {
        type: "upgrade",
        spell
    };
}

function createNewRewardOption(spell, fightIndex) {
    return {
        type: "new",
        spell,
        startRank: rollNewSpellStartRank(fightIndex)
    };
}

function pickRandomUpgradeSpell(
    upgradeableSpells,
    excludedSpellIds,
    ownedSpellIds = []
) {
    const availableUpgrades =
        upgradeableSpells.filter(spell => {
            return !excludedSpellIds.includes(spell.id);
        });

    if (availableUpgrades.length === 0) {
        return null;
    }

    return pickWeightedEntry(
        availableUpgrades,
        spell => getUpgradeOfferWeight(spell, ownedSpellIds)
    );
}

function pickNewRewardSpell(
    ownedSpellIds,
    fightIndex,
    excludedSpellIds = []
) {
    const newSpellPool =
        spells.filter(spell => {
            return (
                !ownedSpellIds.includes(spell.id) &&
                !excludedSpellIds.includes(spell.id)
            );
        });

    if (newSpellPool.length === 0) {
        return null;
    }

    return pickWeightedEntry(
        newSpellPool,
        spell => getNewSpellOfferWeight(
            spell,
            ownedSpellIds,
            fightIndex
        )
    );
}

function hasAvailableUpgrades(upgradeableSpells, excludedSpellIds) {
    return upgradeableSpells.some(spell => {
        return !excludedSpellIds.includes(spell.id);
    });
}

function hasAvailableNewSpells(ownedSpellIds, excludedSpellIds) {
    return spells.some(spell => {
        return (
            !ownedSpellIds.includes(spell.id) &&
            !excludedSpellIds.includes(spell.id)
        );
    });
}

function rollRewardSlotType(
    canUpgrade,
    canNew
) {
    if (canUpgrade && canNew) {
        return Math.random() < REWARD_UPGRADE_TYPE_CHANCE
            ? "upgrade"
            : "new";
    }

    if (canUpgrade) {
        return "upgrade";
    }

    if (canNew) {
        return "new";
    }

    return null;
}

function tryCreateRewardOption(
    slotType,
    fightIndex,
    ownedSpellIds,
    upgradeableSpells,
    excludedSpellIds
) {
    if (slotType === "upgrade") {
        const spell =
            pickRandomUpgradeSpell(
                upgradeableSpells,
                excludedSpellIds,
                ownedSpellIds
            );

        if (!spell) {
            return null;
        }

        return createUpgradeRewardOption(spell);
    }

    if (slotType === "new") {
        const spell =
            pickNewRewardSpell(
                ownedSpellIds,
                fightIndex,
                excludedSpellIds
            );

        if (!spell) {
            return null;
        }

        return createNewRewardOption(spell, fightIndex);
    }

    return null;
}

function createRewardOptionForAvailableType(
    fightIndex,
    ownedSpellIds,
    upgradeableSpells,
    excludedSpellIds,
    preferredType = null
) {
    const canUpgrade =
        hasAvailableUpgrades(upgradeableSpells, excludedSpellIds);

    const canNew =
        hasAvailableNewSpells(ownedSpellIds, excludedSpellIds);

    const preferred =
        preferredType ||
        rollRewardSlotType(canUpgrade, canNew);

    if (!preferred) {
        return null;
    }

    let option =
        tryCreateRewardOption(
            preferred,
            fightIndex,
            ownedSpellIds,
            upgradeableSpells,
            excludedSpellIds
        );

    if (option) {
        return option;
    }

    const fallbackType =
        preferred === "upgrade" ? "new" : "upgrade";

    return tryCreateRewardOption(
        fallbackType,
        fightIndex,
        ownedSpellIds,
        upgradeableSpells,
        excludedSpellIds
    );
}

function isUpgradeRewardType(type) {
    return type === "upgrade" || type === "path_choice";
}

function applySoftTypeGuarantees(
    rewardOptions,
    fightIndex,
    ownedSpellIds,
    upgradeableSpells
) {
    if (rewardOptions.length < 2) {
        return rewardOptions;
    }

    const usedIds =
        rewardOptions.map(option => option.spell.id);

    const hasUpgrade =
        rewardOptions.some(option => {
            return isUpgradeRewardType(option.type);
        });

    const canUpgrade =
        hasAvailableUpgrades(upgradeableSpells, usedIds);

    if (!hasUpgrade && canUpgrade) {
        const replaceIndex =
            rewardOptions.findIndex(option => {
                return option.type === "new";
            });

        if (replaceIndex >= 0) {
            const excluded =
                usedIds.filter((_, index) => {
                    return index !== replaceIndex;
                });

            const replacement =
                tryCreateRewardOption(
                    "upgrade",
                    fightIndex,
                    ownedSpellIds,
                    upgradeableSpells,
                    excluded
                );

            if (replacement) {
                rewardOptions[replaceIndex] =
                    replacement;
            }
        }
    }

    const usedIdsAfterUpgrade =
        rewardOptions.map(option => option.spell.id);

    const hasNewAfter =
        rewardOptions.some(option => {
            return option.type === "new";
        });

    const canNewAfter =
        hasAvailableNewSpells(ownedSpellIds, usedIdsAfterUpgrade);

    if (!hasNewAfter && canNewAfter) {
        const replaceIndex =
            rewardOptions.findIndex(option => {
                return isUpgradeRewardType(option.type);
            });

        if (replaceIndex >= 0) {
            const excluded =
                usedIdsAfterUpgrade.filter((_, index) => {
                    return index !== replaceIndex;
                });

            const replacement =
                tryCreateRewardOption(
                    "new",
                    fightIndex,
                    ownedSpellIds,
                    upgradeableSpells,
                    excluded
                );

            if (replacement) {
                rewardOptions[replaceIndex] =
                    replacement;
            }
        }
    }

    return rewardOptions;
}

function generateRewardOptions(
    fightIndex,
    ownedSpellIds,
    upgradeableSpells
) {
    const rewardOptions = [];
    const usedRewards = [];

    for (let slot = 0; slot < REWARD_SLOT_COUNT; slot++) {
        const option =
            createRewardOptionForAvailableType(
                fightIndex,
                ownedSpellIds,
                upgradeableSpells,
                usedRewards
            );

        if (!option) {
            break;
        }

        rewardOptions.push(option);
        usedRewards.push(option.spell.id);
    }

    applySoftTypeGuarantees(
        rewardOptions,
        fightIndex,
        ownedSpellIds,
        upgradeableSpells
    );

    return shuffleRewardOptions(rewardOptions);
}

function shuffleRewardOptions(rewardOptions) {
    const shuffled =
        [...rewardOptions];

    for (
        let index = shuffled.length - 1;
        index > 0;
        index--
    ) {
        const swapIndex =
            Math.floor(Math.random() * (index + 1));

        const temporary =
            shuffled[index];

        shuffled[index] =
            shuffled[swapIndex];

        shuffled[swapIndex] =
            temporary;
    }

    return shuffled;
}

function rerollRewardOption(
    currentOption,
    fightIndex,
    ownedSpellIds,
    upgradeableSpells,
    otherDisplayedSpellIds
) {
    const excludedSpellIds = [
        ...otherDisplayedSpellIds,
        currentOption.spell.id
    ];

    const option =
        createRewardOptionForAvailableType(
            fightIndex,
            ownedSpellIds,
            upgradeableSpells,
            excludedSpellIds
        );

    return option || currentOption;
}
