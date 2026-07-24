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
    flare_blood: { color: 0x8c1024, radius: 68, duration: 260 },
    flare_shadow: { color: 0x3a4159, radius: 24, duration: 220 },
    flare_dream: { color: 0x39c2ff, radius: 24, duration: 220 },
    cast_circle_dream: {
        color: 0x39c2ff,
        radius: 10,
        duration: 120,
        shape: "circle_fill",
        alpha: 0.78
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
    bolt_primal: { color: 0xd8d4f5, size: 6, speed: 800 }
};

const VFX_IMPACT_PRESETS = {
    generic_burst: { color: 0xffffff, radius: 20, duration: 260 },
    burst_blood: { color: 0x8c1024, radius: 55, duration: 300 },
    burst_shadow: { color: 0x3a4159, radius: 20, duration: 260 },
    burst_dream: { color: 0x39c2ff, radius: 22, duration: 280 },
    burst_rune: { color: 0x9c3b2e, radius: 24, duration: 300 },
    burst_star: { color: 0x6bcf3a, radius: 24, duration: 260 },
    burst_primal: { color: 0xd8d4f5, radius: 22, duration: 300 }
    // "vulnerable_mark" wurde entfernt: verwies auf das geloeschte
    // vulnerable.png und wurde von keinem Zauber/keiner Enemy-Action
    // referenziert (siehe portraitRegistry.js fuer den separaten,
    // ebenfalls deaktivierten Portrait-Overlay-Vulnerable-Effekt).
};

const VFX_PARTICLE_PRESETS = {
    sparks_generic: { color: 0xffe9a8, size: 3, count: 8, spread: 36, duration: 340 },
    sparks_blood: { color: 0x8c1024, size: 3, count: 9, spread: 34, duration: 340 },
    sparks_shadow: { color: 0x3a4159, size: 3, count: 8, spread: 36, duration: 340 },
    sparks_dream: { color: 0x39c2ff, size: 3, count: 8, spread: 40, duration: 360 },
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
