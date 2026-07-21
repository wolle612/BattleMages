#!/usr/bin/env node
/*
 * Regressionstests fuer die reinen Funktionen in src/combatFormula.js
 * (Phase 5 des Architecture & Design Audits, P0).
 *
 * Kein Test-Framework, passend zur Build-losen Projektarchitektur: laedt die
 * echten Quelldateien per vm in einen Sandbox-Kontext (gleiche globale-Scope-
 * Semantik wie index.html) und ruft die Original-Funktionen direkt auf.
 * Aufruf: node tools/test_combat_formula.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const SOURCE_FILES = [
    "data/combatIdentity.js",
    "src/combatStatus.js",
    "src/combatSequence.js",
    "src/effectEngine.js",
    "src/combatFormula.js"
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

function makeContext(overrides = {}) {
    return Object.assign(
        {
            playerHp: 120,
            playerMaxHp: 120,
            playerShield: 0,
            enemyHp: 100,
            enemyShield: 0,
            rotationSpells: [],
            lastPlayerSpell: null,
            castHistory: [],
            effects: {
                playerStatuses: {},
                enemyStatuses: {},
                nextSpellPreps: []
            }
        },
        overrides
    );
}

// --- rollCrit -----------------------------------------------------------

check(
    "rollCrit: guaranteedCrit erzwingt Krit mit Basis-Multiplikator",
    fns.rollCrit({}, { guaranteedCrit: true }),
    { isCrit: true, multiplier: 2 }
);

check(
    "rollCrit: guaranteedCrit + critDamageBonus addiert sich auf den Multiplikator",
    fns.rollCrit({}, { guaranteedCrit: true, critDamageBonus: 0.5 }),
    { isCrit: true, multiplier: 2.5 }
);

check(
    "rollCrit: stark negativer critChanceBonus verhindert Krit deterministisch",
    fns.rollCrit({}, { critChanceBonus: -1 }),
    { isCrit: false, multiplier: 1 }
);

// --- applyVulnerableMultiplier -------------------------------------------

{
    const context = makeContext({
        effects: {
            playerStatuses: {},
            enemyStatuses: {
                vulnerable: { id: "vulnerable", type: "negative", sourceSchool: "blood" }
            },
            nextSpellPreps: []
        }
    });

    const result = fns.applyVulnerableMultiplier(
        context,
        20,
        {},
        {},
        0,
        1
    );

    // vulnerableDamageMultiplier ist 1.5 (data/combatIdentity.js,
    // COMBAT_FORMULA_CONSTANTS) -- als const nicht von aussen auf der
    // vm-Sandbox lesbar, deshalb hier bewusst als Literal erwartet statt aus
    // der Konstante abgeleitet (sonst wuerde eine echte Aenderung des Werts
    // den Test nicht mehr faengt).
    check(
        "applyVulnerableMultiplier: x1.5, abgerundet (20 -> 30)",
        result,
        30
    );

    check(
        "applyVulnerableMultiplier: konsumiert Verwundbar nach Anwendung",
        Boolean(context.effects.enemyStatuses.vulnerable),
        false
    );
}

{
    const context = makeContext();

    check(
        "applyVulnerableMultiplier: ohne Verwundbar unveraendert",
        fns.applyVulnerableMultiplier(context, 20, {}, {}, 0, 1),
        20
    );
}

{
    const context = makeContext({
        effects: {
            playerStatuses: {},
            enemyStatuses: { vulnerable: { id: "vulnerable", type: "negative" } },
            nextSpellPreps: []
        }
    });

    fns.applyVulnerableMultiplier(
        context,
        20,
        {},
        { deferVulnerableConsume: true },
        0,
        2
    );

    check(
        "applyVulnerableMultiplier: deferVulnerableConsume behaelt Status vor letztem Hit",
        Boolean(context.effects.enemyStatuses.vulnerable),
        true
    );
}

// --- applySpellDamageToEnemy / Schildmitigation --------------------------

{
    const context = makeContext({ enemyShield: 30 });

    check(
        "applySpellDamageToEnemy: Schild absorbiert vollstaendig ohne Pierce",
        fns.applySpellDamageToEnemy(context, 20, {}, 0),
        0
    );

    check(
        "applySpellDamageToEnemy: Schild sinkt um absorbierten Schaden",
        context.enemyShield,
        10
    );
}

{
    const context = makeContext({ enemyShield: 30 });

    const damage = fns.applySpellDamageToEnemy(context, 50, {}, 0);

    check(
        "applySpellDamageToEnemy: Ueberschuss durchbrochen wenn Schaden > Schild",
        damage,
        20
    );
}

{
    const context = makeContext({ enemyShield: 30 });

    const damage = fns.applySpellDamageToEnemy(
        context,
        50,
        {},
        15
    );

    // Nachvollzogen gegen die echte Implementierung: piercedDamage =
    // min(damage=50, shieldPierce=15, enemyShield=30) = 15. Danach
    // applyEnemyShield(context, 50-15=35) gegen die noch vollen 30 Schild:
    // blockt 30, verbleibende 5 Schaden kommen durch. Summe: 15 + 5 = 20.
    check(
        "applySpellDamageToEnemy: shieldPierce laesst 15 sofort durch, Rest via Restschild",
        damage,
        20
    );
}

{
    const context = makeContext({ enemyShield: 30 });

    check(
        "applySpellDamageToEnemy: ignoreShield umgeht Schild komplett",
        fns.applySpellDamageToEnemy(context, 20, { ignoreShield: true }, 0),
        20
    );
}

// --- getMissingLifeBonus --------------------------------------------------

check(
    "getMissingLifeBonus: proportional zu fehlendem Leben, abgerundet (50% von 21 -> 10)",
    fns.getMissingLifeBonus(
        makeContext({ playerHp: 60, playerMaxHp: 120 }),
        { missingLifeBonusMax: 21 }
    ),
    10
);

check(
    "getMissingLifeBonus: 0 ohne konfigurierten Maximalwert",
    fns.getMissingLifeBonus(makeContext({ playerHp: 0 }), {}),
    0
);

// --- calculateShieldGain ---------------------------------------------------

check(
    "calculateShieldGain: Basiswert + prozentualer Cast-Bonus, abgerundet (25 * 1.5 -> 37)",
    fns.calculateShieldGain(
        makeContext(),
        { school: "rune" },
        { shield: 25 },
        { shieldPercentBonus: 0.5 }
    ),
    37
);

// --- healPlayer -------------------------------------------------------------

{
    const context = makeContext({ playerHp: 100, playerMaxHp: 120 });
    fns.healPlayer(context, 50);

    check(
        "healPlayer: gedeckelt auf playerMaxHp",
        context.playerHp,
        120
    );
}

// --- Summary --------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
    process.exit(1);
}
