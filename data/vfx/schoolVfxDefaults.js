/*
 * Schul-/Zaubertyp-Fallback-Presets (Stufe 2 der Aufloesungs-/Fallback-Kette,
 * siehe Architekturplan Abschnitt 4). Schul-IDs entsprechen den bestehenden
 * internen IDs aus data/combatIdentity.js (COMBAT_SCHOOLS), NICHT den
 * Fantasy-Namen: blood=Biomantie, shadow=Schatten, dream=Psionik,
 * rune=Verbotene Runenkunst, star=Chaosmagie, primal=Seelenmagie.
 */

const VFX_GENERIC_DEFAULT = {
    cast: { style: "generic_flare" },
    projectile: { style: "bolt_generic" },
    impact: { style: "generic_burst" },
    particles: [{ style: "sparks_generic", at: "impact" }],
    camera: { shake: "small" }
};

function buildSchoolVfxAttackDefault(styleSuffix) {
    return {
        cast: { style: `flare_${styleSuffix}` },
        projectile: { style: `bolt_${styleSuffix}` },
        impact: { style: `burst_${styleSuffix}` },
        particles: [{ style: `sparks_${styleSuffix}`, at: "impact" }],
        camera: { shake: "small" }
    };
}

function buildSchoolVfxProtectionDefault(styleSuffix) {
    return {
        cast: { style: `flare_${styleSuffix}`, duration: 260 },
        particles: [{ style: `sparks_${styleSuffix}`, at: "caster", count: 6 }]
    };
}

function buildSchoolVfxStatusDefault(styleSuffix) {
    return {
        cast: { style: `flare_${styleSuffix}`, duration: 200 },
        particles: [{ style: `sparks_${styleSuffix}`, at: "target", count: 4 }]
    };
}

const VFX_SCHOOL_DEFAULTS = {
    blood: {
        Attack: buildSchoolVfxAttackDefault("blood"),
        Protection: buildSchoolVfxProtectionDefault("blood"),
        Status: buildSchoolVfxStatusDefault("blood")
    },
    shadow: {
        Attack: buildSchoolVfxAttackDefault("shadow"),
        Protection: buildSchoolVfxProtectionDefault("shadow"),
        Status: buildSchoolVfxStatusDefault("shadow")
    },
    dream: {
        Attack: buildSchoolVfxAttackDefault("dream"),
        Protection: buildSchoolVfxProtectionDefault("dream"),
        Status: buildSchoolVfxStatusDefault("dream")
    },
    rune: {
        Attack: buildSchoolVfxAttackDefault("rune"),
        Protection: buildSchoolVfxProtectionDefault("rune"),
        Status: buildSchoolVfxStatusDefault("rune")
    },
    star: {
        Attack: buildSchoolVfxAttackDefault("star"),
        Protection: buildSchoolVfxProtectionDefault("star"),
        Status: buildSchoolVfxStatusDefault("star")
    },
    primal: {
        Attack: buildSchoolVfxAttackDefault("primal"),
        Protection: buildSchoolVfxProtectionDefault("primal"),
        Status: buildSchoolVfxStatusDefault("primal")
    }
};

function getVfxSchoolDefault(schoolId, spellType) {
    const schoolEntry =
        VFX_SCHOOL_DEFAULTS[schoolId];

    if (!schoolEntry) {
        return VFX_GENERIC_DEFAULT;
    }

    return schoolEntry[spellType] || schoolEntry.Attack || VFX_GENERIC_DEFAULT;
}
