#!/usr/bin/env node
/*
 * Regressionstests fuer src/enemyEngine.js (Gegner-Passive, Schadensmodifikation,
 * Effekt-Ausfuehrung). Teil der P3-Roadmap "Breitere automatisierte Testabdeckung"
 * aus dem Architecture & Design Audit.
 *
 * Gleicher Ansatz wie tools/test_combat_formula.js: laedt die echten Quelldateien
 * per vm in einen Sandbox-Kontext (gleiche globale-Scope-Semantik wie index.html)
 * und ruft die Original-Funktionen direkt auf. Fixtures sind bewusst synthetisch
 * (nicht aus data/enemies.js abgeleitet), damit die Tests unabhaengig von
 * zukuenftigen Balance-Aenderungen an den echten Gegnerdaten bleiben.
 * Aufruf: node tools/test_enemy_engine.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

// Reihenfolge orientiert sich an index.html, reduziert auf das, was
// enemyEngine.js tatsaechlich transitiv braucht.
const SOURCE_FILES = [
    "data/combatIdentity.js",
    "data/enemies.js",
    "src/combatStatus.js",
    "src/combatPrep.js",
    "src/effectEngine.js",
    "src/enemyRegistry.js",
    "src/combatContext.js",
    "src/battleManager.js",
    "src/enemyEngine.js"
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

function makeEnemy(overrides = {}) {
    return Object.assign(
        {
            id: "test_enemy",
            name: "Test-Gegner",
            hp: 100,
            passive: { rules: [] },
            actionBar: [{ id: "test_action", name: "Testaktion", effects: [] }]
        },
        overrides
    );
}

function makeContext(enemy, overrides = {}) {
    return Object.assign(
        {
            playerHp: 120,
            playerMaxHp: 120,
            playerShield: 0,
            enemy,
            enemyHp: enemy.hp,
            enemyShield: 0,
            enemyRuntime: fns.initializeEnemyRuntime(enemy),
            log: [],
            actionQueue: [],
            effects: {
                playerStatuses: {},
                enemyStatuses: {},
                nextSpellPreps: []
            }
        },
        overrides
    );
}

// --- matchesPassiveRule --------------------------------------------------

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.actionCount = 1;

    check(
        "matchesPassiveRule: everyNthAction trifft (actionCount+1 teilbar)",
        fns.matchesPassiveRule(context, { everyNthAction: 2 }),
        true
    );

    context.enemyRuntime.actionCount = 0;

    check(
        "matchesPassiveRule: everyNthAction trifft nicht",
        fns.matchesPassiveRule(context, { everyNthAction: 2 }),
        false
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.impulseCount = 4;

    check(
        "matchesPassiveRule: everyNthImpulse trifft",
        fns.matchesPassiveRule(context, { everyNthImpulse: 4 }),
        true
    );

    context.enemyRuntime.impulseCount = 0;

    check(
        "matchesPassiveRule: everyNthImpulse trifft bei 0 nicht (impulseCount > 0 gefordert)",
        fns.matchesPassiveRule(context, { everyNthImpulse: 4 }),
        false
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.vulnerableBonusSinceLastEnemyAction = false;

    check(
        "matchesPassiveRule: withoutVulnerableBonusSinceLastAction trifft ohne Bonus",
        fns.matchesPassiveRule(context, { withoutVulnerableBonusSinceLastAction: true }),
        true
    );

    context.enemyRuntime.vulnerableBonusSinceLastEnemyAction = true;

    check(
        "matchesPassiveRule: withoutVulnerableBonusSinceLastAction trifft mit Bonus nicht",
        fns.matchesPassiveRule(context, { withoutVulnerableBonusSinceLastAction: true }),
        false
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.consecutivePlayerDamageSpells = 2;

    check(
        "matchesPassiveRule: consecutivePlayerDamageSpells erreicht Schwelle",
        fns.matchesPassiveRule(context, { consecutivePlayerDamageSpells: 2 }),
        true
    );

    context.enemyRuntime.consecutivePlayerDamageSpells = 1;

    check(
        "matchesPassiveRule: consecutivePlayerDamageSpells unter Schwelle",
        fns.matchesPassiveRule(context, { consecutivePlayerDamageSpells: 2 }),
        false
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.rotationMechanics = {
        vulnerable: true,
        shield: false,
        crit: false,
        sequence: false
    };

    check(
        "matchesPassiveRule: minimumRotationMechanics trifft bei zu wenig Mechaniken",
        fns.matchesPassiveRule(context, { minimumRotationMechanics: 2 }),
        true
    );

    context.enemyRuntime.rotationMechanics.shield = true;

    check(
        "matchesPassiveRule: minimumRotationMechanics trifft bei ausreichend Mechaniken nicht",
        fns.matchesPassiveRule(context, { minimumRotationMechanics: 2 }),
        false
    );
}

check(
    "matchesPassiveRule: leere Regel (kein condition-Feld) trifft immer",
    fns.matchesPassiveRule(makeContext(makeEnemy()), {}),
    true
);

// --- resolvePassiveEffect -------------------------------------------------

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);

    fns.resolvePassiveEffect(
        context,
        { id: "gain_shield", target: "enemy", amount: 20 },
        {}
    );

    check(
        "resolvePassiveEffect: gain_shield erhoeht enemyShield",
        context.enemyShield,
        20
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);

    fns.resolvePassiveEffect(
        context,
        { id: "set_incoming_damage_cap", amount: 40 },
        {}
    );

    check(
        "resolvePassiveEffect: set_incoming_damage_cap setzt enemyRuntime.incomingDamageCap",
        context.enemyRuntime.incomingDamageCap,
        40
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.consecutivePlayerDamageSpells = 3;

    fns.resolvePassiveEffect(
        context,
        { id: "reset_consecutive_player_damage" },
        {}
    );

    check(
        "resolvePassiveEffect: reset_consecutive_player_damage setzt Zaehler zurueck",
        context.enemyRuntime.consecutivePlayerDamageSpells,
        0
    );
}

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);

    check(
        "cycleBossSchool: startet bei blood",
        context.enemyRuntime.currentBossSchool,
        "blood"
    );

    const expectedCycle =
        ["shadow", "dream", "rune", "star", "primal", "blood"];

    expectedCycle.forEach((expectedSchool, index) => {
        fns.resolvePassiveEffect(context, { id: "cycle_boss_school" }, {});

        check(
            `cycleBossSchool: Schritt ${index + 1} -> ${expectedSchool}`,
            context.enemyRuntime.currentBossSchool,
            expectedSchool
        );
    });
}

// --- modifyIncomingPlayerDamage -------------------------------------------

{
    const enemy = makeEnemy();
    const context = makeContext(enemy);
    context.enemyRuntime.incomingDamageCap = 40;

    check(
        "modifyIncomingPlayerDamage: Schadenscap greift",
        fns.modifyIncomingPlayerDamage(context, 60),
        40
    );
}

{
    const enemy = makeEnemy({
        passive: {
            rules: [],
            values: {
                anti_spike_threshold: 50,
                anti_spike_penalty: 20
            }
        }
    });

    const context = makeContext(enemy);

    check(
        "modifyIncomingPlayerDamage: erster Spike-Treffer selbst unveraendert",
        fns.modifyIncomingPlayerDamage(context, 60),
        60
    );

    check(
        "modifyIncomingPlayerDamage: Anti-Spike-Strafe greift erst beim naechsten Treffer",
        fns.modifyIncomingPlayerDamage(context, 30),
        10
    );

    check(
        "modifyIncomingPlayerDamage: Strafe wird nach Anwendung zurueckgesetzt",
        fns.modifyIncomingPlayerDamage(context, 30),
        30
    );
}

{
    const enemy = makeEnemy({
        passive: {
            rules: [],
            values: { first_player_crit_damage_reduction: 15 }
        }
    });

    const context = makeContext(enemy);

    check(
        "modifyIncomingPlayerDamage: erster Krit wird reduziert",
        fns.modifyIncomingPlayerDamage(context, 50, { isCrit: true }),
        35
    );

    check(
        "modifyIncomingPlayerDamage: zweiter Krit wird nicht mehr reduziert",
        fns.modifyIncomingPlayerDamage(context, 50, { isCrit: true }),
        50
    );
}

// --- resolveEnemyEffect: heal, gedeckelt auf enemy.hp ---------------------

{
    const enemy = makeEnemy({ hp: 100 });
    const context = makeContext(enemy, { enemyHp: 50 });

    fns.resolveEnemyEffect(
        context,
        { name: "Testaktion" },
        { id: "heal", target: "enemy", amount: 70 }
    );

    check(
        "resolveEnemyEffect: heal gedeckelt auf enemy.hp Maximum",
        context.enemyHp,
        100
    );
}

// --- Summary --------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
    process.exit(1);
}
