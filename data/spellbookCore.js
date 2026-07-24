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
        description: "Knochen splittern unter dem Druck lebendiger Magie.",
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
        description: "Innere Organe versagen, sobald die Schwäche greift.",
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
        description: "Ein gezielter Stich, der jede offene Wunde ausnutzt.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Gegen verwundbare Ziele: +30 Schaden."
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
                    damage: 35,
                    vulnerableBonusDamage: 30
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
        build: "widerstandsfestung",
        mechanics: ["resistance"],
        rarity: "Common",
        description: "Runen formen eine dichte Barriere aus hartem Licht.",
        tooltip: [
            "Erhalte 32 Magischen Widerstand."
        ],
        tags: ["Protection"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: { resistance: 32 }
            }
        ]
    },
    {
        id: "shield_breaker",
        school: "rune",
        name: "Schildbrecher",
        type: "Attack",
        role: "build_enabler",
        build: "widerstandskanone",
        mechanics: ["resistance", "sequence"],
        rarity: "Rare",
        description: "Die Barriere zerbricht und entlädt sich als tödlicher Stoß.",
        tooltip: [
            "Verursacht Schaden in Höhe deines Magischen Widerstands.",
            "Nur wirksam, wenn du zuvor einen Schutzzauber gewirkt hast."
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
                    sequenceTrigger: "after_protection",
                    resistanceBonusDamagePercentOnSequence: 100
                }
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
        // Neugestaltet (Combat Condition Engine, 2026-07-23, "Option B"):
        // reine Selbst-Krit-Chance ohne eigenen Payoff wird zum
        // Präzision-Generator für den nächsten Zauber.
        description: "Eine Klinge aus Schatten bereitet den tödlichen Winkel vor.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Der nächste Zauber erhält Präzision (garantiert kritisch)."
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
                    nextSpellGuaranteedCrit: true
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
        description: "Schattenfinger markieren das nächste Opfer für den kritischen Schlag.",
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
        description: "Der letzte Schnitt, der vorbereitete Schwäche endgültig besiegelt.",
        tooltip: [
            "Verursacht 45 Schaden.",
            "Kritische Treffer verursachen +50 Schaden."
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
        build: "widerstand_krit",
        mechanics: ["resistance", "crit"],
        rarity: "Rare",
        description: "Runen und Schatten schwingen im gleichen Takt.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Kritische Treffer gewähren 20 Magischen Widerstand."
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
                    critResistanceGain: 20
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
        description: "Der zweite Schritt fällt, bevor das Opfer den ersten bemerkt.",
        tooltip: [
            "Verursacht 25 Schaden.",
            "Wurde zuvor ein Angriffszauber gewirkt, trifft dieser Zauber zweimal."
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
        description: "Fremde Magie verkettet sich zu einem verstärkten Schlag.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Wurde zuvor ein Zauber einer anderen Schule gewirkt: +30 Schaden."
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
                    sequenceTrigger: "different_school",
                    sequenceDamageBonus: 30
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
        description: "Nur gleiche Magie darf folgen — und trifft dann härter.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Wurde zuvor ein Zauber derselben Schule gewirkt: +30 Schaden."
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
                    sequenceTrigger: "same_school",
                    sequenceDamageBonus: 30
                }
            }
        ]
    }
];
