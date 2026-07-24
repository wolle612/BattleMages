const COMBAT_FORMULA_CONSTANTS = {
    playerStartHp: 120,
    baseCritChance: 0.05,
    critDamageMultiplier: 2,
    vulnerableDamageMultiplier: 1.5
};

const SPELL_ROLES = {
    generator: {
        id: "generator",
        label: "Generator",
        description: "Startet Ressourcen oder Setup-Effekte."
    },
    verstaerker: {
        id: "verstaerker",
        label: "Verstärker",
        description: "Verstärkt den nächsten Zauber oder eine Sequenz."
    },
    finisher: {
        id: "finisher",
        label: "Finisher",
        description: "Zahlt vorbereitete Effekte aus."
    },
    utility: {
        id: "utility",
        label: "Utility",
        description: "Kontrolle, Schutz oder Rotation."
    },
    build_enabler: {
        id: "build_enabler",
        label: "Build-Enabler",
        description: "Eröffnet oder trägt einen Build-Archetyp."
    }
};

const BUILD_ARCHETYPES = {
    widerstandsfestung: {
        id: "widerstandsfestung",
        label: "Widerstandsfestung",
        focus: ["resistance"]
    },
    widerstandskanone: {
        id: "widerstandskanone",
        label: "Widerstandskanone",
        focus: ["resistance", "damage"]
    },
    widerstand_krit: {
        id: "widerstand_krit",
        label: "Widerstand/Krit",
        focus: ["resistance", "crit"]
    },
    verwundbar_burst: {
        id: "verwundbar_burst",
        label: "Verwundbar-Burst",
        focus: ["vulnerable", "damage"]
    },
    verwundbar_ketten: {
        id: "verwundbar_ketten",
        label: "Verwundbar-Ketten",
        focus: ["vulnerable", "sequence"]
    },
    kritmaschine: {
        id: "kritmaschine",
        label: "Kritmaschine",
        focus: ["crit"]
    },
    one_shot: {
        id: "one_shot",
        label: "One-Shot",
        focus: ["crit", "vulnerable", "damage"]
    },
    krit_verwundbar: {
        id: "krit_verwundbar",
        label: "Krit/Verwundbar",
        focus: ["crit", "vulnerable"]
    },
    sustain: {
        id: "sustain",
        label: "Sustain",
        focus: ["shield", "heal"]
    },
    monoschule: {
        id: "monoschule",
        label: "Monoschule",
        focus: ["same_school"]
    },
    multischule: {
        id: "multischule",
        label: "Multischule",
        focus: ["hybrid"]
    },
    sequenz: {
        id: "sequenz",
        label: "Sequenz",
        focus: ["sequence"]
    },
    hybrid: {
        id: "hybrid",
        label: "Hybrid",
        focus: ["hybrid"]
    },
    burst: {
        id: "burst",
        label: "Burst",
        focus: ["damage"]
    },
    kontrollierter_schaden: {
        id: "kontrollierter_schaden",
        label: "Kontrollierter Schaden",
        focus: ["damage", "shield"]
    }
};

const COMBAT_SCHOOLS = {
    blood: {
        id: "blood",
        iconFolder: "biomancy",
        fantasyName: "Biomantie",
        gameplay: "Den Körper systematisch zerstören.",
        primaryMechanic: "vulnerable",
        secondaryMechanic: "hybrid",
        rareMechanic: "crit",
        sequenceLevel: "low"
    },
    shadow: {
        id: "shadow",
        iconFolder: "shadow",
        fantasyName: "Schatten",
        gameplay: "Präzision, Tempo und kritische Treffer.",
        primaryMechanic: "crit",
        secondaryMechanic: "sequence",
        rareMechanic: "resistance",
        sequenceLevel: "high"
    },
    dream: {
        id: "dream",
        iconFolder: "psionics",
        fantasyName: "Psionik",
        gameplay: "Kontrolle und Manipulation.",
        primaryMechanic: "hybrid",
        secondaryMechanic: "sequence",
        rareMechanic: "burst",
        sequenceLevel: "high"
    },
    rune: {
        id: "rune",
        iconFolder: "forbidden_runes",
        fantasyName: "Verbotene Runenkunst",
        gameplay: "Stabilität und Kontrolle.",
        primaryMechanic: "resistance",
        secondaryMechanic: "utility",
        rareMechanic: "crit",
        sequenceLevel: "medium"
    },
    star: {
        id: "star",
        iconFolder: "chaos",
        fantasyName: "Chaosmagie",
        gameplay: "Hoher Druck, kontrolliertes Risiko.",
        primaryMechanic: "burst",
        secondaryMechanic: "hybrid",
        rareMechanic: "resistance",
        sequenceLevel: "very_low"
    },
    primal: {
        id: "primal",
        iconFolder: "soul",
        fantasyName: "Seelenmagie",
        gameplay: "Mechaniken verbinden.",
        primaryMechanic: "hybrid",
        secondaryMechanic: "sustain",
        rareMechanic: "sequence",
        sequenceLevel: "low"
    }
};

const SEQUENCE_TRIGGERS = {
    after_protection: {
        id: "after_protection",
        label: "nach Schutz"
    },
    after_attack: {
        id: "after_attack",
        label: "nach Angriff"
    },
    same_school: {
        id: "same_school",
        label: "gleiche Schule"
    },
    different_school: {
        id: "different_school",
        label: "unterschiedliche Schule"
    },
    hybrid: {
        id: "hybrid",
        label: "Hybrid"
    }
};
