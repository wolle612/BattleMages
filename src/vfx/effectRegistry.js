function resolveVfxStyleKey(categoryDefinition) {
    if (!categoryDefinition) {
        return null;
    }

    return typeof categoryDefinition === "string"
        ? categoryDefinition
        : categoryDefinition.style;
}

function resolveVfxPreset(category, categoryDefinition) {
    const styleKey =
        resolveVfxStyleKey(categoryDefinition);

    if (!styleKey) {
        return null;
    }

    // Schul-Sheet-Presets (data/vfx/schoolVfxAssets.js) sind flach nach
    // styleKey benannt und gelten kategorieuebergreifend (school_cast_*,
    // school_beam_*, school_cut_*, school_explosion_*, school_impact_*).
    if (
        typeof VFX_SCHOOL_SHEET_PRESETS !== "undefined" &&
        VFX_SCHOOL_SHEET_PRESETS[styleKey]
    ) {
        return VFX_SCHOOL_SHEET_PRESETS[styleKey];
    }

    const table =
        VFX_EFFECT_PRESET_TABLES[category];

    if (!table) {
        return null;
    }

    return table[styleKey] || null;
}

// Aspektwahrende Zielgroesse fuer Sprite-Sheet-Presets: skaliert die groesste
// Frame-Kante auf preset.displaySize, sodass nicht-quadratische Frames (z. B.
// Schnitt/Explosion/Impact) NICHT verzerrt werden. Legacy-Presets ohne
// frameW/frameH fallen auf ein quadratisches displaySize zurueck.
function getVfxSheetDisplayDims(preset, scaleMultiplier = 1) {
    const multiplier =
        scaleMultiplier || 1;

    if (preset.frameW && preset.frameH && preset.displaySize) {
        const base =
            preset.displaySize / Math.max(preset.frameW, preset.frameH);

        return {
            w: preset.frameW * base * multiplier,
            h: preset.frameH * base * multiplier
        };
    }

    const size =
        (preset.displaySize || preset.displayWidth || 96) * multiplier;

    return { w: size, h: size };
}

function resolveVfxCastPreset(castDefinition) {
    return resolveVfxPreset("cast", castDefinition);
}

function resolveVfxProjectilePreset(projectileDefinition) {
    return resolveVfxPreset("projectile", projectileDefinition);
}

function resolveVfxProjectileMotionPreset(projectileDefinition, preset) {
    const motionKey =
        projectileDefinition?.motion ||
        preset?.motion;

    if (!motionKey || typeof VFX_PROJECTILE_MOTION_PRESETS === "undefined") {
        return null;
    }

    return VFX_PROJECTILE_MOTION_PRESETS[motionKey] || null;
}

function resolveVfxImpactPreset(impactDefinition) {
    return resolveVfxPreset("impact", impactDefinition);
}

function resolveVfxParticlePreset(particleDefinition) {
    return resolveVfxPreset("particles", particleDefinition);
}
