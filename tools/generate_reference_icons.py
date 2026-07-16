#!/usr/bin/env python3
"""Generate readable pixel-art spell icons for BattleMages."""

from __future__ import annotations

import argparse
from collections.abc import Callable
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
GRID = 96
OUTPUT = 1024

TRANSPARENT = (0, 0, 0, 0)

# ---------------------------------------------------------------------------
# Biomantie palette
# ---------------------------------------------------------------------------
BONE = (232, 220, 200, 255)
BONE_SHADOW = (170, 150, 130, 255)
BONE_DARK = (130, 110, 95, 255)
BLOOD_RED = (140, 30, 45, 255)
BLOOD_DARK = (95, 20, 55, 255)
FLESH = (185, 95, 95, 255)
FLESH_DARK = (150, 70, 75, 255)
VEIN = (110, 25, 40, 255)

# ---------------------------------------------------------------------------
# Schatten palette
# ---------------------------------------------------------------------------
SHADOW_BLACK = (12, 12, 18, 255)
SHADOW_GRAY = (42, 44, 54, 255)
SHADOW_BLUE = (34, 44, 72, 255)
SHADOW_SILVER = (188, 198, 220, 255)
SHADOW_MIST = (28, 32, 48, 200)


def upscale(canvas: Image.Image) -> Image.Image:
    return canvas.resize((OUTPUT, OUTPUT), Image.Resampling.NEAREST)


def new_canvas() -> Image.Image:
    return Image.new("RGBA", (GRID, GRID), TRANSPARENT)


def px(draw: ImageDraw.ImageDraw, x: int, y: int, color: tuple[int, int, int, int]) -> None:
    draw.rectangle((x, y, x, y), fill=color)


def fill_poly(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[int, int]],
    color: tuple[int, int, int, int],
) -> None:
    draw.polygon(points, fill=color)


# ---------------------------------------------------------------------------
# Biomantie
# ---------------------------------------------------------------------------
def draw_bone_fracture() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(34, 18), (58, 18), (62, 28), (30, 28)], BONE)
    fill_poly(draw, [(36, 20), (56, 20), (58, 26), (34, 26)], BONE_SHADOW)
    fill_poly(draw, [(28, 58), (68, 58), (72, 72), (24, 72)], BONE)
    fill_poly(draw, [(32, 60), (64, 60), (66, 70), (30, 70)], BONE_SHADOW)
    fill_poly(draw, [(42, 30), (54, 30), (58, 42), (38, 42)], BLOOD_DARK)
    fill_poly(draw, [(44, 32), (52, 32), (50, 40), (46, 40)], BLOOD_RED)
    for point in [(36, 34), (60, 36), (40, 48), (58, 46), (46, 52), (50, 50)]:
        px(draw, *point, FLESH)

    return upscale(canvas)


def draw_organ_failure() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(48, 20), (66, 34), (58, 62), (38, 62), (30, 34)], FLESH)
    fill_poly(draw, [(48, 24), (62, 36), (56, 58), (40, 58), (34, 36)], BLOOD_RED)
    fill_poly(draw, [(44, 30), (52, 30), (50, 50), (46, 50)], BLOOD_DARK)

    draw.line((40, 38, 56, 46), fill=VEIN, width=2)
    draw.line((36, 48, 60, 40), fill=VEIN, width=2)
    draw.line((42, 54, 54, 54), fill=VEIN, width=2)
    for point in [(46, 42), (50, 44), (44, 50), (52, 48), (48, 36)]:
        px(draw, *point, BLOOD_DARK)

    return upscale(canvas)


def draw_blood_clot() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(48, 16), (62, 40), (58, 68), (48, 78), (38, 68), (34, 40)], BLOOD_RED)
    fill_poly(draw, [(48, 22), (56, 40), (54, 64), (48, 72), (42, 64), (40, 40)], FLESH)
    fill_poly(draw, [(44, 44), (52, 44), (50, 58), (46, 58)], BLOOD_DARK)
    for point in [(46, 48), (50, 52), (44, 56), (52, 56), (48, 50)]:
        px(draw, *point, BLOOD_DARK)
    px(draw, 48, 28, (200, 110, 110, 255))

    return upscale(canvas)


def draw_anatomy() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(48, 18), (68, 34), (64, 72), (32, 72), (28, 34)], BONE_SHADOW)
    fill_poly(draw, [(48, 22), (62, 36), (58, 68), (38, 68), (34, 36)], BONE)

    for x in (40, 48, 56):
        draw.line((x, 28, x, 66), fill=BONE_DARK, width=2)
    for y in (34, 44, 54):
        draw.line((36, y, 60, y), fill=BONE_DARK, width=1)

    draw.ellipse((42, 40, 54, 54), fill=FLESH)
    draw.ellipse((44, 42, 52, 50), fill=BLOOD_RED)
    fill_poly(draw, [(46, 56), (50, 56), (50, 64), (46, 64)], FLESH_DARK)

    return upscale(canvas)


