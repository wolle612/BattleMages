// Meta-Progression-Zauber (Baustein D, Option A): keine Starter-Karten von
// Anfang an -- werden erst startfaehig, sobald der Spieler den passenden
// Build-Archetyp in einem echten Run erreicht hat (siehe
// classifyRotationArchetypes()/starterUnlockArchetype-Filter in
// src/game.js). Vorher ganz normale Reward-Pool-Zauber wie jeder andere.
// Kein Rang-2-5-Aufstiegspfad -- bewusst ausgeklammert, siehe
// docs/design/BattleMages_Meta_Progression_Concept_v1.md.
const spellbookPart3Definitions = [
    {
        id: "soul_migration",
        school: "primal",
        name: "Seelenwanderung",
        type: "Attack",
        role: "verstaerker",
        build: "multischule",
        mechanics: ["hybrid"],
        rarity: "Rare",
        description: "Die Seele leiht sich für einen Moment die Kraft jeder Disziplin, die in der Rotation gebunden ist.",
        tooltip: [
            "Verursacht 24 Schaden.",
            "Pro zusätzlicher Schule in deiner Rotation: +6 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "multischule",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 24,
                    damagePerUniqueSchoolInRotation: 6
                }
            }
        ]
    },
    {
        id: "wound_gangrene",
        school: "blood",
        name: "Wundbrand",
        type: "Attack",
        role: "verstaerker",
        build: "verwundbar_ketten",
        mechanics: ["vulnerable"],
        rarity: "Common",
        description: "Eine Wunde, die sich nicht schließt, sondern mit jedem weiteren Treffer weiter fault.",
        tooltip: [
            "Verursacht 20 Schaden.",
            "Wurde zuvor ein Angriffszauber gewirkt: +10 Schaden.",
            "Gegen verwundbare Ziele: +15 Schaden.",
            "Fügt Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "verwundbar_ketten",
        cooldown: 0,
        effects: ["deal_damage", "apply_vulnerable"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 20,
                    vulnerableBonusDamage: 15,
                    sequenceTrigger: "after_attack",
                    sequenceDamageBonus: 10
                }
            }
        ]
    },
    {
        id: "chaos_discharge",
        school: "star",
        name: "Chaosentladung",
        type: "Attack",
        role: "finisher",
        build: "one_shot",
        mechanics: ["vulnerable", "crit"],
        rarity: "Rare",
        description: "Die gesamte aufgestaute Instabilität entlädt sich in einem einzigen, ungezügelten Stoß.",
        tooltip: [
            "Verursacht 18 Schaden.",
            "Gegen verwundbare Ziele: +22 Schaden.",
            "Kritische Treffer: +15 Schaden.",
            "Je weniger eigene Lebenspunkte: bis zu +24 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "one_shot",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 18,
                    vulnerableBonusDamage: 22,
                    critFlatBonus: 15,
                    missingLifeBonusMax: 24
                }
            }
        ]
    },
    {
        id: "shadow_carapace",
        school: "shadow",
        name: "Schattenpanzer",
        type: "Attack",
        role: "verstaerker",
        build: "widerstand_krit",
        mechanics: ["crit", "resistance"],
        rarity: "Common",
        description: "Jeder perfekt gesetzte Treffer verdichtet den Schatten um den Körper zu einer harten Schale.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Kritische Treffer gewähren 16 Magischen Widerstand."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "widerstand_krit",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    critResistanceGain: 16
                }
            }
        ]
    },
    {
        id: "rune_binding",
        school: "rune",
        name: "Runenbindung",
        type: "Protection",
        role: "generator",
        build: "monoschule",
        mechanics: ["resistance", "sequence"],
        rarity: "Rare",
        description: "Eine fünfte Rune, die nur hält, wenn der Kreis ungebrochen bleibt.",
        tooltip: [
            "Erhalte 18 Magischen Widerstand.",
            "Wurde zuvor ein Zauber derselben Schule gewirkt: +14 zusätzlicher Widerstand."
        ],
        tags: ["Protection"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "monoschule",
        cooldown: 0,
        effects: ["gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: {
                    resistance: 18,
                    sequenceTrigger: "same_school",
                    sequenceResistanceGain: 14
                }
            }
        ]
    },
    {
        id: "nerve_cut",
        school: "blood",
        name: "Nervenschnitt",
        type: "Attack",
        role: "generator",
        build: "krit_verwundbar",
        mechanics: ["crit", "vulnerable"],
        rarity: "Common",
        description: "Ein gezielter Schnitt lähmt die Nerven -- der nächste Treffer sitzt exakt dort, wo es am meisten wehtut.",
        tooltip: [
            "Verursacht 24 Schaden.",
            "Gegen verwundbare Ziele: +12 Schaden.",
            "Der nächste Zauber erhält Präzision (garantiert kritisch)."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "krit_verwundbar",
        cooldown: 0,
        effects: ["deal_damage", "grant_next_spell_prep"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 24,
                    vulnerableBonusDamage: 12
                }
            }
        ]
    },
    {
        id: "mind_cascade",
        school: "dream",
        name: "Gedankenkaskade",
        type: "Attack",
        role: "verstaerker",
        build: "sequenz",
        mechanics: ["sequence"],
        rarity: "Rare",
        description: "Ein Gedanke reißt den nächsten mit sich, bis die ganze Kaskade einschlägt.",
        tooltip: [
            "Verursacht 20 Schaden.",
            "Wurde zuvor ein Angriffszauber gewirkt: +22 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "sequenz",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 20,
                    sequenceTrigger: "after_attack",
                    sequenceDamageBonus: 22
                }
            }
        ]
    },
    {
        id: "dampened_eruption",
        school: "star",
        name: "Gedämpfte Eruption",
        type: "Attack",
        role: "verstaerker",
        build: "kontrollierter_schaden",
        mechanics: ["resistance"],
        rarity: "Common",
        description: "Ein Teil der eigenen Abwehr wird gezielt in zusätzliche Wucht umgeleitet, kontrolliert statt zufällig.",
        tooltip: [
            "Verursacht 20 Schaden.",
            "Zusätzlich Schaden in Höhe von 40% deines Magischen Widerstands."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "kontrollierter_schaden",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 20,
                    resistanceBonusDamagePercent: 40
                }
            }
        ]
    },
    {
        id: "soul_fusion",
        school: "primal",
        name: "Seelenverschmelzung",
        type: "Attack",
        role: "verstaerker",
        build: "hybrid",
        mechanics: ["vulnerable", "resistance"],
        rarity: "Rare",
        description: "Die Seele verschmilzt für einen Moment die eigene Abwehr mit der Schwäche des Gegners zu einer einzigen Wucht.",
        tooltip: [
            "Verursacht 16 Schaden.",
            "Gegen verwundbare Ziele: +14 Schaden.",
            "Zusätzlich Schaden in Höhe von 20% deines Magischen Widerstands."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        starterUnlockArchetype: "hybrid",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 16,
                    vulnerableBonusDamage: 14,
                    resistanceBonusDamagePercent: 20
                }
            }
        ]
    }
];
