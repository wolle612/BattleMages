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

function pickRandomUpgradeSpell(upgradeableSpells, excludedSpellIds) {
    const availableUpgrades =
        upgradeableSpells.filter(spell => {
            return !excludedSpellIds.includes(spell.id);
        });

    if (availableUpgrades.length === 0) {
        return null;
    }

    return availableUpgrades[
        Math.floor(
            Math.random() * availableUpgrades.length
        )
    ];
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

function generateRewardOptions(
    fightIndex,
    ownedSpellIds,
    upgradeableSpells
) {
    const rewardOptions = [];
    const usedRewards = [];

    const firstUpgrade =
        pickRandomUpgradeSpell(
            upgradeableSpells,
            usedRewards
        );

    if (firstUpgrade) {
        rewardOptions.push(
            createUpgradeRewardOption(firstUpgrade)
        );

        usedRewards.push(firstUpgrade.id);
    }

    const newSpell =
        pickNewRewardSpell(
            ownedSpellIds,
            fightIndex
        );

    if (newSpell) {
        rewardOptions.push({
            type: "new",
            spell: newSpell
        });

        usedRewards.push(newSpell.id);
    }

    const secondUpgrade =
        pickRandomUpgradeSpell(
            upgradeableSpells,
            usedRewards
        );

    if (secondUpgrade) {
        rewardOptions.push(
            createUpgradeRewardOption(secondUpgrade)
        );
    }

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

    if (currentOption.type === "upgrade" ||
        currentOption.type === "path_choice") {
        const spell =
            pickRandomUpgradeSpell(
                upgradeableSpells,
                excludedSpellIds
            );

        if (!spell) {
            return currentOption;
        }

        return createUpgradeRewardOption(spell);
    }

    const spell =
        pickNewRewardSpell(
            ownedSpellIds,
            fightIndex,
            excludedSpellIds
        );

    if (!spell) {
        return currentOption;
    }

    return {
        type: "new",
        spell
    };
}