def draw_bone_armor() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(48, 24), (60, 34), (58, 70), (38, 70), (36, 34)], BONE_SHADOW)
    for curve in (
        [(34, 30), (30, 48), (34, 66), (38, 66), (36, 48)],
        [(62, 30), (66, 48), (62, 66), (58, 66), (60, 48)],
        [(40, 28), (48, 26), (56, 28), (54, 38), (42, 38)],
        [(42, 38), (48, 36), (54, 38), (52, 48), (44, 48)],
        [(44, 48), (48, 46), (52, 48), (50, 58), (46, 58)],
    ):
        fill_poly(draw, curve, BONE)
    for curve in (
        [(36, 32), (34, 48), (36, 62), (40, 60), (38, 48)],
        [(60, 32), (62, 48), (60, 62), (56, 60), (58, 48)],
    ):
        fill_poly(draw, curve, BONE_DARK)

    return upscale(canvas)


# ---------------------------------------------------------------------------
# Schatten
# ---------------------------------------------------------------------------
def draw_precision_strike() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(22, 62), (36, 48), (70, 22), (76, 28), (42, 54), (28, 68)], SHADOW_BLACK)
    fill_poly(draw, [(28, 58), (40, 46), (66, 24), (70, 28), (44, 50), (32, 62)], SHADOW_GRAY)
    for point in [(72, 22), (68, 26), (62, 32), (54, 40), (46, 48), (38, 56)]:
        px(draw, *point, SHADOW_SILVER)
    fill_poly(draw, [(18, 66), (28, 56), (32, 60), (22, 70)], SHADOW_GRAY)

    return upscale(canvas)


def draw_dark_blade() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(18, 70), (34, 54), (72, 18), (82, 24), (44, 62), (28, 78)], SHADOW_BLACK)
    fill_poly(draw, [(24, 66), (38, 52), (68, 22), (74, 26), (42, 58), (30, 70)], SHADOW_GRAY)
    fill_poly(draw, [(30, 60), (42, 48), (62, 28), (66, 32), (46, 52), (36, 62)], SHADOW_BLUE)
    for point in [(74, 20), (70, 24), (66, 28), (58, 36), (50, 44), (42, 52), (34, 60), (78, 24), (72, 30)]:
        px(draw, *point, SHADOW_SILVER)
    fill_poly(draw, [(16, 72), (28, 60), (34, 66), (22, 78)], SHADOW_GRAY)

    return upscale(canvas)


def draw_shadow_grasp() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.ellipse((20, 62, 76, 84), fill=SHADOW_MIST)
    draw.ellipse((24, 64, 72, 80), fill=SHADOW_BLACK)

    fill_poly(draw, [(48, 28), (58, 38), (62, 56), (58, 66), (38, 66), (34, 56), (38, 38)], SHADOW_GRAY)
    fill_poly(draw, [(48, 32), (54, 40), (56, 54), (54, 62), (42, 62), (40, 54), (42, 40)], SHADOW_BLACK)

    for point, x in [((30, 34), 30), ((40, 24), 40), ((48, 20), 48), ((56, 24), 56), ((66, 34), 62)]:
        fill_poly(draw, [(x, 24), (x + 6, 34), (x + 2, 50), (x - 2, 50)], SHADOW_GRAY)
        px(draw, *point, SHADOW_SILVER)

    return upscale(canvas)


def draw_death_stroke() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.ellipse((34, 34, 62, 62), outline=SHADOW_SILVER, width=2)
    draw.line([34, 48, 62, 48], fill=SHADOW_SILVER, width=1)
    draw.line([48, 34, 48, 62], fill=SHADOW_SILVER, width=1)
    px(draw, 48, 48, SHADOW_SILVER)

    fill_poly(draw, [(52, 24), (60, 32), (44, 66), (36, 58)], SHADOW_BLACK)
    fill_poly(draw, [(54, 28), (58, 32), (46, 62), (40, 56)], SHADOW_GRAY)
    for point in [(56, 26), (52, 30), (48, 40), (42, 52)]:
        px(draw, *point, SHADOW_SILVER)

    return upscale(canvas)


