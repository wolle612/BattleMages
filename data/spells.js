const spellDefinitions = [
    {
        id: "legacy_burning_blood",
        school: "fire",
        name: "Brennendes Blut",
        description: "Verstärkt Feuermagie.",
        rarity: "common",
        type: "status",
        tags: ["buff", "fire"],
        isSignature: false,
        cooldown: 4,
        rotationOrder: 0,
        starter: false,
        effects: ["fire_buff"],
        upgrades: [
            { rank: 1, values: { fireBuff: true } },
            { rank: 2, values: { fireBuff: true } },
            { rank: 3, values: { fireBuff: true } },
            { rank: 4, values: { fireBuff: true } },
            { rank: 5, values: { fireBuff: true } }
        ]
    },
    {
        id: "legacy_rune_shard",
        school: "arcane",
        name: "Runensplitter",
        description: "Verursacht Schaden und macht das Ziel brüchig.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "debuff", "brittle", "starter"],
        isSignature: false,
        cooldown: 2,
        rotationOrder: 1,
        starter: true,
        effects: ["deal_damage", "apply_brittle"],
        upgrades: [
            { rank: 1, values: { damage: 4 } },
            { rank: 2, values: { damage: 5 } },
            { rank: 3, values: { damage: 6 } },
            { rank: 4, values: { damage: 7 } },
            { rank: 5, values: { damage: 8 } }
        ]
    },
    {
        id: "legacy_ember_bolt",
        school: "fire",
        name: "Glutgeschoss",
        description: "Verursacht Schaden und setzt das Ziel in Brand.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "burn", "starter"],
        isSignature: false,
        cooldown: 1,
        rotationOrder: 2,
        starter: true,
        effects: ["deal_damage", "apply_burn"],
        upgrades: [
            { rank: 1, values: { damage: 5 } },
            { rank: 2, values: { damage: 6 } },
            { rank: 3, values: { damage: 7 } },
            { rank: 4, values: { damage: 8 } },
            { rank: 5, values: { damage: 9 } }
        ]
    },
    {
        id: "legacy_frostbite",
        school: "frost",
        name: "Frostbiss",
        description: "Verlangsamt Gegner und verursacht Frostschaden.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "slow", "starter"],
        isSignature: false,
        cooldown: 1,
        rotationOrder: 3,
        starter: true,
        effects: ["deal_damage", "apply_slow"],
        upgrades: [
            { rank: 1, values: { damage: 4 } },
            { rank: 2, values: { damage: 5 } },
            { rank: 3, values: { damage: 6 } },
            { rank: 4, values: { damage: 7 } },
            { rank: 5, values: { damage: 8 } }
        ]
    },
    {
        id: "legacy_winterfall",
        school: "frost",
        name: "Wintereinbruch",
        description: "Nutzt verlangsamte Gegner aus.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "slow_synergy"],
        isSignature: false,
        cooldown: 4,
        rotationOrder: 4,
        starter: false,
        effects: ["deal_damage", "slow_bonus"],
        upgrades: [
            { rank: 1, values: { damage: 8 } },
            { rank: 2, values: { damage: 9 } },
            { rank: 3, values: { damage: 10 } },
            { rank: 4, values: { damage: 11 } },
            { rank: 5, values: { damage: 12 } }
        ]
    },
    {
        id: "legacy_inferno",
        school: "fire",
        name: "Inferno",
        description: "Ein mächtiger Feuerzauber.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "burn"],
        isSignature: false,
        cooldown: 3,
        rotationOrder: 5,
        starter: false,
        effects: ["deal_damage", "apply_burn"],
        upgrades: [
            { rank: 1, values: { damage: 8 } },
            { rank: 2, values: { damage: 9 } },
            { rank: 3, values: { damage: 10 } },
            { rank: 4, values: { damage: 11 } },
            { rank: 5, values: { damage: 12 } }
        ]
    },
    {
        id: "legacy_decay",
        school: "arcane",
        name: "Zerfall",
        description: "Nutzt Brüchig aus.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "brittle_synergy"],
        isSignature: false,
        cooldown: 4,
        rotationOrder: 6,
        starter: false,
        effects: ["deal_damage", "brittle_bonus"],
        upgrades: [
            { rank: 1, values: { damage: 8 } },
            { rank: 2, values: { damage: 9 } },
            { rank: 3, values: { damage: 10 } },
            { rank: 4, values: { damage: 11 } },
            { rank: 5, values: { damage: 12 } }
        ]
    },
    {
        id: "legacy_ember_armor",
        school: "fire",
        name: "Glutpanzer",
        description: "Schützt dich und verbrennt Angreifer.",
        rarity: "common",
        type: "defense",
        tags: ["shield", "starter"],
        isSignature: false,
        cooldown: 4,
        rotationOrder: 7,
        starter: true,
        effects: ["gain_shield"],
        upgrades: [
            { rank: 1, values: { shield: 2 } },
            { rank: 2, values: { shield: 3 } },
            { rank: 3, values: { shield: 4 } },
            { rank: 4, values: { shield: 5 } },
            { rank: 5, values: { shield: 6 } }
        ]
    },
    {
        id: "legacy_frost_shield",
        school: "frost",
        name: "Frostschild",
        description: "Gewährt Schutz und verlangsamt Angreifer.",
        rarity: "common",
        type: "defense",
        tags: ["shield", "starter"],
        isSignature: false,
        cooldown: 4,
        rotationOrder: 8,
        starter: true,
        effects: ["gain_shield"],
        upgrades: [
            { rank: 1, values: { shield: 3 } },
            { rank: 2, values: { shield: 4 } },
            { rank: 3, values: { shield: 5 } },
            { rank: 4, values: { shield: 6 } },
            { rank: 5, values: { shield: 7 } }
        ]
    },
    {
        id: "legacy_arcane_veil",
        school: "arcane",
        name: "Arkaner Schleier",
        description: "Arkane Schutzmagie.",
        rarity: "common",
        type: "defense",
        tags: ["shield", "brittle_synergy"],
        isSignature: false,
        cooldown: 4,
        rotationOrder: 9,
        starter: false,
        effects: ["gain_shield", "extend_brittle"],
        upgrades: [
            { rank: 1, values: { shield: 4 } },
            { rank: 2, values: { shield: 5 } },
            { rank: 3, values: { shield: 6 } },
            { rank: 4, values: { shield: 7 } },
            { rank: 5, values: { shield: 8 } }
        ]
    },
    {
        id: "legacy_avalanche",
        school: "frost",
        name: "Lawine",
        description: "Ein starker Frostzauber.",
        rarity: "common",
        type: "attack",
        tags: ["damage"],
        isSignature: false,
        cooldown: 3,
        rotationOrder: 10,
        starter: false,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 7 } },
            { rank: 2, values: { damage: 8 } },
            { rank: 3, values: { damage: 9 } },
            { rank: 4, values: { damage: 10 } },
            { rank: 5, values: { damage: 11 } }
        ]
    },
    {
        id: "legacy_aether_storm",
        school: "arcane",
        name: "Äthersturm",
        description: "Ein mächtiger Arkanzauber.",
        rarity: "common",
        type: "attack",
        tags: ["damage", "brittle_synergy"],
        isSignature: false,
        cooldown: 3,
        rotationOrder: 11,
        starter: false,
        effects: ["deal_damage", "brittle_bonus"],
        upgrades: [
            { rank: 1, values: { damage: 7 } },
            { rank: 2, values: { damage: 8 } },
            { rank: 3, values: { damage: 9 } },
            { rank: 4, values: { damage: 10 } },
            { rank: 5, values: { damage: 11 } }
        ]
    }
];
