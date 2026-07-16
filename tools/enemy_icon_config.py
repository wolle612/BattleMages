"""Enemy action icon keys, aliases, and generation prompts."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENEMY_ICONS_DIR = ROOT / "assets" / "icons" / "enemy_actions"

# Different action ids that share one visual icon.
ACTION_ICON_ALIASES = {
    "construct_shield": "rune_shield",
    "construct_attack": "rune_attack",
    "soul_shield": "rune_shield",
}

SCHOOL_TECHNIQUE_SCHOOLS = [
    "blood",
    "shadow",
    "dream",
    "rune",
    "star",
    "primal",
]

ENEMY_STYLE_SUFFIX = (
    " BattleMages enemy ability icon, hostile dark fantasy pixel art. "
    "Bronze, basalt, weathered stone, restrained red accents. "
    "Simplified readable design: bold shapes, thick outlines, about 25% fewer"
    " fine details. Single centered motif, orthographic front view,"
    " transparent background, no text. Must read clearly at 48 pixels."
)

ENEMY_ACTION_PROMPTS: dict[str, str] = {
    "magic_bolt": "Violet arcane magic bolt projectile, simple glowing cone shape.",
    "slash": "Heavy iron sword slash arc, brutal melee strike.",
    "bone_strike": "Bone spike strike, white bone shard with red impact.",
    "shadow_strike_light": "Quick thin shadow blade thrust, light attack.",
    "shadow_strike_heavy": "Heavy thick shadow blade strike, strong attack.",
    "twin_shadow_cut": "Two parallel shadow slash marks, double hit.",
    "rune_shield": "Dark rune stone shield plate with protective glyph.",
    "rune_attack": "Rune-etched stone blast projectile forward.",
    "rune_explosion": "Rune stone exploding outward, bold fragments.",
    "oracle_bolt": "Mystic oracle lightning bolt, purple-white energy.",
    "oracle_blast": "Large oracle energy burst wave.",
    "chaos_bolt": "Poison-green chaos energy bolt, fel green not red.",
    "chaos_surge": "Poison-green chaos wave surge, fel green not red.",
    "soul_strike": "Pale soul energy spear thrust, ghost white.",
    "soul_blast": "Soul energy wave burst, lavender white glow.",
    "soul_crush": "Heavy soul crushing fist or hammer of spirit energy.",
    "beast_claw": "Three dark beast claw marks, diagonal slash.",
    "beast_maul": "Shadow beast pounce leap strike silhouette.",
    "flesh_strike": "Bloody flesh rending claw strike, biomancy enemy attack.",
    "flesh_heal": "Organic flesh regeneration swirl, dark red healing.",
    "flesh_crush": "Heavy flesh hammer crush impact.",
    "nameless_strike": "Dark nameless energy slash, void purple-gray.",
    "nameless_shield": "Dark void shield barrier, nameless protection.",
    "nameless_crush": "Void nameless crushing blast.",
    "arcane_bolt": "Classic arcane mage bolt, blue-violet energy sphere trail.",
    "grand_spell": "Massive boss grand spell rune circle explosion.",
    "school_technique_blood": "Enemy biomancy technique: bone and blood burst attack icon.",
    "school_technique_shadow": "Enemy shadow technique: dark blade strike icon.",
    "school_technique_dream": "Enemy psionic technique: cyan mind blast icon.",
    "school_technique_rune": "Enemy rune technique: stone rune shield and blast icon.",
    "school_technique_star": "Enemy chaos technique: fel-green chaos burst icon.",
    "school_technique_primal": "Enemy soul technique: pale soul drain icon.",
}


def normalize_action_icon_key(action_id: str) -> str:
    if not action_id:
        return "unknown"

    key = action_id
    if key.endswith("_repeat"):
        key = key[: -len("_repeat")]

    return ACTION_ICON_ALIASES.get(key, key)


def all_required_icon_keys() -> list[str]:
    keys = set(ENEMY_ACTION_PROMPTS)
    return sorted(keys)


def build_prompt(icon_key: str) -> str:
    motif = ENEMY_ACTION_PROMPTS[icon_key]
    return f"{motif}{ENEMY_STYLE_SUFFIX}"