def draw_shadow_dance() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    for offset, alpha in [(-16, 140), (16, 100)]:
        ghost = (*SHADOW_BLUE[:3], alpha)
        fill_poly(
            draw,
            [
                (48 + offset, 22),
                (56 + offset, 34),
                (54 + offset, 62),
                (42 + offset, 62),
                (40 + offset, 34),
            ],
            ghost,
        )

    fill_poly(draw, [(48, 18), (58, 32), (56, 66), (40, 66), (38, 32)], SHADOW_BLACK)
    fill_poly(draw, [(48, 24), (54, 34), (52, 62), (44, 62), (42, 34)], SHADOW_GRAY)
    draw.line([48, 32, 48, 58], fill=SHADOW_SILVER, width=2)
    draw.line([42, 40, 54, 40], fill=SHADOW_SILVER, width=2)

    return upscale(canvas)


def draw_shadow_mantle() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(48, 14), (66, 28), (70, 72), (26, 72), (30, 28)], SHADOW_MIST)
    fill_poly(draw, [(48, 18), (62, 30), (64, 68), (32, 68), (34, 30)], SHADOW_BLACK)
    fill_poly(draw, [(48, 28), (54, 36), (52, 58), (44, 58), (42, 36)], SHADOW_GRAY)
    draw.ellipse((44, 32, 52, 42), fill=SHADOW_SILVER)
    fill_poly(draw, [(46, 58), (50, 58), (52, 68), (44, 68)], SHADOW_BLUE)

    return upscale(canvas)


def draw_dark_blow() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    fill_poly(draw, [(18, 52), (48, 52), (48, 60), (18, 60)], SHADOW_MIST)
    fill_poly(draw, [(20, 54), (46, 54), (46, 58), (20, 58)], SHADOW_BLACK)

    fill_poly(draw, [(48, 34), (68, 44), (62, 56), (42, 50)], SHADOW_BLACK)
    fill_poly(draw, [(50, 36), (64, 44), (60, 54), (44, 48)], SHADOW_GRAY)
    for point in [(66, 42), (62, 46), (58, 50), (54, 52)]:
        px(draw, *point, SHADOW_SILVER)

    fill_poly(draw, [(40, 28), (56, 24), (58, 36), (42, 40)], SHADOW_BLUE)
    px(draw, 48, 26, SHADOW_SILVER)

    return upscale(canvas)


# ---------------------------------------------------------------------------
# Reference icons from other schools (unchanged batch)
# ---------------------------------------------------------------------------
def draw_mind_barrier() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    cyan = (58, 196, 214, 255)
    turquoise = (36, 150, 170, 255)
    ice = (120, 196, 230, 255)
    white = (240, 250, 255, 255)
    deep = (20, 70, 90, 180)

    draw.chord((14, 28, 82, 86), 180, 0, fill=deep)
    draw.chord((16, 30, 80, 84), 180, 0, fill=turquoise)
    draw.chord((20, 34, 76, 80), 180, 0, fill=cyan)
    draw.chord((24, 38, 72, 76), 180, 0, fill=ice)
    for x, y in [(48, 42), (56, 46), (56, 54), (48, 58), (40, 54), (40, 46), (48, 50), (48, 62)]:
        px(draw, x, y, white)
    draw.line((18, 78, 78, 78), fill=white, width=2)

    return upscale(canvas)


def draw_shield_wall() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    obsidian = (24, 20, 28, 255)
    obsidian_light = (46, 40, 50, 255)
    copper = (98, 62, 42, 255)
    blood = (150, 32, 38, 255)
    purple = (118, 38, 98, 255)
    glow = (220, 80, 90, 255)

    fill_poly(draw, [(28, 16), (68, 16), (72, 80), (24, 80)], obsidian)
    fill_poly(draw, [(30, 18), (66, 18), (68, 78), (28, 78)], obsidian_light)
    draw.rectangle((32, 24, 64, 72), outline=copper, width=2)
    draw.line((48, 30, 48, 66), fill=blood, width=3)
    draw.line((38, 40, 58, 40), fill=blood, width=2)
    draw.ellipse((42, 32, 54, 44), outline=purple, width=2)
    px(draw, 48, 48, glow)

    return upscale(canvas)


def draw_chaos_eruption() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    poison = (78, 196, 58, 255)
    emerald = (36, 132, 48, 255)
    black = (12, 16, 12, 255)
    yellow = (188, 224, 58, 255)
    orange = (220, 132, 36, 255)

    draw.ellipse((40, 40, 56, 56), fill=black)
    rays = [
        [(48, 48), (48, 12), (52, 12), (52, 48)],
        [(48, 48), (24, 24), (28, 20), (52, 44)],
        [(48, 48), (72, 24), (68, 20), (44, 44)],
        [(48, 48), (20, 48), (20, 52), (48, 52)],
        [(48, 48), (76, 48), (76, 52), (52, 52)],
        [(48, 48), (24, 72), (28, 76), (52, 52)],
        [(48, 48), (72, 72), (68, 76), (44, 52)],
        [(48, 48), (48, 84), (52, 84), (52, 52)],
    ]
    for index, ray in enumerate(rays):
        fill_poly(draw, ray, poison if index % 2 == 0 else emerald)
    for point in [(48, 18), (26, 26), (70, 26), (48, 80)]:
        px(draw, *point, yellow)
    for point in [(48, 14), (22, 22), (74, 22)]:
        px(draw, *point, orange)

    return upscale(canvas)


