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
        description: "Der zuverlässige Füllzauber eines Verwundbar-Builds.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: +15 Schaden."
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
        description: "Kritische Treffer machen das Ziel verwundbar.",
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
        description: "Biomantie erhält erstmals defensiven Spielraum für Hybrid-Builds.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Erhalte 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
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
        description: "Defensiver Crit-Zauber, der Treffer unmittelbar belohnt.",
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
        description: "Der konstante DPS-Zauber für Crit-Builds.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Kritische Treffer verursachen +20 Schaden."
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
        description: "Wandelt Verwundbar in Krit-Chancen um.",
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
        description: "Flexible Alternative zu Dunkler Klinge.",
        tooltip: [
            "Verursacht 32 Schaden.",
            "+18 % Kritchance."
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
        description: "Ersetzt alte Buffs durch klare Nächster-Zauber-Vorbereitung.",
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
        description: "Psionik erhält Zugang zu Schild ohne Runen zu kopieren.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Erhalte 20 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
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
        description: "Verbessert Hybrid-Builds mit gezieltem Verwundbar-Setup.",
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
        description: "Flexibler Unterstützer für den nächsten Treffer.",
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
        mechanics: ["shield", "sequence"],
        rarity: "Rare",
        description: "Belohnt defensive Rotationen.",
        tooltip: [
            "Erhalte 25 Schild.",
            "Wurde zuvor ein Schutzzauber gewirkt: +20 Schild."
        ],
        tags: ["Protection"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["gain_shield"],
        upgrades: [
            {
                rank: 1,
                values: {
                    shield: 25,
                    sequenceTrigger: "after_protection",
                    sequenceShieldBonus: 20
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
        mechanics: ["shield"],
        rarity: "Rare",
        description: "Der stärkste Schildskalierer.",
        tooltip: [
            "Erhöhe deinen aktuellen Schild um 50 %.",
            "Verursacht 15 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["increase_shield_percent", "deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    playerShieldPercentIncrease: 50,
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
        description: "Runenkunst erhält Zugriff auf Verwundbar.",
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
        mechanics: ["shield", "vulnerable"],
        rarity: "Rare",
        description: "Offensive Hybridkarte der Runenkunst.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Besitzt du Schild, fügt dieser Zauber Verwundbar zu."
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
                    applyVulnerableIfPlayerShield: true
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
        mechanics: ["shield"],
        rarity: "Common",
        description: "Aggressive Alternative zum Schildgenerator.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Erhalte 15 Schild."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["deal_damage", "gain_shield"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 35,
                    shield: 15
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
        description: "Einfache Burst-Karte der Chaosmagie.",
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
        description: "Der Standard-Burstzauber der Chaosmagie.",
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
        description: "Nutzt vorhandenen Schild offensiv, ohne ihn zu verbrauchen.",
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
        id: "soul_bind",
        school: "primal",
        name: "Seelenbindung",
        type: "Attack",
        role: "verstaerker",
        build: "schildkanone",
        mechanics: ["shield", "hybrid"],
        rarity: "Rare",
        description: "Direkter Hybrid-Zauber ohne Buff-Leiste.",
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
        description: "Kleiner Bruder des Schildbrechers.",
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
        description: "Verbindet Verwundbar und Schild in einem Schritt.",
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
        description: "Verbindet Crit- und Verwundbar-Builds.",
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
    }
];
