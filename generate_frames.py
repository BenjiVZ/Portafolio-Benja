"""
Genera 30 frames de una laptop desarmándose usando Imagen 4.0 Ultra (mejor modelo).
Usa los prompts exactos del usuario.
"""

import time
from pathlib import Path
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

# ── Config ──
API_KEY = "AIzaSyDLD8TVLby1KmztnWdn0dQnUZ5zaLHGkac"
OUTPUT_DIR = Path("public/frames")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

client = genai.Client(api_key=API_KEY)
MODEL = "imagen-4.0-ultra-generate-001"

# ── Los 30 frames con prompts exactos ──
# Para frames pareados (13-14, 15-16, etc.) se generan 2 imágenes del mismo prompt
FRAMES = [
    # === Fase 1: Cerrada → Abriendo (1-8) ===
    {
        "num": 1,
        "prompt": "A modern sleek black laptop fully assembled and closed, floating in the center of a completely black void background (#0F172A dark navy). The laptop is matte black with subtle green edge lighting (#22C55E). Clean minimal design, no logos. Viewed from a 3/4 angle slightly above. Cinematic lighting, dark moody tech aesthetic. The laptop is pristine and complete. Photorealistic render style."
    },
    {
        "num": 2,
        "prompt": "A modern sleek black laptop with the lid cracked open at 10 degrees, floating in the center of a completely black void background (#0F172A dark navy). A thin sliver of green light (#22C55E) escapes from the gap. Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 3,
        "prompt": "A modern sleek black laptop with lid opening at 25 degrees, floating in the center of a completely black void background (#0F172A dark navy). Green terminal code barely visible on the screen through the gap. Green edge glow (#22C55E). Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 4,
        "prompt": "A modern sleek black laptop with lid open at 45 degrees, floating in the center of a completely black void background (#0F172A dark navy). Screen showing green terminal code on black background. Subtle green glow (#22C55E) reflecting off keyboard. Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 5,
        "prompt": "A modern sleek black laptop with lid open at 70 degrees showing green terminal code prominently, floating in the center of a completely black void background (#0F172A dark navy). Green glow (#22C55E) reflecting on keyboard and trackpad. Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 6,
        "prompt": "A modern sleek black laptop with lid open at 90 degrees, screen displaying columns of green terminal code, floating in the center of a completely black void background (#0F172A dark navy). Strong green glow (#22C55E) illuminating the keyboard area. Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 7,
        "prompt": "A modern sleek black laptop fully open at 110 degrees with screen showing green terminal code on black, floating in the center of a completely black void background (#0F172A dark navy). Vivid green glow (#22C55E) on keyboard. Full laptop clearly visible. Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 8,
        "prompt": "A modern sleek black laptop fully open at 120 degrees with bright green terminal code on screen, floating in the center of a completely black void background (#0F172A dark navy). This is the laptop at its full open position, ready to start separating. Green ambient glow (#22C55E). Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },

    # === Fase 2: Abierta → Separándose (9-16) ===
    {
        "num": 9,
        "prompt": "A modern black laptop fully open, the screen panel starting to float upward 1 inch above the base, floating in the center of a completely black void background (#0F172A dark navy). Thin gap of green light (#22C55E) appears between screen and hinges. Green terminal code on screen. Matte black body. Same 3/4 angle view from slightly above. Clean minimal design, no logos. Cinematic dark tech lighting. Photorealistic render."
    },
    {
        "num": 10,
        "prompt": "A modern black laptop with screen panel floating 3 inches above the base. The keyboard deck is beginning to lift slightly off the bottom chassis, revealing a thin gap. Green glow (#22C55E) visible in gaps between parts. Floating in black void background (#0F172A). Green terminal code on screen. Matte black. Same 3/4 angle from slightly above. No logos. Cinematic dark lighting. Photorealistic."
    },
    {
        "num": 11,
        "prompt": "A modern black laptop separating into three visible layers floating apart: screen panel at top (5 inches up), keyboard deck in middle (2 inches up), bottom chassis at base position. Green glow (#22C55E) between layers. Floating in black void (#0F172A). Green code on screen. Matte black. Same 3/4 angle from slightly above. No logos. Cinematic dark lighting. Photorealistic."
    },
    {
        "num": 12,
        "prompt": "A modern black laptop separating into four layers floating apart vertically: screen panel at top, keyboard deck below it, motherboard becoming visible in middle, bottom chassis at base. Small components (RAM, SSD) starting to peek out. Green glow (#22C55E) between all layers. Black void background (#0F172A). Matte black. Same 3/4 angle from slightly above. Cinematic dark lighting. Photorealistic."
    },
    {
        "num": [13, 14],
        "prompt": "A modern black laptop in partially exploded view with components floating apart: screen display panel at top showing green code, keyboard deck, visible motherboard with chips, battery pack, and bottom shell. All parts separated by 3-4 inches each. Green glow (#22C55E) emanating from gaps. Black void background (#0F172A). Matte black parts. Same 3/4 angle. Cinematic lighting. Photorealistic."
    },
    {
        "num": [15, 16],
        "prompt": "A modern black laptop in exploded view, components floating wider apart: screen panel with green code at top, bezel frame, keyboard deck, trackpad, motherboard with CPU and GPU visible, battery, cooling fan visible, bottom chassis. All separated by 4-5 inches. Subtle green (#22C55E) glow lines connecting components. Black void (#0F172A). Same 3/4 angle. Cinematic dark lighting. Photorealistic."
    },

    # === Fase 3: Explosión completa (17-24) ===
    {
        "num": [17, 18],
        "prompt": "Exploded view of a modern black laptop, components widely separated and floating: display screen showing green terminal code at very top, bezel, keyboard panel, trackpad piece, detailed motherboard with CPU/GPU chips clearly visible, 2 RAM modules, M.2 SSD, flat battery, cooling fan with copper heatpipe, aluminum bottom shell. All floating with 6+ inches of space between each. Green glow (#22C55E) connecting them like energy threads. Black void (#0F172A). Same 3/4 angle. Cinematic lighting. Photorealistic."
    },
    {
        "num": [19, 20],
        "prompt": "Widely exploded view of modern black laptop, all components floating far apart in vertical column: screen panel (green code) at very top, then bezel frame, keyboard deck, individual keycaps starting to detach, trackpad, motherboard with visible circuits and chips, CPU with small heatsink, GPU chip, 2 RAM sticks, M.2 SSD, battery pack, cooling fan module, WiFi card, bottom chassis at very bottom. Green energy glow (#22C55E) floating between parts like particles. Black void (#0F172A). Same 3/4 angle. Cinematic dark lighting. Photorealistic render."
    },
    {
        "num": [21, 22],
        "prompt": "Maximum exploded view of a modern black laptop. All components scattered widely in space, floating far apart: screen display at top with green code becoming faint, bezel, individual keyboard keys dispersing, trackpad, motherboard, CPU, GPU, RAM sticks, SSD, battery, cooling fan, Wi-Fi antenna, screws, rubber feet, hinges, bottom shell. Components spread across entire frame. Bright green (#22C55E) particle trails and glow connecting distant pieces. Deep black void (#0F172A). Same 3/4 angle. Cinematic volumetric lighting. Photorealistic."
    },
    {
        "num": [23, 24],
        "prompt": "Maximum exploded view of a modern black laptop with components floating very far apart and starting to become semi-transparent. Screen showing fading green code, keyboard keys scattered, motherboard, CPU, GPU, RAM, SSD, battery, fan, all drifting outward. Components at 70% opacity. Green (#22C55E) glowing particles floating between fading parts. Deep black void (#0F172A). Same 3/4 angle. Cinematic dark volumetric lighting. Photorealistic. Ethereal dissolving quality."
    },

    # === Fase 4: Desvanecimiento (25-30) ===
    {
        "num": [25, 26],
        "prompt": "Fading exploded laptop components floating far apart at 50% opacity/transparency. Green (#22C55E) glowing particles dominate the scene more than the hardware. Parts dissolving into particles. Screen code very faint. Deep black void (#0F172A). Same 3/4 angle. Ethereal, ghostly quality. Cinematic dark lighting. Photorealistic but dreamy."
    },
    {
        "num": [27, 28],
        "prompt": "Nearly dissolved laptop components at 25% opacity, mostly green (#22C55E) glowing particles and energy trails floating in deep black void (#0F172A). Only faint outlines of screen, keyboard, motherboard remain visible like ghosts. Beautiful particle cloud forming. Same 3/4 angle. Cinematic dark volumetric lighting. Photorealistic ethereal."
    },
    {
        "num": [29, 30],
        "prompt": "Abstract cloud of green (#22C55E) glowing particles and faint energy traces where a laptop used to be. Almost no hardware visible, just the essence of technology dissolving into green particles against deep black void (#0F172A). Peaceful, ethereal, minimal. Cinematic dark lighting. Beautiful particle dispersion."
    },
]


def generate_single(prompt, frame_nums):
    """Genera imagen(es) con Imagen 4.0 Ultra."""
    
    if isinstance(frame_nums, int):
        frame_nums = [frame_nums]
    
    count = len(frame_nums)
    
    # Verificar si ya existen todos los frames de este grupo
    all_exist = all((OUTPUT_DIR / f"laptop_{n:02d}.png").exists() for n in frame_nums)
    if all_exist:
        print(f"  SKIP Frames {frame_nums} ya existen, saltando...")
        return True
    
    config = types.GenerateImagesConfig(
        number_of_images=count,
        aspect_ratio="16:9",
        output_mime_type="image/png",
    )
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_images(
                model=MODEL,
                prompt=prompt,
                config=config,
            )
            
            if response.generated_images:
                for idx, gen_img in enumerate(response.generated_images):
                    if idx < len(frame_nums):
                        num = frame_nums[idx]
                        png_path = OUTPUT_DIR / f"laptop_{num:02d}.png"
                        webp_path = OUTPUT_DIR / f"laptop_{num:02d}.webp"
                        
                        # Guardar desde los bytes de la imagen
                        img = gen_img.image
                        img_pil = Image.open(BytesIO(img.image_bytes))
                        img_pil.save(str(png_path), "PNG")
                        img_pil.save(str(webp_path), "WEBP", quality=85)
                        
                        print(f"  OK Frame {num:02d} guardado ({img_pil.size[0]}x{img_pil.size[1]})")
                
                return True
            else:
                print(f"  WARN Frames {frame_nums}: No se recibieron imagenes (intento {attempt + 1}/{max_retries})")
                if attempt < max_retries - 1:
                    time.sleep(8)
                    
        except Exception as e:
            error_msg = str(e)
            print(f"  ERROR Frames {frame_nums} (intento {attempt + 1}/{max_retries}): {error_msg}")
            
            # Si es rate limit, esperar más
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                wait = 30 * (attempt + 1)
                print(f"  Rate limited, esperando {wait}s...")
                time.sleep(wait)
            elif attempt < max_retries - 1:
                time.sleep(10)
    
    print(f"  FAIL Frames {frame_nums}: FALLIDO")
    return False


def main():
    print("=" * 60)
    print("  GENERADOR DE FRAMES - Imagen 4.0 Ultra")
    print("  Laptop Exploded View Animation")
    print("=" * 60)
    print(f"  Output: {OUTPUT_DIR.resolve()}")
    print(f"  Modelo: {MODEL}")
    print(f"  Total grupos: {len(FRAMES)}")
    print(f"  Total frames: 30")
    print()

    successful = 0
    failed = 0

    for i, frame_data in enumerate(FRAMES):
        nums = frame_data["num"]
        if isinstance(nums, int):
            nums_str = f"{nums:02d}"
        else:
            nums_str = ", ".join(f"{n:02d}" for n in nums)
        
        print(f"  [{i+1}/{len(FRAMES)}] Generando frame(s) {nums_str}...")
        
        result = generate_single(frame_data["prompt"], frame_data["num"])
        
        if result:
            successful += 1
        else:
            failed += 1
        
        # Rate limiting entre requests
        if i < len(FRAMES) - 1:
            wait = 5
            print(f"  Esperando {wait}s...")
            time.sleep(wait)

    print()
    print("=" * 60)
    print(f"  Completado: {successful}/{len(FRAMES)} grupos exitosos, {failed} fallidos")
    print(f"  Frames en: {OUTPUT_DIR.resolve()}")
    print("=" * 60)


if __name__ == "__main__":
    main()
