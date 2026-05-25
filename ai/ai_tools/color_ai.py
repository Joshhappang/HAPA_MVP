# =========================================
# HAPA MINI FIGMA - COLOR AI ENGINE
# ai_tools/color_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import colorsys
import time


class ColorAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # theme presets
            "themes": {
                "light": {
                    "background": "#ffffff",
                    "foreground": "#111111",
                    "primary": "#4c8dff",
                    "secondary": "#6c757d"
                },
                "dark": {
                    "background": "#111111",
                    "foreground": "#ffffff",
                    "primary": "#4c8dff",
                    "secondary": "#888888"
                }
            },

            # behavior
            "auto_contrast": True,
            "adaptive_harmony": True,

            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN ENTRY
    # =====================================

    def generate_palette(
        self,
        base_color: str,
        theme: str = "light"
    ) -> Dict[str, Any]:

        base_rgb = self._hex_to_rgb(base_color)

        palette = {
            "type": "HAPA_COLOR_PALETTE",
            "version": self.options["version"],
            "timestamp": time.time(),
            "base": base_color,
            "theme": theme,
            "colors": self._build_palette(base_rgb, theme)
        }

        return palette

    # =====================================
    # PALETTE BUILDER
    # =====================================

    def _build_palette(
        self,
        rgb: tuple,
        theme: str
    ) -> Dict[str, str]:

        r, g, b = rgb

        h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)

        # generate variations
        lighter = colorsys.hls_to_rgb(h, min(1, l + 0.2), s)
        darker = colorsys.hls_to_rgb(h, max(0, l - 0.2), s)
        muted = colorsys.hls_to_rgb(h, l, max(0, s - 0.3))

        return {

            "primary": self._rgb_to_hex(rgb),

            "light": self._rgb_to_hex(self._to_255(lighter)),

            "dark": self._rgb_to_hex(self._to_255(darker)),

            "muted": self._rgb_to_hex(self._to_255(muted)),

            "background": self.options["themes"][theme]["background"],

            "foreground": self.options["themes"][theme]["foreground"]
        }

    # =====================================
    # HEX → RGB
    # =====================================

    def _hex_to_rgb(self, hex_color: str) -> tuple:

        hex_color = hex_color.lstrip("#")

        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    # =====================================
    # RGB → HEX
    # =====================================

    def _rgb_to_hex(self, rgb: tuple) -> str:

        return "#{:02x}{:02x}{:02x}".format(*rgb)

    # =====================================
    # NORMALIZE RGB
    # =====================================

    def _to_255(self, rgb_float: tuple) -> tuple:

        return tuple(int(max(0, min(1, c)) * 255) for c in rgb_float)

    # =====================================
    # CONTRAST CHECK
    # =====================================

    def contrast_ratio(self, color1: str, color2: str) -> float:

        def luminance(rgb):

            r, g, b = [x / 255 for x in rgb]

            return 0.2126*r + 0.7152*g + 0.0722*b

        c1 = self._hex_to_rgb(color1)

        c2 = self._hex_to_rgb(color2)

        l1 = luminance(c1)

        l2 = luminance(c2)

        lighter = max(l1, l2)

        darker = min(l1, l2)

        return (lighter + 0.05) / (darker + 0.05)

    # =====================================
    # AUTO ADJUST CONTRAST
    # =====================================

    def auto_contrast(self, background: str, text: str) -> str:

        ratio = self.contrast_ratio(background, text)

        if ratio < 4.5:

            return "#000000" if background != "#000000" else "#ffffff"

        return text

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, palette: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[ColorAI DEBUG]")
        print(palette)
