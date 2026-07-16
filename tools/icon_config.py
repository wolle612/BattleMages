"""Shared spell icon paths, school folders, and pilot batch definitions."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SPELLS_DIR = ROOT / "assets" / "icons" / "spells"
RAW_ROOT = ROOT / "assets" / "icons" / "raw"

ARCHIVE_DIRS = {
    "v1": SPELLS_DIR / "_archive_v1",
    "v2": SPELLS_DIR / "_archive_v2",
}

RAW_DIRS = {
    "v1": RAW_ROOT / "reference_v1",
    "v2": RAW_ROOT / "reference_v2",
    "benchmark": RAW_ROOT / "reference_v2" / "_benchmark_procedural",
}

SCHOOL_ICON_FOLDERS = {
    "blood": "biomancy",
    "shadow": "shadow",
    "dream": "psionics",
    "rune": "forbidden_runes",
    "star": "chaos",
    "primal": "soul",
}

SPELL_SCHOOL_BY_ID = {
    "bone_fracture": "biomancy",
    "organ_failure": "biomancy",
    "blood_clot": "biomancy",
    "anatomy": "biomancy",
    "bone_armor": "biomancy",
    "precision_strike": "shadow",
    "dark_blade": "shadow",
    "shadow_grasp": "shadow",
    "death_stroke": "shadow",
    "shadow_dance": "shadow",
    "shadow_mantle": "shadow",
    "dark_blow": "shadow",
    "arcane_chain": "psionics",
    "will_break": "psionics",
    "mind_strike": "psionics",
    "mind_stream": "psionics",
    "mind_barrier": "psionics",
    "mind_trap": "psionics",
    "mind_redirect": "psionics",
    "shield_wall": "forbidden_runes",
    "shield_breaker": "forbidden_runes",
    "rune_harmony": "forbidden_runes",
    "purity": "forbidden_runes",
    "forbidden_seal": "forbidden_runes",
    "amplified_seal": "forbidden_runes",
    "fracture_rune": "forbidden_runes",
    "rune_break": "forbidden_runes",
    "rune_thrust": "forbidden_runes",
    "chaos_eruption": "chaos",
    "chaos_blade": "chaos",
    "chaos_catalyst": "chaos",
    "soul_bind": "soul",
    "soul_cut": "soul",
    "soul_pulse": "soul",
    "soul_spark": "soul",
}

REFERENCE_RAW_OVERRIDES = {
    "dark_blade": "dark_blade_ref.png",
    "mind_barrier": "mind_barrier_ref_v2.png",
    "shield_wall": "shield_wall_ref.png",
    "chaos_eruption": "chaos_eruption_ref.png",
    "soul_spark": "soul_spark_ref.png",
    "bone_fracture": "bone_fracture_ref.png",
}

PILOT_BATCHES = {
    "biomancy": [
        "bone_fracture",
        "organ_failure",
        "blood_clot",
        "anatomy",
        "bone_armor",
    ],
    "shadow": [
        "precision_strike",
        "dark_blade",
        "shadow_grasp",
        "death_stroke",
        "shadow_dance",
        "shadow_mantle",
        "dark_blow",
    ],
    "psionics": [
        "arcane_chain",
        "will_break",
        "mind_strike",
        "mind_stream",
        "mind_barrier",
        "mind_trap",
        "mind_redirect",
    ],
    "forbidden_runes": [
        "shield_wall",
        "shield_breaker",
        "rune_harmony",
        "purity",
        "forbidden_seal",
        "amplified_seal",
        "fracture_rune",
        "rune_break",
        "rune_thrust",
    ],
    "chaos": [
        "chaos_eruption",
        "chaos_blade",
        "chaos_catalyst",
    ],
    "soul": [
        "soul_bind",
        "soul_cut",
        "soul_pulse",
        "soul_spark",
    ],
    "all": [],  # resolved dynamically below
}

PILOT_BATCHES["all"] = sum(
    (spells for name, spells in PILOT_BATCHES.items() if name != "all"),
    [],
)

SIMPLIFICATION_SUFFIX = (
    " Simplified readable pixel art: bold shapes, thick outlines, about 25% fewer"
    " fine details than hyper-detailed icons—no micro-textures, no edge particles,"
    " no glow haze. Still rich dark-fantasy pixel art, not abstract or minimalist."
    " Single centered motif, orthographic front view, transparent background, no text."
    " Must read clearly at 48 pixels."
)

SCHOOL_PROMPTS = {
    "biomancy": {
        "school_label": "Biomantie",
        "palette": "dark red, purple-red, bone white, flesh pink accents",
        "spells": {
            "bone_fracture": {
                "name": "Knochenbruch",
                "motif": "Broken forearm bone split in two with red muscle fibers at the break and one blood drop.",
                "remove": "tiny flesh strands, micro-cracks, extra splinters",
                "keep": "clear broken bone, muscle at fracture, one blood drop",
            },
            "organ_failure": {
                "name": "Organversagen",
                "motif": "Anatomical heart with two or three major vessels on top and one bold dark crack.",
                "remove": "fine vein web, tiny surface noise",
                "keep": "heart silhouette, major vessels, one crack line",
            },
            "blood_clot": {
                "name": "Blutgerinnsel",
                "motif": "Large blood teardrop with one or two dark clot masses inside and two thick vein lines.",
                "remove": "tiny inner branches, excessive highlights",
                "keep": "teardrop shape, inner clots, glossy blood",
            },
            "anatomy": {
                "name": "Anatomie",
                "motif": "Full human skeleton from front: skull, ribcage, spine, pelvis, arms and legs as one body silhouette, small red heart inside torso.",
                "remove": "rib cracks, vein filigree, blood specks",
                "keep": "whole skeleton readable at a glance, red organ accent",
            },
            "bone_armor": {
                "name": "Knochenpanzer",
                "motif": "Bone rib-plate armor over dark flesh torso with glowing red chest core and shoulder spikes.",
                "remove": "fine muscle fibers, tiny bone nicks",
                "keep": "bone armor silhouette, flesh underlayer, red core",
            },
        },
    },
    "shadow": {
        "school_label": "Schatten",
        "palette": "deep black, dark gray, cold dark blue, silver accent highlights",
        "spells": {
            "precision_strike": {
                "name": "Präzisionsschlag",
                "motif": "Black shadow blade with one sharp silver light reflection along the edge.",
                "remove": "extra blade ornaments, mist particles, secondary reflections",
                "keep": "single shadow sword, silver edge gleam",
            },
            "dark_blade": {
                "name": "Dunkle Klinge",
                "motif": "One long curved blade made of pure shadow, simple elegant silhouette.",
                "remove": "notches, smoke wisps, fine edge noise",
                "keep": "long shadow blade, dark blue-black body",
            },
            "shadow_grasp": {
                "name": "Schattengriff",
                "motif": "Black shadow hand rising from a dark shadow pool below.",
                "remove": "extra fingers detail, splash droplets, background mist",
                "keep": "clear hand shape, shadow pool base",
            },
            "death_stroke": {
                "name": "Todesstoß",
                "motif": "Shadow dagger in front of a simple circular target reticle mark.",
                "remove": "crosshair ticks, glow rings, particle dust",
                "keep": "shadow dagger, bold target circle",
            },
            "shadow_dance": {
                "name": "Schattentanz",
                "motif": "Fighter silhouette with two faint shadow afterimages behind it, dynamic pose.",
                "remove": "extra ghost copies, floor shadows, fine cloth folds",
                "keep": "main fighter silhouette, two shadow echoes",
            },
            "shadow_mantle": {
                "name": "Schattenmantel",
                "motif": "Human figure completely wrapped in a living shadow cloak, only faint silver outline visible.",
                "remove": "facial features, cloak texture noise, edge particles",
                "keep": "hooded shadow figure, silver edge accent",
            },
            "dark_blow": {
                "name": "Finsterer Hieb",
                "motif": "Powerful shadow slash arc with a dark motion trail, diagonal strike.",
                "remove": "multiple trail layers, spark particles, fine gradient bands",
                "keep": "one bold slash arc, dark blue trail",
            },
        },
    },
    "psionics": {
        "school_label": "Psionik",
        "palette": "cyan, turquoise, ice blue, white highlights",
        "spells": {
            "arcane_chain": {
                "name": "Arkane Verkettung",
                "motif": "Three glowing geometric rune symbols connected by bright psionic energy lines in a triangle.",
                "remove": "extra symbols, particle sparks, fine inner glyph details",
                "keep": "three linked symbols, energy connections",
            },
            "will_break": {
                "name": "Willensbruch",
                "motif": "Crystal or light-formed head cracking apart with one bold fracture line.",
                "remove": "many small shards, fine facial features, glow haze",
                "keep": "head silhouette, clear crack, cyan crystal light",
            },
            "mind_strike": {
                "name": "Gedankenschlag",
                "motif": "Glowing brain with one mental shockwave ring emanating forward.",
                "remove": "extra wave rings, vein filigree, tiny spark pixels",
                "keep": "brain shape, one shockwave, cyan glow",
            },
            "mind_stream": {
                "name": "Gedankenstrom",
                "motif": "Spiral stream of psionic energy curling inward, simple dynamic swirl.",
                "remove": "multiple nested spirals, particle trails, fine gradient bands",
                "keep": "one clear energy spiral, cyan-turquoise flow",
            },
            "mind_barrier": {
                "name": "Gedankenbarriere",
                "motif": "Transparent mental dome shield with simple hexagon pattern, only four to six hex cells visible.",
                "remove": "dense hex grid, outer glow haze, fine edge particles",
                "keep": "dome silhouette, readable hex pattern",
            },
            "mind_trap": {
                "name": "Gedankenfalle",
                "motif": "Glowing psionic eye inside a simple angular cage or trap frame.",
                "remove": "ornate cage bars, extra eyes, background mist",
                "keep": "single eye, bold trap frame",
            },
            "mind_redirect": {
                "name": "Gedankenumlenkung",
                "motif": "Curved energy arrow bending a straight psionic beam to a new direction.",
                "remove": "multiple beams, spark nodes, fine arrow feathering",
                "keep": "one beam, one curved redirect arrow",
            },
        },
    },
    "forbidden_runes": {
        "school_label": "Verbotene Runenkunst",
        "palette": "obsidian black, dark copper, blood red, purple glow accents",
        "spells": {
            "shield_wall": {
                "name": "Schildwall",
                "motif": "Black rune monolith stone slab with protective glowing glyphs on the face.",
                "remove": "fine crack network, edge particles, extra rune marks",
                "keep": "monolith slab, bold protective glyphs",
            },
            "shield_breaker": {
                "name": "Schildbrecher",
                "motif": "Broken rune stone tablet shattering outward with three or four bold fragments.",
                "remove": "many tiny shards, dust particles, fine inner carving",
                "keep": "broken tablet, clear exploding fragments",
            },
            "rune_harmony": {
                "name": "Runenharmonie",
                "motif": "Three floating rune stones forming a circle, connected by faint energy.",
                "remove": "extra runes, particle ring, fine glyph filigree",
                "keep": "three runes in circle, simple energy link",
            },
            "purity": {
                "name": "Reinheit",
                "motif": "Single ancient symmetrical glyph carved on dark stone, perfectly centered.",
                "remove": "ornate border, micro scratches, glow haze",
                "keep": "one bold symmetric glyph, stone backdrop",
            },
            "forbidden_seal": {
                "name": "Verbotenes Siegel",
                "motif": "Sealed rune circle with two breaking chains on the sides.",
                "remove": "many chain links, fine seal lines, background cracks",
                "keep": "rune seal, two clear breaking chains",
            },
            "amplified_seal": {
                "name": "Verstärktes Siegel",
                "motif": "Large glowing rune with one additional outer ring, radiant power.",
                "remove": "multiple rings, tiny sparkles, fine inner pattern",
                "keep": "central rune, one outer ring, purple-red glow",
            },
            "fracture_rune": {
                "name": "Bruchrune",
                "motif": "Rune symbol in the center of a deep reality crack or fissure in stone.",
                "remove": "branching micro-cracks, edge debris, fine glow noise",
                "keep": "central rune, one bold fissure",
            },
            "rune_break": {
                "name": "Runenbruch",
                "motif": "Shattering glyph with three stone splinters flying outward.",
                "remove": "many small fragments, dust cloud, fine glyph details",
                "keep": "breaking glyph, three clear splinters",
            },
            "rune_thrust": {
                "name": "Runenstoß",
                "motif": "Sharp angular rune spear thrusting forward like a blade.",
                "remove": "motion blur layers, spark trails, fine engravings",
                "keep": "rune spear shape, forward thrust silhouette",
            },
        },
    },
    "chaos": {
        "school_label": "Chaosmagie",
        "palette": "poison green, emerald green, black, yellow-green energy, orange accents only",
        "spells": {
            "chaos_eruption": {
                "name": "Chaoseruption",
                "motif": "Explosion of fel-green flames bursting outward, unstable chaos fire.",
                "remove": "smoke clouds, many spark particles, fine flame filaments",
                "keep": "bold green explosion, fel-fire silhouette",
            },
            "chaos_blade": {
                "name": "Chaosklinge",
                "motif": "Jagged blade made of unstable green chaotic energy, wicked shape.",
                "remove": "extra spikes, particle trails, fine edge noise",
                "keep": "jagged green energy blade, clear silhouette",
            },
            "chaos_catalyst": {
                "name": "Chaoskatalysator",
                "motif": "Sphere of chaotic energy with two or three green lightning bolts around it.",
                "remove": "many lightning forks, outer glow haze, fine surface texture",
                "keep": "energy orb, few green bolts",
            },
        },
    },
    "soul": {
        "school_label": "Seelenmagie",
        "palette": "ghost white, pale lavender, silver, bluish white glow",
        "spells": {
            "soul_bind": {
                "name": "Seelenbindung",
                "motif": "Two floating soul orbs connected by one ethereal thread.",
                "remove": "extra souls, particle aura, fine wisp details",
                "keep": "two soul orbs, one connecting thread",
            },
            "soul_cut": {
                "name": "Seelenschnitt",
                "motif": "Glowing soul orb being cut by a ghostly spectral blade.",
                "remove": "splatter particles, multiple blades, glow haze",
                "keep": "soul orb, one ghost blade cut",
            },
            "soul_pulse": {
                "name": "Seelenimpuls",
                "motif": "Circular wave of white soul energy radiating outward from a center point.",
                "remove": "multiple nested rings, fine gradient bands, spark dots",
                "keep": "one bold pulse ring, soul energy wave",
            },
            "soul_spark": {
                "name": "Seelenfunke",
                "motif": "Small floating soul flame with a soft bright aura.",
                "remove": "many wisp trails, fine flame filaments, outer haze",
                "keep": "single soul flame, simple glow",
            },
        },
    },
}

# Backwards-compatible alias
BIOMANCY_PILOT_PROMPTS = SCHOOL_PROMPTS["biomancy"]["spells"]
BIOMANCY_PALETTE = SCHOOL_PROMPTS["biomancy"]["palette"]


def raw_ref_path(spell_id: str, source: str = "v2") -> Path:
    raw_dir = RAW_DIRS[source]
    if source == "v1" and spell_id in REFERENCE_RAW_OVERRIDES:
        filename = REFERENCE_RAW_OVERRIDES[spell_id]
    else:
        filename = f"{spell_id}_ref.png"
    return raw_dir / filename


def installed_icon_path(spell_id: str) -> Path:
    folder = SPELL_SCHOOL_BY_ID[spell_id]
    return SPELLS_DIR / folder / f"{spell_id}.png"


def build_pilot_prompt(spell_id: str) -> str:
    for school in SCHOOL_PROMPTS.values():
        if spell_id in school["spells"]:
            spec = school["spells"][spell_id]
            return (
                f"BattleMages spell icon, {school['school_label']} school, {spec['name']}. "
                f"Motif: {spec['motif']} "
                f"Palette: {school['palette']}. "
                f"Keep: {spec['keep']}. "
                f"Remove: {spec['remove']}. "
                f"Pixel art game icon, dark fantasy.{SIMPLIFICATION_SUFFIX}"
            )
    raise KeyError(spell_id)
