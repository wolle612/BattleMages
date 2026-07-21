/*
 * BattleMages VFX — datengetriebene Zauber-Zuordnung (siehe
 * docs/BattleMages_VFX_Animation_Mapping_v1.0.md — verbindlich).
 *
 * Jeder Zauber besteht aus genau drei Phasen: Cast -> Projektiltyp -> Impact.
 *
 *   - Cast   wird aus der Schule des Zaubers abgeleitet (school_cast_<school>).
 *   - Impact wird aus der Schule des Zaubers abgeleitet (school_impact_<school>).
 *   - Projektiltyp ist die EINZIGE per-Zauber-Angabe aus der MD-Datei und steht
 *     unten in SPELL_PROJECTILE_TYPES.
 *
 * Es gibt bewusst KEINE Hardcodierung einzelner Zauber-Optik ausserhalb dieser
 * Tabelle; die konkreten Sprite-Sheets liefert data/vfx/schoolVfxAssets.js.
 *
 * Projektiltyp-Werte:
 *   "beam"       Strahl, verbindet Spieler- und Gegnerportrait (kein Flug).
 *   "cut"        Schnitt/Hieb, erscheint direkt auf dem Ziel (kein Flug).
 *   "explosion"  Explosion, erscheint direkt auf dem Ziel (kein Flug).
 *   "projectile" Klassisches fliegendes Geschoss (Spieler -> Gegner).
 *   "shield"     Defensiver Effekt auf dem Portrait, das den Schild erhaelt.
 */

// Optionale per-Zauber-Overrides (z. B. combatTiming oder eine komplett eigene
// Definition). Standardmaessig leer — alle Zauber laufen datengetrieben ueber
// die Schul-Sheets. renderer.js liest hieraus nur ein optionales combatTiming.
const VFX_SPELL_DEFINITIONS = {};

// Verbindliche Projektiltyp-Zuordnung aus BattleMages_VFX_Animation_Mapping_v1.0.
// Schluessel = spellId (data/spellbookCore.js / spellbookPart2.js).
const SPELL_PROJECTILE_TYPES = {
    bone_fracture: "explosion",     // Knochenbruch
    precision_strike: "cut",        // Praezisionsschlag
    shield_wall: "shield",          // Schildwall
    shield_breaker: "cut",          // Schildbrecher
    dark_blade: "cut",              // Dunkle Klinge
    shadow_grasp: "explosion",      // Schattengriff
    death_stroke: "cut",            // Todesstoss
    organ_failure: "projectile",    // Organversagen
    rune_harmony: "beam",           // Runenharmonie
    shadow_dance: "cut",            // Schattentanz
    arcane_chain: "beam",           // Arkane Verkettung
    purity: "explosion",            // Reinheit
    blood_clot: "explosion",        // Blutgerinnsel
    will_break: "projectile",       // Willensbruch
    mind_strike: "cut",             // Gedankenschlag
    mind_stream: "beam",            // Gedankenstrom
    mind_barrier: "shield",         // Gedankenbarriere
    forbidden_seal: "shield",       // Verbotenes Siegel
    amplified_seal: "shield",       // Verstaerktes Siegel
    fracture_rune: "projectile",    // Bruchrune
    soul_bind: "beam",              // Seelenbindung
    soul_cut: "cut",                // Seelenschnitt
    chaos_eruption: "explosion",    // Chaoseruption
    anatomy: "projectile",          // Anatomie
    bone_armor: "shield",           // Knochenpanzer
    shadow_mantle: "shield",        // Schattenmantel
    dark_blow: "cut",               // Finsterer Hieb
    mind_trap: "explosion",         // Gedankenfalle
    mind_redirect: "beam",          // Gedankenumlenkung
    rune_break: "projectile",       // Runenbruch
    rune_thrust: "cut",             // Runenstoss
    chaos_blade: "cut",             // Chaosklinge
    chaos_catalyst: "projectile",   // Chaoskatalysator
    entropy: "explosion",           // Entropie
    overload: "explosion",          // Ueberladung
    soul_pulse: "beam",             // Seelenimpuls
    soul_spark: "projectile",       // Seelenfunke
    soul_ward: "beam"               // Seelenwache
};

function getSpellProjectileType(spellId) {
    return SPELL_PROJECTILE_TYPES[spellId] || null;
}
