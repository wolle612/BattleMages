const rawSpellDefinitions = [
    {
        id: "blood_strike",
        school: "blood",
        name: "Blutschlag",
        type: "Attack",
        tags: ["Attack", "Sacrifice"],
        starter: true,
        cooldown: 0,
        upgrades: [
            { rank: 1, values: { damage: 10, missingLifeBonusMax: 5 } },
            { rank: 2, values: { damage: 12, missingLifeBonusMax: 5 } },
            { rank: 3, values: { damage: 12, missingLifeBonusMax: 8 } },
            { rank: 4, values: { damage: 14, missingLifeBonusMax: 8 } },
            { rank: 5, values: { damage: 14, missingLifeBonusMax: 10 } }
        ]
    },
    {
        id: "blood_lance",
        school: "blood",
        name: "Blutlanze",
        type: "Attack",
        tags: ["Sacrifice", "Burst"],
        starter: true,
        cooldown: 0,
        upgrades: [
            { rank: 1, values: { hpCostPercent: 5, damage: 18 } },
            { rank: 2, values: { hpCostPercent: 5, damage: 22 } },
            { rank: 3, values: { hpCostPercent: 4, damage: 22 } },
            { rank: 4, values: { hpCostPercent: 4, damage: 26 } },
            { rank: 5, values: { hpCostPercent: 4, damage: 26, refundSacrificeOnKill: true } }
        ]
    },
    {
        id: "blood_wall",
        school: "blood",
        name: "Blutwall",
        type: "Protection",
        tags: ["Protection", "Preparation"],
        starter: true,
        cooldown: 0,
        upgrades: [
            { rank: 1, values: { shield: 18, nextBloodDamageBonus: 4, nextBloodBonusCharges: 1 } },
            { rank: 2, values: { shield: 24, nextBloodDamageBonus: 4, nextBloodBonusCharges: 1 } },
            { rank: 3, values: { shield: 24, nextBloodDamageBonus: 8, nextBloodBonusCharges: 1 } },
            { rank: 4, values: { shield: 30, nextBloodDamageBonus: 8, nextBloodBonusCharges: 1 } },
            { rank: 5, values: { shield: 30, nextBloodDamageBonus: 8, nextBloodBonusCharges: 2 } }
        ]
    },
    {
        id: "blood_pact",
        school: "blood",
        name: "Blutpakt",
        type: "Status",
        tags: ["Preparation"],
        cooldown: 0,
        upgrades: [
            { rank: 1, values: { pactCharges: 2, damagePerSacrificedHp: 2 } },
            { rank: 2, values: { pactCharges: 3, damagePerSacrificedHp: 2 } },
            { rank: 3, values: { pactCharges: 3, damagePerSacrificedHp: 3 } },
            { rank: 4, values: { pactCharges: 4, damagePerSacrificedHp: 3 } },
            { rank: 5, values: { pactCharges: 4, damagePerSacrificedHp: 3, healSacrificePercentOnExpire: 25 } }
        ]
    },
    {
        id: "blood_frenzy",
        school: "blood",
        name: "Blutrausch",
        type: "Status",
        tags: ["Manipulation"],
        cooldown: 0,
        upgrades: [
            { rank: 1, values: { frenzyThresholdPercent: 50, frenzyDamageBonus: 6 } },
            { rank: 2, values: { frenzyThresholdPercent: 50, frenzyDamageBonus: 8 } },
            { rank: 3, values: { frenzyThresholdPercent: 60, frenzyDamageBonus: 8 } },
            { rank: 4, values: { frenzyThresholdPercent: 60, frenzyDamageBonus: 10 } },
            { rank: 5, values: { frenzyThresholdPercent: 60, frenzyDamageBonus: 10, frenzyShieldPerBloodSpell: 10 } }
        ]
    },
    {
        id: "blood_moon",
        school: "blood",
        name: "Blutmond",
        type: "Attack",
        tags: ["Burst"],
        isSignature: true,
        cooldown: 1,
        upgrades: [
            { rank: 1, values: { damage: 34, damagePerMissingLifePercent: 0.5 } },
            { rank: 2, values: { damage: 40, damagePerMissingLifePercent: 0.5 } },
            { rank: 3, values: { damage: 40, damagePerMissingLifePercent: 0.5, activateBloodFrenzy: true } },
            { rank: 4, values: { damage: 46, damagePerMissingLifePercent: 0.5, activateBloodFrenzy: true } },
            { rank: 5, values: { damage: 46, damagePerMissingLifePercent: 0.5, activateBloodFrenzy: true, ignoreShield: true } }
        ]
    },
    {
        id: "shadow_strike",
        school: "shadow",
        name: "Schattenstoß",
        description: "Direkter Angriff. Verursacht zusätzlichen Schaden gegen Gegner mit negativen Effekten.",
        rarity: "Common",
        type: "Attack",
        tags: ["Attack", "Manipulation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 10, negativeEffectDamageBonus: 4 } },
            { rank: 2, values: { damage: 12, negativeEffectDamageBonus: 4 } },
            { rank: 3, values: { damage: 12, negativeEffectDamageBonus: 8 } },
            { rank: 4, values: { damage: 14, negativeEffectDamageBonus: 8 } },
            { rank: 5, values: { damage: 14, negativeEffectDamageBonus: 8, negativeEffectShieldPierce: 8 } }
        ]
    },
    {
        id: "corrupted_wound",
        school: "shadow",
        name: "Verdorbene Wunde",
        description: "Verursacht Schaden und fügt Wunde zu.",
        rarity: "Common",
        type: "Status",
        tags: ["Preparation", "Manipulation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "apply_status", "grant_next_school_damage_bonus"],
        upgrades: [
            { rank: 1, values: { damage: 8, statusId: "wound" } },
            { rank: 2, values: { damage: 10, statusId: "wound" } },
            { rank: 3, values: { damage: 10, statusId: "wound", nextSchool: "shadow", nextSchoolDamageBonus: 6, nextSchoolBonusCharges: 1 } },
            { rank: 4, values: { damage: 12, statusId: "wound", nextSchool: "shadow", nextSchoolDamageBonus: 6, nextSchoolBonusCharges: 1 } },
            { rank: 5, values: { damage: 12, statusId: "wound", statusSchoolDamageBonus: 4, nextSchool: "shadow", nextSchoolDamageBonus: 6, nextSchoolBonusCharges: 1 } }
        ]
    },
    {
        id: "shadow_cloak",
        school: "shadow",
        name: "Schattenmantel",
        description: "Gewährt Schild. Der nächste Schattenzauber wird verstärkt.",
        rarity: "Common",
        type: "Protection",
        tags: ["Protection", "Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["gain_shield", "grant_next_school_damage_bonus"],
        upgrades: [
            { rank: 1, values: { shield: 18, nextSchool: "shadow", nextSchoolDamageBonus: 4, nextSchoolBonusCharges: 1 } },
            { rank: 2, values: { shield: 24, nextSchool: "shadow", nextSchoolDamageBonus: 4, nextSchoolBonusCharges: 1 } },
            { rank: 3, values: { shield: 24, nextSchool: "shadow", nextSchoolDamageBonus: 8, nextSchoolBonusCharges: 1 } },
            { rank: 4, values: { shield: 30, nextSchool: "shadow", nextSchoolDamageBonus: 8, nextSchoolBonusCharges: 1 } },
            { rank: 5, values: { shield: 30, nextSchool: "shadow", nextSchoolDamageBonus: 8, nextSchoolBonusCharges: 2 } }
        ]
    },
    {
        id: "embrace",
        school: "shadow",
        name: "Umklammerung",
        description: "Starker Angriff. Profitiert von allen vorhandenen Schwächen.",
        rarity: "Rare",
        type: "Attack",
        tags: ["Burst"],
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 18, requiredStatusId: "wound", statusDamageBonus: 6 } },
            { rank: 2, values: { damage: 22, requiredStatusId: "wound", statusDamageBonus: 6 } },
            { rank: 3, values: { damage: 22, requiredStatusId: "wound", statusDamageBonus: 6, additionalNegativeEffectDamageBonus: 6 } },
            { rank: 4, values: { damage: 26, requiredStatusId: "wound", statusDamageBonus: 6, additionalNegativeEffectDamageBonus: 6 } },
            { rank: 5, values: { damage: 26, requiredStatusId: "wound", statusDamageBonus: 6, additionalNegativeEffectDamageBonus: 6, statusShieldPierce: 12 } }
        ]
    },
    {
        id: "dark_omen",
        school: "shadow",
        name: "Dunkles Omen",
        description: "Bereitet zukünftige Schattenzauber vor.",
        rarity: "Epic",
        type: "Status",
        tags: ["Preparation"],
        cooldown: 0,
        effects: ["grant_next_school_damage_bonus"],
        upgrades: [
            { rank: 1, values: { nextSchool: "shadow", nextSchoolDamageBonus: 3, nextSchoolBonusCharges: 3 } },
            { rank: 2, values: { nextSchool: "shadow", nextSchoolDamageBonus: 5, nextSchoolBonusCharges: 3 } },
            { rank: 3, values: { nextSchool: "shadow", nextSchoolDamageBonus: 5, nextSchoolBonusCharges: 3, firstNextSchoolDamageBonus: 6 } },
            { rank: 4, values: { nextSchool: "shadow", nextSchoolDamageBonus: 7, nextSchoolBonusCharges: 3, firstNextSchoolDamageBonus: 6 } },
            { rank: 5, values: { nextSchool: "shadow", nextSchoolDamageBonus: 7, nextSchoolBonusCharges: 3, firstNextSchoolDamageBonus: 6, nextSchoolShieldPierce: 6 } }
        ]
    },
    {
        id: "umbral_executioner",
        school: "shadow",
        name: "Umbraler Henker",
        description: "Der Finisher der Schattenmagie. Profitiert von sämtlichen vorbereiteten Schwächen.",
        rarity: "Legendary",
        type: "Attack",
        tags: ["Burst"],
        isSignature: true,
        cooldown: 1,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 32, perNegativeEffectDamageBonus: 6 } },
            { rank: 2, values: { damage: 38, perNegativeEffectDamageBonus: 6 } },
            { rank: 3, values: { damage: 38, perNegativeEffectDamageBonus: 8 } },
            { rank: 4, values: { damage: 44, perNegativeEffectDamageBonus: 8 } },
            { rank: 5, values: { damage: 44, perNegativeEffectDamageBonus: 8, ignoreShield: true } }
        ]
    },
    {
        id: "dream_shard",
        school: "dream",
        name: "Traumsplitter",
        description: "Der Angriff hinterlässt einen Nachhall.",
        rarity: "Common",
        type: "Attack",
        tags: ["Attack", "Echo"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "trigger_echo"],
        upgrades: [
            { rank: 1, values: { damage: 10, echoPercent: 50 } },
            { rank: 2, values: { damage: 12, echoPercent: 50 } },
            { rank: 3, values: { damage: 12, echoPercent: 50, echoCopiesStatusEffects: true } },
            { rank: 4, values: { damage: 14, echoPercent: 50, echoCopiesStatusEffects: true } },
            { rank: 5, values: { damage: 14, echoPercent: 75, echoCopiesStatusEffects: true } }
        ]
    },
    {
        id: "deja_vu",
        school: "dream",
        name: "Déjà-vu",
        description: "Der nächste Zauber fühlt sich an, als wäre er bereits gewirkt worden.",
        rarity: "Common",
        type: "Status",
        tags: ["Echo", "Manipulation"],
        starter: true,
        cooldown: 0,
        effects: ["grant_next_echo_bonus"],
        upgrades: [
            { rank: 1, values: { nextEchoDamageBonus: 4, nextEchoBonusCharges: 1 } },
            { rank: 2, values: { nextEchoDamageBonus: 6, nextEchoBonusCharges: 1 } },
            { rank: 3, values: { nextEchoDamageBonus: 6, nextEchoBonusCharges: 1, echoImmediate: true } },
            { rank: 4, values: { nextEchoDamageBonus: 8, nextEchoBonusCharges: 1, echoImmediate: true } },
            { rank: 5, values: { nextEchoDamageBonus: 8, nextEchoBonusCharges: 1, echoImmediate: true, echoCopiesAllEffects: true } }
        ]
    },
    {
        id: "dream_veil",
        school: "dream",
        name: "Traumschleier",
        description: "Der Gegner trifft nur eine verzerrte Wirklichkeit.",
        rarity: "Common",
        type: "Protection",
        tags: ["Protection", "Manipulation"],
        starter: true,
        cooldown: 0,
        effects: ["gain_shield", "reduce_next_enemy_attack"],
        upgrades: [
            { rank: 1, values: { shield: 18, nextEnemyAttackReduction: 4 } },
            { rank: 2, values: { shield: 24, nextEnemyAttackReduction: 4 } },
            { rank: 3, values: { shield: 24, nextEnemyAttackReduction: 8 } },
            { rank: 4, values: { shield: 30, nextEnemyAttackReduction: 8 } },
            { rank: 5, values: { shield: 30, nextEnemyAttackReduction: 8, blockNextNegativeStatus: true } }
        ]
    },
    {
        id: "dream_paradox",
        school: "dream",
        name: "Traumparadoxon",
        description: "Für einen kurzen Moment gelten andere Regeln.",
        rarity: "Rare",
        type: "Status",
        tags: ["Manipulation"],
        cooldown: 0,
        effects: ["grant_next_spell_rule_break"],
        upgrades: [
            { rank: 1, values: { ignoreRestrictionCount: 1 } },
            { rank: 2, values: { ignoreRestrictionCount: 1, nextSpellAdaptiveBonus: 4 } },
            { rank: 3, values: { ignoreRestrictionCount: 2, nextSpellAdaptiveBonus: 4 } },
            { rank: 4, values: { ignoreRestrictionCount: 2, nextSpellAdaptiveBonus: 8 } },
            { rank: 5, values: { ignoreAllRestrictions: true, nextSpellAdaptiveBonus: 8 } }
        ]
    },
    {
        id: "false_awakening",
        school: "dream",
        name: "Falsches Erwachen",
        description: "Ein bereits abgeschlossener Moment kehrt zurück.",
        rarity: "Epic",
        type: "Status",
        tags: ["Echo", "Manipulation"],
        cooldown: 0,
        effects: ["grant_next_echo_bonus"],
        upgrades: [
            { rank: 1, values: { nextEchoDamageBonus: 4, nextEchoBonusCharges: 2 } },
            { rank: 2, values: { nextEchoDamageBonus: 6, nextEchoBonusCharges: 2 } },
            { rank: 3, values: { nextEchoDamageBonus: 6, nextEchoBonusCharges: 2, echoImmediate: true } },
            { rank: 4, values: { nextEchoDamageBonus: 8, nextEchoBonusCharges: 2, echoImmediate: true } },
            { rank: 5, values: { nextEchoDamageBonus: 8, nextEchoBonusCharges: 2, echoImmediate: true, globalEchoPercent: 75 } }
        ]
    },
    {
        id: "dreamwalk",
        school: "dream",
        name: "Traumwanderung",
        description: "Der Höhepunkt der Traummagie.",
        rarity: "Legendary",
        type: "Status",
        tags: ["Echo", "Manipulation"],
        isSignature: true,
        cooldown: 1,
        effects: ["activate_dreamwalk"],
        upgrades: [
            { rank: 1, values: { activateDreamParadox: true, activateFalseAwakening: true } },
            { rank: 2, values: { activateDreamParadox: true, activateFalseAwakening: true, nextSpellAdaptiveBonus: 8 } },
            { rank: 3, values: { activateDreamParadox: true, activateFalseAwakening: true, nextSpellAdaptiveBonus: 8, triggerActiveEchoes: true } },
            { rank: 4, values: { activateDreamParadox: true, activateFalseAwakening: true, nextSpellAdaptiveBonus: 12, triggerActiveEchoes: true } },
            { rank: 5, values: { activateDreamParadox: true, activateFalseAwakening: true, nextSpellAdaptiveBonus: 12, triggerActiveEchoes: true, maximizeDreamEffects: true, globalEchoPercent: 100, ignoreAllRestrictions: true } }
        ]
    },
    {
        id: "rune_strike",
        school: "rune",
        name: "Runenschlag",
        description: "Der Angriff profitiert von der Position innerhalb der Rotation.",
        rarity: "Common",
        type: "Attack",
        tags: ["Attack", "Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 10, previousDifferentTypeDamageBonus: 2, sequenceMaxDamageBonus: 6 } },
            { rank: 2, values: { damage: 12, previousDifferentTypeDamageBonus: 2, sequenceMaxDamageBonus: 6 } },
            { rank: 3, values: { damage: 12, previousDifferentTypeDamageBonus: 2, previousDifferentSchoolDamageBonus: 2, sequenceMaxDamageBonus: 10 } },
            { rank: 4, values: { damage: 14, previousDifferentTypeDamageBonus: 2, previousDifferentSchoolDamageBonus: 2, sequenceMaxDamageBonus: 10 } },
            { rank: 5, values: { damage: 14, previousDifferentTypeDamageBonus: 2, previousDifferentSchoolDamageBonus: 2, sequenceMaxDamageBonus: 14 } }
        ]
    },
    {
        id: "protection_rune",
        school: "rune",
        name: "Schutzrune",
        description: "Schutz stärkt die nächste Kombination.",
        rarity: "Common",
        type: "Protection",
        tags: ["Protection", "Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["gain_shield", "grant_conditional_spell_bonus"],
        upgrades: [
            { rank: 1, values: { shield: 18, conditionalTargetSchool: "rune", conditionalDamageBonus: 4, conditionalBonusCharges: 1 } },
            { rank: 2, values: { shield: 24, conditionalTargetSchool: "rune", conditionalDamageBonus: 4, conditionalBonusCharges: 1 } },
            { rank: 3, values: { shield: 24, conditionalTargetSchool: "rune", conditionalDamageBonus: 4, conditionalShieldBonus: 4, conditionalBonusCharges: 1 } },
            { rank: 4, values: { shield: 30, conditionalTargetSchool: "rune", conditionalDamageBonus: 4, conditionalShieldBonus: 4, conditionalBonusCharges: 1 } },
            { rank: 5, values: { shield: 30, conditionalTargetSchool: "rune", conditionalDamageBonus: 4, conditionalShieldBonus: 4, conditionalBonusCharges: 2 } }
        ]
    },
    {
        id: "rune_link",
        school: "rune",
        name: "Runenverbindung",
        description: "Zauber unterstützen sich gegenseitig.",
        rarity: "Common",
        type: "Status",
        tags: ["Preparation", "Manipulation"],
        starter: true,
        cooldown: 0,
        effects: ["grant_conditional_spell_bonus"],
        upgrades: [
            { rank: 1, values: { conditionalAdaptiveBonus: 6, conditionalBonusCharges: 1 } },
            { rank: 2, values: { conditionalAdaptiveBonus: 8, conditionalBonusCharges: 1 } },
            { rank: 3, values: { conditionalAdaptiveBonus: 8, conditionalBonusCharges: 1, includeHybridCombinations: true } },
            { rank: 4, values: { conditionalAdaptiveBonus: 10, conditionalBonusCharges: 1, includeHybridCombinations: true } },
            { rank: 5, values: { conditionalAdaptiveBonus: 10, conditionalBonusCharges: 2, includeHybridCombinations: true } }
        ]
    },
    {
        id: "rune_flow",
        school: "rune",
        name: "Runenfluss",
        description: "Die Rotation wird effizienter.",
        rarity: "Rare",
        type: "Status",
        tags: ["Preparation"],
        cooldown: 0,
        effects: ["grant_conditional_spell_bonus", "move_next_matching_spell_forward"],
        upgrades: [
            { rank: 1, values: { conditionalTargetSchool: "rune", conditionalDamageBonus: 4, conditionalBonusCharges: 1, moveTargetSchool: "rune", moveSlotsForward: 1 } },
            { rank: 2, values: { conditionalTargetSchool: "rune", conditionalDamageBonus: 6, conditionalBonusCharges: 1, moveTargetSchool: "rune", moveSlotsForward: 1 } },
            { rank: 3, values: { conditionalTargetSchool: "rune", conditionalDamageBonus: 6, conditionalShieldBonus: 4, conditionalBonusCharges: 1, moveTargetSchool: "rune", moveSlotsForward: 1 } },
            { rank: 4, values: { conditionalTargetSchool: "rune", conditionalDamageBonus: 8, conditionalShieldBonus: 4, conditionalBonusCharges: 1, moveTargetSchool: "rune", moveSlotsForward: 1 } },
            { rank: 5, values: { conditionalTargetSchool: "rune", conditionalDamageBonus: 8, conditionalShieldBonus: 4, conditionalBonusCharges: 1, moveTargetSchool: "rune", moveSlotsForward: 1, persistentRotationChange: true } }
        ]
    },
    {
        id: "rune_weave",
        school: "rune",
        name: "Runengeflecht",
        description: "Je vielfältiger das Deck, desto stärker die Runen.",
        rarity: "Epic",
        type: "Status",
        tags: ["Manipulation", "Preparation"],
        cooldown: 0,
        effects: ["grant_conditional_spell_bonus"],
        upgrades: [
            { rank: 1, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 4, conditionalPersistent: true } },
            { rank: 2, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 6, conditionalPersistent: true } },
            { rank: 3, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 6, conditionalShieldBonus: 4, conditionalPersistent: true } },
            { rank: 4, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 8, conditionalShieldBonus: 4, conditionalPersistent: true } },
            { rank: 5, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 8, conditionalShieldBonus: 4, conditionalPersistent: true, additionalHybridBuildTags: 1 } }
        ]
    },
    {
        id: "master_rune",
        school: "rune",
        name: "Meisterrune",
        description: "Der Höhepunkt perfekter Planung.",
        rarity: "Legendary",
        type: "Status",
        tags: ["Burst", "Preparation"],
        isSignature: true,
        cooldown: 1,
        effects: ["activate_master_rune"],
        upgrades: [
            { rank: 1, values: { masterRuneAdaptiveBonus: 8 } },
            { rank: 2, values: { masterRuneAdaptiveBonus: 12 } },
            { rank: 3, values: { masterRuneAdaptiveBonus: 12, retriggerRuneLinks: true } },
            { rank: 4, values: { masterRuneAdaptiveBonus: 16, retriggerRuneLinks: true } },
            { rank: 5, values: { masterRuneAdaptiveBonus: 16, retriggerRuneLinks: true, maximizeRuneEffects: true, activateHybridCombinations: true } }
        ]
    },
    {
        id: "star_shard",
        school: "star",
        name: "Sternensplitter",
        description: "Jeder perfekt getimte Treffer fühlt sich stärker an.",
        rarity: "Common",
        type: "Attack",
        tags: ["Attack", "Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 10, timingDamageBonus: 4 } },
            { rank: 2, values: { damage: 12, timingDamageBonus: 4 } },
            { rank: 3, values: { damage: 12, timingDamageBonus: 8 } },
            { rank: 4, values: { damage: 14, timingDamageBonus: 8 } },
            { rank: 5, values: { damage: 14, timingDamageBonus: 8, timingShieldPierce: 8 } }
        ]
    },
    {
        id: "gravity_field",
        school: "star",
        name: "Gravitationsfeld",
        description: "Der Kampf verlangsamt sich für einen kurzen Moment.",
        rarity: "Common",
        type: "Status",
        tags: ["Control", "Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "activate_timing_effect"],
        upgrades: [
            { rank: 1, values: { damage: 8, timingTargetSchool: "star", timingStarCharges: 1 } },
            { rank: 2, values: { damage: 10, timingTargetSchool: "star", timingStarCharges: 1 } },
            { rank: 3, values: { damage: 10, timingTargetSchool: "star", timingStarCharges: 2 } },
            { rank: 4, values: { damage: 12, timingTargetSchool: "star", timingStarCharges: 2 } },
            { rank: 5, values: { damage: 12, timingTargetSchool: "star", timingStarCharges: 2, timingHybridCharges: 1 } }
        ]
    },
    {
        id: "comet",
        school: "star",
        name: "Komet",
        description: "Ein Angriff, der genau zum richtigen Moment einschlägt.",
        rarity: "Rare",
        type: "Attack",
        tags: ["Burst"],
        cooldown: 0,
        effects: ["deal_damage"],
        upgrades: [
            { rank: 1, values: { damage: 20, timingDamageBonus: 8 } },
            { rank: 2, values: { damage: 24, timingDamageBonus: 8 } },
            { rank: 3, values: { damage: 24, timingDamageBonus: 8, timingShieldPierce: 8 } },
            { rank: 4, values: { damage: 28, timingDamageBonus: 8, timingShieldPierce: 8 } },
            { rank: 5, values: { damage: 28, timingDamageBonus: 8, timingShieldPierce: 8, preserveTimingEffect: true } }
        ]
    },
    {
        id: "solar_eclipse",
        school: "star",
        name: "Sonnenfinsternis",
        description: "Der perfekte Moment verändert den gesamten Kampf.",
        rarity: "Epic",
        type: "Status",
        tags: ["Preparation"],
        cooldown: 0,
        effects: ["grant_conditional_spell_bonus", "empower_timing_effects"],
        upgrades: [
            { rank: 1, values: { conditionalTargetSchool: "star", conditionalDamageBonus: 4, conditionalBonusCharges: 2 } },
            { rank: 2, values: { conditionalTargetSchool: "star", conditionalDamageBonus: 6, conditionalBonusCharges: 2 } },
            { rank: 3, values: { conditionalTargetSchool: "star", conditionalDamageBonus: 6, conditionalBonusCharges: 2, doubleNextTimingBonus: true } },
            { rank: 4, values: { conditionalTargetSchool: "star", conditionalDamageBonus: 8, conditionalBonusCharges: 2, doubleNextTimingBonus: true } },
            { rank: 5, values: { conditionalTargetSchool: "star", conditionalDamageBonus: 8, conditionalBonusCharges: 2, doubleNextTimingBonus: true, globalTimingDamageBonus: 4 } }
        ]
    },
    {
        id: "constellation",
        school: "star",
        name: "Sternbild",
        description: "Mehrere Zauber ergeben gemeinsam ein größeres Muster.",
        rarity: "Epic",
        type: "Status",
        tags: ["Preparation", "Manipulation"],
        cooldown: 0,
        effects: ["grant_conditional_spell_bonus", "enable_auto_timing"],
        upgrades: [
            { rank: 1, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 4, conditionalPersistent: true } },
            { rank: 2, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 6, conditionalPersistent: true } },
            { rank: 3, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 6, conditionalShieldBonus: 4, conditionalPersistent: true } },
            { rank: 4, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 8, conditionalShieldBonus: 4, conditionalPersistent: true } },
            { rank: 5, values: { conditionalTrigger: "hybrid", conditionalDamageBonus: 8, conditionalShieldBonus: 4, conditionalPersistent: true, autoTimingOnHybrid: true } }
        ]
    },
    {
        id: "supernova",
        school: "star",
        name: "Supernova",
        description: "Der Höhepunkt perfekten Timings.",
        rarity: "Legendary",
        type: "Attack",
        tags: ["Burst"],
        isSignature: true,
        cooldown: 1,
        effects: ["deal_damage", "reactivate_timing_effects"],
        upgrades: [
            { rank: 1, values: { damage: 34, timingDamageBonus: 8 } },
            { rank: 2, values: { damage: 40, timingDamageBonus: 8 } },
            { rank: 3, values: { damage: 40, timingDamageBonus: 8, doubleTimingBonus: true } },
            { rank: 4, values: { damage: 46, timingDamageBonus: 8, doubleTimingBonus: true } },
            { rank: 5, values: { damage: 46, timingDamageBonus: 8, doubleTimingBonus: true, reactivateTimingEffects: true } }
        ]
    },
    {
        id: "earthquake",
        school: "primal",
        name: "Erdbeben",
        description: "Der erste Stoß bringt den Gegner aus dem Gleichgewicht.",
        rarity: "Common",
        type: "Attack",
        tags: ["Attack", "Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "trigger_aftershock"],
        upgrades: [
            { rank: 1, values: { damage: 10, aftershockDamage: 4 } },
            { rank: 2, values: { damage: 12, aftershockDamage: 6 } },
            { rank: 3, values: { damage: 12, aftershockDamage: 6, aftershockMomentumGain: 1 } },
            { rank: 4, values: { damage: 14, aftershockDamage: 8, aftershockMomentumGain: 1 } },
            { rank: 5, values: { damage: 14, aftershockDamage: 8, aftershockMomentumGain: 1, aftershockShieldPierce: 8 } }
        ]
    },
    {
        id: "stormfront",
        school: "primal",
        name: "Gewitterfront",
        description: "Mit jedem Einschlag wächst der Druck.",
        rarity: "Common",
        type: "Status",
        tags: ["Preparation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "gain_momentum", "grant_conditional_spell_bonus"],
        upgrades: [
            { rank: 1, values: { damage: 8, momentumGain: 1 } },
            { rank: 2, values: { damage: 10, momentumGain: 1 } },
            { rank: 3, values: { damage: 10, momentumGain: 2 } },
            { rank: 4, values: { damage: 12, momentumGain: 2 } },
            { rank: 5, values: { damage: 12, momentumGain: 2, conditionalTargetSchool: "primal", conditionalDamageBonus: 6, conditionalBonusCharges: 1 } }
        ]
    },
    {
        id: "tornado",
        school: "primal",
        name: "Tornado",
        description: "Der Sturm reißt den Kampf mit sich.",
        rarity: "Common",
        type: "Attack",
        tags: ["Manipulation"],
        starter: true,
        cooldown: 0,
        effects: ["deal_damage", "grant_conditional_spell_bonus"],
        upgrades: [
            { rank: 1, values: { damage: 12, conditionalTargetSchool: "primal", conditionalDamageBonus: 4, conditionalBonusCharges: 1 } },
            { rank: 2, values: { damage: 14, conditionalTargetSchool: "primal", conditionalDamageBonus: 4, conditionalBonusCharges: 1 } },
            { rank: 3, values: { damage: 14, conditionalTargetSchool: "primal", conditionalDamageBonus: 4, conditionalMomentumGain: 1, conditionalBonusCharges: 1 } },
            { rank: 4, values: { damage: 16, conditionalTargetSchool: "primal", conditionalDamageBonus: 4, conditionalMomentumGain: 1, conditionalBonusCharges: 1 } },
            { rank: 5, values: { damage: 16, conditionalTargetSchool: "primal", conditionalDamageBonus: 4, conditionalMomentumGain: 1, conditionalBonusCharges: 2 } }
        ]
    },
    {
        id: "volcanic_eruption",
        school: "primal",
        name: "Vulkanausbruch",
        description: "Das aufgebaute Momentum entlädt sich.",
        rarity: "Rare",
        type: "Attack",
        tags: ["Burst"],
        cooldown: 0,
        effects: ["deal_damage", "consume_momentum"],
        upgrades: [
            { rank: 1, values: { damage: 18, damagePerMomentum: 4, consumeMomentum: true } },
            { rank: 2, values: { damage: 22, damagePerMomentum: 4, consumeMomentum: true } },
            { rank: 3, values: { damage: 22, damagePerMomentum: 4, shieldPiercePerMomentum: 2, consumeMomentum: true } },
            { rank: 4, values: { damage: 26, damagePerMomentum: 4, shieldPiercePerMomentum: 2, consumeMomentum: true } },
            { rank: 5, values: { damage: 26, damagePerMomentum: 4, shieldPiercePerMomentum: 2 } }
        ]
    },
    {
        id: "force_of_nature",
        school: "primal",
        name: "Naturgewalt",
        description: "Die Natur gerät endgültig außer Kontrolle.",
        rarity: "Epic",
        type: "Status",
        tags: ["Preparation"],
        cooldown: 0,
        effects: ["empower_momentum"],
        upgrades: [
            { rank: 1, values: { additionalMomentumGain: 1 } },
            { rank: 2, values: { additionalMomentumGain: 1, primalDamageBonus: 4 } },
            { rank: 3, values: { additionalMomentumGain: 1, primalDamageBonus: 4, initialMomentum: 1 } },
            { rank: 4, values: { additionalMomentumGain: 1, primalDamageBonus: 8, initialMomentum: 1 } },
            { rank: 5, values: { additionalMomentumGain: 1, primalDamageBonus: 8, initialMomentum: 1, minimumMomentum: 3 } }
        ]
    },
    {
        id: "cataclysm",
        school: "primal",
        name: "Kataklysmus",
        description: "Der Höhepunkt der entfesselten Natur.",
        rarity: "Legendary",
        type: "Attack",
        tags: ["Burst"],
        isSignature: true,
        cooldown: 1,
        effects: ["deal_damage", "consume_momentum"],
        upgrades: [
            { rank: 1, values: { damage: 30, damagePerMomentum: 8, consumeMomentum: true } },
            { rank: 2, values: { damage: 36, damagePerMomentum: 8, consumeMomentum: true } },
            { rank: 3, values: { damage: 36, damagePerMomentum: 10, consumeMomentum: true } },
            { rank: 4, values: { damage: 42, damagePerMomentum: 10, consumeMomentum: true } },
            { rank: 5, values: { damage: 42, damagePerMomentum: 10, consumedMomentumDamageBonus: 4, consumeMomentum: true } }
        ]
    }
];
