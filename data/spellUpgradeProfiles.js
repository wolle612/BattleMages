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
                    values: { applyVulnerableShieldGain: 15 },
                    tooltip: ["Erhalte 15 Schild, wenn dieser Zauber Verwundbar zufügt."]
                },
                rank5: {
                    values: { applyVulnerableShieldGain: 30, vulnerableBonusDamage: 10 },
                    tooltip: [
                        "Erhalte 30 Schild statt 15.",
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
                    values: { vulnerableShieldGain: 15 },
                    tooltip: [
                        "Gegen verwundbare Ziele: Fügt erneut Verwundbar zu.",
                        "Erhalte 15 Schild."
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
            values: { shield: 38 },
            tooltip: ["Erhalte 38 Schild."]
        },
        rank4: {
            values: { shield: 50 },
            tooltip: ["Erhalte 50 Schild."]
        },
        paths: {
            a: {
                label: "Verstärkte Rune",
                rank3: {
                    values: { playerShieldFlatIncrease: 15 },
                    tooltip: ["Erhalte zusätzlich 15 Schild."]
                },
                rank5: {
                    values: { shieldGainIfPlayerShielded: 25 },
                    tooltip: ["Besitzt du bereits Schild: Erhalte zusätzlich 25 Schild."]
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
                    values: { shieldBonusDamagePercent: 50 },
                    tooltip: ["Verursacht zusätzlich Schaden in Höhe von 50 % deines Schildes."]
                }
            }
        }
    },
    shield_breaker: {
        rank2: {
            values: { shieldBonusDamagePercent: 60 },
            tooltip: ["Schaden skaliert mit 60 % deines Schildes."]
        },
        rank4: {
            values: { shieldBonusDamagePercent: 75 },
            tooltip: ["Schaden skaliert mit 75 % deines Schildes."]
        },
        paths: {
            a: {
                label: "Vernichtung",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Schaden erhöht sich zusätzlich um +25."]
                },
                rank5: {
                    values: { shieldBonusDamageCritMultiplier: 2 },
                    tooltip: ["Kritische Treffer verdoppeln den zusätzlichen Schildschaden."]
                }
            },
            b: {
                label: "Kontrollierter Einschlag",
                rank3: {
                    values: { shieldConsumePercent: 75 },
                    tooltip: ["Verbraucht nur 75 % deines Schildes."]
                },
                rank5: {
                    values: { postCastShieldGain: 25 },
                    tooltip: ["Nach dem Angriff erhältst du 25 Schild zurück."]
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
            values: { damage: 45, critShieldGain: 25 },
            tooltip: [
                "Verursacht 45 Schaden.",
                "Kritische Treffer gewähren 25 Schild."
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
                    values: { critShieldGain: 40 },
                    tooltip: ["Kritische Treffer gewähren 40 Schild."]
                },
                rank5: {
                    values: { critShieldMultiplier: 2 },
                    tooltip: ["Kritische Treffer verdoppeln den erhaltenen Schild."]
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
                        "Kritische Treffer erzeugen Schild.",
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
                    values: { postCastShieldGain: 25 },
                    tooltip: ["Erhalte nach dem Treffer 25 Schild."]
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
                    values: { vulnerableShieldGain: 20 },
                    tooltip: ["Gegen verwundbare Ziele: Erhalte 20 Schild."]
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
                    values: { critFlatBonus: 30 },
                    tooltip: ["Kritische Treffer verursachen +30 Schaden."]
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
                    tooltip: ["Der nächste Zauber erhält +20 Schaden."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 25 },
                    tooltip: ["Der nächste Zauber erhält +25 % Kritchance."]
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
            values: { shield: 30 },
            tooltip: ["Erhalte 30 Schild."]
        },
        rank4: {
            values: { shield: 45 },
            tooltip: ["Erhalte 45 Schild."]
        },
        paths: {
            a: {
                label: "Eiserner Wille",
                rank3: {
                    values: { playerShieldFlatIncrease: 20 },
                    tooltip: ["Erhalte zusätzlich 20 Schild."]
                },
                rank5: {
                    values: { shieldGainIfPlayerShielded: 30 },
                    tooltip: ["Besitzt du bereits Schild: Erhalte zusätzlich 30 Schild."]
                }
            },
            b: {
                label: "Psychischer Rückstoß",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { shieldBonusDamagePercent: 50 },
                    tooltip: ["Schaden erhöht sich um 50 % deines Schildes."]
                }
            }
        }
    },
    forbidden_seal: {
        rank2: {
            values: { shield: 35 },
            tooltip: ["Erhalte 35 Schild."]
        },
        rank4: {
            values: { shield: 50 },
            tooltip: ["Erhalte 50 Schild."]
        },
        paths: {
            a: {
                label: "Dreifaches Siegel",
                rank3: {
                    values: { sequenceShieldBonus: 35 },
                    tooltip: ["Nach Schutzzauber: +35 Schild."]
                },
                rank5: {
                    values: { sequenceShieldGain: 25 },
                    tooltip: ["Nach einem Schutzzauber erhältst du zusätzlich 25 Schild."]
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
                    values: { shieldBonusDamagePercent: 50 },
                    tooltip: ["Schaden erhöht sich um 50 % deines Schildes."]
                }
            }
        }
    },
    amplified_seal: {
        rank2: {
            values: { playerShieldFlatIncrease: 20 },
            tooltip: ["Erhöhe deinen Schild zusätzlich um 20."]
        },
        rank4: {
            values: { playerShieldFlatIncrease: 60 },
            tooltip: ["Erhöhe deinen Schild zusätzlich um 60."]
        },
        paths: {
            a: {
                label: "Bollwerk",
                rank3: {
                    values: { playerShieldFlatIncrease: 40 },
                    tooltip: ["Erhöhe deinen Schild zusätzlich um 40."]
                },
                rank5: {
                    values: { postCastShieldGain: 30 },
                    tooltip: ["Erhalte zusätzlich 30 Schild."]
                }
            },
            b: {
                label: "Runenstoß",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { shieldBonusDamagePercent: 75 },
                    tooltip: ["Schaden erhöht sich zusätzlich um 75 % deines Schildes."]
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
                    values: { applyVulnerableShieldGain: 20 },
                    tooltip: ["Erhalte beim Zufügen von Verwundbar 20 Schild."]
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
                    values: { shieldFromDealtDamagePercent: 75 },
                    tooltip: ["Erhalte Schild in Höhe von 75 % des verursachten Schadens."]
                },
                rank5: {
                    values: { postCastShieldGain: 20 },
                    tooltip: ["Erhalte zusätzlich 20 Schild."]
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
            values: { shieldBonusDamagePercent: 65 },
            tooltip: ["Skaliert mit 65 % deines Schildes."]
        },
        rank4: {
            values: { shieldBonusDamagePercent: 100 },
            tooltip: ["Skaliert mit 100 % deines Schildes."]
        },
        paths: {
            a: {
                label: "Seelenzerreißer",
                rank3: {
                    values: { shieldBonusDamagePercent: 90 },
                    tooltip: ["Skaliert mit 90 % deines Schildes."]
                },
                rank5: {
                    values: { shieldConsumePercent: 75 },
                    tooltip: ["Verbraucht nur 75 % deines Schildes."]
                }
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
            values: { randomDamageMin: 45, randomDamageMax: 70 },
            tooltip: ["Verursacht 45–70 Schaden."]
        },
        rank4: {
            values: { randomDamageMin: 60, randomDamageMax: 100 },
            tooltip: ["Verursacht 60–100 Schaden."]
        },
        paths: {
            a: {
                label: "Entfesseltes Chaos",
                rank3: {
                    values: { randomDamageMax: 90 },
                    tooltip: ["Maximaler Schaden: 90."]
                },
                rank5: {
                    values: { applyVulnerableOnMaxRandomDamage: true },
                    tooltip: ["Bei maximalem Schaden: Fügt zusätzlich Verwundbar zu."]
                }
            },
            b: {
                label: "Chaotischer Funke",
                rank3: {
                    values: { nextSpellRandomPrep: { damageBonus: 25, critChanceBonus: 25 } },
                    tooltip: [
                        "Der nächste Zauber erhält zufällig:",
                        "+25 Schaden oder +25 % Kritchance."
                    ]
                },
                rank5: {
                    values: { nextSpellRandomPrep: { damageBonus: 25, critChanceBonus: 25, shieldBonus: 20 } },
                    tooltip: ["Der zufällige Bonus kann zusätzlich 20 Schild gewähren."]
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
                    values: { critShieldGain: 20 },
                    tooltip: ["Kritische Treffer erzeugen 20 Schild."]
                },
                rank5: {
                    values: { critShieldGain: 40 },
                    tooltip: ["Kritische Treffer erzeugen 40 Schild."]
                }
            }
        }
    },
    bone_armor: {
        rank2: {
            values: { shield: 30 },
            tooltip: ["Erhalte 30 Schild."]
        },
        rank4: {
            values: { shield: 45 },
            tooltip: ["Erhalte 45 Schild."]
        },
        paths: {
            a: {
                label: "Verdichtete Knochen",
                rank3: {
                    values: { playerShieldFlatIncrease: 20 },
                    tooltip: ["Erhalte zusätzlich 20 Schild."]
                },
                rank5: {
                    values: { shieldGainIfPlayerShielded: 30 },
                    tooltip: ["Besitzt du bereits Schild: Erhalte zusätzlich 30 Schild."]
                }
            },
            b: {
                label: "Splitterpanzer",
                rank3: {
                    values: { damage: 25 },
                    tooltip: ["Verursacht zusätzlich 25 Schaden."]
                },
                rank5: {
                    values: { shieldBonusDamagePercent: 50 },
                    tooltip: ["Schaden erhöht sich zusätzlich um 50 % deines Schildes."]
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
                    values: { sequenceShieldGain: 20 },
                    tooltip: ["Nach anderer Schule: Erhalte 20 Schild."]
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
                    values: { applyVulnerableShieldGain: 20 },
                    tooltip: ["Erhalte beim Zufügen von Verwundbar 20 Schild."]
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
            values: { damage: 45, shield: 25 },
            tooltip: [
                "Verursacht 45 Schaden.",
                "Erhalte 25 Schild."
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
                    values: { shield: 45 },
                    tooltip: ["Erhalte zusätzlich 20 Schild."]
                },
                rank5: {
                    values: { critShieldGain: 25 },
                    tooltip: ["Kritische Treffer gewähren zusätzlich 25 Schild."]
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
                    values: { shieldBonusDamagePercent: 75 },
                    tooltip: ["Schaden erhöht sich auf 75 % deines Schildes."]
                },
                rank5: {
                    values: { shieldBonusDamagePercent: 100 },
                    tooltip: ["Schaden erhöht sich auf 100 % deines Schildes, ohne Schild zu verbrauchen."]
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
            tooltip: ["Verursacht 34 Schaden.", "Erhalte 10 Schild."]
        },
        rank4: {
            values: { damage: 42 },
            tooltip: ["Verursacht 42 Schaden."]
        },
        paths: {
            a: {
                label: "Verdichtung",
                rank3: {
                    values: { shield: 20 },
                    tooltip: ["Schildgewinn steigt auf 20."]
                },
                rank5: {
                    values: { shield: 34 },
                    tooltip: ["Schildgewinn steigt auf 34."]
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
                "Erzeugt 12 Schild und entlädt deinen gesamten Schild sofort als zusätzlichen Schaden."
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
                    values: { shieldBonusDamagePercent: 130, shield: 15 },
                    tooltip: ["Schildschaden: 130 % des Schildes.", "Schildgewinn: 15."]
                },
                rank5: {
                    values: { shieldBonusDamagePercent: 160, shield: 18 },
                    tooltip: ["Schildschaden: 160 % des Schildes.", "Schildgewinn: 18."]
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
                    values: { vulnerableShieldGain: 35 },
                    tooltip: ["Gegen verwundbare Ziele: Erhalte 35 Schild."]
                },
                rank5: {
                    values: { vulnerableShieldMultiplier: 2 },
                    tooltip: ["Gegen verwundbare Ziele verdoppelt sich der erhaltene Schild."]
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
                    values: { vulnerableCritChanceBonus: 50 },
                    tooltip: ["Gegen verwundbare Ziele: +50 % Kritchance."]
                },
                rank5: {
                    values: { critFlatBonus: 40 },
                    tooltip: ["Kritische Treffer verursachen zusätzlich +40 Schaden."]
                }
            },
            b: {
                label: "Seelenlicht",
                rank3: {
                    values: { vulnerableShieldGain: 25 },
                    tooltip: ["Gegen verwundbare Ziele: Erhalte 25 Schild."]
                },
                rank5: {
                    values: { nextSpellCritChanceBonus: 30 },
                    tooltip: ["Trifft ein verwundbares Ziel: Der nächste Zauber erhält +30 % Kritchance."]
                }
            }
        }
    },
    soul_ward: {
        rank2: {
            values: { damage: 34 },
            tooltip: ["Verursacht 34 Schaden.", "Bei kritischem Treffer: Erhalte 20 Schild."]
        },
        rank4: {
            values: { damage: 42 },
            tooltip: ["Verursacht 42 Schaden."]
        },
        paths: {
            a: {
                label: "Wachsame Seele",
                rank3: {
                    values: { critShieldGain: 30 },
                    tooltip: ["Schildgewinn bei Krit: 30."]
                },
                rank5: {
                    values: { critShieldMultiplier: 2 },
                    tooltip: ["Der erhaltene Schild bei Krit verdoppelt sich."]
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
