#!/usr/bin/env python3
"""Technical QA validator for mind_ring_burst VFX asset."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "effects" / "impact" / "mind_ring_burst"
SHEET_PATH = ASSET_DIR / "mind_ring_burst_sheet.png"
JSON_PATH = ASSET_DIR / "mind_ring_burst.json"

FRAME_SIZE = 96
FRAME_COUNT = 8
EXPECTED_WIDTH = FRAME_SIZE * FRAME_COUNT
EXPECTED_HEIGHT = FRAME_SIZE


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
    all_white_bg = True

    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a < 255:
                has_transparency = True
            if not (r == 255 and g == 255 and b == 255 and a == 255):
                all_white_bg = False

    if not has_transparency:
        fail("Kein transparenter Pixel gefunden")

    ok("Transparenz vorhanden")

    if all_white_bg:
        fail("Sheet ist komplett weiss — kein nutzbares Asset")

    ok("Kein vollstaendig weisser Hintergrund")

    return image


def validate_frames(image: Image.Image) -> None:
    for i in range(FRAME_COUNT):
        left = i * FRAME_SIZE
        frame = image.crop((left, 0, left + FRAME_SIZE, FRAME_SIZE))
        bbox = frame.getbbox()

        if bbox is None:
            fail(f"Frame {i} ist komplett leer")

        x0, y0, x1, y1 = bbox
        if x0 < 0 or y0 < 0 or x1 > FRAME_SIZE or y1 > FRAME_SIZE:
            fail(f"Frame {i} Inhalt ausserhalb Frame-Grenzen: {bbox}")

        # Check content not clipped at frame edges (ring should have margin)
        margin = 2
        if x0 < margin or y0 < margin or x1 > FRAME_SIZE - margin or y1 > FRAME_SIZE - margin:
            if i >= FRAME_COUNT - 2:
                continue  # late expansion frames may touch safe margin
            fail(f"Frame {i} scheint abgeschnitten (bbox {bbox})")

    ok(f"{FRAME_COUNT} Frames mit Inhalt, keine unerwarteten Abschnitte")


def validate_no_color_fringe(image: Image.Image) -> None:
    """Detect obvious semi-transparent colored halos at transparency boundaries."""
    pixels = image.load()
    fringe_count = 0
    checked = 0

    for y in range(1, image.height - 1):
        for x in range(1, image.width - 1):
            _, _, _, a = pixels[x, y]
            if a == 0:
                continue
            checked += 1
            neighbors_transparent = 0
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                if pixels[x + dx, y + dy][3] == 0:
                    neighbors_transparent += 1
            if neighbors_transparent > 0 and a < 40:
                r, g, b, _ = pixels[x, y]
                if max(r, g, b) > 20:
                    fringe_count += 1

    ratio = fringe_count / max(checked, 1)
    if ratio > 0.08:
        fail(f"Verdaechtige Farbsaeume: {fringe_count} Randpixel ({ratio:.1%})")

    ok("Keine auffaelligen Farbsaeume")


def validate_json() -> dict:
    if not JSON_PATH.exists():
        fail(f"Missing manifest: {JSON_PATH}")

    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    frames = data.get("frames", {})
    animations = data.get("animations", {}).get("play", [])
    meta = data.get("meta", {})

    if len(frames) != FRAME_COUNT:
        fail(f"JSON frame count {len(frames)}, expected {FRAME_COUNT}")

    if len(animations) != FRAME_COUNT:
        fail(f"Animation frame count {len(animations)}, expected {FRAME_COUNT}")

    for i, name in enumerate(animations):
        if name not in frames:
            fail(f"Animation referenziert unbekannten Frame: {name}")
        frame = frames[name]["frame"]
        expected_x = i * FRAME_SIZE
        if frame["x"] != expected_x or frame["y"] != 0:
            fail(f"Frame {name} offset falsch: {frame}")
        if frame["w"] != FRAME_SIZE or frame["h"] != FRAME_SIZE:
            fail(f"Frame {name} Groesse falsch: {frame}")

    if meta.get("image") != "mind_ring_burst_sheet.png":
        fail(f"Meta image name falsch: {meta.get('image')}")

    ok("JSON-Manifest korrekt")
    ok("Dateinamen korrekt")
    ok("Gleichmaessige Frameabstaende (96px)")

    return data


def main() -> None:
    print("=== mind_ring_burst Technical QA ===")
    image = validate_png()
    validate_frames(image)
    validate_no_color_fringe(image)
    validate_json()
    print("=== ALL TECHNICAL CHECKS PASSED ===")


if __name__ == "__main__":
    main()
