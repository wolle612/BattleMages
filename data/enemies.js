const rawEnemyDefinitions = [
    {
        id: "verirrter_novize",
        name: "Verirrter Novize",
        encounter: 1,
        tier: "Normal",
        combatIdentity: "Einfacher Angreifer",
        buildTest: "Rotationen verstehen",
        hp: 120,
        passive: {
            id: "unstable_magic",
            name: "Instabile Magie",
            description: "Jeder zweite Angriff verursacht +10 Schaden.",
            values: {},
            rules: [
                {
                    hook: "before_enemy_action",
                    everyNthAction: 2,
                    effects: [
                        { id: "modify_action_damage", amount: 10 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "magic_bolt",
                name: "Magischer Bolzen",
                effects: [
                    { id: "deal_damage", target: "player", amount: 25 }
                ]
            },
            {
                id: "magic_bolt_repeat",
                name: "Magischer Bolzen",
                effects: [
                    { id: "deal_damage", target: "player", amount: 25 }
                ]
            }
        ],
        ui: {
            passiveText: "Jeder zweite Angriff verursacht +10 Schaden."
        },
        rewards: { standard: true }
    },
    {
        id: "entstellter_adept",
        name: "Entstellter Adept",
        encounter: 2,
        tier: "Normal",
        combatIdentity: "Belohnt Verwundbar",
        buildTest: "Verwundbar",
        hp: 150,
        passive: {
            id: "biological_adaptation",
            name: "Biologische Anpassung",
            description: "Wurde seit der letzten gegnerischen Aktion kein Verwundbar-Bonus ausgelöst, erhält der Adept 8 Schild.",
            values: {},
            rules: [
                {
                    hook: "before_enemy_action",
                    withoutVulnerableBonusSinceLastAction: true,
                    effects: [
                        { id: "gain_shield", target: "enemy", amount: 8 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "slash",
                name: "Hieb",
                effects: [
                    { id: "deal_damage", target: "player", amount: 28 }
                ]
            },
            {
                id: "bone_strike",
                name: "Knochenschlag",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "slash_repeat",
                name: "Hieb",
                effects: [
                    { id: "deal_damage", target: "player", amount: 28 }
                ]
            }
        ],
        ui: {
            passiveText: "Ohne Verwundbar-Bonus seit der letzten gegnerischen Aktion: +8 Schild."
        },
        rewards: { standard: true }
    },
    {
        id: "schattenlaeufer",
        name: "Schattenläufer",
        encounter: 3,
        tier: "Normal",
        combatIdentity: "Anti-Burst",
        buildTest: "Krit-Timing",
        hp: 165,
        passive: {
            id: "living_shadow",
            name: "Lebender Schatten",
            description: "Der erste kritische Treffer im Kampf verursacht 15 Schaden weniger.",
            values: {
                first_player_crit_damage_reduction: 15
            },
            rules: []
        },
        actionBar: [
            {
                id: "shadow_strike_light",
                name: "Schattenstoß",
                effects: [
                    { id: "deal_damage", target: "player", amount: 25 }
                ]
            },
            {
                id: "shadow_strike_heavy",
                name: "Schwerer Schattenstoß",
                effects: [
                    { id: "deal_damage", target: "player", amount: 40 }
                ]
            },
            {
                id: "twin_shadow_cut",
                name: "Doppelschnitt",
                effects: [
                    {
                        id: "deal_damage",
                        target: "player",
                        amount: 20,
                        hitCount: 2
                    }
                ]
            }
        ],
        ui: {
            passiveText: "Erster kritischer Treffer: -15 Schaden."
        },
        rewards: { standard: true }
    },
    {
        id: "runenketzer",
        name: "Runenketzer",
        encounter: 4,
        tier: "Elite",
        combatIdentity: "Schild-Festung",
        buildTest: "Schild entfernen",
        hp: 280,
        passive: {
            id: "rune_fortress",
            name: "Runenfestung",
            description: "Beginnt den Kampf mit 40 Schild.",
            values: {},
            rules: [
                {
                    hook: "combat_start",
                    combatStart: true,
                    effects: [
                        { id: "gain_shield", target: "enemy", amount: 35 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "rune_shield",
                name: "Runenschild",
                effects: [
                    { id: "gain_shield", target: "enemy", amount: 30 }
                ]
            },
            {
                id: "rune_attack",
                name: "Runenangriff",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "rune_attack_repeat",
                name: "Runenangriff",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "rune_explosion",
                name: "Runenexplosion",
                effects: [
                    { id: "deal_damage", target: "player", amount: 55 }
                ]
            }
        ],
        ui: {
            passiveText: "Startet mit 40 Schild."
        },
        rewards: { standard: true }
    },
    {
        id: "wahnsinniges_orakel",
        name: "Wahnsinniges Orakel",
        encounter: 5,
        tier: "Normal",
        combatIdentity: "Sequenzierung",
        buildTest: "Rotationsplanung",
        hp: 210,
        passive: {
            id: "oracle_pattern",
            name: "Orakel-Muster",
            description: "Nach Schaden durch zwei aufeinanderfolgende Spielerzauber erhält das Orakel 15 Schild.",
            values: {},
            rules: [
                {
                    hook: "before_enemy_action",
                    consecutivePlayerDamageSpells: 2,
                    effects: [
                        { id: "gain_shield", target: "enemy", amount: 15 },
                        { id: "reset_consecutive_player_damage" }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "oracle_bolt",
                name: "Orakelblitz",
                effects: [
                    { id: "deal_damage", target: "player", amount: 30 }
                ]
            },
            {
                id: "oracle_blast",
                name: "Orakelstoß",
                effects: [
                    { id: "deal_damage", target: "player", amount: 45 }
                ]
            },
            {
                id: "oracle_bolt_repeat",
                name: "Orakelblitz",
                effects: [
                    { id: "deal_damage", target: "player", amount: 30 }
                ]
            }
        ],
        ui: {
            passiveText: "Zwei aufeinanderfolgende Spieler-Treffer: +15 Schild."
        },
        rewards: { standard: true }
    },
    {
        id: "chaosgeborener",
        name: "Chaosgeborener",
        encounter: 6,
        tier: "Normal",
        combatIdentity: "Anti-Spike",
        buildTest: "Konstanter DPS",
        hp: 230,
        passive: {
            id: "chaos_dampening",
            name: "Chaosdämpfung",
            description: "Treffer über 70 Schaden reduzieren den nächsten Treffer um 20 Schaden.",
            values: {
                anti_spike_threshold: 70,
                anti_spike_penalty: 15
            },
            rules: []
        },
        actionBar: [
            {
                id: "chaos_bolt",
                name: "Chaosblitz",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "chaos_surge",
                name: "Chaoswelle",
                effects: [
                    { id: "deal_damage", target: "player", amount: 55 }
                ]
            },
            {
                id: "chaos_bolt_repeat",
                name: "Chaosblitz",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            }
        ],
        ui: {
            passiveText: "Treffer über 70: Nächster Treffer -15 Schaden."
        },
        rewards: { standard: true }
    },
    {
        id: "seelenhueter",
        name: "Seelenhüter",
        encounter: 7,
        tier: "Elite",
        combatIdentity: "Zermürbung",
        buildTest: "Lange Kämpfe",
        hp: 420,
        passive: {
            id: "soul_regeneration",
            name: "Seelenregeneration",
            description: "Heilt alle 4 Impulse 35 HP.",
            values: {},
            rules: [
                {
                    hook: "after_enemy_action",
                    everyNthImpulse: 4,
                    effects: [
                        { id: "heal", target: "enemy", amount: 35 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "soul_strike",
                name: "Seelenstoß",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "soul_blast",
                name: "Seelenwelle",
                effects: [
                    { id: "deal_damage", target: "player", amount: 45 }
                ]
            },
            {
                id: "soul_shield",
                name: "Seelenschild",
                effects: [
                    { id: "gain_shield", target: "enemy", amount: 35 }
                ]
            },
            {
                id: "soul_crush",
                name: "Seelenschlag",
                effects: [
                    { id: "deal_damage", target: "player", amount: 70 }
                ]
            }
        ],
        ui: {
            passiveText: "Alle 4 Impulse: Heilt 35 HP."
        },
        rewards: { standard: true }
    },
    {
        id: "runenkonstrukt",
        name: "Runenkonstrukt",
        encounter: 8,
        tier: "Normal",
        combatIdentity: "Schwere Rüstung",
        buildTest: "Mehrfach-Treffer",
        hp: 280,
        passive: {
            id: "damage_cap",
            name: "Schadensdämpfung",
            description: "Einzelne Treffer können maximal 40 Schaden verursachen.",
            values: {
                incoming_damage_cap: 40
            },
            rules: [
                {
                    hook: "combat_start",
                    combatStart: true,
                    effects: [
                        { id: "set_incoming_damage_cap", amount: 40 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "construct_shield",
                name: "Runenschild",
                effects: [
                    { id: "gain_shield", target: "enemy", amount: 25 }
                ]
            },
            {
                id: "construct_attack",
                name: "Runenangriff",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "construct_shield_repeat",
                name: "Runenschild",
                effects: [
                    { id: "gain_shield", target: "enemy", amount: 25 }
                ]
            }
        ],
        ui: {
            passiveText: "Einzelne Treffer sind auf 40 Schaden begrenzt."
        },
        rewards: { standard: true }
    },
    {
        id: "schattenbestie",
        name: "Schattenbestie",
        encounter: 9,
        tier: "Normal",
        combatIdentity: "Risiko-Management",
        buildTest: "Krit-Timing",
        hp: 320,
        passive: {
            id: "predator_instinct",
            name: "Raubtierinstinkt",
            description: "Nach einem erlittenen kritischen Treffer verursacht der nächste Angriff +20 Schaden.",
            values: {
                after_player_crit_attack_bonus: 20
            },
            rules: []
        },
        actionBar: [
            {
                id: "beast_claw",
                name: "Klauenhieb",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "beast_maul",
                name: "Schattensprung",
                effects: [
                    { id: "deal_damage", target: "player", amount: 52 }
                ]
            },
            {
                id: "beast_claw_repeat",
                name: "Klauenhieb",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            }
        ],
        ui: {
            passiveText: "Nach erlittenem Krit: Nächster Angriff +20 Schaden."
        },
        rewards: { standard: true }
    },
    {
        id: "fleischformer",
        name: "Fleischformer",
        encounter: 10,
        tier: "Elite",
        combatIdentity: "Schadensrennen",
        buildTest: "Burst-Fenster",
        hp: 520,
        passive: {
            id: "flesh_renewal",
            name: "Fleischerneuerung",
            description: "Heilt nach jeder vollständigen Spieler-Rotation 50 HP.",
            values: {},
            rules: [
                {
                    hook: "after_player_rotation",
                    afterPlayerRotation: true,
                    effects: [
                        { id: "heal", target: "enemy", amount: 50 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "flesh_strike",
                name: "Fleischhieb",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "flesh_heal",
                name: "Fleischheilung",
                effects: [
                    { id: "heal", target: "enemy", amount: 70 }
                ]
            },
            {
                id: "flesh_strike_repeat",
                name: "Fleischhieb",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "flesh_crush",
                name: "Fleischschlag",
                effects: [
                    { id: "deal_damage", target: "player", amount: 70 }
                ]
            }
        ],
        ui: {
            passiveText: "Nach jeder Spieler-Rotation: Heilt 50 HP."
        },
        rewards: { standard: true }
    },
    {
        id: "der_namenlose",
        name: "Der Namenlose",
        encounter: 11,
        tier: "Elite",
        combatIdentity: "Hybrid-Check",
        buildTest: "Mehrere Mechaniken",
        hp: 620,
        passive: {
            id: "adaptive_shell",
            name: "Adaptive Hülle",
            description: "Wurden in der letzten Spieler-Rotation weniger als zwei Kernmechaniken genutzt, erhält der Namenlose 20 Schild.",
            values: {},
            rules: [
                {
                    hook: "after_player_rotation",
                    minimumRotationMechanics: 2,
                    effects: [
                        { id: "gain_shield", target: "enemy", amount: 20 }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "nameless_strike",
                name: "Namensloser Schlag",
                effects: [
                    { id: "deal_damage", target: "player", amount: 40 }
                ]
            },
            {
                id: "nameless_strike_repeat",
                name: "Namensloser Schlag",
                effects: [
                    { id: "deal_damage", target: "player", amount: 40 }
                ]
            },
            {
                id: "nameless_shield",
                name: "Namensloser Schutz",
                effects: [
                    { id: "gain_shield", target: "enemy", amount: 35 }
                ]
            },
            {
                id: "nameless_crush",
                name: "Namensloser Stoß",
                effects: [
                    { id: "deal_damage", target: "player", amount: 75 }
                ]
            }
        ],
        ui: {
            passiveText: "Weniger als zwei Mechaniken in der Rotation: +20 Schild."
        },
        rewards: { standard: true }
    },
    {
        id: "erster_erzmagier",
        name: "Der Erste Erzmagier",
        encounter: 12,
        tier: "Boss",
        combatIdentity: "Abschlussprüfung",
        buildTest: "Vollständige Beherrschung",
        hp: 900,
        passive: {
            id: "master_forbidden_schools",
            name: "Meister der verbotenen Schulen",
            description: "Wechselt nach jeder Spieler-Rotation die aktive Schule und modifiziert seine Schultechniken.",
            values: {},
            rules: [
                {
                    hook: "after_player_rotation",
                    afterPlayerRotation: true,
                    effects: [
                        { id: "cycle_boss_school" }
                    ]
                }
            ]
        },
        actionBar: [
            {
                id: "arcane_bolt",
                name: "Arkaner Bolzen",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "school_technique",
                name: "Schultechnik",
                actionType: "school_technique",
                schoolTechniques: {
                    blood: {
                        name: "Biomantie-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 35 },
                            { id: "apply_status", target: "player", statusId: "vulnerable" }
                        ]
                    },
                    shadow: {
                        name: "Schattentechnik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 45 }
                        ]
                    },
                    dream: {
                        name: "Psionik-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 35 }
                        ]
                    },
                    rune: {
                        name: "Runenkunst-Technik",
                        effects: [
                            { id: "gain_shield", target: "enemy", amount: 25 },
                            { id: "deal_damage", target: "player", amount: 30 }
                        ]
                    },
                    star: {
                        name: "Chaos-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 50 }
                        ]
                    },
                    primal: {
                        name: "Seelenmagie-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 35 },
                            { id: "heal", target: "enemy", amount: 20 }
                        ]
                    }
                }
            },
            {
                id: "arcane_bolt_repeat",
                name: "Arkaner Bolzen",
                effects: [
                    { id: "deal_damage", target: "player", amount: 35 }
                ]
            },
            {
                id: "school_technique_repeat",
                name: "Schultechnik",
                actionType: "school_technique",
                schoolTechniques: {
                    blood: {
                        name: "Biomantie-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 35 },
                            { id: "apply_status", target: "player", statusId: "vulnerable" }
                        ]
                    },
                    shadow: {
                        name: "Schattentechnik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 45 }
                        ]
                    },
                    dream: {
                        name: "Psionik-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 35 }
                        ]
                    },
                    rune: {
                        name: "Runenkunst-Technik",
                        effects: [
                            { id: "gain_shield", target: "enemy", amount: 25 },
                            { id: "deal_damage", target: "player", amount: 30 }
                        ]
                    },
                    star: {
                        name: "Chaos-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 50 }
                        ]
                    },
                    primal: {
                        name: "Seelenmagie-Technik",
                        effects: [
                            { id: "deal_damage", target: "player", amount: 35 },
                            { id: "heal", target: "enemy", amount: 20 }
                        ]
                    }
                }
            },
            {
                id: "grand_spell",
                name: "Großzauber",
                effects: [
                    { id: "deal_damage", target: "player", amount: 72 }
                ]
            }
        ],
        ui: {
            passiveText: "Wechselt nach jeder Spieler-Rotation die aktive Schule."
        },
        rewards: { standard: true }
    }
];
