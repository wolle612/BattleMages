/*
 * Benannte Stil-Presets pro VFX-Kategorie.
 *
 * WICHTIG: Presets sind nach STIL benannt, nicht nach Zauber oder Schule.
 * Ein Stil wird von vielen Zaubern wiederverwendet - das ist die Grundlage
 * der 100+-Zauber-Skalierung (siehe Architekturplan, Abschnitt 8).
 *
 * Die Schul-Farbpaletten orientieren sich an den Farbschemata aus
 * docs/design/BattleMages_Icon_Design_Guide.md (aktuelle Schulnamen:
 * Biomantie/Schatten/Psionik/Verbotene Runenkunst/Chaosmagie/Seelenmagie).
 * Hinweis: docs/art_style.md verwendet noch die älteren Schulnamen
 * (Blut/Schatten/Traum/Runen/Sterne/Urgewalten) mit teils abweichenden
 * Farben - siehe Risiko 1 im Architekturplan.
 */

const VFX_CAST_PRESETS = {
    generic_flare: { color: 0xf4e9c9, radius: 22, duration: 220 },
    flare_blood: { color: 0x8c1024, radius: 24, duration: 220 },
    flare_shadow: { color: 0x3a4159, radius: 24, duration: 220 },
    flare_dream: { color: 0x39c2ff, radius: 24, duration: 220 },
    cast_circle_dream: {
        color: 0x39c2ff,
        radius: 10,
        duration: 120,
        shape: "circle_fill",
        alpha: 0.78
    },
    psionic_cast_mind_focus_hex: {
        spritesheet:
            "assets/effects/cast/psionic_cast_mind_focus_hex.json",
        animation: "play",
        displayWidth: 96,
        displayHeight: 71,
        duration: 320,
        animationSpeed: 0.3,
        blendMode: "add"
    },
    flare_rune: { color: 0x9c3b2e, radius: 26, duration: 260 },
    flare_star: { color: 0x6bcf3a, radius: 24, duration: 210 },
    flare_primal: { color: 0xd8d4f5, radius: 24, duration: 240 }
};

/*
 * Wiederverwendbare Bewegungsprofile fuer Projectile. Die Werte beschreiben
 * ausschliesslich PixiJS-Transformationen; Sprite Sheets bleiben unveraendert.
 */
const VFX_PROJECTILE_MOTION_PRESETS = {
    psionic_glide: {
        ease: "smoothstep",
        pulse: {
            startScale: 0.95,
            peakScale: 1,
            endScale: 0.97,
            peakProgress: 0.55
        },
        rotationDegrees: 2,
        pathWobblePixels: 1.4,
        trail: {
            color: 0x39c2ff,
            alpha: 0.28,
            lengthPixels: 30,
            sampleDistance: 5,
            minScale: 0.55
        }
    }
};

const VFX_PROJECTILE_PRESETS = {
    bolt_generic: { color: 0xf2f2f2, size: 6, speed: 950 },
    bolt_blood: { color: 0x8c1024, size: 6, speed: 850 },
    bolt_shadow: { color: 0x3a4159, size: 6, speed: 1000 },
    bolt_dream: { color: 0x39c2ff, size: 6, speed: 900 },
    bolt_rune: { color: 0x9c3b2e, size: 7, speed: 850 },
    bolt_star: { color: 0x6bcf3a, size: 7, speed: 1050 },
    bolt_primal: { color: 0xd8d4f5, size: 6, speed: 800 },
    mind_pressure_arc: {
        spritesheet:
            "assets/effects/projectiles/mind_pressure_arc/mind_pressure_projectile.json",
        animation: "play",
        displayWidth: 82,
        displayHeight: 328,
        speed: 1100,
        animationSpeed: 0.78,
        blendMode: "add",
        motion: "psionic_glide"
    }
};

const VFX_IMPACT_PRESETS = {
    generic_burst: { color: 0xffffff, radius: 20, duration: 260 },
    burst_blood: { color: 0x8c1024, radius: 22, duration: 280 },
    burst_shadow: { color: 0x3a4159, radius: 20, duration: 260 },
    burst_dream: { color: 0x39c2ff, radius: 22, duration: 280 },
    burst_rune: { color: 0x9c3b2e, radius: 24, duration: 300 },
    burst_star: { color: 0x6bcf3a, radius: 24, duration: 260 },
    burst_primal: { color: 0xd8d4f5, radius: 22, duration: 300 },
    mind_ring_burst: {
        spritesheet: "assets/effects/impact/mind_ring_burst/mind_ring_burst.json",
        animation: "play",
        displaySize: 96,
        duration: 140,
        animationSpeed: 0.55,
        blendMode: "add"
    },
    vulnerable_mark: {
        texture: "assets/effects/impact/vulnerable.png",
        size: 44,
        duration: 320
    }
};

const VFX_PARTICLE_PRESETS = {
    sparks_generic: { color: 0xffe9a8, size: 3, count: 8, spread: 36, duration: 340 },
    sparks_blood: { color: 0x8c1024, size: 3, count: 9, spread: 34, duration: 340 },
    sparks_shadow: { color: 0x3a4159, size: 3, count: 8, spread: 36, duration: 340 },
    sparks_dream: { color: 0x39c2ff, size: 3, count: 8, spread: 40, duration: 360 },
    mind_motes_placeholder: {
        color: 0xe8f4ff,
        size: 2,
        count: 4,
        spread: 22,
        duration: 260
    },
    sparks_rune: { color: 0x9c3b2e, size: 3, count: 8, spread: 34, duration: 360 },
    sparks_star: { color: 0x6bcf3a, size: 3, count: 10, spread: 44, duration: 320 },
    sparks_primal: { color: 0xd8d4f5, size: 3, count: 8, spread: 38, duration: 380 }
};

const VFX_EFFECT_PRESET_TABLES = {
    cast: VFX_CAST_PRESETS,
    projectile: VFX_PROJECTILE_PRESETS,
    impact: VFX_IMPACT_PRESETS,
    particles: VFX_PARTICLE_PRESETS
};
