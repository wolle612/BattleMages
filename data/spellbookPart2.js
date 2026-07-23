const spellbookPart2Definitions = [
    {
        id: "blood_clot",
        school: "blood",
        name: "Blutgerinnsel",
        type: "Attack",
        role: "verstaerker",
        build: "verwundbar_burst",
        mechanics: ["vulnerable"],
        rarity: "Common",
        description: "Geronnenes Blut verdichtet sich zum nächsten Stoß.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: +15 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    vulnerableBonusDamage: 15
                }
            }
        ]
    },
    {
        id: "anatomy",
        school: "blood",
        name: "Anatomie",
        type: "Attack",
        role: "verstaerker",
        build: "krit_verwundbar",
        mechanics: ["crit", "vulnerable"],
        rarity: "Rare",
        description: "Der kritische Treffer legt die Schwachstelle frei.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Kritische Treffer fügen Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    critAppliesVulnerable: true
                }
            }
        ]
    },
    {
        id: "bone_armor",
        school: "blood",
        name: "Knochenpanzer",
        type: "Attack",
        role: "verstaerker",
        build: "schildfestung",
        mechanics: ["shield"],
        rarity: "Common",
        description: "Knochenplatten wachsen über Haut und Fleisch.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Erhalte 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_shield"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 15,
                    shield: 20
                }
            }
        ]
    },
    {
        id: "shadow_mantle",
        school: "shadow",
        name: "Schattenmantel",
        type: "Attack",
        role: "verstaerker",
        build: "kritmaschine",
        mechanics: ["crit", "shield"],
        rarity: "Rare",
        description: "Ein Mantel aus Schatten fängt kritische Treffer ab.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Bei einem kritischen Treffer erhältst du 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 32,
                    critShieldGain: 20
                }
            }
        ]
    },
    {
        id: "dark_blow",
        school: "shadow",
        name: "Finsterer Hieb",
        type: "Attack",
        role: "verstaerker",
        build: "kritmaschine",
        mechanics: ["crit"],
        rarity: "Common",
        description: "Ein schwerer Hieb aus der Dunkelheit.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Kritische Treffer verursachen +20 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 35,
                    critFlatBonus: 20
                }
            }
        ]
    },
    {
        id: "will_break",
        school: "dream",
        name: "Willensbruch",
        type: "Attack",
        role: "verstaerker",
        build: "krit_verwundbar",
        mechanics: ["vulnerable", "crit"],
        rarity: "Rare",
        description: "Der gebrochene Wille öffnet den Geist für kritische Treffer.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: +30 % Kritchance."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    vulnerableCritChanceBonus: 30
                }
            }
        ]
    },
    {
        id: "mind_strike",
        school: "dream",
        name: "Gedankenschlag",
        type: "Attack",
        role: "generator",
        build: "kritmaschine",
        mechanics: ["crit"],
        rarity: "Common",
        description: "Ein Gedankenstoß sucht den verwundbaren Punkt.",
        tooltip: [
            "Verursacht 32 Schaden.",
            "+18 % Kritchance."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 32,
                    critChanceBonus: 18
                }
            }
        ]
    },
    {
        id: "mind_stream",
        school: "dream",
        name: "Gedankenstrom",
        type: "Attack",
        role: "verstaerker",
        build: "kritmaschine",
        mechanics: ["crit"],
        rarity: "Rare",
        description: "Ein Strom von Absicht richtet den nächsten Zauber aus.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Der nächste Zauber erhält +40 % Kritchance."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "grant_next_spell_prep"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 15,
                    nextSpellCritChanceBonus: 40,
                    nextSpellPrepCharges: 1
                }
            }
        ]
    },
    {
        id: "mind_barrier",
        school: "dream",
        name: "Gedankenbarriere",
        type: "Attack",
        role: "verstaerker",
        build: "schildfestung",
        mechanics: ["shield"],
        rarity: "Common",
        description: "Gedanken verdichten sich zu einem schützenden Schild.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Erhalte 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_shield"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 15,
                    shield: 20
                }
            }
        ]
    },
    {
        id: "mind_trap",
        school: "dream",
        name: "Gedankenfalle",
        type: "Attack",
        role: "verstaerker",
        build: "multischule",
        mechanics: ["sequence", "vulnerable"],
        rarity: "Rare",
        description: "Fremde Magie löst die Falle und macht das Ziel verwundbar.",
        tooltip: [
            "Verursacht 25 Schaden.",
            "Wurde zuvor ein Zauber einer anderen Schule gewirkt: Fügt Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "apply_vulnerable"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 25,
                    applyVulnerableOnSequenceTrigger: "different_school"
                }
            }
        ]
    },
    {
        id: "mind_redirect",
        school: "dream",
        name: "Gedankenumlenkung",
        type: "Attack",
        role: "verstaerker",
        build: "kritmaschine",
        mechanics: ["crit"],
        rarity: "Common",
        description: "Die Absicht wird umgelenkt und schärft den Folgeschlag.",
        tooltip: [
            "Verursacht 20 Schaden.",
            "Der nächste Zauber erhält +25 % Kritchance."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "grant_next_spell_prep"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 20,
                    nextSpellCritChanceBonus: 25,
                    nextSpellPrepCharges: 1
                }
            }
        ]
    },
    {
        id: "forbidden_seal",
        school: "rune",
        name: "Verbotenes Siegel",
        type: "Protection",
        role: "verstaerker",
        build: "schildfestung",
        mechanics: ["resistance", "sequence"],
        rarity: "Rare",
        description: "Ein verbotenes Siegel wächst mit jedem Schutzzauber.",
        tooltip: [
            "Erhalte 25 Magischen Widerstand.",
            "Wurde zuvor ein Schutzzauber gewirkt: +20 Magischen Widerstand."
        ],
        tags: ["Protection"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: {
                    resistance: 25,
                    sequenceTrigger: "after_protection",
                    sequenceResistanceBonus: 20
                }
            }
        ]
    },
    {
        id: "amplified_seal",
        school: "rune",
        name: "Verstärktes Siegel",
        type: "Attack",
        role: "verstaerker",
        build: "schildfestung",
        mechanics: ["resistance"],
        rarity: "Rare",
        description: "Das Siegel pulsiert und verdoppelt die vorhandene Barriere.",
        tooltip: [
            "Erhöhe deinen aktuellen Magischen Widerstand um 50 %.",
            "Verursacht 15 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["increase_resistance", "deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    playerResistancePercentIncrease: 50,
                    damage: 15
                }
            }
        ]
    },
    {
        id: "fracture_rune",
        school: "rune",
        name: "Bruchrune",
        type: "Attack",
        role: "verstaerker",
        build: "verwundbar_burst",
        mechanics: ["vulnerable"],
        rarity: "Common",
        description: "Die Rune springt auf und hinterlässt eine offene Schwäche.",
        tooltip: [
            "Verursacht 25 Schaden.",
            "Fügt Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "apply_vulnerable"],
        upgrades: [
            {
                rank: 1,
                values: { damage: 25 }
            }
        ]
    },
    {
        id: "rune_break",
        school: "rune",
        name: "Runenbruch",
        type: "Attack",
        role: "verstaerker",
        build: "hybrid",
        mechanics: ["resistance", "vulnerable"],
        rarity: "Rare",
        description: "Hinter dem eigenen Schild bricht die Rune das Ziel.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Besitzt du Magischen Widerstand, fügt dieser Zauber Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "apply_vulnerable"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    applyVulnerableIfPlayerResistance: true
                }
            }
        ]
    },
    {
        id: "rune_thrust",
        school: "rune",
        name: "Runenstoß",
        type: "Attack",
        role: "verstaerker",
        build: "schildfestung",
        mechanics: ["resistance"],
        rarity: "Common",
        description: "Ein runischer Stoß, der zugleich schützt und verletzt.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Erhalte 15 Magischen Widerstand."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 35,
                    resistance: 15
                }
            }
        ]
    },
    {
        id: "chaos_eruption",
        school: "star",
        name: "Chaoseruption",
        type: "Attack",
        role: "verstaerker",
        build: "burst",
        mechanics: ["burst"],
        rarity: "Common",
        description: "Ungezähmte Energie entlädt sich in unberechenbarer Gewalt.",
        tooltip: [
            "Verursacht 30–50 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    randomDamageMin: 30,
                    randomDamageMax: 50
                }
            }
        ]
    },
    {
        id: "chaos_blade",
        school: "star",
        name: "Chaosklinge",
        type: "Attack",
        role: "verstaerker",
        build: "burst",
        mechanics: ["burst"],
        rarity: "Rare",
        description: "Eine Klinge aus reinem Chaos schneidet ohne Umweg.",
        tooltip: [
            "Verursacht 45 Schaden."
        ],
        tags: ["Burst"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: { damage: 45 }
            }
        ]
    },
    {
        id: "chaos_catalyst",
        school: "star",
        name: "Chaoskatalysator",
        type: "Attack",
        role: "build_enabler",
        build: "schildkanone",
        mechanics: ["shield", "burst"],
        rarity: "Epic",
        description: "Chaos nährt sich am Schild und entlädt den Überschuss.",
        tooltip: [
            "Verursacht 25 Schaden.",
            "Besitzt du Schild, verursacht dieser Zauber zusätzlichen Schaden in Höhe von 50 % deines Schildes."
        ],
        tags: ["Burst"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 25,
                    shieldBonusDamagePercent: 50
                }
            }
        ]
    },
    {
        id: "entropy",
        school: "star",
        name: "Entropie",
        type: "Attack",
        role: "generator",
        build: "schildkanone",
        mechanics: ["burst", "shield"],
        rarity: "Common",
        description: "Geordnete Energie zerfällt in Chaos und hinterlässt einen schützenden Rest.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Erhalte 10 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_shield"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    shield: 10
                }
            }
        ]
    },
    {
        id: "overload",
        school: "star",
        name: "Überladung",
        type: "Attack",
        role: "finisher",
        build: "schildkanone",
        mechanics: ["shield", "burst"],
        rarity: "Epic",
        description: "Aufgestauter Schild überlädt sich und entlädt sich gewaltsam.",
        tooltip: [
            "Verursacht 12 Schaden.",
            "Erzeugt 12 Schild und entlädt deinen gesamten Schild sofort als zusätzlichen Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["gain_shield", "deal_shield_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 12,
                    shield: 12,
                    shieldBonusDamagePercent: 100
                }
            }
        ]
    },
    {
        id: "soul_bind",
        school: "primal",
        name: "Seelenbindung",
        type: "Attack",
        role: "verstaerker",
        build: "schildkanone",
        mechanics: ["shield", "hybrid"],
        rarity: "Rare",
        description: "Die getroffene Seele gibt Kraft als Schild zurück.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Erhalte Schild in Höhe von 50 % des verursachten Schadens."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "gain_shield_from_dealt_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    shieldFromDealtDamagePercent: 50
                }
            }
        ]
    },
    {
        id: "soul_cut",
        school: "primal",
        name: "Seelenschnitt",
        type: "Attack",
        role: "verstaerker",
        build: "schildkanone",
        mechanics: ["shield"],
        rarity: "Common",
        description: "Ein Schnitt, der aus dem eigenen Schild gespeist wird.",
        tooltip: [
            "Verursacht Schaden in Höhe von 50 % deines Schildes."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    shieldBonusDamagePercent: 50
                }
            }
        ]
    },
    {
        id: "soul_pulse",
        school: "primal",
        name: "Seelenimpuls",
        type: "Attack",
        role: "verstaerker",
        build: "verwundbar_burst",
        mechanics: ["vulnerable", "shield"],
        rarity: "Rare",
        description: "Verwundbarkeit wird zu schützender Seelenkraft.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele erhältst du 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    vulnerableShieldGain: 20
                }
            }
        ]
    },
    {
        id: "soul_spark",
        school: "primal",
        name: "Seelenfunke",
        type: "Attack",
        role: "verstaerker",
        build: "krit_verwundbar",
        mechanics: ["crit", "vulnerable"],
        rarity: "Rare",
        description: "Ein Funke Seelenfeuer sucht kritische Schwachstellen.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: +30 % Kritchance."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    vulnerableCritChanceBonus: 30
                }
            }
        ]
    },
    {
        id: "soul_ward",
        school: "primal",
        name: "Seelenwache",
        type: "Attack",
        role: "verstaerker",
        build: "schild_krit",
        mechanics: ["crit", "shield"],
        rarity: "Common",
        description: "Die Seele wacht auf und schützt sich im entscheidenden Moment.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Bei kritischem Treffer: Erhalte 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    critShieldGain: 20
                }
            }
        ]
    }
];
