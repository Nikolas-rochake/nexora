"""
Generate hyper-realistic Relic images with Gemini Nano Banana.
Run once to seed /app/backend/relic_images/{key}.png
"""
import asyncio
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

OUT_DIR = ROOT / "relic_images"
OUT_DIR.mkdir(exist_ok=True)

MODEL_ID = "gemini-3.1-flash-image-preview"

BASE_STYLE = (
    "Ultra hyper-realistic 3D render of a single futuristic luxury art object floating "
    "at the center of a completely transparent background (checker alpha, RGBA PNG). "
    "Materials must include brushed titanium, matte gold, polished obsidian, faceted "
    "crystal and high-tech glass with subtle iridescence. Cinematic studio lighting: "
    "soft rim light, warm gold key light, cool cyan fill. Museum-piece quality, extreme "
    "surface detail, sharp reflections, physically-based rendering, 8k, unreal engine, "
    "Octane. NO people, NO text, NO borders, NO frame, NO card, NO shadow on ground, "
    "NO logo. Object perfectly centered, cropped tightly. Absolutely transparent "
    "background — every pixel outside the object must be fully alpha 0."
)

RELICS = {
    "genesis": (
        "A perfect ivory-white porcelain and crystal sphere the size of a pomegranate, "
        "floating in space. Three impossibly thin matte gold rings orbit around it at "
        "different angles. Inside the sphere a small white-blue luminous core softly "
        "pulses, casting subtle light through the translucent shell. A few tiny faceted "
        "crystal shards float in slow orbit. Symbol of primordial perfection."
    ),
    "aeternum": (
        "A transparent flawless quartz crystal with dozens of sharp facets, perfectly "
        "cut, egg-shaped. Trapped inside is an infinite golden double-helix spiral. "
        "Tiny gold fragments hover in slow orbit around it. Faint golden glow at the "
        "edges of every facet. Eternity, timelessness."
    ),
    "constellation": (
        "A polished obsidian polyhedron (dodecahedron), pitch-black glass-like surface "
        "with mirror reflections. Inside it, small bright star-like points connected "
        "by thin luminous gold lines form a miniature galaxy. Contains an entire cosmos."
    ),
    "eclipse": (
        "A perfectly circular disc of ultra-polished black obsidian, extremely "
        "reflective, hovering vertically. Behind it a dense matte-gold corona of "
        "light radiates outward, a permanent eclipse. The center absorbs all light, "
        "the halo pulses gold."
    ),
    "painita": (
        "A deep blood-red faceted crystal, one of the rarest gemstones on earth. "
        "Its facets catch gold reflections. Inside the center a tiny brilliant white "
        "core glows. Extremely precious, jewellery-grade cut, sitting weightless."
    ),
    "apex": (
        "A sharp geometric tetrahedron pyramid made of brushed titanium. Every edge "
        "is inlaid with a thin luminous gold line that appears to glow from within. "
        "At the very top rests a small pointed white crystal. Symbol of the summit."
    ),
    "aureon": (
        "A hollow sphere composed of dozens of separate suspended brushed-gold plates, "
        "arranged spherically but never touching, floating in perfect balance. Inside "
        "the very center a small clear white crystal glows. Highly advanced futuristic "
        "goldsmith technology."
    ),
    "obsidian": (
        "A large upright shard of jet-black obsidian, monolithic and heavy-looking, "
        "extremely polished mirror surface with metallic reflections. Veins of glowing "
        "gold run through its interior like circuits inside dark glass. Imposing."
    ),
    "alfalium": (
        "A metallic-blue liquid-looking crystal, teardrop shaped, hovering above an "
        "invisible base. Its interior appears fluid, iridescent, with slow-moving "
        "waves of cyan and cobalt reflecting cool light. A fictional luxury element."
    ),
    "omeguium": (
        "An elegant minimalist silver-platinum crystal, faceted, geometrically pure "
        "diamond-octahedron shape. Highly polished mirror-like surface with subtle "
        "warm gold reflections. Simple but exquisitely refined — the most common Relic "
        "that still looks like a museum-grade luxury object."
    ),
}


async def generate_one(key: str, description: str):
    prompt = (
        f"{BASE_STYLE}\n\nSubject: {description}\n\n"
        "Render this single object photorealistically with a fully transparent alpha "
        "background. Output must be a PNG with genuine alpha channel — no white or "
        "black background rectangle."
    )
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY missing")

    chat = LlmChat(
        api_key=api_key,
        session_id=f"nexora-relic-{key}",
        system_message="You are a world-class luxury 3D concept artist.",
    ).with_model("gemini", MODEL_ID).with_params(modalities=["image", "text"])

    _, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if not images:
        raise RuntimeError(f"No image returned for {key}")

    img_bytes = base64.b64decode(images[0]["data"])
    out = OUT_DIR / f"{key}.png"
    out.write_bytes(img_bytes)
    print(f"  ✓ {key}  ({len(img_bytes)/1024:.1f} kB)")


async def main():
    targets = sys.argv[1:] or list(RELICS.keys())
    print(f"Generating {len(targets)} Relic image(s) →  {OUT_DIR}")
    for key in targets:
        if key not in RELICS:
            print(f"  ✗ unknown key: {key}")
            continue
        try:
            await generate_one(key, RELICS[key])
        except Exception as e:
            print(f"  ✗ {key}: {e}")


if __name__ == "__main__":
    asyncio.run(main())
