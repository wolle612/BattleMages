const SPELL_MAX_RANK = 5;
const PATH_CHOICE_RANK = 3;

function createDefaultSpellProgress() {
    return {
        rank: 1,
        path: null
    };
}

function getSpellProgress(spellId) {
    const rank =
        spellRanks[spellId] || 1;

    const path =
        spellPaths[spellId] || null;

    return {
        rank,
        path
    };
}

function getSpellRank(spellId) {
    return getSpellProgress(spellId).rank;
}

function getSpellPath(spellId) {
    return getSpellProgress(spellId).path;
}

function getSpellUpgradeProfile(spell) {
    return spellUpgradeProfiles[spell.id] || null;
}

function getSpellBaseValues(spell) {
    if (spell.values) {
        return { ...spell.values };
    }

    const rankOneUpgrade =
        (spell.upgrades || []).find(step => step.rank === 1);

    return rankOneUpgrade
        ? { ...rankOneUpgrade.values }
        : {};
}

function mergeUpgradeValues(baseValues, patchValues) {
    if (!patchValues) {
        return { ...baseValues };
    }

    return {
        ...baseValues,
        ...patchValues
    };
}

function mergeUpgradeEffects(baseEffects, patchEffects) {
    if (!patchEffects?.length) {
        return [...baseEffects];
    }

    const mergedEffects =
        [...baseEffects];

    patchEffects.forEach(effect => {
        if (!mergedEffects.includes(effect)) {
            mergedEffects.push(effect);
        }
    });

    return mergedEffects;
}

function resolveSpellUpgradeValues(spell, rank, path) {
    const profile =
        getSpellUpgradeProfile(spell);

    let values =
        getSpellBaseValues(spell);

    if (!profile) {
        return values;
    }

    if (rank >= 2 && profile.rank2?.values) {
        values =
            mergeUpgradeValues(
                values,
                profile.rank2.values
            );
    }

    if (rank >= 3 && path && profile.paths?.[path]?.rank3?.values) {
        values =
            mergeUpgradeValues(
                values,
                profile.paths[path].rank3.values
            );
    }

    if (rank >= 4) {
        if (profile.rank4?.values) {
            values =
                mergeUpgradeValues(
                    values,
                    profile.rank4.values
                );
        }

        if (path && profile.paths?.[path]?.rank4?.values) {
            values =
                mergeUpgradeValues(
                    values,
                    profile.paths[path].rank4.values
                );
        }
    }

    if (
        rank >= 5 &&
        path &&
        profile.paths?.[path]?.rank5?.values
    ) {
        values =
            mergeUpgradeValues(
                values,
                profile.paths[path].rank5.values
            );
    }

    return values;
}

function resolveSpellEffects(spell, rank, path) {
    const profile =
        getSpellUpgradeProfile(spell);

    let effects =
        [...(spell.effects || [])];

    if (!profile || rank < 3 || !path) {
        return effects;
    }

    const pathProfile =
        profile.paths[path];

    if (rank >= 3) {
        effects =
            mergeUpgradeEffects(
                effects,
                pathProfile?.rank3?.effects
            );
    }

    if (rank >= 4) {
        effects =
            mergeUpgradeEffects(
                effects,
                pathProfile?.rank4?.effects
            );
    }

    if (rank >= 5) {
        effects =
            mergeUpgradeEffects(
                effects,
                pathProfile?.rank5?.effects
            );
    }

    if (rank >= 4) {
        effects =
            mergeUpgradeEffects(
                effects,
                profile.rank4?.effects
            );
    }

    if (rank >= 2) {
        effects =
            mergeUpgradeEffects(
                effects,
                profile.rank2?.effects
            );
    }

    return effects;
}

function getResolvedSpellState(spell) {
    const progress =
        getSpellProgress(spell.id);

    return {
        rank: progress.rank,
        path: progress.path,
        values: resolveSpellUpgradeValues(
            spell,
            progress.rank,
            progress.path
        ),
        effects: resolveSpellEffects(
            spell,
            progress.rank,
            progress.path
        )
    };
}

function getSpellRankValues(spell, rank, path) {
    const resolvedPath =
        path !== undefined
            ? path
            : (
                rank >= PATH_CHOICE_RANK
                    ? getSpellPath(spell.id)
                    : null
            );

    return resolveSpellUpgradeValues(
        spell,
        rank,
        resolvedPath
    );
}

