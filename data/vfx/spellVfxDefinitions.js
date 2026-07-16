/*
 * Phase 2 (Pilot): reale Spell Effect Definitions fuer 6 Piloten-Zauber,
 * einer pro Schule (siehe Architekturplan, Abschnitt 7). Diese Zauber
 * demonstrieren Stufe 1 der Aufloesungs-/Fallback-Kette (explizite
 * Definition schlaegt Schul-Default). Alle anderen Zauber laufen bewusst
 * weiterhin ueber schoolVfxDefaults.js (Stufe 2), bis sie individuell
 * ausgestaltet werden (Phase 3).
 *
 * spellId -> Fremdschluessel zu data/spellbookCore.js / spellbookPart2.js.
 */

const VFX_SPELL_DEFINITIONS = {
    // Biomantie (blood) - "Knochenbruch": zuverlaessiger Verwundbar-Erzeuger.
    bone_fracture: {
        cast: { style: "flare_blood", duration: 200 },
        projectile: { style: "bolt_blood", speed: 800 },
        impact: { style: "burst_blood" },
        particles: [
            { style: "sparks_blood", at: "impact" },
            { style: "sparks_blood", at: "impact", count: 3 }
        ],
        camera: { shake: "small" },
        sound: { cast: "blood_cast_01", impact: "blood_impact_01" }
    },

    // Psionik (dream) - "Gedankenschlag": Platzhalter bis Bibliothek komplett.
    mind_strike: {
        combatTiming: {
            feedbackRead: 70,
            beforeImpact: 0,
            startVfxOnFeedback: true
        },
        cast: { style: "flare_dream", duration: 220 },
        projectile: { style: "bolt_dream", speed: 900 },
        impact: { style: "burst_dream" },
        particles: [{ style: "sparks_dream", at: "impact" }],
        camera: { shake: null },
        sound: {
            cast: "psionics_cast_focus_01",
            projectile: "psionics_projectile_arc_01",
            impact: "psionics_impact_ring_01"
        }
    },

    // Schatten (shadow) - "Praezisionsschlag": erster grosser Burst-Zauber.
    precision_strike: {
        cast: { style: "flare_shadow", duration: 160 },
        projectile: { style: "bolt_shadow", speed: 1100 },
        impact: { style: "burst_shadow" },
        particles: [{ style: "sparks_shadow", at: "impact" }],
        camera: { shake: "medium" },
        sound: { impact: "shadow_impact_01" }
    },

    // Psionik (dream) - "Arkane Verkettung": Hybrid-Zauber fuer Multischule.
    arcane_chain: {
        cast: { style: "flare_dream", duration: 220 },
        projectile: { style: "bolt_dream" },
        impact: { style: "burst_dream" },
        particles: [
            { style: "sparks_dream", at: "impact" },
            { style: "sparks_dream", at: "caster", count: 4 }
        ],
        camera: { shake: "small" },
        sound: { impact: "dream_impact_01" }
    },

    // Verbotene Runenkunst (rune) - "Schildwall": Standard-Schildgenerator.
    shield_wall: {
        cast: { style: "flare_rune", duration: 300 },
        particles: [{ style: "sparks_rune", at: "caster", count: 8 }],
        sound: { cast: "rune_shield_01" }
    },

    // Chaosmagie (star) - "Chaoseruption": einfache Burst-Karte.
    chaos_eruption: {
        cast: { style: "flare_star", duration: 160 },
        projectile: { style: "bolt_star", speed: 1150 },
        impact: { style: "burst_star", scale: 1.15 },
        particles: [{ style: "sparks_star", at: "impact", count: 12 }],
        camera: { shake: "medium" },
        sound: { impact: "chaos_impact_01" }
    },

    // Schatten (shadow) - "Todesstoss": einziger aktueller Finisher-Zauber
    // (role: "finisher"). Phase 3+4: bewusst verfeinertes Signature-Moment
    // mit staerkerem Impact/Flash (Phase 3) sowie Zoom + kurzem Freeze/
    // Hitstop (Phase 4) statt reinem Schul-Default.
    death_stroke: {
        cast: { style: "flare_shadow", duration: 200 },
        projectile: { style: "bolt_shadow", speed: 1200 },
        impact: { style: "burst_shadow", scale: 1.5 },
        particles: [{ style: "sparks_shadow", at: "impact", count: 14 }],
        camera: {
            shake: "medium",
            flash: true,
            zoom: { duration: 300 },
            freeze: { duration: 110 }
        },
        sound: { impact: "shadow_finisher_01" }
    },

    // Seelenmagie (primal) - "Seelenbindung": Schaden + Schild-Rueckfluss.
    soul_bind: {
        cast: { style: "flare_primal", duration: 220 },
        projectile: { style: "bolt_primal" },
        impact: { style: "burst_primal" },
        particles: [
            { style: "sparks_primal", at: "impact" },
            { style: "sparks_primal", at: "caster", count: 5 }
        ],
        camera: { shake: "small" },
        sound: { impact: "soul_impact_01" }
    }
};
