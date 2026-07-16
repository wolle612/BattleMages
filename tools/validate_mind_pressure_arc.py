#!/usr/bin/env python3
"""Technical QA for mind_pressure_arc projectile VFX asset."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "effects" / "projectiles" / "mind_pressure_arc"
SHEET_PATH = ASSET_DIR / "mind_pressure_arc_sheet.png"
JSON_PATH = ASSET_DIR / "mind_pressure_arc.json"

FRAME_W = 64
FRAME_H = 24
FRAME_COUNT = 8
EXPECTED_WIDTH = FRAME_W * FRAME_COUNT
EXPECTED_HEIGHT = FRAME_H


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def ok(message: str) -> None:
    print(f"OK: {message}")


def validate_png() -> Image.Image:
    if not SHEET_PATH.exists():
        fail(f"Missing sheet: {SHEET_PATH}")

    image = Image.open(SHEET_PATH)
    if image.mode != "RGBA":
        fail(f"Expected RGBA, got {image.mode}")

    ok("PNG besitzt echten Alphakanal (RGBA)")

    if image.size != (EXPECTED_WIDTH, EXPECTED_HEIGHT):
        fail(f"Sheet size {image.size}, expected ({EXPECTED_WIDTH}, {EXPECTED_HEIGHT})")

    ok(f"Sheet-Groesse korrekt ({EXPECTED_WIDTH}x{EXPECTED_HEIGHT})")

    pixels = image.load()
    has_transparency = False
    for y in range(image.height):
        for x in range(image.width):
            if pixels[x, y][3] < 255:
                has_transparency = True
                break
        if has_transparency:
            break

    if not has_transparency:
        fail("Kein transparenter Pixel gefunden")

    ok("Transparenz vorhanden")
    return image


def validate_frames(image: Image.Image) -> None:
    for i in range(FRAME_COUNT):
        left = i * FRAME_W
        frame = image.crop((left, 0, left + FRAME_W, FRAME_H))
        if frame.getbbox() is None:
            fail(f"Frame {i} ist leer")

    ok(f"{FRAME_COUNT} Frames mit Inhalt")


def validate_no_fringe(image: Image.Image) -> None:
    pixels = image.load()
    fringe_count = 0
    checked = 0

    for y in range(1, image.height - 1):
        for x in range(1, image.width - 1):
            _, _, _, a = pixels[x, y]
            if a == 0:
                continue
            checked += 1
            neighbors_transparent = sum(
                1 for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1))
                if pixels[x + dx, y + dy][3] == 0
            )
            if neighbors_transparent > 0 and a < 40:
                r, g, b, _ = pixels[x, y]
                if max(r, g, b) > 20:
                    fringe_count += 1

    ratio = fringe_count / max(checked, 1)
    if ratio > 0.09:
        fail(f"Verdaechtige Farbsaeume: {fringe_count} ({ratio:.1%})")

    ok("Keine auffaelligen Farbsaeume")


def validate_json() -> None:
    if not JSON_PATH.exists():
        fail(f"Missing manifest: {JSON_PATH}")

    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    frames = data.get("frames", {})
    animations = data.get("animations", {}).get("play", [])

    if len(frames) != FRAME_COUNT or len(animations) != FRAME_COUNT:
        fail("Frame count mismatch in JSON")

    for i, name in enumerate(animations):
        frame = frames[name]["frame"]
        if frame["x"] != i * FRAME_W or frame["w"] != FRAME_W or frame["h"] != FRAME_H:
            fail(f"Frame layout wrong: {name} {frame}")

    ok("JSON-Manifest korrekt")
    ok("Gleichmaessige Frameabstaende (64px)")


def validate_trail_not_brighter_than_core(image: Image.Image) -> None:
    frame = image.crop((3 * FRAME_W, 0, 4 * FRAME_W, FRAME_H))
    px = frame.load()

    tail_max = 0.0
    tip_max = 0.0

    for y in range(FRAME_H):
        for x in range(FRAME_W):
            r, g, b, a = px[x, y]
            if a < 20:
                continue
            luma = 0.299 * r + 0.587 * g + 0.114 * b
            if x < 12:
                tail_max = max(tail_max, luma)
            if x > 48:
                tip_max = max(tip_max, luma)

    if tip_max < 50:
        fail("Projektilspitze zu schwach")

    if tail_max > tip_max:
        fail(f"Trail zu hell ({tail_max:.0f}) vs Spitze ({tip_max:.0f})")

    ok("Trail nicht heller als Projektilkern")


def main() -> None:
    print("=== mind_pressure_arc Technical QA ===")
    image = validate_png()
    validate_frames(image)
    validate_no_fringe(image)
    validate_json()
    validate_trail_not_brighter_than_core(image)
    print("=== ALL TECHNICAL CHECKS PASSED ===")


if __name__ == "__main__":
    main()
