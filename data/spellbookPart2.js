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
        build: "widerstandsfestung",
        mechanics: ["resistance"],
        rarity: "Common",
        description: "Knochenplatten wachsen über Haut und Fleisch.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Erhalte 20 Magischen Widerstand."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 15,
                    resistance: 20
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
        build: "krit_verwundbar",
        mechanics: ["crit", "resistance", "vulnerable"],
        rarity: "Rare",
        // Verwundbar-Erzeugung ergaenzt (2026-07-24): Schatten hatte zuvor
        // keinen einzigen garantierten Verwundbar-Erzeuger auf Basisebene
        // (nur pfadgebundene Optionen bei precision_strike/death_stroke),
        // waehrend mehrere Zauber (u.a. in Seelenmagie) Verwundbar-Zugang
        // voraussetzen. critAppliesVulnerable existiert bereits als Wert
        // (dark_blade Pfad B) -- hier unconditional auf Basisebene statt
        // pfadgebunden, da Schattens eigene Praezision-Generatoren
        // (dark_blade/shadow_grasp) verlaesslich Krits erzeugen und dadurch
        // aus dem an sich chancenbasierten Trigger in der Praxis einen
        // zuverlaessigen macht.
        description: "Ein Mantel aus Schatten fängt kritische Treffer ab und reißt Wunden auf.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Bei einem kritischen Treffer erhältst du 20 Magischen Widerstand.",
            "Kritische Treffer fügen zusätzlich Verwundbar zu."
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
                    critResistanceGain: 20,
                    critAppliesVulnerable: true
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
        id: "keen_cut",
        school: "shadow",
        name: "Findiger Schnitt",
        type: "Attack",
        role: "verstaerker",
        build: "verwundbar_ketten",
        mechanics: ["crit", "vulnerable"],
        rarity: "Common",
        // Fuellt den verwundbar_ketten-Archetyp (bisher 0 Zauber in Schatten,
        // siehe BattleMages_Spellpool_Backlog.md, Slot 3). Bewusst NICHT als
        // 1:1-Portierung einer Biomantie-Mechanik, sondern an die eigene
        // Schulidentitaet angepasst: critAppliesVulnerable (dasselbe
        // Vokabular wie shadow_mantle, siehe dortiger Kommentar) statt
        // bedingungsloser Verwundbar-Erneuerung -- synergiert direkt mit den
        // vorhandenen Praezision-Generatoren (dark_blade/shadow_grasp), die
        // in einer gut gebauten Rotation zuverlaessig Krits liefern und
        // dadurch die Kette am Laufen halten.
        description: "Gezielte Präzisionsschläge finden immer neue Schwachstellen.",
        tooltip: [
            "Verursacht 28 Schaden.",
            "Gegen verwundbare Ziele: +20 Schaden.",
            "Kritische Treffer fügen zusätzlich Verwundbar zu."
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
                    damage: 28,
                    vulnerableBonusDamage: 20,
                    critAppliesVulnerable: true
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
        // Neugestaltet (Combat Condition Engine, 2026-07-23, "Option B"):
        // reine Verwundbar-gated Selbst-Krit-Chance ohne eigenen Payoff wird
        // zum bedingten Präzision-Generator, analog zu soul_spark.
        description: "Der gebrochene Wille bereitet den Geist auf den entscheidenden Treffer vor.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: Der nächste Zauber erhält Präzision (garantiert kritisch)."
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
                    nextSpellGuaranteedCrit: true,
                    nextSpellPrepRequiresVulnerable: true
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
        // Neugestaltet (Combat Condition Engine, 2026-07-23): reine
        // Selbst-Krit-Chance ohne eigenen Payoff (siehe Phase-0.5-
        // Diskussion) wird zum Präzision-Generator fuer den naechsten
        // Zauber -- Nutzer-Entscheidung "Option B", keine reine
        // Formalismus-Migration wie sonst in dieser Session.
        description: "Ein Gedankenstoß bereitet den entscheidenden Treffer vor.",
        tooltip: [
            "Verursacht 32 Schaden.",
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
                    damage: 32,
                    nextSpellGuaranteedCrit: true
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
        build: "widerstandsfestung",
        mechanics: ["resistance"],
        rarity: "Common",
        description: "Gedanken verdichten sich zu einem schützenden Schild.",
        tooltip: [
            "Verursacht 15 Schaden.",
            "Erhalte 20 Magischen Widerstand."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 15,
                    resistance: 20
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
        build: "widerstandsfestung",
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
        build: "widerstandsfestung",
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
        build: "widerstandsfestung",
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
        // Neugestaltet (Combat Condition Engine, 2026-07-23, zweiter Anlauf
        // nach Nutzer-Feedback): ersetzt die vormals zufällige Schadensspanne
        // UND den zufälligen Next-Spell-Prep (Pfad B) durch deterministische
        // Mechaniken -- explizite Nutzer-Entscheidung, kein reiner
        // Formalismus-Bug wie bei den sonstigen Migrationen. Erster Entwurf
        // (Schaden skaliert mit eigener fehlender Lebensenergie) verworfen --
        // gehörte konzeptionell zu Blutmagie/Biomantie (siehe
        // docs/archive/blood_spec.md), nicht zu Chaosmagie. Stattdessen an
        // "Chaosblitz" (World of Warcraft) orientiert: Chaos ignoriert
        // gegnerische Verteidigung komplett, wirkt dadurch instabil/
        // rücksichtslos, ist mechanisch aber vollständig deterministisch.
        description: "Ungezähmte Energie durchschlägt jede Verteidigung, ungeachtet von Schild oder Widerstand.",
        tooltip: [
            "Verursacht 35 Schaden.",
            "Ignoriert gegnerischen Schild und Magischen Widerstand vollständig."
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
                    ignoreShield: true
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
        starter: true,
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
        build: "widerstandskanone",
        mechanics: ["resistance", "burst"],
        rarity: "Epic",
        description: "Chaos nährt sich am Schild und entlädt den Überschuss.",
        tooltip: [
            "Verursacht 25 Schaden.",
            "Besitzt du Magischen Widerstand, verursacht dieser Zauber zusätzlichen Schaden in Höhe von 50 % deines Widerstands."
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
                    resistanceBonusDamagePercent: 50
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
        build: "widerstandskanone",
        mechanics: ["burst", "resistance"],
        rarity: "Common",
        description: "Geordnete Energie zerfällt in Chaos und hinterlässt einen schützenden Rest.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Erhalte 10 Magischen Widerstand."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_resistance"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 26,
                    resistance: 10
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
        build: "widerstandskanone",
        mechanics: ["resistance", "burst"],
        rarity: "Epic",
        // Hinweis fuer Phase 3 (Balance): Ueberladung war urspruenglich bewusst
        // so gebaut, dass sie sich selbst einen garantierten Schild-Sockel
        // verschafft UND ihn im selben Cast wieder verbraucht (Rotationsposition-
        // unabhaengig, siehe Content-Phase-Notizen). Unter Magischem Widerstand
        // (nie konsumiert) skaliert der Schaden jetzt zusaetzlich mit JEDEM
        // zuvor angesammelten Widerstand (z. B. von Entropie), nicht nur dem
        // eigenen +12 -- eine echte Staerkung gegenueber dem urspruenglichen
        // Design, faithful uebernommen, nicht kompensiert. Gehoert zur
        // Retuning-Liste der Balance-Phase.
        description: "Aufgestauter Widerstand überlädt sich und entlädt sich gewaltsam.",
        tooltip: [
            "Verursacht 12 Schaden.",
            "Erzeugt 12 Magischen Widerstand und verursacht zusätzlichen Schaden in Höhe von 100 % deines Magischen Widerstands."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: false,
        cooldown: 0,
        effects: ["gain_resistance", "deal_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 12,
                    resistance: 12,
                    resistanceBonusDamagePercent: 100
                }
            }
        ]
    },
    {
        id: "bound_chaos",
        school: "star",
        name: "Gezügeltes Chaos",
        type: "Attack",
        role: "verstaerker",
        build: "kontrollierter_schaden",
        mechanics: ["burst", "resistance"],
        rarity: "Rare",
        // Fuellt den kontrollierter_schaden-Archetyp (bisher 0 Zauber, siehe
        // BattleMages_Spellpool_Backlog.md) -- bewusst in Chaosmagie statt
        // Runenkunst platziert (Nutzer-Entscheidung 2026-07-24, Rune hat mit 9
        // Zaubern bereits das groesste Uebergewicht im Spellbook). Anders als
        // die bestehenden leichten Widerstand-Generatoren (entropy, bone_armor,
        // mind_barrier, rune_thrust: kleiner Schaden + ordentlich Widerstand)
        // liefert dieser Zauber beide Werte auf spuerbarem, vergleichbarem
        // Niveau -- echte Balance statt Widerstand-Uebergewicht.
        description: "Das eigene Chaos wird für einen Moment gebändigt — Schaden und Schutz zugleich.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Erhalte 22 Magischen Widerstand."
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
                    damage: 26,
                    resistance: 22
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
        build: "widerstandskanone",
        mechanics: ["resistance", "hybrid"],
        rarity: "Rare",
        description: "Die getroffene Seele gibt Kraft als Magischen Widerstand zurück.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Erhalte Magischen Widerstand in Höhe von 50 % des verursachten Schadens."
        ],
        tags: ["Attack"],
        spellbookCore: true,
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_resistance_from_dealt_damage"],
        upgrades: [
            {
                rank: 1,
                values: {
                    damage: 30,
                    resistanceFromDealtDamagePercent: 50
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
        build: "widerstandskanone",
        mechanics: ["resistance"],
        rarity: "Common",
        description: "Ein Schnitt, der aus dem eigenen Widerstand gespeist wird.",
        tooltip: [
            "Verursacht Schaden in Höhe von 50 % deines Magischen Widerstands."
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
                    resistanceBonusDamagePercent: 50
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
        mechanics: ["vulnerable", "resistance"],
        rarity: "Rare",
        description: "Verwundbarkeit wird zu schützender Seelenkraft.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele erhältst du 20 Magischen Widerstand."
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
                    vulnerableResistanceGain: 20
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
        // Neugestaltet (Combat Condition Engine, 2026-07-23, "Option B"):
        // reine Verwundbar-gated Selbst-Krit-Chance ohne eigenen Payoff wird
        // zum bedingten Präzision-Generator -- nutzt das bereits bestehende
        // nextSpellPrepRequiresVulnerable (siehe organ_failure), kein neuer
        // Code noetig.
        description: "Ein Funke Seelenfeuer bereitet den nächsten Treffer vor.",
        tooltip: [
            "Verursacht 30 Schaden.",
            "Gegen verwundbare Ziele: Der nächste Zauber erhält Präzision (garantiert kritisch)."
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
                    nextSpellGuaranteedCrit: true,
                    nextSpellPrepRequiresVulnerable: true
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
        build: "widerstand_krit",
        mechanics: ["crit", "resistance"],
        rarity: "Common",
        description: "Die Seele wacht auf und schützt sich im entscheidenden Moment.",
        tooltip: [
            "Verursacht 26 Schaden.",
            "Bei kritischem Treffer: Erhalte 20 Magischen Widerstand."
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
                    critResistanceGain: 20
                }
            }
        ]
    },
    {
        id: "soul_resonance",
        school: "primal",
        name: "Seelenresonanz",
        type: "Attack",
        role: "verstaerker",
        build: "sequenz",
        mechanics: ["sequence", "resistance"],
        rarity: "Common",
        // Fuellt den sequenz-Archetyp (bisher nur shadow_dance, Epic --
        // Slot 4 aus BattleMages_Spellpool_Backlog.md). Schliesst dabei eine
        // in COMBAT_SCHOOLS dokumentierte, nie eingeloeste Identitaetsluecke:
        // primal.rareMechanic ist bereits seit langem "sequence", aber kein
        // Seelenmagie-Zauber nutzte bislang einen Sequenz-Trigger.
        // different_school + sequenceResistanceGain sind bereits
        // vollstaendig implementiertes, schul-agnostisches Vokabular
        // (siehe combatFormula.js calculateResistanceGain), aktuell nur in
        // Psionik (arcane_chain/mind_trap) genutzt -- kein neuer Code.
        description: "Die Seele reagiert auf fremde Magie, die ihr vorausging.",
        tooltip: [
            "Verursacht 28 Schaden.",
            "Wurde zuvor ein Zauber einer anderen Schule gewirkt: Erhalte 22 Magischen Widerstand."
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
                    damage: 28,
                    sequenceTrigger: "different_school",
                    sequenceResistanceGain: 22
                }
            }
        ]
    }
];
