# =========================================
# HAPA MINI FIGMA - TYPOGRAPHY AI ENGINE
# ai_tools/typography_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time


class TypographyAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # base scale (Figma-like)
            "base_font_size": 16,
            "scale_ratio": 1.25,

            # font system
            "default_font": "Inter",

            # line height rules
            "line_height_ratio": 1.4,

            # debug
            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN ENTRY
    # =====================================

    def generate_type_scale(
        self,
        base_size: Optional[int] = None
    ) -> Dict[str, Any]:

        base = base_size or self.options["base_font_size"]

        scale = self.options["scale_ratio"]

        type_scale = {
            "type": "HAPA_TYPE_SCALE",
            "version": self.options["version"],
            "timestamp": time.time(),
            "base": base,
            "scale": scale,
            "tokens": self._build_scale(base, scale)
        }

        return type_scale

    # =====================================
    # SCALE GENERATOR
    # =====================================

    def _build_scale(self, base: int, ratio: float) -> Dict[str, Dict[str, Any]]:

        sizes = {

            "xs": base / (ratio * 1.5),

            "sm": base / ratio,

            "md": base,

            "lg": base * ratio,

            "xl": base * (ratio ** 2),

            "xxl": base * (ratio ** 3)
        }

        tokens = {}

        for name, size in sizes.items():

            tokens[name] = {

                "fontSize": round(size, 2),

                "lineHeight": round(size * self.options["line_height_ratio"], 2),

                "fontFamily": self.options["default_font"]
            }

        return tokens

    # =====================================
    # TEXT STYLE BUILDER
    # =====================================

    def build_text_style(
        self,
        size_key: str = "md",
        weight: str = "normal",
        color: str = "#000000"
    ) -> Dict[str, Any]:

        scale = self.generate_type_scale()["tokens"]

        if size_key not in scale:

            size_key = "md"

        base = scale[size_key]

        return {

            "fontSize": base["fontSize"],

            "lineHeight": base["lineHeight"],

            "fontFamily": base["fontFamily"],

            "fontWeight": weight,

            "color": color
        }

    # =====================================
    # PARAGRAPH STYLE
    # =====================================

    def paragraph_style(self) -> Dict[str, Any]:

        return self.build_text_style("md")

    # =====================================
    # HEADING STYLE
    # =====================================

    def heading_style(self, level: int = 1) -> Dict[str, Any]:

        mapping = {

            1: "xxl",

            2: "xl",

            3: "lg",

            4: "md"
        }

        size_key = mapping.get(level, "md")

        return self.build_text_style(size_key, weight="bold")

    # =====================================
    # ALIGNMENT RULES
    # =====================================

    def align_text(self, context: str = "body") -> str:

        if context == "heading":

            return "left"

        if context == "button":

            return "center"

        return "left"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, output: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[TypographyAI DEBUG]")
        print(output)
