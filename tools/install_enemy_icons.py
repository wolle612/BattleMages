#!/usr/bin/env python3
"""Process raw enemy action icons into game asset folder."""

from __future__ import annotations

import argparse
from pathlib import Path

from enemy_icon_config import ENEMY_ICONS_DIR, all_required_icon_keys
from process_spell_icon import process_icon

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "assets" / "icons" / "raw" / "enemy_actions"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--icon",
        action="append",
        dest="icons",
        help="Install specific icon key(s). Default: all configured keys with raw source.",
    )
    args = parser.parse_args()

    icon_keys = args.icons or all_required_icon_keys()

    for icon_key in icon_keys:
        source = RAW_DIR / f"{icon_key}.png"
        if not source.exists():
            print(f"Skip missing raw: {source.relative_to(ROOT)}")
            continue

        destination = ENEMY_ICONS_DIR / f"{icon_key}.png"
        process_icon(source, destination)
        print(f"Installed {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
