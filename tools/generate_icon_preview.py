#!/usr/bin/env python3
"""Build 48px review sheets from raw or installed spell icon sources."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

from icon_config import (
    PILOT_BATCHES,
    RAW_DIRS,
    SPELL_SCHOOL_BY_ID,
    installed_icon_path,
    raw_ref_path,
)

ROOT = Path(__file__).resolve().parents[1]
PREVIEW_BG = (20, 22, 28, 255)
LABEL_HEIGHT = 0


def load_icon(spell_id: str, source: str) -> Image.Image:
    if source == "installed":
        path = installed_icon_path(spell_id)
    else:
        path = raw_ref_path(spell_id, source=source)
        if not path.exists():
            path = RAW_DIRS[source] / f"{spell_id}.png"

    if not path.exists():
        raise FileNotFoundError(path)

    return Image.open(path).convert("RGBA")


def make_preview(
    spell_ids: list[str],
    *,
    source: str,
    thumb_size: int,
    cell_size: int,
    columns: int,
    label: str,
) -> Image.Image:
    columns = min(columns, max(1, len(spell_ids)))
    rows = (len(spell_ids) + columns - 1) // columns
    sheet = Image.new(
        "RGBA",
        (columns * cell_size, rows * cell_size + LABEL_HEIGHT),
        PREVIEW_BG,
    )

    for index, spell_id in enumerate(spell_ids):
        icon = load_icon(spell_id, source)
        thumb = icon.resize((thumb_size, thumb_size), Image.Resampling.NEAREST)
        offset_x = (index % columns) * cell_size + (cell_size - thumb_size) // 2
        offset_y = (index // columns) * cell_size + (cell_size - thumb_size) // 2
        sheet.paste(thumb, (offset_x, offset_y), thumb)

    return sheet


def make_comparison_preview(
    spell_ids: list[str],
    *,
    left_source: str,
    right_source: str,
    thumb_size: int,
    cell_width: int,
    cell_height: int,
) -> Image.Image:
    sheet = Image.new(
        "RGBA",
        (cell_width * 2, cell_height * len(spell_ids)),
        PREVIEW_BG,
    )

    for row, spell_id in enumerate(spell_ids):
        for column, source in enumerate((left_source, right_source)):
            icon = load_icon(spell_id, source)
            thumb = icon.resize((thumb_size, thumb_size), Image.Resampling.NEAREST)
            x = column * cell_width + (cell_width - thumb_size) // 2
            y = row * cell_height + (cell_height - thumb_size) // 2
            sheet.paste(thumb, (x, y), thumb)

    return sheet


def default_output_name(mode: str, batch: str, source: str) -> str:
    if mode == "compare":
        return f"preview_48px_{batch}_v1_vs_v2.png"
    return f"preview_48px_{batch}_{source}.png"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--batch",
        choices=tuple(PILOT_BATCHES),
        default="biomancy",
    )
    parser.add_argument(
        "--mode",
        choices=("single", "compare"),
        default="single",
    )
    parser.add_argument(
        "--source",
        choices=("v1", "v2", "installed", "benchmark"),
        default="v2",
    )
    parser.add_argument(
        "--left-source",
        choices=("v1", "v2", "installed", "benchmark"),
        default="installed",
    )
    parser.add_argument(
        "--right-source",
        choices=("v1", "v2", "installed", "benchmark"),
        default="v2",
    )
    parser.add_argument("--thumb-size", type=int, default=48)
    parser.add_argument("--cell-size", type=int, default=96)
    parser.add_argument("--columns", type=int, default=5)
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Defaults to assets/icons/raw/reference_v2/<name>.png",
    )
    args = parser.parse_args()

    spell_ids = PILOT_BATCHES[args.batch]
    output_dir = RAW_DIRS["v2"]
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.mode == "compare":
        image = make_comparison_preview(
            spell_ids,
            left_source=args.left_source,
            right_source=args.right_source,
            thumb_size=args.thumb_size,
            cell_width=args.cell_size,
            cell_height=args.cell_size,
        )
        output = args.output or output_dir / default_output_name(
            "compare",
            args.batch,
            args.source,
        )
    else:
        image = make_preview(
            spell_ids,
            source=args.source,
            thumb_size=args.thumb_size,
            cell_size=args.cell_size,
            columns=args.columns,
            label=args.batch,
        )
        output = args.output or output_dir / default_output_name(
            "single",
            args.batch,
            args.source,
        )

    image.save(output, optimize=True)
    print(f"Saved {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
