const spellbookCoreDefinitions = [
    {
        id: "bone_fracture",
        school: "blood",
        name: "Knochenbruch",
        type: "Attack",
        role: "generator",
        build: "verwundbar_burst",
        mechanics: ["vulnerable"],
        rarity: "Common",
        description: "Der zuverlässigste Verwundbar-Erzeuger.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Fügt Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "apply_vulnerable"],
        upgrades: [
            {
                rank: 1,
                values: { damage: 30 }
            }
        ]
    },
    {
        id: "organ_failure",
        school: "blood",
        name: "Organversagen",
        type: "Attack",
        role: "build_enabler",
        build: "verwundbar_ketten",
        mechanics: ["vulnerable"],
        rarity: "Rare",
        description: "Hält Verwundbar-Ketten ohne komplizierte Dauer am Laufen.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: Fügt erneut Verwundbar zu."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "apply_vulnerable"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    applyVulnerableOnlyIfVulnerable: true
                }
            }
        ]
    },
    {
        id: "precision_strike",
        school: "shadow",
        name: "Präzisionsschlag",
        type: "Attack",
        role: "build_enabler",
        build: "verwundbar_burst",
        mechanics: ["vulnerable"],
        rarity: "Rare",
        description: "Der erste große Burst-Zauber für Verwundbar-Builds.",
        tooltip: [
            "Verursacht 40 Schaden.",
            "Gegen verwundbare Ziele: +35 Schaden."
        ],
        tags: ["Burst"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 40,
                    vulnerableBonusDamage: 35
                }
            }
        ]
    },
    {
        id: "shield_wall",
        school: "rune",
        name: "Schildwall",
        type: "Protection",
        role: "generator",
        build: "schildfestung",
        mechanics: ["shield"],
        rarity: "Common",
        description: "Der Standard-Schildgenerator.",
        tooltip: [
            "Erhalte 32 Schild."
        ],
        tags: ["Protection"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["gain_shield"],
        upgrades: [
            {
                rank: 1,
                values: { shield: 32 }
            }
        ]
    },
    {
        id: "shield_breaker",
        school: "rune",
        name: "Schildbrecher",
        type: "Attack",
        role: "build_enabler",
        build: "schildkanone",
        mechanics: ["shield"],
        rarity: "Rare",
        description: "Wandelt Schild in Schaden um.",
        tooltip: [
            "Verursacht Schaden in Höhe deines aktuellen Schildes.",
            "Entfernt anschließend deinen Schild."
        ],
        tags: ["Burst"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_shield_damage"],
        upgrades: [
            {
                rank: 1,
                values: { consumePlayerShield: true }
            }
        ]
    },
    {
        id: "dark_blade",
        school: "shadow",
        name: "Dunkle Klinge",
        type: "Attack",
        role: "generator",
        build: "kritmaschine",
        mechanics: ["crit"],
        rarity: "Common",
        description: "Ein zuverlässiger Krit-Generator.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "+20 % Kritchance."
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
                    critChanceBonus: 20
                }
            }
        ]
    },
    {
        id: "shadow_grasp",
        school: "shadow",
        name: "Schattengriff",
        type: "Attack",
        role: "build_enabler",
        build: "one_shot",
        mechanics: ["crit"],
        rarity: "Rare",
        description: "Eröffnet den Garantierter-Krit-Build für den nächsten Zauber.",
        tooltip: [
            "Verursacht 20 Schaden.",
            "Der nächste Zauber trifft garantiert kritisch."
        ],
        tags: ["Preparation"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "grant_next_spell_prep"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 20,
                    nextSpellGuaranteedCrit: true,
                    nextSpellPrepCharges: 1
                }
            }
        ]
    },
    {
        id: "death_stroke",
        school: "shadow",
        name: "Todesstoß",
        type: "Attack",
        role: "finisher",
        build: "one_shot",
        mechanics: ["crit"],
        rarity: "Epic",
        description: "Der Finisher, für den man Krit vorbereitet.",
        tooltip: [
            "Verursacht 45 Schaden.",
            "Kritische Treffer verursachen +50 Schaden."
        ],
        tags: ["Burst"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 45,
                    critFlatBonus: 50
                }
            }
        ]
    },
    {
        id: "rune_harmony",
        school: "rune",
        name: "Runenharmonie",
        type: "Attack",
        role: "build_enabler",
        build: "schild_krit",
        mechanics: ["shield", "crit"],
        rarity: "Rare",
        description: "Die Brücke zwischen Schild- und Krit-Builds.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Kritische Treffer gewähren 20 Schild."
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
                    critShieldGain: 20
                }
            }
        ]
    },
    {
        id: "shadow_dance",
        school: "shadow",
        name: "Schattentanz",
        type: "Attack",
        role: "build_enabler",
        build: "sequenz",
        mechanics: ["sequence"],
        rarity: "Epic",
        description: "Belohnt gute Reihenfolge nach Angriffszaubern.",
        tooltip: [
            "Verursacht 25 Schaden.",
            "Wurde zuvor ein Angriffszauber gewirkt, trifft dieser Zauber zweimal."
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
                    damage: 25,
                    sequenceTrigger: "after_attack",
                    sequenceRepeatHits: 2
                }
            }
        ]
    },
    {
        id: "arcane_chain",
        school: "dream",
        name: "Arkane Verkettung",
        type: "Attack",
        role: "build_enabler",
        build: "multischule",
        mechanics: ["sequence"],
        rarity: "Rare",
        description: "Der wichtigste Hybrid-Zauber für Multischule-Builds.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Wurde zuvor ein Zauber einer anderen Schule gewirkt: +35 Schaden."
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
                    sequenceTrigger: "different_school",
                    sequenceDamageBonus: 35
                }
            }
        ]
    },
    {
        id: "purity",
        school: "rune",
        name: "Reinheit",
        type: "Attack",
        role: "build_enabler",
        build: "monoschule",
        mechanics: ["sequence"],
        rarity: "Rare",
        description: "Belohnt bewusst gewählte Monoschule-Rotationen.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Wurde zuvor ein Zauber derselben Schule gewirkt: +35 Schaden."
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
                    sequenceTrigger: "same_school",
                    sequenceDamageBonus: 35
                }
            }
        ]
    }
];
