#!/usr/bin/env python3
"""Gameplay readability QA for mind_pressure_arc on dark BattleMages background."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHEET_PATH = ROOT / "assets" / "effects" / "projectiles" / "mind_pressure_arc" / "mind_pressure_arc_sheet.png"
PREVIEW_PATH = ROOT / "assets" / "effects" / "projectiles" / "mind_pressure_arc" / "mind_pressure_arc_preview_dark.png"

FRAME_W = 64
FRAME_H = 24
BG_COLOR = (26, 31, 46, 255)


def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    sys.exit(1)


def ok(msg: str) -> None:
    print(f"OK: {msg}")


def main() -> None:
    print("=== mind_pressure_arc Gameplay QA ===")
    sheet = Image.open(SHEET_PATH).convert("RGBA")

    peak = sheet.crop((3 * FRAME_W, 0, 4 * FRAME_W, FRAME_H))
    preview = Image.new("RGBA", (FRAME_W, FRAME_H), BG_COLOR)
    preview.paste(peak, (0, 0), peak)
    preview.save(PREVIEW_PATH, optimize=True)
    ok(f"Preview gespeichert: {PREVIEW_PATH.relative_to(ROOT)}")

    bg_luma = 0.299 * BG_COLOR[0] + 0.587 * BG_COLOR[1] + 0.114 * BG_COLOR[2]
    lumas = []
    for y in range(FRAME_H):
        for x in range(FRAME_W):
            r, g, b, a = peak.getpixel((x, y))
            if a > 80:
                lumas.append(0.299 * r + 0.587 * g + 0.114 * b)

    if len(lumas) < 20:
        fail("Projektil zu schwach sichtbar")

    contrast = sum(lumas) / len(lumas) - bg_luma
    if contrast < 30:
        fail(f"Kontrast zu niedrig ({contrast:.1f})")

    ok(f"Projektil sofort lesbar (Kontrast {contrast:.1f})")

    bbox = peak.getbbox()
    if not bbox:
        fail("Peak frame leer")

    width = bbox[2] - bbox[0]
    if width < FRAME_W * 0.45:
        fail("Silhouette zu klein fuer Lesbarkeit")

    ok(f"Silhouette klar ({width}px breit)")

    # Leading edge on right half
    right_pixels = sum(
        1 for y in range(FRAME_H) for x in range(FRAME_W // 2, FRAME_W)
        if peak.getpixel((x, y))[3] > 100
    )
    left_pixels = sum(
        1 for y in range(FRAME_H) for x in range(0, FRAME_W // 2)
        if peak.getpixel((x, y))[3] > 60
    )

    if right_pixels <= left_pixels:
        fail("Flugrichtung unklar — fuehrender Rand nicht dominant")

    ok("Flugrichtung / Geschwindigkeit visuell klar")

    print("=== GAMEPLAY QA PASSED ===")


if __name__ == "__main__":
    main()
