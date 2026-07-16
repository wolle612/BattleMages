/*
 * Phase 3: Gegneraktionen an dieselbe VFX-Pipeline anschliessen.
 *
 * Gegneraktionen haben keine spellId (kein Eintrag in spellRegistry.js),
 * sondern einen iconKey (siehe assets/icons/enemy_actions/, renderer.js
 * getCombatFeedbackView). Diese Tabelle ordnet jeden bestehenden iconKey
 * einem Stil-Suffix zu (identisch zu den Schul-Suffixen aus
 * schoolVfxDefaults.js, plus "generic" fuer reine Wumms-/Nahkampftreffer
 * ohne erkennbare Schul-Zugehoerigkeit). Reine Nachschlagetabelle, keine
 * Logik - neue Gegneraktionen brauchen nur eine neue Zeile hier.
 */

const VFX_ENEMY_ACTION_STYLE_KEYS = {
    arcane_bolt: "dream",
    beast_claw: "generic",
    beast_maul: "generic",
    bone_strike: "blood",
    chaos_bolt: "star",
    chaos_surge: "star",
    flesh_crush: "blood",
    flesh_heal: "blood",
    flesh_strike: "blood",
    grand_spell: "generic",
    magic_bolt: "dream",
    nameless_crush: "generic",
    nameless_shield: "rune",
    nameless_strike: "generic",
    oracle_blast: "dream",
    oracle_bolt: "dream",
    rune_attack: "rune",
    rune_explosion: "rune",
    rune_shield: "rune",
    school_technique_blood: "blood",
    school_technique_dream: "dream",
    school_technique_primal: "primal",
    school_technique_rune: "rune",
    school_technique_shadow: "shadow",
    school_technique_star: "star",
    shadow_strike_heavy: "shadow",
    shadow_strike_light: "shadow",
    slash: "generic",
    soul_blast: "primal",
    soul_crush: "primal",
    soul_strike: "primal",
    twin_shadow_cut: "shadow"
};

function resolveEnemyActionVfxDefinition(iconKey) {
    const styleSuffix =
        VFX_ENEMY_ACTION_STYLE_KEYS[iconKey] || "generic";

    if (styleSuffix === "generic") {
        return VFX_GENERIC_DEFAULT;
    }

    return buildSchoolVfxAttackDefault(styleSuffix);
}
