#!/usr/bin/env node
/*
 * Regressionstests fuer src/rewardSystem.js (Raritaets-/Rang-Gewichtstabellen,
 * Schul-Affinitaet, Wound-Setup-Abhaengigkeits-Heuristik, gewichtete Zufallsauswahl).
 * Teil der P3-Roadmap "Breitere automatisierte Testabdeckung" aus dem
 * Architecture & Design Audit.
 *
 * Gleicher Ansatz wie tools/test_combat_formula.js: laedt die echten Quelldateien
 * per vm in einen Sandbox-Kontext und ruft die Original-Funktionen direkt auf.
 * Fuer die zufallsbasierten Funktionen (pickWeightedEntry, rollRewardSlotType)
 * wird Math.random() temporaer deterministisch gemockt -- sicher, weil die
 * Sandbox dasselbe Math-Objekt referenziert wie dieses Skript.
 * Aufruf: node tools/test_reward_system.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const SOURCE_FILES = [
    "data/spellbookCore.js",
    "data/spellbookPart2.js",
    "data/spellUpgradeProfiles.js",
    "data/spells.js",
    "data/enemies.js",
    "data/combatIdentity.js",
    "src/spellRegistry.js",
    "src/state.js",
    "src/upgradeResolver.js",
    "src/rewardSystem.js"
];

const sandbox = { Math, console };
vm.createContext(sandbox);

for (const relativePath of SOURCE_FILES) {
    const code = fs.readFileSync(path.join(ROOT, relativePath), "utf-8");
    vm.runInContext(code, sandbox, { filename: relativePath });
}

const fns = sandbox;

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
    const ok =
        JSON.stringify(actual) === JSON.stringify(expected);

    if (ok) {
        passed++;
        console.log(`PASS  ${name}`);
    } else {
        failed++;
        console.log(`FAIL  ${name}`);
        console.log(`      expected: ${JSON.stringify(expected)}`);
        console.log(`      actual:   ${JSON.stringify(actual)}`);
    }
}

function checkClose(name, actual, expected, tolerance = 0.001) {
    const ok =
        typeof actual === "number" &&
        Math.abs(actual - expected) < tolerance;

    if (ok) {
        passed++;
        console.log(`PASS  ${name}`);
    } else {
        failed++;
        console.log(`FAIL  ${name}`);
        console.log(`      expected ~${expected}, actual ${actual}`);
    }
}

function withMockedRandom(value, fn) {
    const originalRandom = Math.random;
    Math.random = () => value;

    try {
        return fn();
    } finally {
        Math.random = originalRandom;
    }
}

// --- getRewardRarityWeights: Bucket-Grenzen ---------------------------------

check(
    "getRewardRarityWeights: fightIndex 0 -> erstes Bucket",
    fns.getRewardRarityWeights(0),
    { Common: 68, Rare: 32, Epic: 0, Legendary: 0 }
);

check(
    "getRewardRarityWeights: fightIndex 3 -> zweites Bucket (Grenze maxFightIndex 4)",
    fns.getRewardRarityWeights(3),
    { Common: 48, Rare: 42, Epic: 10, Legendary: 0 }
);

check(
    "getRewardRarityWeights: fightIndex jenseits aller Buckets -> letztes Bucket als Fallback",
    fns.getRewardRarityWeights(999),
    { Common: 14, Rare: 34, Epic: 34, Legendary: 18 }
);

// --- getNewSpellStartRankWeights: Bucket-Grenzen ----------------------------

check(
    "getNewSpellStartRankWeights: fightIndex 0 -> erstes Bucket",
    fns.getNewSpellStartRankWeights(0),
    { 1: 95, 2: 5 }
);

check(
    "getNewSpellStartRankWeights: fightIndex 4 -> zweites Bucket (Grenze maxFightIndex 6)",
    fns.getNewSpellStartRankWeights(4),
    { 1: 80, 2: 20 }
);

check(
    "getNewSpellStartRankWeights: fightIndex jenseits aller Buckets -> letztes Bucket",
    fns.getNewSpellStartRankWeights(999),
    { 1: 60, 2: 40 }
);

// --- rollNewSpellStartRank: deterministisch ueber gemocktes Math.random ----

check(
    "rollNewSpellStartRank: Math.random=0 waehlt den ersten (gewichtsstaerkeren) Rang",
    withMockedRandom(0, () => fns.rollNewSpellStartRank(0)),
    1
);

check(
    "rollNewSpellStartRank: Math.random nahe 1 waehlt den zweiten Rang",
    withMockedRandom(0.999, () => fns.rollNewSpellStartRank(0)),
    2
);

// --- getOwnedSchoolIds / playerHasWoundEnabler (echte Zauberdaten) ---------

{
    const owned =
        fns.getOwnedSchoolIds(["bone_fracture", "shield_wall"]);

    check(
        "getOwnedSchoolIds: leitet Schulen aus Zauber-IDs ab",
        Array.from(owned).sort(),
        ["blood", "rune"]
    );
}

check(
    "playerHasWoundEnabler: true wenn ein Zauber apply_vulnerable besitzt (bone_fracture)",
    fns.playerHasWoundEnabler(["bone_fracture"]),
    true
);

check(
    "playerHasWoundEnabler: false ohne Vulnerable-Enabler im Besitz (shield_wall)",
    fns.playerHasWoundEnabler(["shield_wall"]),
    false
);

// --- spellRequiresWoundSetup -------------------------------------------------

check(
    "spellRequiresWoundSetup: blood_clot braucht Verwundbar (vulnerableBonusDamage)",
    fns.spellRequiresWoundSetup(fns.getSpellById("blood_clot")),
    true
);

check(
    "spellRequiresWoundSetup: shield_wall braucht kein Verwundbar-Setup",
    fns.spellRequiresWoundSetup(fns.getSpellById("shield_wall")),
    false
);

// --- getNewSpellOfferWeight: Raritaet, Schul-Affinitaet, Wound-Penalty -----

checkClose(
    "getNewSpellOfferWeight: blood_clot ohne Wound-Enabler wird auf 20% abgewertet",
    fns.getNewSpellOfferWeight(fns.getSpellById("blood_clot"), [], 0),
    68 * 0.2
);

checkClose(
    "getNewSpellOfferWeight: blood_clot MIT Wound-Enabler einer ANDEREN Schule " +
    "(mind_trap/dream) keine Abwertung, keine Schul-Affinitaet",
    fns.getNewSpellOfferWeight(
        fns.getSpellById("blood_clot"),
        ["mind_trap"],
        0
    ),
    68
);

check(
    "getNewSpellOfferWeight: Schul-Affinitaet (1.5x) fuer bereits besessene Schule " +
    "(shield_breaker ist Rare -> Basisgewicht 32 bei fightIndex 0, x1.5 durch rune-Affinitaet via shield_wall)",
    fns.getNewSpellOfferWeight(
        fns.getSpellById("shield_breaker"),
        ["shield_wall"],
        0
    ),
    32 * 1.5
);

// --- getUpgradeOfferWeight ---------------------------------------------------

check(
    "getUpgradeOfferWeight: Basis-Gewicht 1 ohne Schul-Affinitaet",
    fns.getUpgradeOfferWeight(fns.getSpellById("shield_wall"), []),
    1
);

check(
    "getUpgradeOfferWeight: 1.5x Schul-Affinitaet",
    fns.getUpgradeOfferWeight(fns.getSpellById("shield_wall"), ["shield_wall"]),
    1.5
);

// --- rollRewardSlotType: 55/45-Split deterministisch ------------------------

check(
    "rollRewardSlotType: Math.random unter der Upgrade-Schwelle (0.55) -> upgrade",
    withMockedRandom(0.1, () => fns.rollRewardSlotType(true, true)),
    "upgrade"
);

check(
    "rollRewardSlotType: Math.random ueber der Upgrade-Schwelle -> new",
    withMockedRandom(0.9, () => fns.rollRewardSlotType(true, true)),
    "new"
);

check(
    "rollRewardSlotType: kein Upgrade-Pool verfuegbar -> immer new",
    withMockedRandom(0.01, () => fns.rollRewardSlotType(false, true)),
    "new"
);

check(
    "rollRewardSlotType: kein Neu-Pool verfuegbar -> immer upgrade",
    withMockedRandom(0.99, () => fns.rollRewardSlotType(true, false)),
    "upgrade"
);

check(
    "rollRewardSlotType: kein Pool verfuegbar -> null",
    fns.rollRewardSlotType(false, false),
    null
);

// --- Summary --------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
    process.exit(1);
}
