const META_SAVE_KEY = "battlemages_meta_v1";

// Run-uebergreifende Fortschrittsdaten, bewusst getrennt vom Checkpoint-
// basierten Run-Save (persistence.js): dort wird ein einzelner laufender
// Run ueberschrieben, hier werden Werte ueber viele Runs hinweg kumuliert
// (siehe docs/design/BattleMages_Meta_Progression_Concept_v1.md).
function getDefaultMetaState() {
    return {
        version: 1,
        runsStarted: 0,
        runsCompleted: 0,
        wins: 0,
        losses: 0,
        bestFightReached: 0,
        seenSpellIds: [],
        seenEnemyIds: [],
        unlockedArchetypeIds: [],
        unlockedLegendarySchools: [],
        bestStats: {
            highestHit: 0,
            peakResistance: 0,
            longestRun: 0
        }
    };
}

function loadMetaState() {
    const defaults =
        getDefaultMetaState();

    if (!isLocalStorageAvailable()) {
        return defaults;
    }

    try {
        const raw =
            localStorage.getItem(META_SAVE_KEY);

        if (!raw) {
            return defaults;
        }

        const parsed =
            JSON.parse(raw);

        return {
            ...defaults,
            ...parsed,
            bestStats: {
                ...defaults.bestStats,
                ...(parsed.bestStats || {})
            }
        };
    } catch (error) {
        return defaults;
    }
}

function saveMetaState(metaState) {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.setItem(
            META_SAVE_KEY,
            JSON.stringify(metaState)
        );
    } catch (error) {
        console.warn(
            "[Meta-Progression] Fortschritt konnte nicht gespeichert werden:",
            error
        );
    }
}

function getMetaState() {
    return loadMetaState();
}

function addSeenId(idList, id) {
    return idList.includes(id)
        ? idList
        : [...idList, id];
}

const MIN_ARCHETYPE_BUILD_MATCHES = 2;

// Gibt die gemeinsame Schul-ID zurueck, wenn alle Rotations-Zauber aus
// derselben Schule stammen, sonst null. Basis sowohl fuer den
// "monoschule"-Archetyp (isMonoSchoolRotation) als auch fuer die
// Legendary-Freischaltung (recordRunEnd) -- dort zusaetzlich an einen
// Sieg gekoppelt.
function getMonoSchoolId(rotationSpells) {
    if (rotationSpells.length === 0) {
        return null;
    }

    const firstSchool =
        rotationSpells[0].school;

    return rotationSpells.every(spell => spell.school === firstSchool)
        ? firstSchool
        : null;
}

function isMonoSchoolRotation(rotationSpells) {
    return getMonoSchoolId(rotationSpells) !== null;
}

// Ordnet eine abgeschlossene Rotation den Build-Archetypen zu, fuer
// die sie qualifiziert -- rein anhand des von den Zauber-Designs
// bereits vergebenen spell.build-Felds (data/spellbookCore.js,
// spellbookPart2.js), keine neue Heuristik. Mehrheitsregel: der/die
// build-Werte mit den meisten Treffern unter den 5 Rotations-Zaubern
// gewinnen, mindestens 2 Treffer noetig; bei Gleichstand zaehlen alle
// fuehrenden Archetypen. "monoschule" ist strukturell geprueft (alle
// Zauber gleiche Schule), da nur ein einziger Zauber im Pool
// build:"monoschule" traegt und ueber die Mehrheitsregel sonst so gut
// wie nie erreichbar waere.
function classifyRotationArchetypes(rotationSpells) {
    const buildCounts = {};

    rotationSpells.forEach(spell => {
        if (!spell.build) {
            return;
        }

        buildCounts[spell.build] =
            (buildCounts[spell.build] || 0) + 1;
    });

    const maxCount =
        Math.max(0, ...Object.values(buildCounts));

    const matchedArchetypeIds =
        maxCount >= MIN_ARCHETYPE_BUILD_MATCHES
            ? Object.keys(buildCounts).filter(
                buildId => buildCounts[buildId] === maxCount
            )
            : [];

    if (isMonoSchoolRotation(rotationSpells)) {
        matchedArchetypeIds.push("monoschule");
    }

    return [...new Set(matchedArchetypeIds)];
}

function recordRunStart(startingSpellIds) {
    const metaState =
        loadMetaState();

    metaState.runsStarted += 1;

    (startingSpellIds || []).forEach(spellId => {
        metaState.seenSpellIds =
            addSeenId(metaState.seenSpellIds, spellId);
    });

    saveMetaState(metaState);
}

function recordSeenEnemy(enemyId) {
    if (!enemyId) {
        return;
    }

    const metaState =
        loadMetaState();

    metaState.seenEnemyIds =
        addSeenId(metaState.seenEnemyIds, enemyId);

    saveMetaState(metaState);
}

// runResult: { victory, fightsCompleted, runStats, finalSpellIds,
//              matchedArchetypeIds, monoSchoolId }
function recordRunEnd(runResult) {
    const metaState =
        loadMetaState();

    metaState.runsCompleted += 1;

    if (runResult.victory) {
        metaState.wins += 1;
    } else {
        metaState.losses += 1;
    }

    const fightsCompleted =
        runResult.fightsCompleted || 0;

    if (fightsCompleted > metaState.bestFightReached) {
        metaState.bestFightReached = fightsCompleted;
    }

    if (fightsCompleted > metaState.bestStats.longestRun) {
        metaState.bestStats.longestRun = fightsCompleted;
    }

    const highestHit =
        runResult.runStats?.highestHit || 0;

    if (highestHit > metaState.bestStats.highestHit) {
        metaState.bestStats.highestHit = highestHit;
    }

    const peakResistance =
        runResult.runStats?.peakResistance || 0;

    if (peakResistance > metaState.bestStats.peakResistance) {
        metaState.bestStats.peakResistance = peakResistance;
    }

    (runResult.finalSpellIds || []).forEach(spellId => {
        metaState.seenSpellIds =
            addSeenId(metaState.seenSpellIds, spellId);
    });

    (runResult.matchedArchetypeIds || []).forEach(archetypeId => {
        metaState.unlockedArchetypeIds =
            addSeenId(metaState.unlockedArchetypeIds, archetypeId);
    });

    // Legendary-Freischaltung (Baustein C): anders als der allgemeine
    // Archetyp-Tracker oben bewusst an einen Sieg gekoppelt (siehe
    // Rueckfrage-Antwort "Sieg erforderlich" in
    // BattleMages_Meta_Progression_Concept_v1.md).
    if (runResult.victory && runResult.monoSchoolId) {
        metaState.unlockedLegendarySchools =
            addSeenId(metaState.unlockedLegendarySchools, runResult.monoSchoolId);
    }

    saveMetaState(metaState);
}
