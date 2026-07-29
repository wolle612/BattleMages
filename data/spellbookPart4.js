// Legendary-Zauber (Baustein C der Meta-Progression, siehe
// docs/design/BattleMages_Meta_Progression_Concept_v1.md). Je Schule
// genau einer -- schaltet sich fuer den Reward-Pool frei, sobald der
// Spieler einen Run mit einer reinen Mono-Schul-Rotation dieser
// Schule GEWINNT (legendaryUnlockSchool-Feld, ausgewertet in
// src/rewardSystem.js isLegendaryUnlocked() gegen
// metaState.unlockedLegendarySchools, siehe src/metaProgression.js).
// Machtneutral: keine automatische Vergabe, weiterhin normale
// Reward-Gewichtung (REWARD_RARITY_WEIGHTS_BY_PROGRESS) -- lediglich
// vorher komplett ausgeschlossen. Kein Rang-2-5-Aufstiegspfad,
// bewusst wie bei den Baustein-D-Zaubern.
const spellbookPart4Definitions = [
    {
        id: "organ_collapse",
        school: "blood",
        name: "Organkollaps",
        type: "Attack",
        role: "finisher",
        build: "verwundbar_burst",
        mechanics: ["vulnerable"],
        rarity: "Legendary",
        description: "Der Körper erreicht den Punkt, an dem keine Wunde mehr heilen kann.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Gegen verwundbare Ziele: +55 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        legendaryUnlockSchool: "blood",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    vulnerableBonusDamage: 55
                }
            }
        ]
    },
    {
        id: "shadow_execution",
        school: "shadow",
        name: "Hinrichtung",
        type: "Attack",
        role: "finisher",
        build: "one_shot",
        mechanics: ["crit"],
        rarity: "Legendary",
        description: "Ein letzter, makelloser Schnitt -- als hätte das Ziel nie eine Chance gehabt.",
        tooltip: [
            "Verursacht 32 Schaden.",
            "Kritische Treffer verursachen +40 Schaden und wirken zusätzlich, als wäre das Ziel verwundbar."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        legendaryUnlockSchool: "shadow",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 32,
                    critFlatBonus: 40,
                    vulnerableBonusWithoutStatus: true
                }
            }
        ]
    },
    {
        id: "mind_storm",
        school: "dream",
        name: "Geistessturm",
        type: "Attack",
        role: "verstaerker",
        build: "multischule",
        mechanics: ["hybrid"],
        rarity: "Legendary",
        description: "Alle gebundenen Kräfte entladen sich gleichzeitig im Geist des Gegners.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Ignoriert gegnerischen Schild.",
            "Pro zusätzlicher Schule in deiner Rotation: +10 Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        legendaryUnlockSchool: "dream",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    ignoreShield: true,
                    damagePerUniqueSchoolInRotation: 10
                }
            }
        ]
    },
    {
        id: "rune_collapse",
        school: "rune",
        name: "Runenkollaps",
        type: "Attack",
        role: "finisher",
        build: "widerstandskanone",
        mechanics: ["resistance"],
        rarity: "Legendary",
        description: "Der gesamte aufgebaute Widerstand entlädt sich in einem einzigen, alles durchdringenden Stoß.",
        tooltip: [
            "Verursacht 20 Schaden.",
            "Zusätzlich Schaden in Höhe von 120% deines Magischen Widerstands."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        legendaryUnlockSchool: "rune",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 20,
                    resistanceBonusDamagePercent: 120
                }
            }
        ]
    },
    {
        id: "annihilation",
        school: "star",
        name: "Vernichtung",
        type: "Attack",
        role: "verstaerker",
        build: "burst",
        mechanics: ["burst"],
        rarity: "Legendary",
        description: "Reine, ungefilterte Zerstörung -- nichts hält ihr stand.",
        tooltip: [
            "Verursacht 70 Schaden.",
            "Ignoriert gegnerischen Schild und Magischen Widerstand vollständig."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        legendaryUnlockSchool: "star",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 70,
                    ignoreShield: true
                }
            }
        ]
    },
    {
        id: "soul_apotheosis",
        school: "primal",
        name: "Seelenapotheose",
        type: "Attack",
        role: "finisher",
        build: "hybrid",
        mechanics: ["vulnerable", "resistance", "crit"],
        rarity: "Legendary",
        description: "Die Seele verbindet in diesem Moment jede Kraft, die sie je gebunden hat.",
        tooltip: [
            "Verursacht 18 Schaden.",
            "Gegen verwundbare Ziele: +20 Schaden.",
            "Zusätzlich Schaden in Höhe von 30% deines Magischen Widerstands.",
            "Kritische Treffer verursachen +20 zusätzlichen Schaden."
        ],
        tags: ["Attack"],
        spellbookCore: false,
        starter: false,
        legendaryUnlockSchool: "primal",
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 18,
                    vulnerableBonusDamage: 20,
                    resistanceBonusDamagePercent: 30,
                    critFlatBonus: 20
                }
            }
        ]
    }
];
