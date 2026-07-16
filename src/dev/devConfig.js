// Developer Mode configuration.
// Set DEV_MODE_ENABLED to false (or remove dev scripts from index.html) for release builds.

const DEV_MODE_ENABLED = true;

const DEV_TEST_ENCOUNTER = 9999;

const DEV_DEFAULT_ENEMY_ID = "dev_training_dummy";

const DEV_DEFAULT_FILLER_SPELL_IDS = [
    "shield_wall",
    "precision_strike",
    "bone_fracture",
    "organ_failure"
];

const DEV_DUMMY_ENEMY = {
    id: "dev_training_dummy",
    name: "Training Dummy",
    encounter: DEV_TEST_ENCOUNTER,
    tier: "Normal",
    combatIdentity: "Dev Target",
    buildTest: "VFX Testing",
    hp: 999,
    passive: null,
    actionBar: [
        {
            id: "magic_bolt",
            name: "Leichter Schlag",
            effects: [
                { id: "deal_damage", target: "player", amount: 1 }
            ]
        }
    ],
    ui: {
        passiveText: "Trainingsziel für Developer Mode."
    },
    rewards: {
        standard: false
    }
};
