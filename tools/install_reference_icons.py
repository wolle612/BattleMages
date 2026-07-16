#!/usr/bin/env python3
"""Install spell icons from raw reference sources into game asset folders."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from icon_config import (
    ARCHIVE_DIRS,
    PILOT_BATCHES,
    RAW_DIRS,
    SPELL_SCHOOL_BY_ID,
    raw_ref_path,
)
from process_spell_icon import process_icon

ROOT = Path(__file__).resolve().parents[1]
SPELLS_DIR = ROOT / "assets" / "icons" / "spells"

LEGACY_BATCHES = {
    "reference": [
        "bone_fracture",
        "dark_blade",
        "mind_barrier",
        "shield_wall",
        "chaos_eruption",
        "soul_spark",
    ],
    "pending": [
        "organ_failure",
        "blood_clot",
        "anatomy",
        "bone_armor",
        "precision_strike",
        "shadow_grasp",
        "death_stroke",
        "shadow_dance",
        "shadow_mantle",
        "dark_blow",
        "arcane_chain",
        "will_break",
        "mind_strike",
        "mind_stream",
        "mind_trap",
        "mind_redirect",
        "shield_breaker",
        "rune_harmony",
        "purity",
        "forbidden_seal",
        "amplified_seal",
        "fracture_rune",
        "rune_break",
        "rune_thrust",
        "chaos_blade",
        "chaos_catalyst",
        "soul_bind",
        "soul_cut",
        "soul_pulse",
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
}


def resolve_batch(batch: str, source: str) -> list[str]:
    if batch in PILOT_BATCHES:
        return PILOT_BATCHES[batch]

    if batch == "all":
        if source == "v1":
            return LEGACY_BATCHES["reference"] + LEGACY_BATCHES["pending"]
        return sum(PILOT_BATCHES.values(), [])

    return LEGACY_BATCHES[batch]


def archive_existing(spell_id: str, archive: str) -> None:
    folder = SPELL_SCHOOL_BY_ID[spell_id]
    source = SPELLS_DIR / folder / f"{spell_id}.png"
    if not source.exists():
        return

    target_dir = ARCHIVE_DIRS[archive] / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target_dir / f"{spell_id}.png")


def install_spell(spell_id: str, *, source: str, archive: str) -> None:
    folder = SPELL_SCHOOL_BY_ID[spell_id]
    raw_source = raw_ref_path(spell_id, source=source)
    if not raw_source.exists():
        raise FileNotFoundError(f"Missing raw icon: {raw_source}")

    archive_existing(spell_id, archive)
    destination = SPELLS_DIR / folder / f"{spell_id}.png"
    process_icon(raw_source, destination)
    print(f"Installed {destination.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--batch",
        choices=(
            "reference",
            "pending",
            "shadow",
            "all",
            *PILOT_BATCHES.keys(),
        ),
        default="biomancy",
    )
    parser.add_argument(
        "--source",
        choices=tuple(RAW_DIRS),
        default="v2",
        help="Raw reference folder version (default: v2).",
    )
    parser.add_argument(
        "--archive",
        choices=tuple(ARCHIVE_DIRS),
        default="v2",
        help="Archive currently installed icons here before replacing.",
    )
    parser.add_argument(
        "--spell",
        action="append",
        dest="spells",
        help="Install only specific spell IDs (can be repeated).",
    )
    args = parser.parse_args()

    spell_ids = args.spells or resolve_batch(args.batch, args.source)

    for spell_id in spell_ids:
        install_spell(spell_id, source=args.source, archive=args.archive)


if __name__ == "__main__":
    main()
