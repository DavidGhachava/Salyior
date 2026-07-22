from pathlib import Path
from PIL import Image


ROOT = Path(r"C:\Users\herom\Desktop\salyior")

PROJECTS = {
    Path(r"C:\Users\herom\Pictures\Screenshots\Screenshot 2026-07-22 023126.png"): ROOT / "public" / "projects" / "kristina-languages.webp",
    Path(r"C:\Users\herom\AppData\Local\Temp\codex-clipboard-7b88fed2-70bb-4dd0-9969-26842a05bffb.png"): ROOT / "public" / "projects" / "arqi.webp",
    Path(r"C:\Users\herom\AppData\Local\Temp\codex-clipboard-f1a8cf4b-22e0-45a2-a051-ad570ec49afb.png"): ROOT / "public" / "projects" / "arrive.webp",
}

LOGO_SOURCE = Path(r"C:\Users\herom\Downloads\logo colors.png")
LOGO_OUTPUT = ROOT / "public" / "brand" / "salyior-mark.png"


def optimize_screenshot(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGB")
        if image.width > 1600:
            height = round(image.height * 1600 / image.width)
            image = image.resize((1600, height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=84, method=6)
        print(f"{destination.name}: {image.width}x{image.height} · {destination.stat().st_size / 1024:.0f} KB")


def create_transparent_mark() -> None:
    LOGO_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(LOGO_SOURCE) as source:
        crop = source.convert("RGB").crop((250, 125, 1005, 825))
        crop.thumbnail((560, 520), Image.Resampling.LANCZOS)
        rgba = Image.new("RGBA", crop.size)
        source_pixels = crop.load()
        target_pixels = rgba.load()

        for y in range(crop.height):
            for x in range(crop.width):
                red, green, blue = source_pixels[x, y]
                peak = max(red, green, blue)
                alpha = max(0, min(255, round((peak - 34) * 3.2)))
                if blue - red > 35 and green - red > 35:
                    color = (0, 217, 238)
                else:
                    color = (247, 248, 250)
                target_pixels[x, y] = (*color, alpha)

        bbox = rgba.getbbox()
        if bbox:
            rgba = rgba.crop(bbox)
        rgba.save(LOGO_OUTPUT, "PNG", optimize=True)
        print(f"{LOGO_OUTPUT.name}: {rgba.width}x{rgba.height} · {LOGO_OUTPUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    for source, destination in PROJECTS.items():
        optimize_screenshot(source, destination)
    create_transparent_mark()
