#!/usr/bin/env node
/*
 * Regressionstests fuer src/upgradeResolver.js (Rang-/Pfad-Wert-Merging,
 * Effekt-Merging, Upgrade-Art-Bestimmung). Teil der P3-Roadmap "Breitere
 * automatisierte Testabdeckung" aus dem Architecture & Design Audit.
 *
 * Gleicher Ansatz wie tools/test_combat_formula.js: laedt die echten Quelldateien
 * per vm in einen Sandbox-Kontext und ruft die Original-Funktionen direkt auf.
 * Nutzt "shadow_mantle" (Schattenmantel) als Referenzzauber, weil er einen
 * vollstaendigen Rang2/Pfad-a+b-Rang3/Rang4/Rang5-Verlauf in
 * data/spellUpgradeProfiles.js besitzt -- jeder erwartete Wert ist von Hand
 * gegen die echten Profildaten nachgerechnet.
 * Aufruf: node tools/test_upgrade_resolver.js
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
    "data/combatIdentity.js",
    "src/spellRegistry.js",
    "src/state.js",
    "src/upgradeResolver.js"
];

const sandbox = { Math, console };
vm.createContext(sandbox);

for (const relativePath of SOURCE_FILES) {
    const code = fs.readFileSync(path.join(ROOT, relativePath), "utf-8");
    vm.runInContext(code, sandbox, { filename: relativePath });
}

// spellRanks/spellPaths sind `let`-Deklarationen (state.js) -- wie bei jedem
// klassischen Script sind das Bindungen im lexikalischen Scope der Sandbox,
// NICHT Properties des globalen Objekts. Von aussen sind sie daher nicht
// direkt lesbar/schreibbar; kleine function-Deklarationen (die als Properties
// des globalen Objekts landen) dienen als Bruecke.
vm.runInContext(
    `
    function testSetSpellRank(id, rank) { spellRanks[id] = rank; }
    function testSetSpellPath(id, spellPath) { spellPaths[id] = spellPath; }
    function testClearSpellProgress(id) {
        delete spellRanks[id];
        delete spellPaths[id];
    }
    `,
    sandbox,
    { filename: "test-bridge.js" }
);

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

const shadowMantle =
    fns.getSpellById("shadow_mantle");

// --- resolveSpellUpgradeValues: vollstaendiger Rang-/Pfad-Verlauf ----------
// Referenzzauber Schattenmantel: Basis {damage:32, critShieldGain:20}
// (data/spellbookPart2.js), Profil in data/spellUpgradeProfiles.js.

check(
    "resolveSpellUpgradeValues: Rang 1 = unveraenderte Basiswerte",
    fns.resolveSpellUpgradeValues(shadowMantle, 1, null),
    { damage: 32, critShieldGain: 20 }
);

check(
    "resolveSpellUpgradeValues: Rang 2 ueberschreibt nur damage (schulweiter Patch)",
    fns.resolveSpellUpgradeValues(shadowMantle, 2, null),
    { damage: 40, critShieldGain: 20 }
);

check(
    "resolveSpellUpgradeValues: Rang 3 Pfad A ueberschreibt critShieldGain",
    fns.resolveSpellUpgradeValues(shadowMantle, 3, "a"),
    { damage: 40, critShieldGain: 35 }
);

check(
    "resolveSpellUpgradeValues: Rang 3 Pfad B setzt critAppliesVulnerable statt critShieldGain-Aenderung",
    fns.resolveSpellUpgradeValues(shadowMantle, 3, "b"),
    { damage: 40, critShieldGain: 20, critAppliesVulnerable: true }
);

check(
    "resolveSpellUpgradeValues: Rang 4 Pfad A (globaler Rang4-Patch, kein pfadspezifischer Rang4)",
    fns.resolveSpellUpgradeValues(shadowMantle, 4, "a"),
    { damage: 50, critShieldGain: 35 }
);

check(
    "resolveSpellUpgradeValues: Rang 5 Pfad A addiert critShieldMultiplier",
    fns.resolveSpellUpgradeValues(shadowMantle, 5, "a"),
    { damage: 50, critShieldGain: 35, critShieldMultiplier: 2 }
);

check(
    "resolveSpellUpgradeValues: Rang 5 Pfad B addiert vulnerableGuaranteedCrit statt critShieldMultiplier",
    fns.resolveSpellUpgradeValues(shadowMantle, 5, "b"),
    {
        damage: 50,
        critShieldGain: 20,
        critAppliesVulnerable: true,
        vulnerableGuaranteedCrit: true
    }
);

check(
    "resolveSpellUpgradeValues: Rang 3 ohne Pfadwahl liefert nur den Rang2-Stand (kein Pfad-Patch anwendbar)",
    fns.resolveSpellUpgradeValues(shadowMantle, 3, null),
    { damage: 40, critShieldGain: 20 }
);

// --- mergeUpgradeValues / mergeUpgradeEffects: isolierte Merge-Logik ------

check(
    "mergeUpgradeValues: Patch ueberschreibt nur die eigenen Keys, Rest bleibt",
    fns.mergeUpgradeValues({ a: 1, b: 2 }, { b: 99 }),
    { a: 1, b: 99 }
);

check(
    "mergeUpgradeValues: ohne Patch unveraenderte Kopie",
    fns.mergeUpgradeValues({ a: 1 }, null),
    { a: 1 }
);

check(
    "mergeUpgradeEffects: fuegt neue Effekt-IDs an, ohne Duplikate",
    fns.mergeUpgradeEffects(["deal_damage"], ["deal_damage", "apply_vulnerable"]),
    ["deal_damage", "apply_vulnerable"]
);

check(
    "mergeUpgradeEffects: ohne Patch unveraenderte Kopie",
    fns.mergeUpgradeEffects(["deal_damage"], []),
    ["deal_damage"]
);

// --- getSpellProgress / getSpellRank / getSpellPath (echter globaler State) -

fns.testSetSpellRank(shadowMantle.id, 4);
fns.testSetSpellPath(shadowMantle.id, "b");

check(
    "getSpellProgress: liest Rang/Pfad aus dem globalen State",
    fns.getSpellProgress(shadowMantle.id),
    { rank: 4, path: "b" }
);

check(
    "getSpellRank: liefert nur den Rang",
    fns.getSpellRank(shadowMantle.id),
    4
);

check(
    "getSpellPath: liefert nur den Pfad",
    fns.getSpellPath(shadowMantle.id),
    "b"
);

fns.testClearSpellProgress(shadowMantle.id);

check(
    "getSpellProgress: Default Rang 1, kein Pfad, wenn kein State vorhanden",
    fns.getSpellProgress(shadowMantle.id),
    { rank: 1, path: null }
);

// --- getNextUpgradeKind ------------------------------------------------------

fns.testSetSpellRank(shadowMantle.id, 2);

check(
    "getNextUpgradeKind: Rang 2 -> naechster Schritt ist Pfadwahl (Rang 3)",
    fns.getNextUpgradeKind(shadowMantle),
    "path_choice"
);

fns.testSetSpellRank(shadowMantle.id, 3);

check(
    "getNextUpgradeKind: Rang 3 -> normales Upgrade",
    fns.getNextUpgradeKind(shadowMantle),
    "upgrade"
);

fns.testSetSpellRank(shadowMantle.id, 5);

check(
    "getNextUpgradeKind: Maximalrang erreicht -> kein weiteres Upgrade",
    fns.getNextUpgradeKind(shadowMantle),
    null
);

fns.testClearSpellProgress(shadowMantle.id);

// --- Summary --------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
    process.exit(1);
}
