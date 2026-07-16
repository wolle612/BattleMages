#!/usr/bin/env python3
"""Normalize spell icons to 1024x1024 masters without destroying detail."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = 1024
MOTIF_FILL = 0.92
DARK_BORDER_DEPTH_RATIO = 0.14


def is_light_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha < 16:
        return True

    if (
        red > 210
        and green > 210
        and blue > 210
        and abs(red - green) < 18
        and abs(green - blue) < 18
    ):
        return True

    if abs(red - green) < 12 and abs(green - blue) < 12 and 170 < red < 245:
        return True

    return False


def is_dark_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha < 16:
        # Do not flood through transparency; otherwise dark motifs get eaten
        # after the light background pass opens edge-connected alpha channels.
        return False
    return red < 32 and green < 32 and blue < 32


def flood_remove(
    rgba: Image.Image,
    predicate,
    *,
    max_depth: int | None,
) -> None:
    pixels = rgba.load()
    width, height = rgba.size

    if max_depth is None:
        visited: set[tuple[int, int]] = set()
        queue: deque[tuple[int, int]] = deque()

        for x in range(width):
            queue.append((x, 0))
            queue.append((x, height - 1))
        for y in range(height):
            queue.append((0, y))
            queue.append((width - 1, y))

        while queue:
            x, y = queue.popleft()
            if (x, y) in visited:
                continue
            if x < 0 or y < 0 or x >= width or y >= height:
                continue

            visited.add((x, y))
            if not predicate(pixels[x, y]):
                continue

            pixels[x, y] = (255, 255, 255, 0)
            queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
        return

    visited: set[tuple[int, int, int]] = set()
    queue: deque[tuple[int, int, int]] = deque()

    for x in range(width):
        queue.append((x, 0, 0))
        queue.append((x, height - 1, 0))
    for y in range(height):
        queue.append((0, y, 0))
        queue.append((width - 1, y, 0))

    while queue:
        x, y, depth = queue.popleft()
        if (x, y, depth) in visited:
            continue
        if x < 0 or y < 0 or x >= width or y >= height:
            continue

        visited.add((x, y, depth))
        if not predicate(pixels[x, y]):
            continue

        pixels[x, y] = (255, 255, 255, 0)
        if depth >= max_depth:
            continue

        next_depth = depth + 1
        queue.extend(
            (
                (x + 1, y, next_depth),
                (x - 1, y, next_depth),
                (x, y + 1, next_depth),
                (x, y - 1, next_depth),
            )
        )


def fill_interior_holes(rgba: Image.Image, passes: int = 3) -> None:
    width, height = rgba.size
    if width * height > 750_000:
        return

    pixels = rgba.load()
    neighbors = (
        (-1, 0),
        (1, 0),
        (0, -1),
        (0, 1),
        (-1, -1),
        (1, -1),
        (-1, 1),
        (1, 1),
    )

    for _ in range(passes):
        replacements: list[tuple[int, int, tuple[int, int, int, int]]] = []

        for y in range(height):
            for x in range(width):
                if pixels[x, y][3] > 16:
                    continue

                opaque_neighbors = []
                for dx, dy in neighbors:
                    nx, ny = x + dx, y + dy
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    neighbor = pixels[nx, ny]
                    if neighbor[3] > 16:
                        opaque_neighbors.append(neighbor)

                if len(opaque_neighbors) < 6:
                    continue

                red = sum(color[0] for color in opaque_neighbors) // len(
                    opaque_neighbors
                )
                green = sum(color[1] for color in opaque_neighbors) // len(
                    opaque_neighbors
                )
                blue = sum(color[2] for color in opaque_neighbors) // len(
                    opaque_neighbors
                )
                replacements.append((x, y, (red, green, blue, 255)))

        if not replacements:
            break

        for x, y, color in replacements:
            pixels[x, y] = color


def is_checkerboard_gray(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha < 16:
        return False
    if abs(red - green) > 8 or abs(green - blue) > 8:
        return False
    return 220 <= red <= 255


def remove_checkerboard_artifacts(rgba: Image.Image) -> None:
    """Remove faux transparency grids baked into AI-exported motifs."""
    pixels = rgba.load()
    width, height = rgba.size
    radius = 2

    for y in range(height):
        for x in range(width):
            if not is_checkerboard_gray(pixels[x, y]):
                continue

            checker_neighbors = 0
            for dy in range(-radius, radius + 1):
                for dx in range(-radius, radius + 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    if is_checkerboard_gray(pixels[nx, ny]):
                        checker_neighbors += 1

            if checker_neighbors >= 8:
                pixels[x, y] = (255, 255, 255, 0)


def remove_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    dark_border_depth = max(24, int(min(width, height) * DARK_BORDER_DEPTH_RATIO))

    flood_remove(rgba, is_light_background, max_depth=None)
    remove_checkerboard_artifacts(rgba)
    flood_remove(rgba, is_dark_background, max_depth=dark_border_depth)
    return rgba


def trim_transparent(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image
    return image.crop(bbox)


def fit_icon(image: Image.Image, output_size: int = DEFAULT_OUTPUT) -> Image.Image:
    rgba = trim_transparent(remove_background(image))
    fill_interior_holes(rgba)
    if rgba.width == 0 or rgba.height == 0:
        raise ValueError("Image has no visible pixels.")

    max_side = int(output_size * MOTIF_FILL)
    scale = min(max_side / rgba.width, max_side / rgba.height)
    target_width = max(1, int(rgba.width * scale))
    target_height = max(1, int(rgba.height * scale))
    resized = rgba.resize((target_width, target_height), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (output_size, output_size), (0, 0, 0, 0))
    offset = (
        (output_size - target_width) // 2,
        (output_size - target_height) // 2,
    )
    canvas.paste(resized, offset, resized)
    return canvas


def process_icon(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        result = fit_icon(image)
        result.save(destination, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    process_icon(args.source, args.destination)
    print(f"Saved {args.destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
