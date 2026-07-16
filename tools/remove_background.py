from pathlib import Path
from collections import deque
from PIL import Image

# ============================================
# BattleMages Asset Processor
# Version 2
# Entfernt KI-Hintergründe per Flood Fill
# und reduziert weiße Farbsäume.
# ============================================

INPUT_FOLDER = Path("assets/icons/raw")
OUTPUT_FOLDER = Path("assets/icons/final")

OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)


def is_background(pixel):
    r, g, b, a = pixel

    # sehr helle Grau-/Weißtöne
    return (
        r > 210
        and g > 210
        and b > 210
        and abs(r - g) < 18
        and abs(g - b) < 18
    )


processed = 0

print("BattleMages Icon Processor")
print("--------------------------------")

for image_path in INPUT_FOLDER.glob("*.png"):

    print(f"Bearbeite {image_path.name}")

    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()

    width, height = img.size

    visited = set()
    queue = deque()

    # Starte Flood Fill in allen vier Ecken
    starts = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
    ]

    for s in starts:
        queue.append(s)

    while queue:

        x, y = queue.popleft()

        if (x, y) in visited:
            continue

        if x < 0 or y < 0 or x >= width or y >= height:
            continue

        visited.add((x, y))

        if is_background(pixels[x, y]):

            pixels[x, y] = (255, 255, 255, 0)

            queue.extend([
                (x + 1, y),
                (x - 1, y),
                (x, y + 1),
                (x, y - 1),
            ])

    # ----------------------------------------
    # White Fringe entfernen
    # ----------------------------------------

    for y in range(1, height - 1):
        for x in range(1, width - 1):

            r, g, b, a = pixels[x, y]

            if a == 0:
                continue

            # fast weiß?
            if r > 215 and g > 190 and b > 190:

                neighbours = []

                for dx, dy in [
                    (-1,0),(1,0),(0,-1),(0,1),
                    (-1,-1),(1,-1),(-1,1),(1,1)
                ]:

                    nr, ng, nb, na = pixels[x+dx, y+dy]

                    if na > 0 and not is_background((nr,ng,nb,na)):
                        neighbours.append((nr,ng,nb))

                if neighbours:

                    avg_r = sum(c[0] for c in neighbours)//len(neighbours)
                    avg_g = sum(c[1] for c in neighbours)//len(neighbours)
                    avg_b = sum(c[2] for c in neighbours)//len(neighbours)

                    pixels[x,y] = (
                        avg_r,
                        avg_g,
                        avg_b,
                        a
                    )

    output = OUTPUT_FOLDER / image_path.name
    img.save(output)

    processed += 1

print("--------------------------------")
print(f"Fertig! {processed} Icons verarbeitet.")