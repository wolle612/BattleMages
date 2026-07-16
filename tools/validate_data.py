#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def extract_spell_blocks(text):
    blocks = []
    for match in re.finditer(r"\{\s*\n\s*id:\s*\"([^\"]+)\"", text):
        start = match.start()
        depth = 0
        for index in range(start, len(text)):
            if text[index] == "{":
                depth += 1
            elif text[index] == "}":
                depth -= 1
                if depth == 0:
                    blocks.append((match.group(1), text[start : index + 1]))
                    break
    return blocks


def has_field(block, field):
    return re.search(rf"\b{field}\s*:", block) is not None


def validate_spells():
    text = (ROOT / "data" / "spellbookCore.js").read_text(encoding="utf-8")
    text += (ROOT / "data" / "spellbookPart2.js").read_text(encoding="utf-8")
    blocks = extract_spell_blocks(text)
    required = [
        "id",
        "school",
        "name",
        "type",
        "role",
        "build",
        "mechanics",
        "rarity",
        "description",
        "tooltip",
        "effects",
        "upgrades",
    ]
    missing = {}
    for spell_id, block in blocks:
        miss = [field for field in required if not has_field(block, field)]
        if miss:
            missing[spell_id] = miss
    profile_ids = set(re.findall(r"^\s+(\w+):\s*\{", (ROOT / "data" / "spellUpgradeProfiles.js").read_text(encoding="utf-8"), re.M))
    spell_ids = {spell_id for spell_id, _ in blocks}
    return {
        "count": len(blocks),
        "missing_fields": missing,
        "missing_profiles": sorted(spell_ids - profile_ids),
        "orphan_profiles": sorted(profile_ids - spell_ids),
    }


def validate_enemies():
    text = (ROOT / "data" / "enemies.js").read_text(encoding="utf-8")
    match = re.search(r"const rawEnemyDefinitions = (\[[\s\S]*?\]);", text)
    enemies = json.loads(match.group(1))
    required = [
        "id",
        "name",
        "encounter",
        "tier",
        "combatIdentity",
        "buildTest",
        "hp",
        "passive",
        "actionBar",
        "ui",
        "rewards",
    ]
    missing = {}
    for enemy in enemies:
        miss = [field for field in required if field not in enemy]
        if miss:
            missing[enemy.get("id", "?")] = miss
    return {"count": len(enemies), "missing_fields": missing}


if __name__ == "__main__":
    print("SPELLS", json.dumps(validate_spells(), indent=2, ensure_ascii=False))
    print("ENEMIES", json.dumps(validate_enemies(), indent=2, ensure_ascii=False))
