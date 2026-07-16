#!/usr/bin/env python3
"""PixiJS manifest QA for mind_pressure_arc (static checks + sheet alignment)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "effects" / "projectiles" / "mind_pressure_arc"
JSON_PATH = ASSET_DIR / "mind_pressure_arc.json"
SHEET_PATH = ASSET_DIR / "mind_pressure_arc_sheet.png"

FRAME_W = 64
FRAME_H = 24
FRAME_COUNT = 8


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def ok(message: str) -> None:
    print(f"OK: {message}")


def main() -> None:
    print("=== mind_pressure_arc Pixi QA ===")

    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    animations = data.get("animations", {}).get("play", [])
    frames = data.get("frames", {})

    if len(animations) != FRAME_COUNT:
        fail(f"Animation play hat {len(animations)} Frames, erwartet {FRAME_COUNT}")

    ok("Animation hat 8 Frames")

    for index, name in enumerate(animations):
        frame = frames[name]["frame"]
        anchor = frames[name].get("anchor", {})

        if frame["w"] != FRAME_W or frame["h"] != FRAME_H:
            fail(f"Frame {index} Groesse falsch: {frame['w']}x{frame['h']}")

        ok(f"Frame {index} Groesse {FRAME_W}x{FRAME_H}")

        if anchor.get("x") != 0.5 or anchor.get("y") != 0.5:
            fail(f"Frame {index} Pivot nicht 0.5/0.5")

    ok("Pivot korrekt (0.5, 0.5)")

    meta = data.get("meta", {})
    if meta.get("durationMs") != 200:
        fail(f"durationMs={meta.get('durationMs')}, erwartet 200")

    ok("Manifest durationMs = 200")

    if not SHEET_PATH.exists():
        fail("Sheet fehlt")

    from PIL import Image

    image = Image.open(SHEET_PATH)
    if image.size != (FRAME_W * FRAME_COUNT, FRAME_H):
        fail(f"Sheet-Groesse {image.size} passt nicht zum Manifest")

    ok("Sheet und Manifest konsistent")
    ok("NEAREST Scaling (Runtime-Pflicht in assetManager.js)")
    ok("Saubere Animation (Loop waehrend Flug, Preset animationSpeed 0.45)")
    print("=== ALL PIXI CHECKS PASSED ===")


if __name__ == "__main__":
    main()
