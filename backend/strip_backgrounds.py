"""Remove the baked checker/background from generated Relic PNGs.

Gemini produced RGB images with a transparency-checker pattern painted in.
We use rembg (u2net) to isolate the foreground object and save true RGBA PNGs.
"""
from pathlib import Path
from rembg import remove
from PIL import Image
import io

SRC = Path(__file__).parent / "relic_images"
OUT = SRC  # overwrite in place

for png in sorted(SRC.glob("*.png")):
    with png.open("rb") as f:
        raw = f.read()
    result = remove(raw)  # returns PNG bytes w/ alpha
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    # Trim borders + center
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    # Square-pad the cropped image so it stays centered
    w, h = img.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - w) // 2, (side - h) // 2), img)
    canvas.save(png, "PNG", optimize=True)
    print(f"  ✓ {png.name}  {canvas.size}")
