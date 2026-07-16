#!/usr/bin/env python3
"""Validate enemy action icon coverage."""

from __future__ import annotations

import json
import re
from pathlib import Path

from enemy_icon_config import all_required_icon_keys, normalize_action_icon_key

ROOT = Path(__file__).resolve().parents[1]
ENEMIES_FILE = ROOT / "data" / "enemies.js"
ICONS_DIR = ROOT / "assets" / "icons" / "enemy_actions"


def load_action_ids() -> set[str]:
    text = ENEMIES_FILE.read_text(encoding="utf-8")
    action_ids: set[str] = set()

    for match in re.finditer(r"actionBar:\s*\[([\s\S]*?)\n\s*\]", text):
        block = match.group(1)
        for id_match in re.finditer(
            r'\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"',
            block,
        ):
            action_ids.add(normalize_action_icon_key(id_match.group(1)))

    for school in ("blood", "shadow", "dream", "rune", "star", "primal"):
        action_ids.add(f"school_technique_{school}")

    return action_ids


def main() -> None:
    required_from_data = load_action_ids()
    required_from_config = set(all_required_icon_keys())
    required = required_from_data | required_from_config

    missing = sorted(
        key for key in required if not (ICONS_DIR / f"{key}.png").exists()
    )
    found = len(required) - len(missing)

    print(
        json.dumps(
            {
                "required_icons": len(required),
                "icons_found": found,
                "icons_missing": len(missing),
                "missing": missing,
                "all_matched": len(missing) == 0,
            },
            indent=2,
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
