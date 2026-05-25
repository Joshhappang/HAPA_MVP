# =========================================
# HAPA MINI FIGMA - IMAGE AI ENGINE
# ai_tools/image_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid


class ImageAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # defaults
            "default_width": 512,
            "default_height": 512,

            # behavior
            "auto_optimize": True,
            "cache_enabled": True,

            "debug": False,

            **(options or {})
        }

        self.cache: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # MAIN IMAGE GENERATOR
    # =====================================

    def generate_image(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        image_id = self._uuid()

        image = {
            "type": "HAPA_IMAGE",
            "version": self.options["version"],
            "id": image_id,
            "timestamp": time.time(),

            "prompt": prompt,

            "size": {
                "width": context.get("width", self.options["default_width"]),
                "height": context.get("height", self.options["default_height"])
            },

            "style": self._infer_style(prompt),

            "url": self._generate_placeholder_url(prompt, image_id)
        }

        if self.options["cache_enabled"]:

            self.cache[image_id] = image

        return image

    # =====================================
    # STYLE INFERENCE
    # =====================================

    def _infer_style(self, prompt: str) -> str:

        p = prompt.lower()

        if "3d" in p:
            return "3d"

        if "flat" in p:
            return "flat"

        if "icon" in p:
            return "icon"

        if "realistic" in p:
            return "realistic"

        return "default"

    # =====================================
    # PLACEHOLDER URL GENERATOR
    # =====================================

    def _generate_placeholder_url(self, prompt: str, image_id: str) -> str:

        safe_prompt = prompt.replace(" ", "+")[:30]

        return f"https://hapa.ai/image/{image_id}?q={safe_prompt}"

    # =====================================
    # BATCH GENERATION
    # =====================================

    def generate_batch(
        self,
        prompts: List[str],
        context: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:

        return [
            self.generate_image(p, context)
            for p in prompts
        ]

    # =====================================
    # OPTIMIZE IMAGE
    # =====================================

    def optimize(self, image: Dict[str, Any]) -> Dict[str, Any]:

        if not self.options["auto_optimize"]:
            return image

        optimized = image.copy()

        optimized["optimized"] = True

        optimized["size"]["width"] = min(image["size"]["width"], 1024)

        optimized["size"]["height"] = min(image["size"]["height"], 1024)

        return optimized

    # =====================================
    # CACHE MANAGEMENT
    # =====================================

    def get_from_cache(self, image_id: str) -> Optional[Dict[str, Any]]:

        return self.cache.get(image_id)

    def clear_cache(self):

        self.cache.clear()

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"img-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, image: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[ImageAI DEBUG]")
        print(image)
