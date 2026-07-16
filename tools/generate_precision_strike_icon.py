#!/usr/bin/env python3
"""Generate a distinctive Präzisionsschlag icon (stiletto + light reflex + reticle)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = 1024
GRID = 128

SHADOW_BLACK = (12, 12, 18, 255)
SHADOW_GRAY = (42, 44, 54, 255)
SHADOW_BLUE = (34, 44, 72, 255)
SHADOW_SILVER = (188, 198, 220, 255)
SHADOW_WHITE = (240, 248, 255, 255)
RETICLE = (110, 120, 145, 160)


def upscale(canvas: Image.Image) -> Image.Image:
    return canvas.resize((OUTPUT, OUTPUT), Image.Resampling.NEAREST)


def px(draw: ImageDraw.ImageDraw, x: int, y: int, color: tuple[int, int, int, int]) -> None:
    draw.rectangle((x, y, x, y), fill=color)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def draw_precision_strike() -> Image.Image:
    canvas = Image.new("RGBA", (GRID, GRID), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    # Precision reticle behind the blade tip (vulnerable / targeted strike).
    cx, cy = 84, 38
    draw.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), outline=RETICLE, width=2)
    draw.line((cx - 22, cy, cx + 22, cy), fill=SHADOW_SILVER, width=1)
    draw.line((cx, cy - 22, cx, cy + 22), fill=SHADOW_SILVER, width=1)
    px(draw, cx, cy, SHADOW_WHITE)

    # Straight stiletto thrust — thin, unlike the long curved Dunkle Klinge.
    tip = (98, 24)
    base = (18, 104)
    for step in range(101):
        t = step / 100
        x = int(lerp(base[0], tip[0], t))
        y = int(lerp(base[1], tip[1], t))
        width = max(2, int(lerp(7, 2, t)))
        for offset in range(-width, width + 1):
            px(draw, x + offset, y, SHADOW_BLACK)
            if offset <= 0:
                px(draw, x + offset, y + 1, SHADOW_GRAY)
            if offset >= 0:
                px(draw, x + offset, y - 1, SHADOW_BLUE)

    # Sharp silver light reflex along the upper cutting edge.
    for step in range(8, 96):
        t = step / 100
        x = int(lerp(base[0], tip[0], t))
        y = int(lerp(base[1], tip[1], t)) - 3
        px(draw, x, y, SHADOW_SILVER)
        px(draw, x + 1, y - 1, SHADOW_WHITE)
        px(draw, x - 1, y, SHADOW_SILVER)
        if step > 65:
            px(draw, x, y - 1, SHADOW_WHITE)

    # Needle-sharp tip highlight.
    for point in [(96, 26), (97, 25), (98, 24), (95, 27)]:
        px(draw, *point, SHADOW_WHITE)

    # Minimal guard — functional, not ornate like Dunkle Klinge.
    fill_guard = [(16, 102), (24, 94), (30, 100), (22, 108)]
    draw.polygon(fill_guard, fill=SHADOW_GRAY)
    draw.line((14, 104, 28, 90), fill=SHADOW_SILVER, width=1)

    # Short wrapped grip.
    fill_poly = [(12, 106), (18, 100), (22, 104), (16, 110)]
    draw.polygon(fill_poly, fill=SHADOW_BLACK)
    for y in (102, 105, 108):
        draw.line((13, y, 20, y), fill=SHADOW_BLUE, width=1)

    return upscale(canvas)


def main() -> None:
    image = draw_precision_strike()
    ref_path = ROOT / "assets" / "icons" / "raw" / "reference_v1" / "precision_strike_ref.png"
    ref_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(ref_path, optimize=True)
    print(f"Saved {ref_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
