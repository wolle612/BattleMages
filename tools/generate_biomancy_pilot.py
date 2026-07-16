#!/usr/bin/env python3
"""Generate simplified Biomantie v2 pilot icons into reference_v2."""

from __future__ import annotations

import argparse
from pathlib import Path

from generate_reference_icons import ICON_BUILDERS
from icon_config import (
    BIOMANCY_PILOT_PROMPTS,
    PILOT_BATCHES,
    RAW_DIRS,
    build_pilot_prompt,
    raw_ref_path,
)

ROOT = Path(__file__).resolve().parents[1]
RAW_V2 = RAW_DIRS["v2"]
BENCHMARK_DIR = RAW_V2 / "_benchmark_procedural"
SOURCE_V1_DIR = RAW_V2 / "_source_v1"


def export_biomancy_benchmarks() -> list[Path]:
    BENCHMARK_DIR.mkdir(parents=True, exist_ok=True)
    saved: list[Path] = []

    for spell_id in PILOT_BATCHES["biomancy"]:
        _, builder = ICON_BUILDERS[spell_id]
        image = builder()
        destination = BENCHMARK_DIR / f"{spell_id}_ref.png"
        image.save(destination, optimize=True)
        saved.append(destination)
        print(f"Saved benchmark {destination.relative_to(ROOT)}")

    return saved


def copy_v1_sources() -> list[Path]:
    SOURCE_V1_DIR.mkdir(parents=True, exist_ok=True)
    copied: list[Path] = []

    for spell_id in PILOT_BATCHES["biomancy"]:
        source = raw_ref_path(spell_id, source="v1")
        if not source.exists():
            print(f"Skip missing v1 source: {source.relative_to(ROOT)}")
            continue
        destination = SOURCE_V1_DIR / f"{spell_id}_ref.png"
        destination.write_bytes(source.read_bytes())
        copied.append(destination)
        print(f"Copied v1 source {destination.relative_to(ROOT)}")

    return copied


def write_prompt_sheet() -> Path:
    lines = [
        "# Biomantie Icon Pilot v2 — Generation Prompts",
        "",
        "## Workflow",
        "",
        "1. v1-Quellen liegen unter `assets/icons/raw/reference_v2/_source_v1/`.",
        "2. Prompt unten kopieren und mit Cursor CreateImage (Referenz: `_source_v1/`) erzeugen.",
        "3. Freigegebenes Ergebnis als `{spell_id}_ref.png` nach `assets/icons/raw/reference_v2/` legen.",
        "4. Review: `py tools/generate_icon_preview.py --batch biomancy --source v2`",
        "5. Vergleich: `py tools/generate_icon_preview.py --batch biomancy --mode compare --left-source installed --right-source v2`",
        "6. Install: `py tools/install_reference_icons.py --batch biomancy --source v2`",
        "",
        "Lesbarkeits-Benchmark (procedural, nicht final): `_benchmark_procedural/`.",
        "",
    ]

    for spell_id in PILOT_BATCHES["biomancy"]:
        spec = BIOMANCY_PILOT_PROMPTS[spell_id]
        lines.extend(
            [
                f"## {spec['name']} (`{spell_id}`)",
                "",
                f"**Motiv:** {spec['motif']}",
                f"**Behalten:** {spec['keep']}",
                f"**Streichen:** {spec['remove']}",
                "",
                "```",
                build_pilot_prompt(spell_id),
                "```",
                "",
            ]
        )

    destination = ROOT / "docs" / "design" / "icon_pilot_biomancy_v2.md"
    destination.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {destination.relative_to(ROOT)}")
    return destination


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--prompts-only",
        action="store_true",
        help="Only write prompts and copy v1 sources.",
    )
    args = parser.parse_args()

    write_prompt_sheet()
    copy_v1_sources()

    if args.prompts_only:
        return

    export_biomancy_benchmarks()


if __name__ == "__main__":
    main()
