#!/usr/bin/env node
/*
 * Vollrotations-Balance-Simulator -- nutzt die ECHTE Spiel-Engine (spellEngine.js,
 * enemyEngine.js, battleManager.js, ...) statt einer Python-Zweitimplementierung.
 * Ersetzt/ergaenzt die 3-Zauber-Starter-Simulation in tools/balance_sim.py um
 * echte 5-Zauber-Rotationen inkl. Raengen/Pfaden -- Phase 0 der Content-Phase
 * aus dem Architecture & Design Audit (docs/specs/architecture_design_audit_2026-07-21.md).
 *
 * Laedt dieselben Quelldateien wie index.html (ohne Renderer/VFX/Dev-Layer) per
 * Node-vm in einen Sandbox-Kontext und ruft die echten Funktionen direkt auf --
 * keine Neuimplementierung von Kampflogik, keine Drift-Gefahr gegenueber dem
 * echten Spiel.
 *
 * Aufruf: node tools/simulate_full_builds.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

// Entspricht der Ladereihenfolge in index.html, ohne renderer.js/vendor/vfx/dev
// (reine Headless-Simulation braucht kein DOM/PixiJS).
const SOURCE_FILES = [
    "data/spellbookCore.js",
    "data/spellbookPart2.js",
    "data/spellUpgradeProfiles.js",
    "data/spells.js",
    "data/enemies.js",
    "data/combatIdentity.js",
    "src/spellRegistry.js",
    "src/enemyRegistry.js",
    "src/constants.js",
    "src/state.js",
    "src/rotationManager.js",
    "src/combatStatus.js",
    "src/combatSequence.js",
    "src/combatPrep.js",
    "src/combatFormula.js",
    "src/combatContext.js",
    "src/enemyEngine.js",
    "src/upgradeResolver.js",
    "src/effectEngine.js",
    "src/spellEngine.js",
    "src/battleManager.js"
];

const sandbox = { Math, console };
vm.createContext(sandbox);

for (const relativePath of SOURCE_FILES) {
    const code = fs.readFileSync(path.join(ROOT, relativePath), "utf-8");
    vm.runInContext(code, sandbox, { filename: relativePath });
}

// Bridge fuer `let`-States (state.js), die als Sandbox-Properties nicht direkt
// erreichbar sind -- siehe dieselbe Erkenntnis in test_upgrade_resolver.js.
vm.runInContext(
    `
    function testSetSelectedSpells(spellIds) {
        selectedSpells = spellIds.map(id => getSpellById(id));
    }
    function testSetRank(id, rank) { spellRanks[id] = rank; }
    function testSetPath(id, spellPath) { spellPaths[id] = spellPath; }
    function testResetProgress() {
        spellRanks = {};
        spellPaths = {};
    }
    function testSetCurrentFight(index) { currentFight = index; }
    function testRunFight() { return simulateFight(); }
    function testEnemyCount() { return enemies.length; }
    function testEnemyLabel(index) { return enemies[index].name; }
    `,
    sandbox,
    { filename: "test-bridge.js" }
);

const fns = sandbox;

// --- RV-Extraktion aus der echten actionQueue -------------------------------

function extractRotationDamages(result) {
    const rotations = [];
    let currentDamage = 0;
    let hasOpenRound = false;

    result.actionQueue.forEach(action => {
        if (action.type === "round") {
            if (hasOpenRound) {
                rotations.push(currentDamage);
            }
            currentDamage = 0;
            hasOpenRound = true;
            return;
        }

        if (action.type === "spellDamage") {
            const impact =
                parseInt(action.impact, 10);

            if (!Number.isNaN(impact)) {
                currentDamage += Math.abs(impact);
            }
        }
    });

    if (hasOpenRound) {
        rotations.push(currentDamage);
    }

    // Die letzte geloggte Runde ist nur dann vollstaendig, wenn der Kampf durch
    // Rundenlimit endete (keine Seite starb). Bei Sieg/Niederlage kann die
    // letzte Runde mittendrin abgebrochen sein -- ausschliessen, um den
    // RV-Schnitt nicht zu verzerren.
    const endedByDeath =
        result.victory || result.playerHp <= 0;

    return endedByDeath ? rotations.slice(0, -1) : rotations;
}

// --- Zielbaender aus docs/design/BattleMages_Combat_Formula_v2.md ----------

const RV_TARGET_BANDS = [
    ["Durchschnittlicher Build", 160, 190],
    ["Synergischer Build", 220, 260],
    ["Perfekt optimierter Build", 300, 360]
];

function classifyRv(value) {
    if (value == null) {
        return "keine Messpunkte";
    }

    for (const [label, low, high] of RV_TARGET_BANDS) {
        if (value >= low && value <= high) {
            return `im Band "${label}" (${low}-${high})`;
        }
    }

    if (value < RV_TARGET_BANDS[0][1]) {
        return `unter "${RV_TARGET_BANDS[0][0]}" (${RV_TARGET_BANDS[0][1]}-${RV_TARGET_BANDS[0][2]})`;
    }

    if (value > RV_TARGET_BANDS[RV_TARGET_BANDS.length - 1][2]) {
        const last = RV_TARGET_BANDS[RV_TARGET_BANDS.length - 1];
        return `ueber "${last[0]}" (${last[1]}-${last[2]})`;
    }

    return "zwischen zwei Zielbaendern (trifft keins genau)";
}

// --- Monoschule-Demo-Builds (alle Zauber je Schule, gedeckelt auf 5 Slots) --

const BUILDS = {
    "Biomantie (5/5 Zauber)": [
        "bone_fracture", "organ_failure", "blood_clot", "anatomy", "bone_armor"
    ],
    "Schatten (5 von 7 Zaubern)": [
        "dark_blade", "shadow_grasp", "death_stroke", "shadow_dance", "shadow_mantle"
    ],
    "Psionik (5 von 7 Zaubern)": [
        "mind_strike", "mind_barrier", "mind_stream", "arcane_chain", "will_break"
    ],
    "Verbotene Runenkunst (5 von 9 Zaubern)": [
        "shield_wall", "shield_breaker", "rune_harmony", "forbidden_seal", "fracture_rune"
    ],
    "Chaosmagie (5/5 Zauber)": [
        "entropy", "chaos_eruption", "chaos_blade", "chaos_catalyst", "overload"
    ],
    "Seelenmagie (5/5, monoschule -- Verwundbar wird nie angewendet)": [
        "soul_bind", "soul_cut", "soul_pulse", "soul_spark", "soul_ward"
    ],
    "Seelenmagie + Biomantie-Generator (Multischule, wie eigentlich gedacht)": [
        "bone_fracture", "soul_pulse", "soul_spark", "soul_bind", "soul_ward"
    ]
};

const RANK_STAGES = [
    { label: "Rang 1 (Basis)", rank: 1, path: null },
    { label: "Rang 3, Pfad A", rank: 3, path: "a" },
    { label: "Rang 5, Pfad A", rank: 5, path: "a" }
];

const TRIALS_PER_ENEMY = 50;

function setupBuild(spellIds, rank, spellPath) {
    fns.testResetProgress();
    fns.testSetSelectedSpells(spellIds);

    spellIds.forEach(id => {
        fns.testSetRank(id, rank);

        if (rank >= 3 && spellPath) {
            fns.testSetPath(id, spellPath);
        }
    });
}

function runStage(spellIds, rank, spellPath) {
    setupBuild(spellIds, rank, spellPath);

    const enemyCount =
        fns.testEnemyCount();

    let wins = 0;
    let fights = 0;
    const rvSamples = [];

    for (let enemyIndex = 0; enemyIndex < enemyCount; enemyIndex++) {
        fns.testSetCurrentFight(enemyIndex);

        for (let trial = 0; trial < TRIALS_PER_ENEMY; trial++) {
            const result =
                fns.testRunFight();

            fights++;

            if (result.victory) {
                wins++;
            }

            rvSamples.push(...extractRotationDamages(result));
        }
    }

    const avgRv =
        rvSamples.length > 0
            ? rvSamples.reduce((sum, value) => sum + value, 0) / rvSamples.length
            : null;

    return {
        winRate: wins / fights,
        avgRv,
        rotationsMeasured: rvSamples.length
    };
}

function main() {
    console.log("=== Vollrotations-Simulation (echte Engine, keine Reimplementierung) ===");
    console.log(`${TRIALS_PER_ENEMY} Versuche je Gegner, ${fns.testEnemyCount()} Gegner insgesamt.\n`);

    Object.entries(BUILDS).forEach(([buildName, spellIds]) => {
        console.log(`--- ${buildName} ---`);

        RANK_STAGES.forEach(stage => {
            const { winRate, avgRv, rotationsMeasured } =
                runStage(spellIds, stage.rank, stage.path);

            const rvDisplay =
                avgRv != null ? avgRv.toFixed(1) : "n/a";

            console.log(
                `  ${stage.label.padEnd(16)} ` +
                `win=${(winRate * 100).toFixed(0).padStart(3)}%  ` +
                `avg_rv=${rvDisplay.padStart(6)} (n=${rotationsMeasured})  ` +
                classifyRv(avgRv)
            );
        });

        console.log("");
    });
}

main();
