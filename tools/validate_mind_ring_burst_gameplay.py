#!/usr/bin/env python3
"""Gameplay readability QA for mind_ring_burst on dark BattleMages background."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SHEET_PATH = ROOT / "assets" / "effects" / "impact" / "mind_ring_burst" / "mind_ring_burst_sheet.png"
PREVIEW_PATH = ROOT / "assets" / "effects" / "impact" / "mind_ring_burst" / "mind_ring_burst_preview_dark.png"

FRAME_SIZE = 96
FRAME_COUNT = 8
BG_COLOR = (26, 31, 46, 255)  # approx #1a1f2e battle UI


def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    sys.exit(1)


def ok(msg: str) -> None:
    print(f"OK: {msg}")


def main() -> None:
    print("=== mind_ring_burst Gameplay QA ===")
    sheet = Image.open(SHEET_PATH).convert("RGBA")

    peak_frame = sheet.crop((3 * FRAME_SIZE, 0, 4 * FRAME_SIZE, FRAME_SIZE))
    preview = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), BG_COLOR)
    preview.paste(peak_frame, (0, 0), peak_frame)
    preview.save(PREVIEW_PATH, optimize=True)
    ok(f"Dark-Background-Preview gespeichert: {PREVIEW_PATH.relative_to(ROOT)}")

    # Contrast: ring pixels vs background
    ring_pixels = []
    bg_luma = 0.299 * BG_COLOR[0] + 0.587 * BG_COLOR[1] + 0.114 * BG_COLOR[2]

    for y in range(FRAME_SIZE):
        for x in range(FRAME_SIZE):
            r, g, b, a = peak_frame.getpixel((x, y))
            if a > 100:
                luma = 0.299 * r + 0.587 * g + 0.114 * b
                ring_pixels.append(luma)

    if len(ring_pixels) < 40:
        fail("Zu wenig sichtbarer Ringinhalt im Peak-Frame")

    avg_luma = sum(ring_pixels) / len(ring_pixels)
    contrast = avg_luma - bg_luma

    if contrast < 35:
        fail(f"Kontrast zu niedrig auf dunklem UI ({contrast:.1f})")

    ok(f"Kontrast auf dunklem Hintergrund ausreichend ({contrast:.1f})")

    # Ring should not cover entire frame (portrait readability)
    bbox = peak_frame.getbbox()
    if not bbox:
        fail("Peak frame leer")

    coverage = ((bbox[2] - bbox[0]) * (bbox[3] - bbox[1])) / (FRAME_SIZE * FRAME_SIZE)
    if coverage > 0.82:
        fail(f"Effekt ueberdeckt zu viel ({coverage:.0%})")

    ok(f"Ringabdeckung moderat ({coverage:.0%}) — Portrait bleibt lesbar")

    # Center transparency (portrait face area)
    cx, cy = FRAME_SIZE // 2, FRAME_SIZE // 2
    center_alpha = peak_frame.getpixel((cx, cy))[3]
    if center_alpha > 120:
        fail("Zentrum nicht transparent genug fuer Portrait")

    ok("Trefferpunkt im Zentrum klar, Portrait-Kern bleibt frei")

    print("=== GAMEPLAY QA PASSED ===")


if __name__ == "__main__":
    main()