def draw_soul_spark() -> Image.Image:
    canvas = new_canvas()
    draw = ImageDraw.Draw(canvas)

    ghost = (230, 236, 246, 255)
    lavender = (198, 188, 220, 255)
    silver = (182, 188, 204, 255)
    blue_white = (210, 226, 255, 255)
    aura = (170, 180, 210, 120)

    draw.ellipse((24, 24, 72, 72), fill=aura)
    fill_poly(draw, [(48, 24), (58, 42), (54, 64), (42, 64), (38, 42)], lavender)
    fill_poly(draw, [(48, 28), (54, 42), (52, 60), (44, 60), (42, 42)], silver)
    fill_poly(draw, [(48, 34), (50, 44), (50, 56), (46, 56), (46, 44)], ghost)
    fill_poly(draw, [(48, 18), (50, 24), (46, 24)], blue_white)

    return upscale(canvas)


ICON_BUILDERS: dict[str, tuple[str, Callable[[], Image.Image]]] = {
    "bone_fracture": ("biomancy", draw_bone_fracture),
    "organ_failure": ("biomancy", draw_organ_failure),
    "blood_clot": ("biomancy", draw_blood_clot),
    "anatomy": ("biomancy", draw_anatomy),
    "bone_armor": ("biomancy", draw_bone_armor),
    "precision_strike": ("shadow", draw_precision_strike),
    "dark_blade": ("shadow", draw_dark_blade),
    "shadow_grasp": ("shadow", draw_shadow_grasp),
    "death_stroke": ("shadow", draw_death_stroke),
    "shadow_dance": ("shadow", draw_shadow_dance),
    "shadow_mantle": ("shadow", draw_shadow_mantle),
    "dark_blow": ("shadow", draw_dark_blow),
    "mind_barrier": ("psionics", draw_mind_barrier),
    "shield_wall": ("forbidden_runes", draw_shield_wall),
    "chaos_eruption": ("chaos", draw_chaos_eruption),
    "soul_spark": ("soul", draw_soul_spark),
}

BATCH_2A = [
    "bone_fracture",
    "organ_failure",
    "blood_clot",
    "anatomy",
    "bone_armor",
    "precision_strike",
    "dark_blade",
    "shadow_grasp",
    "death_stroke",
    "shadow_dance",
    "shadow_mantle",
    "dark_blow",
]

REFERENCE_ICONS = [
    "bone_fracture",
    "dark_blade",
    "mind_barrier",
    "shield_wall",
    "chaos_eruption",
    "soul_spark",
]


def generate_icons(spell_ids: list[str], preview_name: str) -> None:
    spells_dir = ROOT / "assets" / "icons" / "spells"
    raw_dir = ROOT / "assets" / "icons" / "raw" / "reference_v1"
    raw_dir.mkdir(parents=True, exist_ok=True)

    columns = min(6, max(3, len(spell_ids)))
    rows = (len(spell_ids) + columns - 1) // columns
    preview = Image.new("RGBA", (columns * 96, rows * 96), (20, 22, 28, 255))

    for index, spell_id in enumerate(spell_ids):
        folder, builder = ICON_BUILDERS[spell_id]
        image = builder()
        destination = spells_dir / folder / f"{spell_id}.png"
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, optimize=True)
        image.save(raw_dir / f"{spell_id}.png", optimize=True)

        thumb = image.resize((48, 48), Image.Resampling.NEAREST)
        preview.paste(thumb, ((index % columns) * 96, (index // columns) * 96), thumb)
        print(f"Generated {destination.relative_to(ROOT)}")

    preview_path = raw_dir / preview_name
    preview.save(preview_path)
    print(f"Preview saved to {preview_path.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--batch",
        choices=("reference", "2a", "all"),
        default="2a",
        help="Which icon set to generate (default: 2a)",
    )
    args = parser.parse_args()

    if args.batch == "reference":
        generate_icons(REFERENCE_ICONS, "preview_48px_reference.png")
    elif args.batch == "2a":
        generate_icons(BATCH_2A, "preview_48px_batch_2a.png")
    else:
        generate_icons(list(ICON_BUILDERS.keys()), "preview_48px_all.png")


if __name__ == "__main__":
    main()
