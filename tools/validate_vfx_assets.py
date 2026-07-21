#!/usr/bin/env python3
"""Regressionsschutz fuer die VFX-Datenschicht (Phase 5 der VFX-Migration).

Prueft, dass jeder Preset-/Manifest-Eintrag in data/vfx/*.js auf eine
tatsaechlich existierende Datei zeigt, und dass jeder Zauber genau einen
gueltigen Projektiltyp zugewiesen bekommt. Soll verhindern, dass sich
verwaiste Presets wie die entfernten mind_pressure_arc/mind_ring_burst/
psionic_cast_mind_focus_hex-Eintraege unbemerkt wieder einschleichen.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

VALID_PROJECTILE_TYPES = {"beam", "cut", "explosion", "projectile", "shield"}


def load_json_const(relative_path, const_name):
    text = (ROOT / relative_path).read_text(encoding="utf-8")
    match = re.search(rf"const {const_name} = (\{{[\s\S]*?\}}|\[[\s\S]*?\]);", text)
    if not match:
        raise ValueError(f"{const_name} nicht gefunden in {relative_path}")
    return json.loads(match.group(1))


def load_spell_ids():
    text = (ROOT / "data" / "spellbookCore.js").read_text(encoding="utf-8")
    text += (ROOT / "data" / "spellbookPart2.js").read_text(encoding="utf-8")
    return set(re.findall(r'id:\s*"([^"]+)"', text))


def check_paths_exist(paths):
    return sorted(path for path in paths if not (ROOT / path).exists())


def check_school_sheet_presets():
    presets = load_json_const("data/vfx/schoolVfxAssets.js", "VFX_SCHOOL_SHEET_PRESETS")
    missing = [
        {"styleKey": style_key, "path": preset["spritesheet"]}
        for style_key, preset in presets.items()
        if not (ROOT / preset["spritesheet"]).exists()
    ]
    return {"checked": len(presets), "missing": missing}


def check_school_sheet_manifests():
    manifests = load_json_const("data/vfx/schoolVfxAssets.js", "VFX_SCHOOL_SHEET_MANIFESTS")
    return {"checked": len(manifests), "missing": check_paths_exist(manifests)}


def extract_flat_object_entries(text):
    """(name, body) fuer jedes `name: { ...ohne verschachtelte Klammern... }`."""
    return re.findall(r"(\w+):\s*\{([^{}]*)\}", text)


def check_effect_presets():
    text = (ROOT / "data" / "vfx" / "effectPresets.js").read_text(encoding="utf-8")
    missing = []
    checked = 0
    for name, body in extract_flat_object_entries(text):
        sheet_match = re.search(r'spritesheet:\s*"([^"]+)"', body)
        if not sheet_match:
            continue
        checked += 1
        if not (ROOT / sheet_match.group(1)).exists():
            missing.append({"preset": name, "path": sheet_match.group(1)})
    return {"checked": checked, "missing": missing}


def check_spell_projectile_types():
    text = (ROOT / "data" / "vfx" / "spellVfxDefinitions.js").read_text(encoding="utf-8")
    match = re.search(r"const SPELL_PROJECTILE_TYPES = \{([\s\S]*?)\};", text)
    entries = dict(re.findall(r'(\w+):\s*"(\w+)"', match.group(1)))

    spell_ids = load_spell_ids()
    return {
        "checked": len(entries),
        "unknown_spell_ids": sorted(set(entries) - spell_ids),
        "invalid_projectile_types": {
            spell_id: p_type
            for spell_id, p_type in entries.items()
            if p_type not in VALID_PROJECTILE_TYPES
        },
        "spells_without_projectile_type": sorted(spell_ids - set(entries)),
    }


def main():
    result = {
        "school_sheet_presets": check_school_sheet_presets(),
        "school_sheet_manifests": check_school_sheet_manifests(),
        "effect_presets": check_effect_presets(),
        "spell_projectile_types": check_spell_projectile_types(),
    }
    spell_check = result["spell_projectile_types"]
    all_ok = (
        not result["school_sheet_presets"]["missing"]
        and not result["school_sheet_manifests"]["missing"]
        and not result["effect_presets"]["missing"]
        and not spell_check["unknown_spell_ids"]
        and not spell_check["invalid_projectile_types"]
        and not spell_check["spells_without_projectile_type"]
    )
    result["all_ok"] = all_ok
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if not all_ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
