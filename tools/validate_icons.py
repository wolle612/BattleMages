#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ICONS_ROOT = ROOT / "assets" / "icons" / "spells"

SCHOOL_ICON_FOLDERS = {
    "blood": "biomancy",
    "shadow": "shadow",
    "dream": "psionics",
    "rune": "forbidden_runes",
    "star": "chaos",
    "primal": "soul",
}


def load_spells():
    text = (ROOT / "data" / "spellbookCore.js").read_text(encoding="utf-8")
    text += (ROOT / "data" / "spellbookPart2.js").read_text(encoding="utf-8")
    spells = []
    for match in re.finditer(r'id:\s*"([^"]+)"[\s\S]*?school:\s*"([^"]+)"', text):
        spells.append({"id": match.group(1), "school": match.group(2)})
    return spells


def main():
    spells = load_spells()
    found = 0
    missing = []
    wrong_folder = []
    ids = []

    for spell in spells:
        spell_id = spell["id"]
        school = spell["school"]
        ids.append(spell_id)

        if ids.count(spell_id) > 1:
            continue

        folder = SCHOOL_ICON_FOLDERS.get(school, school)
        icon_path = ICONS_ROOT / folder / f"{spell_id}.png"

        if not icon_path.exists():
            missing.append(
                {
                    "id": spell_id,
                    "school": school,
                    "expected": str(icon_path.relative_to(ROOT)).replace("\\", "/"),
                }
            )
            continue

        found += 1

        if school not in SCHOOL_ICON_FOLDERS:
            wrong_folder.append(spell_id)

    duplicates = [spell_id for spell_id in set(ids) if ids.count(spell_id) > 1]

    print(
        json.dumps(
            {
                "spell_count": len(spells),
                "icons_found": found,
                "icons_missing": len(missing),
                "missing": missing,
                "duplicate_ids": duplicates,
                "all_matched": len(missing) == 0 and len(duplicates) == 0,
            },
            indent=2,
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