function getNextUpgradeKind(spell) {
    const progress =
        getSpellProgress(spell.id);

    if (progress.rank >= SPELL_MAX_RANK) {
        return null;
    }

    if (
        progress.rank === PATH_CHOICE_RANK - 1 &&
        getSpellUpgradeProfile(spell)?.paths
    ) {
        return "path_choice";
    }

    return "upgrade";
}

function isSpellUpgradeable(spell) {
    return Boolean(getNextUpgradeKind(spell));
}

function getPathChoiceOptions(spell) {
    const profile =
        getSpellUpgradeProfile(spell);

    if (!profile?.paths) {
        return [];
    }

    return ["a", "b"]
        .filter(pathId => profile.paths[pathId])
        .map(pathId => {
            const pathProfile =
                profile.paths[pathId];

            return {
                path: pathId,
                label: pathProfile.label,
                tooltip: pathProfile.rank3?.tooltip || [],
                values: pathProfile.rank3?.values || {}
            };
        });
}

function getSpellTooltipLines(spell, rank, path) {
    const profile =
        getSpellUpgradeProfile(spell);

    if (rank === 1) {
        return spell.tooltip || [];
    }

    if (rank === 2 && profile?.rank2?.tooltip?.length) {
        return profile.rank2.tooltip;
    }

    if (rank >= PATH_CHOICE_RANK && path && profile?.paths?.[path]) {
        const pathProfile =
            profile.paths[path];

        if (rank === 5 && pathProfile.rank5?.tooltip?.length) {
            return pathProfile.rank5.tooltip;
        }

        if (rank === 4) {
            if (pathProfile.rank4?.tooltip?.length) {
                return pathProfile.rank4.tooltip;
            }

            if (profile.rank4?.tooltip?.length) {
                return profile.rank4.tooltip;
            }
        }

        if (rank === PATH_CHOICE_RANK && pathProfile.rank3?.tooltip?.length) {
            return pathProfile.rank3.tooltip;
        }
    }

    return spell.tooltip || [];
}

function getSpellPathLabel(spell, path) {
    if (!path) {
        return null;
    }

    return getSpellUpgradeProfile(spell)
        ?.paths?.[path]
        ?.label || null;
}

function getSpellRewardPreviewLines(spell, currentRank, pathChoice) {
    if (pathChoice) {
        return pathChoice.tooltip || [];
    }

    const targetRank =
        currentRank + 1;

    const profile =
        getSpellUpgradeProfile(spell);

    if (targetRank === 2 && profile?.rank2?.tooltip?.length) {
        return profile.rank2.tooltip;
    }

    const resolvedPath =
        getSpellPath(spell.id);

    if (
        targetRank >= PATH_CHOICE_RANK &&
        resolvedPath &&
        profile?.paths?.[resolvedPath]
    ) {
        const pathProfile =
            profile.paths[resolvedPath];

        if (targetRank === 5 && pathProfile.rank5?.tooltip?.length) {
            return pathProfile.rank5.tooltip;
        }

        if (targetRank === 4) {
            if (pathProfile.rank4?.tooltip?.length) {
                return pathProfile.rank4.tooltip;
            }

            if (profile.rank4?.tooltip?.length) {
                return profile.rank4.tooltip;
            }
        }
    }

    return getSpellTooltipLines(
        spell,
        targetRank,
        resolvedPath
    );
}

function applySpellUpgradeChoice(spell, chosenPath) {
    const progress =
        getSpellProgress(spell.id);

    if (getNextUpgradeKind(spell) === "path_choice") {
        spellPaths[spell.id] = chosenPath;
        spellRanks[spell.id] = PATH_CHOICE_RANK;
        return;
    }

    spellRanks[spell.id] = progress.rank + 1;
}

function initializeSpellProgress(spellId) {
    spellRanks[spellId] = 1;
    delete spellPaths[spellId];
}

function removeSpellProgress(spellId) {
    delete spellRanks[spellId];
    delete spellPaths[spellId];
}

function scaleUpgradeValuesByFactor(values, factor, keys) {
    const scaledValues =
        { ...values };

    keys.forEach(key => {
        if (typeof scaledValues[key] === "number") {
            scaledValues[key] =
                Math.round(scaledValues[key] * factor);
        }
    });

    return scaledValues;
}
