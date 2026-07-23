const spellUpgradeProfiles = {
    bone_fracture: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Offene Fraktur",
                rank3: {
                    values: { vulnerableBonusDamage: 20 },
                    tooltip: ["Gegen verwundbare Ziele: +20 Schaden."]
                },
                rank5: {
                    values: { vulnerableRepeatHits: 2 },
                    tooltip: ["Gegen verwundbare Ziele trifft Knochenbruch zweimal."]
                }
            },
            b: {
                label: "Knochenpanzer",
                rank3: {
                    values: { applyVulnerableResistanceGain: 15 },
                    tooltip: ["Erhalte 15 Magischen Widerstand, wenn dieser Zauber Verwundbar zufügt."]
                },
                rank5: {
                    values: { applyVulnerableResistanceGain: 30, vulnerableBonusDamage: 10 },
                    tooltip: [
                        "Erhalte 30 Magischen Widerstand statt 15.",
                        "Gegen verwundbare Ziele: +10 Schaden."
                    ]
                }
            }
        }
    },
    organ_failure: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Totales Versagen",
                rank3: {
                    values: { vulnerableBonusDamage: 25 },
                    tooltip: ["Gegen verwundbare Ziele: +25 Schaden."]
                },
                rank5: {
                    values: { vulnerableRepeatHits: 2 },
                    tooltip: ["Gegen verwundbare Ziele trifft Organversagen zweimal."]
                }
            },
            b: {
                label: "Kettenreaktion",
                rank3: {
                    values: { vulnerableResistanceGain: 15 },
                    tooltip: [
                        "Gegen verwundbare Ziele: Fügt erneut Verwundbar zu.",
                        "Erhalte 15 Magischen Widerstand."
                    ]
                },
                rank5: {
                    values: {
                        nextSpellCritChanceBonus: 25,
                        nextSpellPrepRequiresVulnerable: true
                    },
                    tooltip: ["Gegen verwundbare Ziele: Der nächste Zauber erhält +25 % Kritchance."]
                }
            }
        }
    },
    precision_strike: {
        rank2: {
            values: { vulnerableBonusDamage: 55 },
            tooltip: ["Gegen verwundbare Ziele: +55 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Perfekter Treffer",
                rank3: {
                    values: { critFlatBonus: 25 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +25 Schaden."]
                },
                rank5: {
                    values: { vulnerableGuaranteedCrit: true },
                    tooltip: ["Gegen verwundbare Ziele: Garantierter Krit."]
                }
            },
            b: {
                label: "Präziser Schnitt",
                rank3: {
                    values: {},
                    effects: ["apply_vulnerable"],
                    tooltip: ["Fügt nach dem Treffer erneut Verwundbar zu."]
                },
                rank5: {
                    values: { damage: 65 },
                    tooltip: [
                        "Fügt erneut Verwundbar zu.",
                        "Verursacht zusätzlich +15 Schaden."
                    ]
                }
            }
        }
    },
    shield_wall: {
        rank2: {
            values: { resistance: 38 },
            tooltip: ["Erhalte 38 Magischen Widerstand."]
        },
        rank4: {
            values: { resistance: 50 },
            tooltip: ["Erhalte 50 Magischen Widerstand."]
        },
        paths: {
            a: {
                label: "Verstärkte Rune",
                rank3: {
                    // Hinweis: dieser Wert war schon vor der Migration
                    // wirkungslos (fehlender "increase_shield_percent"/
                    // jetzt "increase_resistance" Eintrag in effects[]).
                    // Bewusst 1:1 als bestehende, dem Nutzer gemeldete
                    // Inkonsistenz uebernommen, nicht stillschweigend
                    // "repariert" -- siehe Zusammenfassung.
                    values: { playerResistanceFlatIncrease: 15 },
                    tooltip: ["Erhalte zusätzlich 15 Magischen Widerstand."]
                },
                rank5: {
                    values: { resistanceGainIfPlayerHasResistance: 25 },
                    tooltip: ["Besitzt du bereits Widerstand: Erhalte zusätzlich 25 Magischen Widerstand."]
                }
            },
            b: {
                label: "Dornenschild",
                rank3: {
                    values: { damage: 20 },
                    effects: ["deal_damage"],
                    tooltip: ["Verursacht zusätzlich 20 Schaden."]
                },
                rank5: {
                    values: { resistanceBonusDamagePercent: 50 },
                    tooltip: ["Verursacht zusätzlich Schaden in Höhe von 50 % deines Magischen Widerstands."]
                }
            }
        }
    },
    shield_breaker: {
        rank2: {
            values: { resistanceBonusDamagePercentOnSequence: 60 },
            tooltip: ["Schaden skaliert mit 60 % deines Magischen Widerstands."]
        },
        rank4: {
            values: { resistanceBonusDamagePercentOnSequence: 75 },
            tooltip: ["Schaden skaliert mit 75 % deines Magischen Widerstands."]
        },
        paths: {
            a: {
                label: "Vernichtung",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Schaden erhöht sich zusätzlich um +25."]
                },
                rank5: {
                    values: { resistanceBonusDamageCritMultiplier: 2 },
                    tooltip: ["Kritische Treffer verdoppeln den zusätzlichen Widerstandsschaden."]
                }
            },
            b: {
                label: "Kontrollierter Einschlag",
                // Rang 3 bewusst ohne Zusatzeffekt gelassen: shieldConsumePercent
                // ("verbrauche nur X% deines Schildes") hat unter Magischem
                // Widerstand (wird nie konsumiert) keine Entsprechung mehr --
                // echte Design-Luecke, nicht eigenmaechtig durch einen erfundenen
                // Ersatzwert geschlossen. Siehe Zusammenfassung/Migrationsnotizen.
                rank5: {
                    values: { postCastResistanceGain: 25 },
                    tooltip: ["Nach dem Angriff erhältst du 25 Magischen Widerstand zurück."]
                }
            }
        }
    },
    dark_blade: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Schatteninstinkt",
                rank3: {
                    values: { critChanceBonus: 35 },
                    tooltip: ["+35 % Kritchance."]
                },
                rank5: {
                    values: { critFlatBonus: 30 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +30 Schaden."]
                }
            },
            b: {
                label: "Blutjagd",
                rank3: {
                    values: { critAppliesVulnerable: true },
                    tooltip: ["Kritische Treffer fügen Verwundbar zu."]
                },
                rank5: {
                    values: { vulnerableGuaranteedCrit: true },
                    tooltip: ["Gegen verwundbare Ziele: Garantierter Krit."]
                }
            }
        }
    },
    shadow_grasp: {
        rank2: {
            values: { damage: 30 },
            tooltip: ["Verursacht 30 Schaden."]
        },
        rank4: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        paths: {
            a: {
                label: "Tödlicher Griff",
                rank3: {
                    values: { nextSpellDamageBonus: 25 },
                    tooltip: ["Der nächste kritische Treffer verursacht zusätzlich +25 Schaden."]
                },
                rank5: {
                    values: { nextSpellDamageBonus: 50 },
                    tooltip: ["Der nächste kritische Treffer verursacht zusätzlich +50 Schaden."]
                }
            },
            b: {
                label: "Fesselgriff",
                rank3: {
                    values: { nextSpellShieldBonus: 25 },
                    tooltip: ["Der nächste kritische Treffer gewährt anschließend 25 Schild."]
                },
                rank5: {
                    values: { nextSpellAppliesVulnerable: true },
                    tooltip: ["Der nächste kritische Treffer fügt zusätzlich Verwundbar zu."]
                }
            }
        }
    },
    death_stroke: {
        rank2: {
            values: { damage: 55 },
            tooltip: ["Verursacht 55 Schaden."]
        },
        rank4: {
            values: { damage: 65 },
            tooltip: ["Verursacht 65 Schaden."]
        },
        paths: {
            a: {
                label: "Hinrichtung",
                rank3: {
                    values: { critFlatBonus: 90 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +40 Schaden."]
                },
                rank5: {
                    values: { critFollowUpPercent: 50 },
                    tooltip: ["Garantierte kritische Treffer treffen ein zweites Mal mit 50 % Schaden."]
                }
            },
            b: {
                label: "Durchbohren",
                rank3: {
                    values: { vulnerableBonusDamage: 30 },
                    tooltip: ["Gegen verwundbare Ziele: +30 Schaden."]
                },
                rank5: {
                    values: { damage: 80 },
                    effects: ["apply_vulnerable"],
                    tooltip: [
                        "Fügt nach dem Treffer erneut Verwundbar zu.",
                        "Verursacht +15 Schaden."
                    ]
                }
            }
        }
    },
    rune_harmony: {
        rank2: {
            values: { damage: 45, critResistanceGain: 25 },
            tooltip: [
                "Verursacht 45 Schaden.",
                "Kritische Treffer gewähren 25 Magischen Widerstand."
            ]
        },
        rank4: {
            values: { damage: 55 },
            tooltip: ["Verursacht 55 Schaden."]
        },
        paths: {
            a: {
                label: "Runenfokus",
                rank3: {
                    values: { critResistanceGain: 40 },
                    tooltip: ["Kritische Treffer gewähren 40 Magischen Widerstand."]
                },
                rank5: {
                    values: { critResistanceMultiplier: 2 },
                    tooltip: ["Kritische Treffer verdoppeln den erhaltenen Magischen Widerstand."]
                }
            },
            b: {
                label: "Resonierende Rune",
                rank3: {
                    values: { critAppliesVulnerable: true },
                    tooltip: ["Kritische Treffer fügen zusätzlich Verwundbar zu."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 20 },
                    tooltip: [
                        "Kritische Treffer erzeugen Widerstand.",
                        "Der nächste Zauber erhält +20 % Kritchance."
                    ]
                }
            }
        }
    },
    shadow_dance: {
        rank2: {
            values: { damage: 35 },
            tooltip: ["Verursacht 35 Schaden."]
        },
        rank4: {
            values: { damage: 45 },
            tooltip: ["Verursacht 45 Schaden."]
        },
        paths: {
            a: {
                label: "Tanz der Klingen",
                rank3: {
                    values: { sequenceRepeatFullDamage: true },
                    tooltip: ["Der zweite Treffer verursacht vollen Schaden."]
                },
                rank5: {
                    values: { sequenceBothHitsCanCrit: true },
                    tooltip: ["Beide Treffer können kritisch treffen."]
                }
            },
            b: {
                label: "Tänzer der Schatten",
                rank3: {
                    values: { sequenceRepeatAppliesVulnerable: true },
                    tooltip: ["Der zweite Treffer fügt Verwundbar zu."]
                },
                rank5: {
                    values: { critShieldGain: 15 },
                    tooltip: ["Jeder kritische Treffer erzeugt 15 Schild."]
                }
            }
        }
    },
    arcane_chain: {
        rank2: {
            values: { damage: 55, sequenceDamageBonus: 55 },
            tooltip: [
                "Verursacht 55 Schaden.",
                "Nach anderer Schule: +55 Schaden."
            ]
        },
        rank4: {
            values: { damage: 65 },
            tooltip: ["Verursacht 65 Schaden."]
        },
        paths: {
            a: {
                label: "Meister der Schulen",
                rank3: {
                    values: { sequenceDamageBonus: 55 },
                    tooltip: ["Bonus nach anderer Schule: +55 Schaden."]
                },
                rank5: {
                    values: { damagePerUniqueSchoolInRotation: 10 },
                    tooltip: ["Pro anderer Schule in deiner Zauberleiste: +10 Schaden."]
                }
            },
            b: {
                label: "Arkane Verbindung",
                rank3: {
                    values: { nextSpellCritChanceBonus: 20 },
                    tooltip: ["Der nächste Zauber erhält +20 % Kritchance."]
                },
                rank5: {
                    values: { nextSpellDamageBonus: 20 },
                    tooltip: ["Der nächste Zauber erhält zusätzlich +20 Schaden."]
                }
            }
        }
    },
    purity: {
        rank2: {
            values: { damage: 55, sequenceDamageBonus: 55 },
            tooltip: [
                "Verursacht 55 Schaden.",
                "Nach gleicher Schule: +55 Schaden."
            ]
        },
        rank4: {
            values: { damage: 65 },
            tooltip: ["Verursacht 65 Schaden."]
        },
        paths: {
            a: {
                label: "Vollkommene Reinheit",
                rank3: {
                    values: { sequenceDamageBonus: 55 },
                    tooltip: ["Bonus nach gleicher Schule: +55 Schaden."]
                },
                rank5: {
                    values: { sequenceRepeatHits: 2 },
                    tooltip: ["Nach gleicher Schule trifft Reinheit zweimal."]
                }
            },
            b: {
                label: "Unerschütterliche Rune",
                rank3: {
                    values: { postCastResistanceGain: 25 },
                    tooltip: ["Erhalte nach dem Treffer 25 Magischen Widerstand."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 25, nextSpellSchool: "rune" },
                    tooltip: ["Der nächste Zauber derselben Schule erhält +25 % Kritchance."]
                }
            }
        }
    },
    blood_clot: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Inneres Bluten",
                rank3: {
                    values: { vulnerableBonusDamage: 30 },
                    tooltip: ["Gegen verwundbare Ziele: +30 Schaden."]
                },
                rank5: {
                    values: { vulnerableRepeatHits: 2 },
                    tooltip: ["Gegen verwundbare Ziele trifft Blutgerinnsel zweimal."]
                }
            },
            b: {
                label: "Geronnene Essenz",
                rank3: {
                    values: { vulnerableResistanceGain: 20 },
                    tooltip: ["Gegen verwundbare Ziele: Erhalte 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { nextSpellDamageBonus: 20 },
                    tooltip: ["Gegen verwundbare Ziele: Der nächste Zauber erhält +20 Schaden."]
                }
            }
        }
    },
    will_break: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Zerschmetterter Wille",
                rank3: {
                    values: { vulnerableCritChanceBonus: 50 },
                    tooltip: ["Gegen verwundbare Ziele: +50 % Kritchance."]
                },
                rank5: {
                    values: { critAppliesVulnerable: true },
                    tooltip: ["Trifft Willensbruch kritisch, fügt er zusätzlich Verwundbar zu."]
                }
            },
            b: {
                label: "Kontrollverlust",
                rank3: {
                    values: { nextSpellDamageBonus: 30 },
                    tooltip: ["Gegen verwundbare Ziele: Der nächste Zauber erhält +30 Schaden."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 25 },
                    tooltip: ["Der nächste Zauber erhält zusätzlich +25 % Kritchance."]
                }
            }
        }
    },
    mind_strike: {
        rank2: {
            values: { damage: 42 },
            tooltip: ["Verursacht 42 Schaden."]
        },
        rank4: {
            values: { damage: 52 },
            tooltip: ["Verursacht 52 Schaden."]
        },
        paths: {
            a: {
                label: "Gedankenexplosion",
                rank3: {
                    values: { vulnerableGuaranteedCrit: true, critFlatBonus: 30 },
                    tooltip: [
                        "Gegen verwundbare Ziele: garantierter Krit.",
                        "Kritische Treffer verursachen +30 Schaden."
                    ]
                },
                rank5: {
                    values: { critFollowUpPercent: 50 },
                    tooltip: ["Kritische Treffer treffen ein zweites Mal mit 50 % Schaden."]
                }
            },
            b: {
                label: "Präziser Fokus",
                rank3: {
                    values: { nextSpellDamageBonus: 20 },
                    tooltip: ["Der nächste Zauber erhält zusätzlich +20 Schaden."]
                },
                rank5: {
                    values: { nextSpellPrepCharges: 2 },
                    tooltip: ["Die Präzision gilt für die nächsten 2 Zauber statt nur einen."]
                }
            }
        }
    },
    mind_stream: {
        rank2: {
            values: { damage: 25 },
            tooltip: ["Verursacht 25 Schaden."]
        },
        rank4: {
            values: { damage: 35 },
            tooltip: ["Verursacht 35 Schaden."]
        },
        paths: {
            a: {
                label: "Genialer Einfall",
                rank3: {
                    values: { nextSpellCritChanceBonus: 50 },
                    tooltip: ["Der nächste Zauber erhält +50 % Kritchance."]
                },
                rank5: {
                    values: { nextSpellCritDamageBonus: 35 },
                    tooltip: ["Der nächste kritische Treffer verursacht zusätzlich +35 Schaden."]
                }
            },
            b: {
                label: "Impuls",
                rank3: {
                    values: { nextSpellDamageBonus: 25 },
                    tooltip: ["Der nächste Zauber erhält +25 Schaden."]
                },
                rank5: {
                    values: { nextSpellAppliesVulnerable: true },
                    tooltip: ["Der nächste Zauber fügt zusätzlich Verwundbar zu."]
                }
            }
        }
    },
    mind_barrier: {
        rank2: {
            values: { resistance: 30 },
            tooltip: ["Erhalte 30 Magischen Widerstand."]
        },
        rank4: {
            values: { resistance: 45 },
            tooltip: ["Erhalte 45 Magischen Widerstand."]
        },
        paths: {
            a: {
                label: "Eiserner Wille",
                rank3: {
                    // Hinweis: schon vor der Migration wirkungslos (fehlender
                    // "increase_shield_percent"/"increase_resistance" Eintrag in
                    // effects[]), gleiche vorbestehende Inkonsistenz wie bei
                    // shield_wall/bone_armor Pfad A Rang 3. 1:1 uebernommen.
                    values: { playerResistanceFlatIncrease: 20 },
                    tooltip: ["Erhalte zusätzlich 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { resistanceGainIfPlayerHasResistance: 30 },
                    tooltip: ["Besitzt du bereits Widerstand: Erhalte zusätzlich 30 Magischen Widerstand."]
                }
            },
            b: {
                label: "Psychischer Rückstoß",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { resistanceBonusDamagePercent: 50 },
                    tooltip: ["Schaden erhöht sich um 50 % deines Magischen Widerstands."]
                }
            }
        }
    },
    forbidden_seal: {
        rank2: {
            values: { resistance: 35 },
            tooltip: ["Erhalte 35 Magischen Widerstand."]
        },
        rank4: {
            values: { resistance: 50 },
            tooltip: ["Erhalte 50 Magischen Widerstand."]
        },
        paths: {
            a: {
                label: "Dreifaches Siegel",
                rank3: {
                    values: { sequenceResistanceBonus: 35 },
                    tooltip: ["Nach Schutzzauber: +35 Magischen Widerstand."]
                },
                rank5: {
                    values: { sequenceResistanceGain: 25 },
                    tooltip: ["Nach einem Schutzzauber erhältst du zusätzlich 25 Magischen Widerstand."]
                }
            },
            b: {
                label: "Runenexplosion",
                rank3: {
                    values: { damage: 25 },
                    effects: ["deal_damage"],
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { resistanceBonusDamagePercent: 50 },
                    tooltip: ["Schaden erhöht sich um 50 % deines Magischen Widerstands."]
                }
            }
        }
    },
    amplified_seal: {
        rank2: {
            values: { playerResistanceFlatIncrease: 20 },
            tooltip: ["Erhöhe deinen Magischen Widerstand zusätzlich um 20."]
        },
        rank4: {
            values: { playerResistanceFlatIncrease: 60 },
            tooltip: ["Erhöhe deinen Magischen Widerstand zusätzlich um 60."]
        },
        paths: {
            a: {
                label: "Bollwerk",
                rank3: {
                    values: { playerResistanceFlatIncrease: 40 },
                    tooltip: ["Erhöhe deinen Magischen Widerstand zusätzlich um 40."]
                },
                rank5: {
                    values: { postCastResistanceGain: 30 },
                    tooltip: ["Erhalte zusätzlich 30 Magischen Widerstand."]
                }
            },
            b: {
                label: "Runenstoß",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { resistanceBonusDamagePercent: 75 },
                    tooltip: ["Schaden erhöht sich zusätzlich um 75 % deines Magischen Widerstands."]
                }
            }
        }
    },
    fracture_rune: {
        rank2: {
            values: { damage: 35 },
            tooltip: ["Verursacht 35 Schaden."]
        },
        rank4: {
            values: { damage: 45 },
            tooltip: ["Verursacht 45 Schaden."]
        },
        paths: {
            a: {
                label: "Tiefer Bruch",
                rank3: {
                    values: { vulnerableBonusDamage: 25 },
                    tooltip: ["Gegen verwundbare Ziele: +25 Schaden."]
                },
                rank5: {
                    values: { vulnerableRepeatHits: 2 },
                    tooltip: ["Gegen verwundbare Ziele trifft Bruchrune zweimal."]
                }
            },
            b: {
                label: "Schützender Bruch",
                rank3: {
                    values: { applyVulnerableResistanceGain: 20 },
                    tooltip: ["Erhalte beim Zufügen von Verwundbar 20 Magischen Widerstand."]
                },
                rank5: {
                    values: {
                        nextSpellDamageBonus: 20,
                        nextSpellPrepTrigger: "on_apply_vulnerable"
                    },
                    tooltip: ["Beim Zufügen von Verwundbar: Der nächste Zauber erhält +20 Schaden."]
                }
            }
        }
    },
    soul_bind: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Mächtige Bindung",
                rank3: {
                    values: { resistanceFromDealtDamagePercent: 75 },
                    tooltip: ["Erhalte Magischen Widerstand in Höhe von 75 % des verursachten Schadens."]
                },
                rank5: {
                    values: { postCastResistanceGain: 20 },
                    tooltip: ["Erhalte zusätzlich 20 Magischen Widerstand."]
                }
            },
            b: {
                label: "Essenzschub",
                rank3: {
                    values: { nextSpellDamageBonus: 25 },
                    tooltip: ["Der nächste Zauber erhält +25 Schaden."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 25 },
                    tooltip: ["Der nächste Zauber erhält +25 % Kritchance."]
                }
            }
        }
    },
    soul_cut: {
        rank2: {
            values: { resistanceBonusDamagePercent: 65 },
            tooltip: ["Skaliert mit 65 % deines Magischen Widerstands."]
        },
        rank4: {
            values: { resistanceBonusDamagePercent: 100 },
            tooltip: ["Skaliert mit 100 % deines Magischen Widerstands."]
        },
        paths: {
            a: {
                label: "Seelenzerreißer",
                rank3: {
                    values: { resistanceBonusDamagePercent: 90 },
                    tooltip: ["Skaliert mit 90 % deines Magischen Widerstands."]
                },
                // Rang 5 bewusst ohne Zusatzeffekt gelassen: shieldConsumePercent
                // war schon vor der Migration wirkungslos (soul_cut nutzt
                // "deal_damage", nie "deal_shield_damage" -- die einzige Stelle,
                // die shieldConsumePercent ausliest). Selbst wenn erreichbar,
                // ergibt "verbrauche nur X%" unter permanentem, nie konsumiertem
                // Widerstand ohnehin keinen Sinn mehr. Nicht eigenmaechtig durch
                // einen erfundenen Ersatzwert geschlossen.
            },
            b: {
                label: "Geöffnete Seele",
                rank3: {
                    values: {},
                    effects: ["apply_vulnerable"],
                    tooltip: ["Fügt zusätzlich Verwundbar zu."]
                },
                rank5: {
                    values: { vulnerableGuaranteedCrit: true },
                    tooltip: ["Gegen verwundbare Ziele: Garantierter Krit."]
                }
            }
        }
    },
    chaos_eruption: {
        rank2: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        rank4: {
            values: { damage: 65 },
            tooltip: ["Verursacht 65 Schaden."]
        },
        paths: {
            a: {
                label: "Entfesseltes Chaos",
                rank3: {
                    values: { vulnerableBonusDamage: 25 },
                    tooltip: ["Gegen verwundbare Ziele: +25 Schaden."]
                },
                rank5: {
                    values: { vulnerableBonusDamage: 50 },
                    tooltip: ["Gegen verwundbare Ziele: +50 Schaden."]
                }
            },
            b: {
                label: "Chaotischer Funke",
                rank3: {
                    values: { nextSpellIgnoresShield: true },
                    tooltip: ["Der nächste Zauber ignoriert ebenfalls gegnerischen Schild und Magischen Widerstand."]
                },
                rank5: {
                    values: { nextSpellPrepCharges: 2 },
                    tooltip: ["Gilt für die nächsten 2 Zauber statt nur einen."]
                }
            }
        }
    },
    anatomy: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Chirurgische Präzision",
                rank3: {
                    values: { critFlatBonus: 25 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +25 Schaden."]
                },
                rank5: {
                    values: { vulnerableBonusWithoutStatus: true },
                    tooltip: ["Kritische Treffer verursachen Verwundbar-Bonus, auch ohne Verwundbar."]
                }
            },
            b: {
                label: "Freigelegte Schwäche",
                rank3: {
                    values: { critResistanceGain: 20 },
                    tooltip: ["Kritische Treffer erzeugen 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { critResistanceGain: 40 },
                    tooltip: ["Kritische Treffer erzeugen 40 Magischen Widerstand."]
                }
            }
        }
    },
    bone_armor: {
        rank2: {
            values: { resistance: 30 },
            tooltip: ["Erhalte 30 Magischen Widerstand."]
        },
        rank4: {
            values: { resistance: 45 },
            tooltip: ["Erhalte 45 Magischen Widerstand."]
        },
        paths: {
            a: {
                label: "Verdichtete Knochen",
                rank3: {
                    // Hinweis: schon vor der Migration wirkungslos (fehlender
                    // "increase_shield_percent"/"increase_resistance" Eintrag in
                    // effects[], gleiche vorbestehende Inkonsistenz wie shield_wall
                    // Pfad A Rang 3). 1:1 uebernommen, nicht repariert.
                    values: { playerResistanceFlatIncrease: 20 },
                    tooltip: ["Erhalte zusätzlich 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { resistanceGainIfPlayerHasResistance: 30 },
                    tooltip: ["Besitzt du bereits Widerstand: Erhalte zusätzlich 30 Magischen Widerstand."]
                }
            },
            b: {
                label: "Splitterpanzer",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { resistanceBonusDamagePercent: 50 },
                    tooltip: ["Schaden erhöht sich zusätzlich um 50 % deines Magischen Widerstands."]
                }
            }
        }
    },
    shadow_mantle: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Mantel der Finsternis",
                rank3: {
                    values: { critShieldGain: 35 },
                    tooltip: ["Bei kritischem Treffer: Erhalte 35 Schild."]
                },
                rank5: {
                    values: { critShieldMultiplier: 2 },
                    tooltip: ["Der erhaltene Schild verdoppelt sich."]
                }
            },
            b: {
                label: "Lautloser Jäger",
                rank3: {
                    values: { critAppliesVulnerable: true },
                    tooltip: ["Kritische Treffer fügen zusätzlich Verwundbar zu."]
                },
                rank5: {
                    values: { vulnerableGuaranteedCrit: true },
                    tooltip: ["Gegen verwundbare Ziele: Garantierter Krit."]
                }
            }
        }
    },
    dark_blow: {
        rank2: {
            values: { damage: 45 },
            tooltip: ["Verursacht 45 Schaden."]
        },
        rank4: {
            values: { damage: 55 },
            tooltip: ["Verursacht 55 Schaden."]
        },
        paths: {
            a: {
                label: "Tödliche Präzision",
                rank3: {
                    values: { critFlatBonus: 55 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +35 Schaden."]
                },
                rank5: {
                    values: { critFollowUpPercent: 50 },
                    tooltip: ["Kritische Treffer treffen zweimal mit 50 % Schaden."]
                }
            },
            b: {
                label: "Schattenenergie",
                rank3: {
                    values: { critShieldGain: 20 },
                    tooltip: ["Kritische Treffer erzeugen 20 Schild."]
                },
                rank5: {
                    values: { critAppliesVulnerable: true },
                    tooltip: ["Kritische Treffer fügen zusätzlich Verwundbar zu."]
                }
            }
        }
    },
    mind_trap: {
        rank2: {
            values: { damage: 35 },
            tooltip: ["Verursacht 35 Schaden."]
        },
        rank4: {
            values: { damage: 45 },
            tooltip: ["Verursacht 45 Schaden."]
        },
        paths: {
            a: {
                label: "Geistfessel",
                rank3: {
                    values: { sequenceTrigger: "different_school", sequenceDamageBonus: 30 },
                    tooltip: ["Nach anderer Schule: +30 Schaden."]
                },
                rank5: {
                    values: { sequenceGuaranteedCrit: true },
                    tooltip: ["Nach anderer Schule: Garantierter Krit."]
                }
            },
            b: {
                label: "Gedankennetz",
                rank3: {
                    // Hinweis: schon vor der Migration wirkungslos -- mind_trap
                    // hat "gain_shield" (jetzt "gain_resistance") nie in seiner
                    // effects[]-Liste, daher wurde dieser Wert nie ausgewertet.
                    // 1:1 als ebenso wirkungsloser Wert uebernommen, nicht
                    // repariert.
                    values: { sequenceResistanceGain: 20 },
                    tooltip: ["Nach anderer Schule: Erhalte 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { sequenceRepeatAppliesVulnerable: true },
                    tooltip: ["Nach anderer Schule: Fügt zusätzlich Verwundbar zu."]
                }
            }
        }
    },
    mind_redirect: {
        rank2: {
            values: { damage: 30 },
            tooltip: ["Verursacht 30 Schaden."]
        },
        rank4: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        paths: {
            a: {
                label: "Totale Kontrolle",
                rank3: {
                    values: { nextSpellCritChanceBonus: 40 },
                    tooltip: ["Der nächste Zauber erhält +40 % Kritchance."]
                },
                rank5: {
                    values: { nextSpellCritDamageBonus: 35 },
                    tooltip: ["Der nächste kritische Treffer verursacht zusätzlich +35 Schaden."]
                }
            },
            b: {
                label: "Mentaler Schub",
                rank3: {
                    values: { nextSpellDamageBonus: 30 },
                    tooltip: ["Der nächste Zauber erhält +30 Schaden."]
                },
                rank5: {
                    values: { nextSpellAppliesVulnerable: true },
                    tooltip: ["Der nächste Zauber fügt zusätzlich Verwundbar zu."]
                }
            }
        }
    },
    rune_break: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Zersplitternde Rune",
                rank3: {
                    values: { vulnerableBonusDamage: 30 },
                    tooltip: ["Gegen verwundbare Ziele: +30 Schaden."]
                },
                rank5: {
                    values: { vulnerableRepeatHits: 2 },
                    tooltip: ["Gegen verwundbare Ziele trifft Runenbruch zweimal."]
                }
            },
            b: {
                label: "Schutzrune",
                rank3: {
                    values: { applyVulnerableResistanceGain: 20 },
                    tooltip: ["Erhalte beim Zufügen von Verwundbar 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { nextSpellDamageBonus: 25 },
                    tooltip: ["Beim Zufügen von Verwundbar: Der nächste Zauber erhält +25 Schaden."]
                }
            }
        }
    },
    rune_thrust: {
        rank2: {
            values: { damage: 45, resistance: 25 },
            tooltip: [
                "Verursacht 45 Schaden.",
                "Erhalte 25 Magischen Widerstand."
            ]
        },
        rank4: {
            values: { damage: 55 },
            tooltip: ["Verursacht 55 Schaden."]
        },
        paths: {
            a: {
                label: "Mächtiger Stoß",
                rank3: {
                    values: { damage: 65 },
                    tooltip: ["Verursacht zusätzlich +20 Schaden."]
                },
                rank4: {
                    values: { damage: 75 },
                    tooltip: ["Verursacht 75 Schaden."]
                },
                rank5: {
                    values: { critFlatBonus: 40 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +40 Schaden."]
                }
            },
            b: {
                label: "Schutzstoß",
                rank3: {
                    values: { resistance: 45 },
                    tooltip: ["Erhalte zusätzlich 20 Magischen Widerstand."]
                },
                rank5: {
                    values: { critResistanceGain: 25 },
                    tooltip: ["Kritische Treffer gewähren zusätzlich 25 Magischen Widerstand."]
                }
            }
        }
    },
    chaos_blade: {
        rank2: {
            values: { damage: 55 },
            tooltip: ["Verursacht 55 Schaden."]
        },
        rank4: {
            values: { damage: 65 },
            tooltip: ["Verursacht 65 Schaden."]
        },
        paths: {
            a: {
                label: "Entfesselte Klinge",
                rank3: {
                    values: { damage: 80 },
                    tooltip: ["Verursacht zusätzlich +25 Schaden."]
                },
                rank4: {
                    values: { damage: 90 },
                    tooltip: ["Verursacht 90 Schaden."]
                },
                rank5: {
                    values: { critFlatBonus: 50 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +50 Schaden."]
                }
            },
            b: {
                label: "Instabile Schneide",
                rank3: {
                    values: {},
                    effects: ["apply_vulnerable"],
                    tooltip: ["Fügt zusätzlich Verwundbar zu."]
                },
                rank5: {
                    values: { vulnerableGuaranteedCrit: true },
                    tooltip: ["Gegen verwundbare Ziele: Garantierter Krit."]
                }
            }
        }
    },
    chaos_catalyst: {
        rank2: {
            values: { damage: 35 },
            tooltip: ["Verursacht 35 Schaden."]
        },
        rank4: {
            values: { damage: 45 },
            tooltip: ["Verursacht 45 Schaden."]
        },
        paths: {
            a: {
                label: "Chaosresonanz",
                rank3: {
                    values: { resistanceBonusDamagePercent: 75 },
                    tooltip: ["Schaden erhöht sich auf 75 % deines Magischen Widerstands."]
                },
                rank5: {
                    // Hinweis: der alte Tooltip betonte "ohne Schild zu
                    // verbrauchen" als Rang-5-Alleinstellungsmerkmal -- unter
                    // Magischem Widerstand (grundsaetzlich nie konsumiert)
                    // gilt das jetzt schon ab Rang 1, nicht erst hier. Tooltip
                    // entsprechend angepasst, reine Textkorrektur, kein
                    // Balance-Eingriff.
                    values: { resistanceBonusDamagePercent: 100 },
                    tooltip: ["Schaden erhöht sich auf 100 % deines Magischen Widerstands."]
                }
            },
            b: {
                label: "Instabile Resonanz",
                rank3: {
                    values: {},
                    effects: ["apply_vulnerable"],
                    tooltip: ["Fügt zusätzlich Verwundbar zu."]
                },
                rank5: {
                    values: { vulnerableGuaranteedCrit: true },
                    tooltip: ["Gegen verwundbare Ziele: Garantierter Krit."]
                }
            }
        }
    },
    entropy: {
        rank2: {
            values: { damage: 34 },
            tooltip: ["Verursacht 34 Schaden.", "Erhalte 10 Magischen Widerstand."]
        },
        rank4: {
            values: { damage: 42 },
            tooltip: ["Verursacht 42 Schaden."]
        },
        paths: {
            a: {
                label: "Verdichtung",
                rank3: {
                    values: { resistance: 20 },
                    tooltip: ["Widerstandsgewinn steigt auf 20."]
                },
                rank5: {
                    values: { resistance: 34 },
                    tooltip: ["Widerstandsgewinn steigt auf 34."]
                }
            },
            b: {
                label: "Implosion",
                rank3: {
                    values: { critFlatBonus: 20 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +20 Schaden."]
                },
                rank5: {
                    values: { critFlatBonus: 40 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +40 Schaden."]
                }
            }
        }
    },
    overload: {
        rank2: {
            values: { damage: 20 },
            tooltip: [
                "Verursacht 20 Schaden.",
                "Erzeugt 12 Magischen Widerstand und verursacht zusätzlichen Schaden in Höhe von 100 % deines Widerstands."
            ]
        },
        rank4: {
            values: { damage: 28 },
            tooltip: ["Verursacht 28 Schaden."]
        },
        paths: {
            a: {
                label: "Vollentladung",
                rank3: {
                    values: { resistanceBonusDamagePercent: 130, resistance: 15 },
                    tooltip: ["Widerstandsschaden: 130 % des Widerstands.", "Widerstandsgewinn: 15."]
                },
                rank5: {
                    values: { resistanceBonusDamagePercent: 160, resistance: 18 },
                    tooltip: ["Widerstandsschaden: 160 % des Widerstands.", "Widerstandsgewinn: 18."]
                }
            },
            b: {
                label: "Stoßwelle",
                rank3: {
                    values: { damage: 38 },
                    tooltip: ["Fixschaden: 38."]
                },
                rank4: {
                    values: { damage: 48 },
                    tooltip: ["Fixschaden: 48."]
                },
                rank5: {
                    values: { damage: 60 },
                    tooltip: ["Fixschaden: 60."]
                }
            }
        }
    },
    soul_pulse: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Mächtiger Impuls",
                rank3: {
                    values: { vulnerableResistanceGain: 35 },
                    tooltip: ["Gegen verwundbare Ziele: Erhalte 35 Magischen Widerstand."]
                },
                rank5: {
                    values: { vulnerableResistanceMultiplier: 2 },
                    tooltip: ["Gegen verwundbare Ziele verdoppelt sich der erhaltene Magische Widerstand."]
                }
            },
            b: {
                label: "Essenzschub",
                rank3: {
                    values: { nextSpellDamageBonus: 25 },
                    tooltip: ["Der nächste Zauber erhält +25 Schaden."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 25 },
                    tooltip: ["Trifft ein verwundbares Ziel: Der nächste Zauber erhält +25 % Kritchance."]
                }
            }
        }
    },
    soul_spark: {
        rank2: {
            values: { damage: 40 },
            tooltip: ["Verursacht 40 Schaden."]
        },
        rank4: {
            values: { damage: 50 },
            tooltip: ["Verursacht 50 Schaden."]
        },
        paths: {
            a: {
                label: "Entfachte Seele",
                rank3: {
                    values: { nextSpellPrepCharges: 2 },
                    tooltip: ["Die Präzision gilt für die nächsten 2 Zauber statt nur einen."]
                },
                rank5: {
                    values: { nextSpellCritDamageBonus: 35 },
                    tooltip: ["Der garantierte kritische Treffer verursacht zusätzlichen Schaden."]
                }
            },
            b: {
                label: "Seelenlicht",
                rank3: {
                    values: { vulnerableResistanceGain: 25 },
                    tooltip: ["Gegen verwundbare Ziele: Erhalte 25 Magischen Widerstand."]
                },
                rank5: {
                    values: { nextSpellDamageBonus: 30 },
                    tooltip: ["Der nächste Zauber erhält zusätzlich +30 Schaden."]
                }
            }
        }
    },
    soul_ward: {
        rank2: {
            values: { damage: 34 },
            tooltip: ["Verursacht 34 Schaden.", "Bei kritischem Treffer: Erhalte 20 Magischen Widerstand."]
        },
        rank4: {
            values: { damage: 42 },
            tooltip: ["Verursacht 42 Schaden."]
        },
        paths: {
            a: {
                label: "Wachsame Seele",
                rank3: {
                    values: { critResistanceGain: 30 },
                    tooltip: ["Widerstandsgewinn bei Krit: 30."]
                },
                rank5: {
                    values: { critResistanceMultiplier: 2 },
                    tooltip: ["Der erhaltene Magische Widerstand bei Krit verdoppelt sich."]
                }
            },
            b: {
                label: "Gebundener Schutz",
                rank3: {
                    values: { sequenceTrigger: "after_protection", sequenceDamageBonus: 25 },
                    tooltip: ["Nach einem Schutz-Zauber: +25 Schaden."]
                },
                rank5: {
                    values: { sequenceDamageBonus: 45 },
                    tooltip: ["Nach einem Schutz-Zauber: +45 Schaden."]
                }
            }
        }
    }
};
