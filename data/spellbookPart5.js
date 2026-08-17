// Sustain-Archetyp (Spielinhalte-Optimierung, siehe
// docs/design/BattleMages_Spielinhalte_Optimierung_Backlog.md): erste
// beiden Zauber ueberhaupt mit build:"sustain" -- vorher 0 von 56
// Zaubern, obwohl COMBAT_SCHOOLS.primal.secondaryMechanic bereits seit
// Projektbeginn "sustain" deklariert (data/combatIdentity.js). Beide
// folgen dem etablierten Seelenmagie-Muster (siehe
// BattleMages_Spell_Authoring_Checklist.md, Abschnitt 0): Seelenmagie
// hat bewusst keinen Generator/Finisher, jeder Zauber verbindet zwei
// Mechaniken -- hier jeweils eine bestehende Ressource mit Heilung
// (healPlayer() in combatFormula.js existierte bereits, wurde aber nie
// aufgerufen).
const spellbookPart5Definitions = [
    {
        id: "soul_anchor",
        school: "primal",
        name: "Seelenanker",
        type: "Attack",
        role: "verstaerker",
        build: "sustain",
        mechanics: ["resistance", "sustain"],
        rarity: "Common",
        description: "Der aufgebaute Widerstand verankert die Seele fester im Körper.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Heilt dich um 40 % deines Magischen Widerstands."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        starterUnlockArchetype: "sustain",
        cooldown: 0,
        effects: ["deal_damage", "heal_from_resistance_percent"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    healFromResistancePercent: 40
                }
            }
        ]
    },
    {
        id: "soul_theft",
        school: "primal",
        name: "Seelenraub",
        type: "Attack",
        role: "verstaerker",
        build: "sustain",
        mechanics: ["sustain", "hybrid"],
        rarity: "Rare",
        description: "Entzieht dem Ziel im Treffermoment Lebenskraft.",
        tooltip: [
            "Verursacht 28 Schaden.",
            "Heilt dich um 50 % des verursachten Schadens."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "heal_from_dealt_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 28,
                    healFromDealtDamagePercent: 50
                }
            }
        ]
    }
];
