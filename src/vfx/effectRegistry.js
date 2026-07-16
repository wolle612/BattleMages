function resolveVfxStyleKey(categoryDefinition) {
    if (!categoryDefinition) {
        return null;
    }

    return typeof categoryDefinition === "string"
        ? categoryDefinition
        : categoryDefinition.style;
}

function resolveVfxPreset(category, categoryDefinition) {
    const table =
        VFX_EFFECT_PRESET_TABLES[category];

    const styleKey =
        resolveVfxStyleKey(categoryDefinition);

    if (!table || !styleKey) {
        return null;
    }

    return table[styleKey] || null;
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
